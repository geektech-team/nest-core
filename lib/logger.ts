import { LoggerService } from '@nestjs/common';
import {
  createLogger,
  transports,
  format,
  Logger as WinstonLogger,
} from 'winston';

class Logger implements LoggerService {
  logger: WinstonLogger;
  constructor(label = '') {
    this.logger = createLogger({
      format: format.combine(
        format.colorize(),
        format.splat(),
        format.simple(),
        format.label({ label }),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf((arg) => {
          const { level, message, label, timestamp } = arg;
          let i = 0;
          let combineMessage = message;
          while (arg[i]) {
            combineMessage += ` ${arg[i]}`;
            i++;
          }
          const _label = label ? ` [${label}]` : '';
          return `${timestamp} ${level}:${_label} ${combineMessage}`;
        }),
      ),
      transports: [
        new transports.Console({ level: 'debug' }),
        new transports.Console({
          level: 'error',
        }),
      ],
    });
  }

  log(message: any, ...optionalParams: any[]) {
    this.info(message, ...optionalParams);
  }
  info(message: any, ...optionalParams: any[]) {
    this.logger.info(message, optionalParams);
  }
  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, optionalParams);
  }
  debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, optionalParams);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    this.logger.verbose(message, optionalParams);
  }
}

const logger = new Logger();

export { logger, Logger };
