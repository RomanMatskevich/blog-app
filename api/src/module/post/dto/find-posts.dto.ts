import { IsOptional, Min, IsNumber } from "class-validator";
import { Type } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
    @ApiProperty({
        description: 'Number of page',
        example: '1',
    })
    @IsNumber()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    page?: number;
    
    @ApiProperty({
        description: 'Limit osts on page',
        example: '10',
    })
    @IsNumber()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    limit?: number
}
