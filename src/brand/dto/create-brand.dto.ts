import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
    @ApiProperty({ example: 'Tech Clients', description: 'Name of the brand' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
