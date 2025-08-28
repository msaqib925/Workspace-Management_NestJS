import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({
        example: 'saqib@gmail.com',
        description: 'Unique email address of user'
    })
    @IsEmail()
    email: string;


    @ApiProperty({
        example: 'Saqib',
        description: 'Name of user'
    })
    @IsString()
    name: string;


    @ApiProperty({
        example: 'password',
        description: 'Password (min 6 characters)'
    })
    @IsString()
    @MinLength(6)
    password: string;
}