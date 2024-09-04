import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from './dto/find-posts.dto';
import { ApiResponse } from '@nestjs/swagger';
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @ApiResponse({ status: 200, description: 'post' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @UsePipes(new ValidationPipe())
  create(@Body() createPostDto: CreatePostDto) {
    createPostDto.image.save();
    return this.postService.create(createPostDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'arr post' })
  @ApiResponse({ status: 500, description: 'Internal' })
  @UsePipes(new ValidationPipe())
  findAll(@Query() paginationDto: PaginationDto) {
    return this.postService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'post' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UsePipes(new ValidationPipe())
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'post' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    updatePostDto.image.save();
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
