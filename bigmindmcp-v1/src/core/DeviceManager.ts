import { DeviceConfig, VendorProfile } from '../types/index.js';
import { ConfigLoader } from './ConfigLoader.js';
import { logger } from '../utils/logger.js';

export class DeviceManager {
    private devices: Map<string, DeviceConfig> = new Map();
    private profiles: Map<string, VendorProfile> = new Map();
    private configLoader: ConfigLoader;
    
    constructor(configLoader?: ConfigLoader) {
        this.configLoader = configLoader || new ConfigLoader();
    }
    
    /**
     * Initialize device manager - load all configurations
     */
    async initialize(): Promise<void> {
        try {
            logger.info('Initializing DeviceManager...');
            
            // Load profiles first
            this.profiles = await this.configLoader.loadProfiles();
            
            // Load all device configurations
            const inventories = await this.configLoader.loadAllDeviceConfigs();
            
            // Add all devices to the manager
            this.devices.clear();
            for (const inventory of inventories) {
                for (const device of inventory.devices) {
                    this.devices.set(device.id, device);
                }
            }
            
            logger.info(`DeviceManager initialized with ${this.devices.size} devices`);
        } catch (error) {
            logger.error('Failed to initialize DeviceManager:', error as Error);
            throw error;
        }
    }
    
    /**
     * Get all devices
     */
    getAllDevices(): DeviceConfig[] {
        return Array.from(this.devices.values());
    }
    
    /**
     * Get device by ID
     */
    getDevice(deviceId: string): DeviceConfig | undefined {
        return this.devices.get(deviceId);
    }
    
    /**
     * Get devices by vendor
     */
    getDevicesByVendor(vendor: string): DeviceConfig[] {
        return Array.from(this.devices.values())
            .filter(device => device.source === vendor);
    }
    
    /**
     * Get devices by protocol
     */
    getDevicesByProtocol(protocol: string): DeviceConfig[] {
        return Array.from(this.devices.values())
            .filter(device => device.connection.protocol === protocol);
    }
    
    /**
     * Get devices by type
     */
    getDevicesByType(type: string): DeviceConfig[] {
        return Array.from(this.devices.values())
            .filter(device => device.type === type);
    }
    
    /**
     * Get devices by tag
     */
    getDevicesByTag(tag: string): DeviceConfig[] {
        return Array.from(this.devices.values())
            .filter(device => device.tags?.includes(tag));
    }
    
    /**
     * Get profile for a device
     */
    getDeviceProfile(device: DeviceConfig): VendorProfile | undefined {
        return this.profiles.get(device.profile);
    }
    
    /**
     * Get profile by name
     */
    getProfile(profileName: string): VendorProfile | undefined {
        return this.profiles.get(profileName);
    }
    
    /**
     * Add a device dynamically
     */
    addDevice(device: DeviceConfig): void {
        this.devices.set(device.id, device);
        logger.info(`Added device: ${device.id}`);
    }
    
    /**
     * Remove a device
     */
    removeDevice(deviceId: string): boolean {
        const deleted = this.devices.delete(deviceId);
        if (deleted) {
            logger.info(`Removed device: ${deviceId}`);
        }
        return deleted;
    }
    
    /**
     * Get device count
     */
    getDeviceCount(): number {
        return this.devices.size;
    }
    
    /**
     * Get statistics
     */
    getStatistics(): {
        total_devices: number;
        by_vendor: Record<string, number>;
        by_protocol: Record<string, number>;
        by_type: Record<string, number>;
    } {
        const stats = {
            total_devices: this.devices.size,
            by_vendor: {} as Record<string, number>,
            by_protocol: {} as Record<string, number>,
            by_type: {} as Record<string, number>
        };
        
        for (const device of this.devices.values()) {
            // Count by vendor
            const vendor = device.source || 'unknown';
            stats.by_vendor[vendor] = (stats.by_vendor[vendor] || 0) + 1;
            
            // Count by protocol
            const protocol = device.connection.protocol;
            stats.by_protocol[protocol] = (stats.by_protocol[protocol] || 0) + 1;
            
            // Count by type
            const type = device.type;
            stats.by_type[type] = (stats.by_type[type] || 0) + 1;
        }
        
        return stats;
    }
    
    /**
     * Reload configurations
     */
    async reload(): Promise<void> {
        logger.info('Reloading configurations...');
        await this.initialize();
    }
}
