import { defaultLogger, Logger } from '../logging/logger';
import { v4 as uuidv4 } from 'uuid';

export enum AuditEventType {
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout',
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  DATA_ACCESS = 'data.access',
  DATA_CREATED = 'data.created',
  DATA_UPDATED = 'data.updated',
  DATA_DELETED = 'data.deleted',
  DATA_EXPORTED = 'data.exported',
  PERMISSION_GRANTED = 'permission.granted',
  PERMISSION_REVOKED = 'permission.revoked',
  CONFIG_CHANGED = 'config.changed',
  SECURITY_EVENT = 'security.event',
  SYSTEM_EVENT = 'system.event',
}

export enum AuditSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical',
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  severity: AuditSeverity;
  actor: {
    userId?: string;
    username?: string;
    ipAddress?: string;
    userAgent?: string;
  };
  resource: {
    type: string;
    id?: string;
    name?: string;
  };
  action: string;
  result: 'success' | 'failure';
  metadata?: {
    [key: string]: any;
  };
  changes?: {
    before?: any;
    after?: any;
  };
  correlationId?: string;
}

export interface AuditFilter {
  eventType?: AuditEventType;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  resourceType?: string;
  severity?: AuditSeverity;
}

export class AuditLogger {
  private logger: Logger;
  private auditEvents: AuditEvent[] = [];
  private maxEventsInMemory: number = 10000;
  private retentionDays: number = 90;

  constructor() {
    this.logger = defaultLogger.child({ component: 'audit-logger' });
    this.retentionDays = parseInt(process.env.AUDIT_RETENTION_DAYS || '90');
  }

  logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
    const auditEvent: AuditEvent = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ...event,
    };

    this.logger.info('Audit event logged', {
      auditEvent,
      eventType: event.eventType,
      actor: event.actor.userId || event.actor.username,
      resource: event.resource.type,
      action: event.action,
      result: event.result,
    });

    this.auditEvents.push(auditEvent);

    if (this.auditEvents.length > this.maxEventsInMemory) {
      this.auditEvents.shift();
    }

    return auditEvent;
  }

  logUserAction(
    userId: string,
    action: string,
    resourceType: string,
    resourceId?: string,
    result: 'success' | 'failure' = 'success',
    metadata?: any
  ): AuditEvent {
    return this.logEvent({
      eventType: AuditEventType.DATA_ACCESS,
      severity: AuditSeverity.INFO,
      actor: { userId },
      resource: { type: resourceType, id: resourceId },
      action,
      result,
      metadata,
    });
  }

  logSecurityEvent(
    eventType: AuditEventType,
    userId: string | undefined,
    ipAddress: string,
    action: string,
    result: 'success' | 'failure',
    metadata?: any
  ): AuditEvent {
    return this.logEvent({
      eventType,
      severity: result === 'failure' ? AuditSeverity.WARNING : AuditSeverity.INFO,
      actor: { userId, ipAddress },
      resource: { type: 'security' },
      action,
      result,
      metadata,
    });
  }

  logDataChange(
    userId: string,
    resourceType: string,
    resourceId: string,
    action: string,
    before: any,
    after: any
  ): AuditEvent {
    return this.logEvent({
      eventType: AuditEventType.DATA_UPDATED,
      severity: AuditSeverity.INFO,
      actor: { userId },
      resource: { type: resourceType, id: resourceId },
      action,
      result: 'success',
      changes: { before, after },
    });
  }

  filterEvents(filter: AuditFilter): AuditEvent[] {
    return this.auditEvents.filter((event) => {
      if (filter.eventType && event.eventType !== filter.eventType) return false;
      if (filter.userId && event.actor.userId !== filter.userId) return false;
      if (filter.resourceType && event.resource.type !== filter.resourceType) return false;
      if (filter.severity && event.severity !== filter.severity) return false;
      
      if (filter.startDate) {
        const eventDate = new Date(event.timestamp);
        if (eventDate < filter.startDate) return false;
      }
      
      if (filter.endDate) {
        const eventDate = new Date(event.timestamp);
        if (eventDate > filter.endDate) return false;
      }
      
      return true;
    });
  }

  exportEvents(filter?: AuditFilter): string {
    const events = filter ? this.filterEvents(filter) : this.auditEvents;
    return JSON.stringify(events, null, 2);
  }

  exportEventsCSV(filter?: AuditFilter): string {
    const events = filter ? this.filterEvents(filter) : this.auditEvents;
    
    if (events.length === 0) {
      return 'No events to export';
    }

    const headers = [
      'ID',
      'Timestamp',
      'Event Type',
      'Severity',
      'User ID',
      'IP Address',
      'Resource Type',
      'Resource ID',
      'Action',
      'Result',
    ];

    const rows = events.map((event) => [
      event.id,
      event.timestamp,
      event.eventType,
      event.severity,
      event.actor.userId || '',
      event.actor.ipAddress || '',
      event.resource.type,
      event.resource.id || '',
      event.action,
      event.result,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }

  getRetentionPolicy(): { retentionDays: number; cutoffDate: Date } {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);
    
    return {
      retentionDays: this.retentionDays,
      cutoffDate,
    };
  }

  cleanupOldEvents(): number {
    const policy = this.getRetentionPolicy();
    const initialCount = this.auditEvents.length;
    
    this.auditEvents = this.auditEvents.filter((event) => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= policy.cutoffDate;
    });

    const removedCount = initialCount - this.auditEvents.length;
    
    if (removedCount > 0) {
      this.logger.info(`Cleaned up ${removedCount} old audit events`, {
        retentionDays: this.retentionDays,
        cutoffDate: policy.cutoffDate,
      });
    }

    return removedCount;
  }

  getEventCount(): number {
    return this.auditEvents.length;
  }

  clearAllEvents(): void {
    this.auditEvents = [];
    this.logger.warn('All audit events cleared from memory');
  }
}

export const auditLogger = new AuditLogger();
