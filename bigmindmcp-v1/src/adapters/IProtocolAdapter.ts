import { ConnectionConfig, ConnectionStatus, CommandResult } from '../types/index.js';

/**
 * Base interface for all protocol adapters
 */
export interface IProtocolAdapter {
    protocol: string;
    
    /**
     * Connect to the device
     */
    connect(config: ConnectionConfig): Promise<void>;
    
    /**
     * Disconnect from the device
     */
    disconnect(): Promise<void>;
    
    /**
     * Execute a command/request
     */
    execute(command: string, options?: any): Promise<CommandResult>;
    
    /**
     * Check if connected
     */
    isConnected(): boolean;
    
    /**
     * Get connection status
     */
    getStatus(): ConnectionStatus;
}
