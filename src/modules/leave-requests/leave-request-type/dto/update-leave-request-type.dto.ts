import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveRequestTypeDto } from './create-leave-request-type.dto';

export class UpdateLeaveRequestTypeDto extends PartialType(CreateLeaveRequestTypeDto) {}
