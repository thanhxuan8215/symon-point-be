import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { Injectable, LoggerService as LoggerCommon } from '@nestjs/common';

@Injectable()
export class LoggerService implements LoggerCommon {
  private context?: string;
  private logger: winston.Logger;

  constructor() {
    this.initializeLogger();
  }

  initializeLogger() {
    const format = winston.format.combine(
      winston.format.timestamp({
        format: 'DD/MM/YYYY HH:mm:ss',
      }),
      winston.format.printf(
        (error) => `[${[error.timestamp]}]  [${error.context || 'System'}] :  [${error.level}]: ${error.message}`
      ),
    );
    const fileLogConfig = (level: string) => {
      return {
        filename: `logs/${level}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        level: level,
        handleExceptions: true,
        json: false,
        colorize: true,
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '15d',
      };
    };
    this.logger = winston.createLogger({
      format,
      transports: [
        new winston.transports.Console({
          format,
        }),
        new winston.transports.DailyRotateFile(fileLogConfig('info')),
        new winston.transports.DailyRotateFile(fileLogConfig('error')),
      ],
      // exceptionHandlers: [
      //   new winston.transports.File({ filename: 'logs/exceptions.log' }),
      // ],
    });
  }

  public setContext(context: string) {
    this.context = context;
  }

  public log(message: any, context?: string) {
    context = context || this.context;

    if ('object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.info(msg as string, { context, ...meta });
    }

    return this.logger.info(message, { context });
  }

  public error(message: any, trace?: string, context?: string) {
    context = context || this.context;

    if (message instanceof Error) {
      const { message: msg, name, stack, ...meta } = message;

      return this.logger.error(msg, {
        context,
        stack: [trace || message.stack],
        ...meta,
      });
    }

    if ('object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.error(msg as string, {
        context,
        stack: [trace],
        ...meta,
      });
    }

    return this.logger.error(message, { context, stack: [trace] });
  }

  public warn(message: any, context?: string) {
    context = context || this.context;

    if ('object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.warn(msg as string, { context, ...meta });
    }

    return this.logger.warn(message, { context });
  }

  public debug?(message: any, context?: string) {
    context = context || this.context;

    if ('object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.debug(msg as string, { context, ...meta });
    }

    return this.logger.debug(message, { context });
  }

  public verbose?(message: any, context?: string) {
    context = context || this.context;

    if ('object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.verbose(msg as string, { context, ...meta });
    }

    return this.logger.verbose(message, { context });
  }
}
