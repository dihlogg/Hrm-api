import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveRequestParticipantsDto } from './create-leave-request-participants.dto';

export class UpdateLeaveRequestParticipantsDto extends PartialType(CreateLeaveRequestParticipantsDto) {}
