import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateWorkspaceDto {
    @ApiProperty({
        example: 'Creative Agency',
        description: 'The name of workspace'
    })
    @IsString()
    @IsNotEmpty()
    name: string
}