import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateDto } from './dto/create.dto';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get/:id')
  getHello(@Param('id', ParseIntPipe) id: number) {
    if (id < 0) {
      throw new BadRequestException('Id должен быть больше 0');
    }
    return this.appService.getHello();
    // return this.appService.getHello();
  }
  @UsePipes(new ValidationPipe())
  @Post('create')
  getPost(@Body() dto: CreateDto) {
    return dto;
  }
}
