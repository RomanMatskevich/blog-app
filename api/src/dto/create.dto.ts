import { IsNumber, Max, Min } from 'class-validator';
export class CreateDto {
  @Min(1)
  @Max(10)
  @IsNumber()
  num: number;
}
