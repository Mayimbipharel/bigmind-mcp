#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import { DeviceManager } from './core/DeviceManager.js';
import { ConfigLoader } from './core/ConfigLoader.js';
import { SSHAdapter } from './adapters/SSHAdapter.js';
import { CiscoHandler } from './handlers/CiscoHandler.js';
import { logger } from './utils/logger.js';

// Global device manager
let deviceManager: DeviceManager;

// Initialize the system
async function initializeSystem() {
    try {
        const configLoader = new ConfigLoader();
        deviceManager = new DeviceManager(configLoader);
        
        await deviceManager.initialize();
        
        const stats = deviceManager.getStatistics();
        
        // Only log to stderr (safe for MCP)
        console.error(`BIGMIND: Loaded ${stats.total_devices} devices`);
        console.error(`BIGMIND: Vendors: ${Object.keys(stats.by_vendor).join(', ')}`);
        console.error(`BIGMIND: Protocols: ${Object.keys(stats.by_protocol).join(', ')}`);
        
    } catch (error) {
        console.error('BIGMIND: Failed to initialize system:', error);
        throw error;
    }
}

// Helper function to execute command on a device
async function executeDeviceCommand(deviceId: string, command: string): Promise<string> {
    const device = deviceManager.getDevice(deviceId);
    if (!device) {
        throw new Error(`Device ${deviceId} not found`);
    }
    
    const profile = deviceManager.getDeviceProfile(device);
    
    // For now, we only support SSH devices
    if (device.connection.protocol !== 'ssh') {
        throw new Error(`Device ${deviceId} uses ${device.connection.protocol} protocol (not yet supported)`);
    }
    
    // Create adapter with profile
    const adapter = new SSHAdapter(profile);
    
    // Create handler based on vendor
    let handler;
    if (device.source === 'cisco') {
        handler = new CiscoHandler(adapter, device, profile);
    } else {
        throw new Error(`Vendor ${device.source} not yet supported`);
    }
    
    try {
        await handler.connect();
        const result = await handler.executeCommand(command);
        await handler.disconnect();
        return result.output || '';
    } catch (error) {
        await handler.disconnect();
        throw error;
    }
}

// Create MCP server
const server = new Server({
    name: "bigmind-network-manager",
    version: "2.0.0",
}, {
    capabilities: {
        tools: {},
    },
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    const devices = deviceManager.getAllDevices();
    const deviceIds = devices.map(d => d.id);
    
    return {
        tools: [
            {
                name: "list_devices",
                description: "List all available network devices and monitoring systems",
                inputSchema: { 
                    type: "object", 
                    properties: {
                        filter: {
                            type: "string",
                            enum: ["all", "ssh", "api", "cisco", "juniper", "librenms", "graylog"],
                            description: "Filter devices by type or vendor"
                        }
                    }
                },
            },
            {
                name: "get_device_info",
                description: "Get detailed information about a specific device",
                inputSchema: {
                    type: "object",
                    properties: {
                        device_id: {
                            type: "string",
                            enum: deviceIds,
                            description: "ID of the device"
                        }
                    },
                    required: ["device_id"],
                },
            },
            {
                name: "show_running_config",
                description: "Display the running configuration of a network device",
                inputSchema: {
                    type: "object",
                    properties: {
                        device_id: {
                            type: "string",
                            enum: deviceIds,
                            description: "ID of the device"
                        },
                    },
                    required: ["device_id"],
                },
            },
            {
                name: "show_interfaces",
                description: "Show interface status on a network device",
                inputSchema: {
                    type: "object",
                    properties: {
                        device_id: {
                            type: "string",
                            enum: deviceIds,
                        },
                    },
                    required: ["device_id"],
                },
            },
            {
                name: "show_version",
                description: "Display version information of a network device",
                inputSchema: {
                    type: "object",
                    properties: {
                        device_id: {
                            type: "string",
                            enum: deviceIds,
                        },
                    },
                    required: ["device_id"],
                },
            },
            {
                name: "execute_command",
                description: "Execute a custom command on a network device",
                inputSchema: {
                    type: "object",
                    properties: {
                        device_id: {
                            type: "string",
                            enum: deviceIds,
                        },
                        command: {
                            type: "string",
                            description: "Command to execute"
                        },
                    },
                    required: ["device_id", "command"],
                },
            },
            {
                name: "get_statistics",
                description: "Get system statistics (device counts, vendors, protocols)",
                inputSchema: {
                    type: "object",
                    properties: {}
                },
            }
        ],
    };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case "list_devices": {
                const filter = (args as any)?.filter || "all";
                let devices = deviceManager.getAllDevices();
                
                if (filter !== "all") {
                    if (filter === "ssh" || filter === "api") {
                        devices = deviceManager.getDevicesByProtocol(filter);
                    } else {
                        devices = deviceManager.getDevicesByVendor(filter);
                    }
                }
                
                const list = devices
                    .map(d => `${d.id}: ${d.name} (${d.source}/${d.type}) [${d.connection.protocol}://${d.connection.host || d.connection.base_url}]`)
                    .join("\n");
                
                return {
                    content: [{ 
                        type: "text", 
                        text: `Available devices (${devices.length}):\n${list}` 
                    }],
                };
            }

            case "get_device_info": {
                const deviceId = (args as any)?.device_id;
                if (!deviceId) throw new Error("device_id required");
                
                const device = deviceManager.getDevice(deviceId);
                if (!device) throw new Error(`Device ${deviceId} not found`);
                
                const info = {
                    id: device.id,
                    name: device.name,
                    type: device.type,
                    vendor: device.source,
                    protocol: device.connection.protocol,
                    host: device.connection.host || device.connection.base_url,
                    tags: device.tags,
                    profile: device.profile
                };
                
                return {
                    content: [{ 
                        type: "text", 
                        text: JSON.stringify(info, null, 2)
                    }],
                };
            }

            case "show_running_config": {
                const deviceId = (args as any)?.device_id;
                if (!deviceId) throw new Error("device_id required");
                
                const output = await executeDeviceCommand(deviceId, "show running-config");
                return { content: [{ type: "text", text: output }] };
            }

            case "show_interfaces": {
                const deviceId = (args as any)?.device_id;
                if (!deviceId) throw new Error("device_id required");
                
                const output = await executeDeviceCommand(deviceId, "show ip interface brief");
                return { content: [{ type: "text", text: output }] };
            }

            case "show_version": {
                const deviceId = (args as any)?.device_id;
                if (!deviceId) throw new Error("device_id required");
                
                const output = await executeDeviceCommand(deviceId, "show version");
                return { content: [{ type: "text", text: output }] };
            }

            case "execute_command": {
                const deviceId = (args as any)?.device_id;
                const command = (args as any)?.command;
                
                if (!deviceId || !command) {
                    throw new Error("device_id and command required");
                }
                
                const output = await executeDeviceCommand(deviceId, command);
                return { content: [{ type: "text", text: output }] };
            }

            case "get_statistics": {
                const stats = deviceManager.getStatistics();
                return {
                    content: [{ 
                        type: "text", 
                        text: JSON.stringify(stats, null, 2)
                    }],
                };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
            isError: true,
        };
    }
});

// Main function
async function main() {
    try {
        // Initialize system
        await initializeSystem();
        
        // Start MCP server
        const transport = new StdioServerTransport();
        await server.connect(transport);
        
        // Only log to stderr (safe for MCP)
        console.error("BIGMIND MCP Server ready");
    } catch (error) {
        console.error("BIGMIND: Failed to start server:", error);
        process.exit(1);
    }
}

main().catch(console.error);