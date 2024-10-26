import { AsyncLocalStorage } from 'async_hooks';
import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';

const asyncLocalStorage = new AsyncLocalStorage<{ tracingId: string }>();

export class Logger {
  private baseLogger;

  constructor() {
    this.baseLogger = pino({
      base: { pid: false },
      level: 'debug',
    });
  }

  private getTracingId(): string {
    const store = asyncLocalStorage.getStore();
    return store?.tracingId || 'N/A';
  }

  public getLogger() {
    return this.baseLogger.child({ tracingId: this.getTracingId() });
  }

  public static setTracingId(tracingId: string = uuidv4(), callback: () => void): void {
    asyncLocalStorage.run({ tracingId }, callback);
  }
}



function curriculumService(): void {
  const logger = new Logger().getLogger();
  logger.info('Request received at curriculum service');
  authService();
  reportService();
  logger.info('Returning response from curriculum service');
}

function authService(): void {
  const logger = new Logger().getLogger();
  logger.info('Authenticating user');
  // Simulate authentication process
  logger.info('User authenticated successfully');
}

function reportService(): void {
  const logger = new Logger().getLogger();
  logger.info('Generating report');
  // Simulate report generation
  logger.info('Report generated successfully');
}

Logger.setTracingId(undefined, () => {
  curriculumService();
});


