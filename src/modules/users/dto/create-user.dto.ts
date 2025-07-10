import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto{
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    userName: string;

    @ApiProperty()
    password: string;
}
