import { BaseHandler } from './BaseHandler.js';
import { IProtocolAdapter } from '../adapters/IProtocolAdapter.js';
import { DeviceConfig, VendorProfile } from '../types/index.js';
import { logger } from '../utils/logger.js';

/**
 * Cisco device handler
 */
export class CiscoHandler extends BaseHandler {
    constructor(adapter: IProtocolAdapter, device: DeviceConfig, profile?: VendorProfile) {
        super(adapter, device, profile);
    }
    
    /**
     * Get Cisco IOS version
     */
    async getVersion(): Promise<string> {
        logger.debug(`Getting version for ${this.device.name}`);
        const command = this.profile?.commands?.get_version || 'show version';
        const result = await this.executeCommand(command);
        return result.output || '';
    }
    
    /**
     * Get running configuration
     */
    async getConfig(): Promise<string> {
        logger.debug(`Getting config for ${this.device.name}`);
        const command = this.profile?.commands?.get_config || 'show running-config';
        const result = await this.executeCommand(command);
        return result.output || '';
    }
    
    /**
     * Get interface status
     */
    async getInterfaces(): Promise<string> {
        logger.debug(`Getting interfaces for ${this.device.name}`);
        const command = this.profile?.commands?.get_interfaces || 'show ip interface brief';
        const result = await this.executeCommand(command);
        return result.output || '';
    }
    
    /**
     * Get inventory
     */
    async getInventory(): Promise<string> {
        logger.debug(`Getting inventory for ${this.device.name}`);
        const command = this.profile?.commands?.get_inventory || 'show inventory';
        const result = await this.executeCommand(command);
        return result.output || '';
    }
}
