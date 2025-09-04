import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteMemberDto {
    @ApiProperty({ example: 'user@example.com', description: 'Email of the user to invite' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
