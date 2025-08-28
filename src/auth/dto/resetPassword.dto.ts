import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    token: string;

    @ApiProperty({
        example: 'newPassword',
        description: 'Password (min 6 characters)'
    })
    @IsString()
    @MinLength(5)
    newPassword: string
}