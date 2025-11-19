// Core Types for BIGMIND

export interface DeviceConfig {
    id: string;
    name: string;
    type: string;
    profile: string;
    connection: ConnectionConfig;
    tags?: string[];
    source?: string;
    metadata?: Record<string, any>;
}

export interface ConnectionConfig {
    protocol: 'ssh' | 'http' | 'https' | 'snmp' | 'telnet';
    host?: string;
    port?: number;
    base_url?: string;
    credentials?: CredentialsConfig;
    timeout?: number;
    verify_ssl?: boolean;
}

export interface CredentialsConfig {
    username?: string;
    password?: string;
    api_token?: string;
    api_key?: string;
    ssh_key?: string;
}

export interface VendorProfile {
    vendor: string;
    os: string;
    protocol: string;
    ssh_settings?: SSHSettings;
    commands?: Record<string, string>;
    prompts?: {
        user?: string;
        privileged?: string;
        config?: string;
    };
}

export interface SSHSettings {
    port: number;
    ready_timeout: number;
    keepalive_interval: number;
    algorithms?: {
        serverHostKey?: string[];
        kex?: string[];
        cipher?: string[];
        hmac?: string[];
        compress?: string[];
    };
}

export interface DeviceInventory {
    vendor: string;
    protocol: string;
    description?: string;
    connection?: ConnectionConfig;
    devices: DeviceConfig[];
}

export interface ConnectionStatus {
    connected: boolean;
    last_used?: Date;
    error?: string;
}

export interface CommandResult {
    success: boolean;
    output?: string;
    error?: string;
    timestamp: Date;
    execution_time?: number;
}

export interface HealthStatus {
    device_id: string;
    status: 'healthy' | 'warning' | 'critical' | 'unknown';
    checks: HealthCheck[];
    timestamp: Date;
}

export interface HealthCheck {
    name: string;
    status: 'pass' | 'fail' | 'warning';
    message?: string;
    value?: any;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
