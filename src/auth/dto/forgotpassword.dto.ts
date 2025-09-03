import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty({
        example: 'saqib@gmail.com',
        description: 'Registered email address of user'
    })
    @IsEmail()
    email: string;
}