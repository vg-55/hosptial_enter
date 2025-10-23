import vault from 'node-vault';
import { defaultLogger } from '../logging/logger';

export interface SecretConfig {
  [key: string]: string | number | boolean;
}

export class SecretsManager {
  private vaultClient: any;
  private isInitialized: boolean = false;
  private cachedSecrets: Map<string, any> = new Map();

  constructor() {
    if (process.env.VAULT_ENABLED === 'true') {
      this.initializeVault();
    }
  }

  private async initializeVault() {
    try {
      this.vaultClient = vault({
        endpoint: process.env.VAULT_ADDR || 'http://localhost:8200',
        token: process.env.VAULT_TOKEN,
      });

      const healthCheck = await this.vaultClient.health();
      this.isInitialized = healthCheck.initialized;
      
      defaultLogger.info('Vault client initialized', {
        endpoint: process.env.VAULT_ADDR,
        initialized: this.isInitialized,
      });
    } catch (error) {
      defaultLogger.error('Failed to initialize Vault client', error);
      this.isInitialized = false;
    }
  }

  async getSecret(path: string, refresh: boolean = false): Promise<SecretConfig | null> {
    if (!this.isInitialized) {
      defaultLogger.warn('Vault not initialized, falling back to environment variables');
      return this.getFromEnvironment(path);
    }

    if (!refresh && this.cachedSecrets.has(path)) {
      return this.cachedSecrets.get(path);
    }

    try {
      const result = await this.vaultClient.read(path);
      const secretData = result.data.data || result.data;
      
      this.cachedSecrets.set(path, secretData);
      defaultLogger.info('Secret retrieved from Vault', { path });
      
      return secretData;
    } catch (error) {
      defaultLogger.error('Failed to retrieve secret from Vault', error, { path });
      return this.getFromEnvironment(path);
    }
  }

  async writeSecret(path: string, data: SecretConfig): Promise<boolean> {
    if (!this.isInitialized) {
      defaultLogger.error('Vault not initialized, cannot write secret');
      return false;
    }

    try {
      await this.vaultClient.write(path, { data });
      this.cachedSecrets.delete(path);
      defaultLogger.info('Secret written to Vault', { path });
      return true;
    } catch (error) {
      defaultLogger.error('Failed to write secret to Vault', error, { path });
      return false;
    }
  }

  async deleteSecret(path: string): Promise<boolean> {
    if (!this.isInitialized) {
      defaultLogger.error('Vault not initialized, cannot delete secret');
      return false;
    }

    try {
      await this.vaultClient.delete(path);
      this.cachedSecrets.delete(path);
      defaultLogger.info('Secret deleted from Vault', { path });
      return true;
    } catch (error) {
      defaultLogger.error('Failed to delete secret from Vault', error, { path });
      return false;
    }
  }

  private getFromEnvironment(path: string): SecretConfig | null {
    const envKey = path.replace(/\//g, '_').toUpperCase();
    const value = process.env[envKey];
    
    if (value) {
      return { value };
    }
    
    return null;
  }

  clearCache() {
    this.cachedSecrets.clear();
    defaultLogger.info('Secrets cache cleared');
  }

  isVaultEnabled(): boolean {
    return this.isInitialized;
  }
}

export const secretsManager = new SecretsManager();
