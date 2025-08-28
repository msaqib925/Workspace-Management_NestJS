import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty({
        example: 'saqib@gmail.com',
        description: 'Unique email address of user'
    })
    @IsEmail()
    email: string;
}