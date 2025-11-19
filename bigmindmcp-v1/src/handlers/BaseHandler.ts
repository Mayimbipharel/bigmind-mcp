import { IProtocolAdapter } from '../adapters/IProtocolAdapter.js';
import { DeviceConfig, VendorProfile, CommandResult } from '../types/index.js';
import { logger } from '../utils/logger.js';

/**
 * Base handler class for all device/system handlers
 */
export abstract class BaseHandler {
    protected adapter: IProtocolAdapter;
    protected device: DeviceConfig;
    protected profile: VendorProfile | undefined;
    
    constructor(adapter: IProtocolAdapter, device: DeviceConfig, profile?: VendorProfile) {
        this.adapter = adapter;
        this.device = device;
        this.profile = profile;
    }
    
    /**
     * Connect to the device
     */
    async connect(): Promise<void> {
        try {
            await this.adapter.connect(this.device.connection);
            logger.info(`Connected to device: ${this.device.name}`);
        } catch (error) {
            logger.error(`Failed to connect to ${this.device.name}:`, error as Error);
            throw error;
        }
    }
    
    /**
     * Disconnect from the device
     */
    async disconnect(): Promise<void> {
        await this.adapter.disconnect();
    }
    
    /**
     * Execute a command
     */
    async executeCommand(command: string): Promise<CommandResult> {
        if (!this.adapter.isConnected()) {
            await this.connect();
        }
        
        try {
            const result = await this.adapter.execute(command);
            return result;
        } catch (error) {
            logger.error(`Command execution failed on ${this.device.name}:`, error as Error);
            throw error;
        }
    }
    
    /**
     * Check if connected
     */
    isConnected(): boolean {
        return this.adapter.isConnected();
    }
    
    /**
     * Get device information - to be implemented by subclasses
     */
    abstract getVersion(): Promise<string>;
    
    /**
     * Get device configuration - to be implemented by subclasses
     */
    abstract getConfig(): Promise<string>;
}
