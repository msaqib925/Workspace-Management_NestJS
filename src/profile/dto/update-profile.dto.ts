import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class updateProfileDto {
  @IsOptional()
  @ApiProperty({
    example: 'Aaqib',
    description: 'Updated Name'
  })
  @IsString()
  name?: string;

  @IsOptional()
  @ApiProperty({
    example: 'aaqib@gmail.com',
    description: 'Unique and updated email address of user'
  })
  @IsEmail()
  email?: string;
}
