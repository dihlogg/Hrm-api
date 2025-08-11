import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveReasonDto } from './create-leave-reason.dto';

export class UpdateLeaveReasonDto extends PartialType(CreateLeaveReasonDto) {}
