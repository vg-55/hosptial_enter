import * as crypto from 'crypto';
import CryptoJS from 'crypto-js';
import { defaultLogger } from '../logging/logger';

export class FieldEncryption {
  private algorithm: string = 'aes-256-gcm';
  private masterKey: Buffer;
  private keyDerivationSalt: Buffer;

  constructor() {
    const masterKeyEnv = process.env.ENCRYPTION_MASTER_KEY;
    if (!masterKeyEnv) {
      throw new Error('ENCRYPTION_MASTER_KEY environment variable is required');
    }
    this.masterKey = Buffer.from(masterKeyEnv, 'base64');
    
    const saltEnv = process.env.ENCRYPTION_SALT;
    if (!saltEnv) {
      throw new Error('ENCRYPTION_SALT environment variable is required');
    }
    this.keyDerivationSalt = Buffer.from(saltEnv, 'base64');
  }

  private deriveKey(context: string): Buffer {
    return crypto.pbkdf2Sync(this.masterKey, Buffer.concat([this.keyDerivationSalt, Buffer.from(context)]), 100000, 32, 'sha256');
  }

  encryptField(plaintext: string, context: string = 'default'): string {
    try {
      const key = this.deriveKey(context);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);
      
      let encrypted = cipher.update(plaintext, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      
      const authTag = cipher.getAuthTag();
      
      const result = {
        encrypted,
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        algorithm: this.algorithm,
      };
      
      return Buffer.from(JSON.stringify(result)).toString('base64');
    } catch (error) {
      defaultLogger.error('Field encryption failed', error);
      throw new Error('Encryption failed');
    }
  }

  decryptField(encryptedData: string, context: string = 'default'): string {
    try {
      const jsonString = Buffer.from(encryptedData, 'base64').toString('utf8');
      const data = JSON.parse(jsonString);
      
      const key = this.deriveKey(context);
      const decipher = crypto.createDecipheriv(
        data.algorithm,
        key,
        Buffer.from(data.iv, 'base64')
      );
      
      decipher.setAuthTag(Buffer.from(data.authTag, 'base64'));
      
      let decrypted = decipher.update(data.encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      defaultLogger.error('Field decryption failed', error);
      throw new Error('Decryption failed');
    }
  }

  hashSensitiveData(data: string, salt?: string): string {
    const actualSalt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(data, actualSalt, 10000, 64, 'sha512').toString('hex');
    return `${actualSalt}:${hash}`;
  }

  verifySensitiveData(data: string, hashedData: string): boolean {
    try {
      const [salt, originalHash] = hashedData.split(':');
      const hash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex');
      return hash === originalHash;
    } catch (error) {
      defaultLogger.error('Hash verification failed', error);
      return false;
    }
  }
}

export class DataMasking {
  static maskEmail(email: string): string {
    const [username, domain] = email.split('@');
    if (!username || !domain) return '***@***';
    
    const visibleChars = Math.min(3, Math.floor(username.length / 2));
    const maskedUsername = username.substring(0, visibleChars) + '***';
    return `${maskedUsername}@${domain}`;
  }

  static maskCreditCard(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length < 4) return '****';
    return '****-****-****-' + cleaned.slice(-4);
  }

  static maskSSN(ssn: string): string {
    const cleaned = ssn.replace(/\D/g, '');
    if (cleaned.length < 4) return '***-**-****';
    return '***-**-' + cleaned.slice(-4);
  }

  static maskPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 4) return '***-***-****';
    return '***-***-' + cleaned.slice(-4);
  }

  static maskGeneric(value: string, visibleChars: number = 4): string {
    if (value.length <= visibleChars) return '*'.repeat(value.length);
    return value.substring(0, visibleChars) + '*'.repeat(value.length - visibleChars);
  }
}

export const fieldEncryption = process.env.ENCRYPTION_MASTER_KEY && process.env.ENCRYPTION_SALT
  ? new FieldEncryption()
  : null;

if (!fieldEncryption) {
  defaultLogger.warn('Field encryption not initialized - missing environment variables');
}
