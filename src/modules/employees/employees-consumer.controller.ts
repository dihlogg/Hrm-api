import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmployeesService } from './employees.service';
import { KAFKA_TOPICS } from '../../kafka/config/kafka-topics.constant';

@Controller()
export class EmployeesConsumerController {
  private readonly logger = new Logger(EmployeesConsumerController.name);

  constructor(private readonly employeesService: EmployeesService) {}

  @EventPattern(KAFKA_TOPICS.CANDIDATE_HIRED)
  async handleCandidateHired(@Payload() payload: any) {
    try {
      if (typeof payload === 'string') {
        payload = JSON.parse(payload);
      }
      this.logger.log(`Received CANDIDATE_HIRED event for email: ${payload.email}`);
      await this.employeesService.handleCandidateHiredEvent(payload);
    } catch (error) {
      this.logger.error('Failed to handle CANDIDATE_HIRED event', error);
      throw error;
    }
  }
}
