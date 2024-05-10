import { LoggerService } from "@nestjs/common";
import { createLogger, transports, format } from "winston";

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.splat(),
    // format.label({ label: "bff" }),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.printf(({ level, message, label, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console({ level: "debug" }),
    new transports.Console({
      level: "error",
    }),
  ],
});

class Logger implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    logger.info(message);
  }
  error(message: any, ...optionalParams: any[]) {
    logger.error(message);
  }
  warn(message: any, ...optionalParams: any[]) {
    logger.warn(message);
  }
  debug?(message: any, ...optionalParams: any[]) {
    logger.debug(message);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    logger.verbose(message);
  }
}

export { logger, Logger };
