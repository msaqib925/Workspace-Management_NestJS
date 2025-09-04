import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateWorkspaceDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Updated workspace name' })
    name?: string
}