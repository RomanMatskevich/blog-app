import { IsOptional, Min, IsNumber } from "class-validator";
import { Type } from 'class-transformer';

export class PaginationDto {
    @IsNumber()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    page?: number;
    
    @IsNumber()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    limit?: number
}
