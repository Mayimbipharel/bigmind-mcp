import { Client } from 'ssh2';
import { IProtocolAdapter } from './IProtocolAdapter.js';
import { ConnectionConfig, ConnectionStatus, CommandResult, VendorProfile } from '../types/index.js';
import { logger } from '../utils/logger.js';

export class SSHAdapter implements IProtocolAdapter {
    protocol = 'ssh';
    
    private conn: Client | null = null;
    private config: ConnectionConfig | null = null;
    private connected = false;
    private lastUsed: Date | null = null;
    private profile: VendorProfile | undefined;
    
    constructor(profile?: VendorProfile) {
        this.profile = profile;
        logger.debug('SSHAdapter instance created');
    }
    
    async connect(config: ConnectionConfig): Promise<void> {
        this.config = config;
        
        return new Promise((resolve, reject) => {
            this.conn = new Client();
            
            this.conn.on('ready', () => {
                this.connected = true;
                this.lastUsed = new Date();
                logger.info(`SSH connected to ${config.host}:${config.port}`);
                resolve();
            });
            
            this.conn.on('error', (err) => {
                this.connected = false;
                logger.error(`SSH connection error to ${config.host}:`, err);
                reject(err);
            });
            
            this.conn.on('close', () => {
                this.connected = false;
                logger.debug(`SSH connection closed to ${config.host}`);
            });
            
            // Build connection options
            const connOptions: any = {
                host: config.host,
                port: config.port || 22,
                username: config.credentials?.username,
                password: config.credentials?.password,
                privateKey: config.credentials?.ssh_key,
                readyTimeout: this.profile?.ssh_settings?.ready_timeout || config.timeout || 20000,
                keepaliveInterval: this.profile?.ssh_settings?.keepalive_interval || 10000
            };
            
            // Add algorithms from profile if available
            if (this.profile?.ssh_settings?.algorithms) {
                connOptions.algorithms = this.profile.ssh_settings.algorithms;
            }
            
            // Connect with configuration
            this.conn.connect(connOptions);
        });
    }
    
    async disconnect(): Promise<void> {
        if (this.conn) {
            this.conn.end();
            this.connected = false;
            logger.debug('SSH connection closed');
        }
    }
    
    async execute(command: string, options?: any): Promise<CommandResult> {
        const startTime = Date.now();
        
        if (!this.conn || !this.connected) {
            throw new Error('Not connected to SSH server');
        }
        
        return new Promise((resolve, reject) => {
            this.conn!.shell((err, stream) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                let output = '';
                
                stream.on('data', (data: Buffer) => {
                    output += data.toString();
                });
                
                stream.on('close', () => {
                    this.lastUsed = new Date();
                    const executionTime = Date.now() - startTime;
                    
                    resolve({
                        success: true,
                        output: output,
                        timestamp: new Date(),
                        execution_time: executionTime
                    });
                });
                
                stream.on('error', (err: Error) => {
                    reject(err);
                });
                
                // Send commands
                stream.write('terminal length 0\n');
                setTimeout(() => stream.write(`${command}\n`), 500);
                setTimeout(() => stream.write('exit\n'), 1000);
            });
        });
    }
    
    isConnected(): boolean {
        return this.connected;
    }
    
    getStatus(): ConnectionStatus {
        return {
            connected: this.connected,
            last_used: this.lastUsed || undefined
        };
    }
}
