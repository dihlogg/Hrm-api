import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitPublisherService {
  constructor(
    @Inject('HRM_NOTIFY_SERVICE') private readonly rabbitClient: ClientProxy,
  ) {}

  async emitWithRetry(
    pattern: string,
    data: any,
    maxRetries = 3,
    baseDelay = 2000, // 2s
  ): Promise<void> {
    let attempt = 0;

    const attemptSend = async (): Promise<void> => {
      try {
        await new Promise<void>((resolve, reject) => {
          console.log(
            `[${new Date().toISOString()}] Attempting to publish message:`,
            {
              pattern,
              data,
              attempt: attempt + 1,
              queue: 'hrm.notifications',
            },
          );
          const observable = this.rabbitClient.emit(pattern, data);
          const subscription = observable.subscribe({
            next: () => {
              console.log(
                `[${new Date().toISOString()}] Successfully published message:`,
                {
                  pattern,
                  queue: 'hrm.notifications',
                },
              );
              subscription.unsubscribe();
              resolve();
            },
            error: (error) => {
              console.error(
                `[${new Date().toISOString()}] Failed to publish message (attempt ${attempt + 1}):`,
                {
                  pattern,
                  error: error.message,
                },
              );
              subscription.unsubscribe();
              reject(error);
            },
            complete: () => {
              console.log(
                `[${new Date().toISOString()}] Message publish completed:`,
                {
                  pattern,
                  queue: 'hrm.notifications',
                },
              );
              subscription.unsubscribe();
              resolve();
            },
          });
        });
      } catch (error) {
        attempt++;
        if (attempt > maxRetries) {
          console.error(
            `[${new Date().toISOString()}] Failed to publish event after ${maxRetries} retries:`,
            {
              pattern,
              error: error.message,
            },
          );
          throw new Error(
            `Failed to publish event "${pattern}" after ${maxRetries} retries: ${error.message}`,
          );
        }
        const delay = baseDelay * 2 ** attempt;
        console.log(
          `[${new Date().toISOString()}] Retrying after ${delay}ms:`,
          {
            pattern,
            attempt: attempt + 1,
          },
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return attemptSend();
      }
    };

    return attemptSend();
  }
}
