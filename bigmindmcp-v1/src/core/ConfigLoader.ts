import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DeviceInventory, VendorProfile } from '../types/index.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ConfigLoader {
    private configDir: string;
    private profilesCache: Map<string, VendorProfile> = new Map();
    
    constructor(configDir?: string) {
        this.configDir = configDir || path.join(__dirname, '../../config');
        logger.debug(`ConfigLoader initialized with directory: ${this.configDir}`);
    }
    
    /**
     * Load all device configuration files (devices-*.json)
     */
    async loadAllDeviceConfigs(): Promise<DeviceInventory[]> {
        const inventories: DeviceInventory[] = [];
        
        try {
            const files = fs.readdirSync(this.configDir);
            const deviceFiles = files.filter(f => 
                f.startsWith('devices-') && f.endsWith('.json')
            );
            
            logger.info(`Found ${deviceFiles.length} device configuration files`);
            
            for (const file of deviceFiles) {
                try {
                    const inventory = await this.loadDeviceConfig(file);
                    inventories.push(inventory);
                    logger.info(`Loaded ${inventory.devices.length} devices from ${file}`);
                } catch (error) {
                    logger.error(`Failed to load ${file}:`, error as Error);
                }
            }
            
            return inventories;
        } catch (error) {
            logger.error('Failed to read config directory:', error as Error);
            throw error;
        }
    }
    
    /**
     * Load a specific device configuration file
     */
    async loadDeviceConfig(filename: string): Promise<DeviceInventory> {
        const filePath = path.join(this.configDir, filename);
        
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const inventory: DeviceInventory = JSON.parse(content);
            
            // Add source vendor to each device
            inventory.devices.forEach(device => {
                device.source = inventory.vendor;
            });
            
            return inventory;
        } catch (error) {
            logger.error(`Failed to load device config from ${filename}:`, error as Error);
            throw error;
        }
    }
    
    /**
     * Load vendor profiles
     */
    async loadProfiles(): Promise<Map<string, VendorProfile>> {
        const profilesPath = path.join(this.configDir, 'profiles.json');
        
        try {
            const content = fs.readFileSync(profilesPath, 'utf-8');
            const data = JSON.parse(content);
            
            this.profilesCache.clear();
            
            for (const [profileName, profile] of Object.entries(data.profiles)) {
                this.profilesCache.set(profileName, profile as VendorProfile);
            }
            
            logger.info(`Loaded ${this.profilesCache.size} vendor profiles`);
            return this.profilesCache;
        } catch (error) {
            logger.error('Failed to load profiles:', error as Error);
            throw error;
        }
    }
    
    /**
     * Get a specific profile by name
     */
    getProfile(profileName: string): VendorProfile | undefined {
        return this.profilesCache.get(profileName);
    }
    
    /**
     * Load global settings
     */
    async loadSettings(): Promise<any> {
        const settingsPath = path.join(this.configDir, 'settings.json');
        
        try {
            const content = fs.readFileSync(settingsPath, 'utf-8');
            const settings = JSON.parse(content);
            logger.info('Loaded global settings');
            return settings;
        } catch (error) {
            logger.error('Failed to load settings:', error as Error);
            throw error;
        }
    }
    
    /**
     * Watch configuration files for changes
     */
    watchConfigChanges(callback: (filename: string) => void): void {
        try {
            fs.watch(this.configDir, (event, filename) => {
                if (filename && (filename.startsWith('devices-') || filename === 'profiles.json')) {
                    logger.info(`Configuration file changed: ${filename}`);
                    callback(filename);
                }
            });
            logger.info('Configuration file watching enabled');
        } catch (error) {
            logger.error('Failed to watch config directory:', error as Error);
        }
    }
}
