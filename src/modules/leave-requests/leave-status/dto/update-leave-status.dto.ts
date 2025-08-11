import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveStatusDto } from './create-leave-status.dto';

export class UpdateLeaveStatusDto extends PartialType(CreateLeaveStatusDto) {}
