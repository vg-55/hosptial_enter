export interface StaffMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  specialization?: string;
  hireDate: string;
  status: 'active' | 'on_leave' | 'inactive';
  avatar?: string;
  certifications: Certification[];
  address?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  staffCount: number;
  description?: string;
}

export interface Shift {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  startTime: string;
  endTime: string;
  shiftType: 'morning' | 'afternoon' | 'night' | 'on_call';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  location: string;
  notes?: string;
}

export interface PerformanceMetric {
  staffId: string;
  staffName: string;
  department: string;
  role: string;
  patientsHandled: number;
  averageRating: number;
  tasksCompleted: number;
  attendanceRate: number;
  punctualityScore: number;
  period: string;
}

export interface StaffStats {
  totalStaff: number;
  staffChange: number;
  activeShifts: number;
  shiftsChange: number;
  averagePerformance: number;
  performanceChange: number;
  vacancyRate: number;
  vacancyChange: number;
}
