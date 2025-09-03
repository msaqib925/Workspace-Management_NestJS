import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({
        example: 'f7f581888306abfd8ee6ffcc05d17a6379dd63b40e7c75dca5d1472ea3704ad6',
        description: 'reset password token'
    })

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