import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({
        example: 'saqib@gmail.com',
        description: 'Unique email address of user'
    })
    @IsString()
    email: string;


    @ApiProperty({
        example: 'password',
        description: 'Password (min 6 characters)'
    })
    @IsString()
    password: string;
}