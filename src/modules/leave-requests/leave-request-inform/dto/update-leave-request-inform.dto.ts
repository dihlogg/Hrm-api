import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveRequestInformDto } from './create-leave-request-inform.dto';

export class UpdateLeaveRequestInformDto extends PartialType(CreateLeaveRequestInformDto) {}
