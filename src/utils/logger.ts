import fs from 'fs';
import path from 'path';

/**
 * Log levels
 */
export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  logToConsole: boolean;
  logToFile: boolean;
  logLevel: LogLevel;
  logFilePath: string;
}

/**
 * Default logger configuration
 */
const defaultConfig: LoggerConfig = {
  logToConsole: true,
  logToFile: true,
  logLevel: LogLevel.INFO,
  logFilePath: path.join(process.cwd(), 'logs', 'app.log'),
};

/**
 * Logger class for application logging
 */
class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.ensureLogDirectory();
  }

  /**
   * Ensure the log directory exists
   */
  private ensureLogDirectory(): void {
    if (this.config.logToFile) {
      const logDir = path.dirname(this.config.logFilePath);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
    }
  }

  /**
   * Format a log message
   */
  private formatLogMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaString}`;
  }

  /**
   * Write a log message to the console
   */
  private logToConsole(level: LogLevel, formattedMessage: string): void {
    if (!this.config.logToConsole) return;

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
    }
  }

  /**
   * Write a log message to a file
   */
  private logToFile(formattedMessage: string): void {
    if (!this.config.logToFile) return;

    try {
      fs.appendFileSync(this.config.logFilePath, formattedMessage + '\n');
    } catch (error) {
      console.error(`Failed to write to log file: ${error}`);
    }
  }

  /**
   * Check if the log level is enabled
   */
  private isLevelEnabled(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    const configLevelIndex = levels.indexOf(this.config.logLevel);
    const logLevelIndex = levels.indexOf(level);
    return logLevelIndex <= configLevelIndex;
  }

  /**
   * Log a message
   */
  private log(level: LogLevel, message: string, meta?: any): void {
    if (!this.isLevelEnabled(level)) return;

    const formattedMessage = this.formatLogMessage(level, message, meta);
    this.logToConsole(level, formattedMessage);
    this.logToFile(formattedMessage);
  }

  /**
   * Log an error message
   */
  error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, message, meta);
  }

  /**
   * Log a warning message
   */
  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta);
  }

  /**
   * Log an info message
   */
  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta);
  }

  /**
   * Log a debug message
   */
  debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, message, meta);
  }
}

// Create and export a default logger instance
export const logger = new Logger();

// Export the Logger class for custom instances
export default Logger;
