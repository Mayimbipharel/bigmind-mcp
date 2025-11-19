import { LogLevel } from '../types/index.js';

class Logger {
    private level: LogLevel = 'error';
    
    constructor(level: LogLevel = 'error') {
        this.level = level;
    }
    
    setLevel(level: LogLevel): void {
        this.level = level;
    }
    
    private shouldLog(level: LogLevel): boolean {
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
        const currentLevelIndex = levels.indexOf(this.level);
        const requestedLevelIndex = levels.indexOf(level);
        return requestedLevelIndex >= currentLevelIndex;
    }
    
    // Use stderr for all logs (MCP requirement)
    debug(message: string, ...args: any[]): void {
        if (this.shouldLog('debug')) {
            console.error(`[DEBUG] ${message}`, ...args);
        }
    }
    
    info(message: string, ...args: any[]): void {
        if (this.shouldLog('info')) {
            console.error(`[INFO] ${message}`, ...args);
        }
    }
    
    warn(message: string, ...args: any[]): void {
        if (this.shouldLog('warn')) {
            console.error(`[WARN] ${message}`, ...args);
        }
    }
    
    error(message: string, error?: Error, ...args: any[]): void {
        if (this.shouldLog('error')) {
            console.error(`[ERROR] ${message}`, error, ...args);
        }
    }
}

export const logger = new Logger('error'); // Only show errors by default