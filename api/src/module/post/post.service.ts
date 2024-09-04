import { Model } from 'mongoose';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from './dto/find-posts.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  create(createPostDto: CreatePostDto) {
    const { title, description ,image } = createPostDto;
    try{
      const createdPost = this.postModel.create({title, description, image: image.fileNameFull});
      return createdPost;
    }catch(error){
      throw new InternalServerErrorException('Failed to load posts', error.message)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const page = Number(paginationDto.page) || 1
    const limit = Number(paginationDto.limit) || 10
    const skip = (page - 1) * (limit)
    try {
      const posts = await this.postModel.find()
        .skip(skip)
        .limit(limit)
        .exec();
      const total = await this.postModel.countDocuments().exec();
      return { posts, total };
    } catch (error){
      throw new InternalServerErrorException('Failed to load posts', error.message)
    }
  }

  async findOne(id: string) {
    try {
      const post = await this.postModel.findById(id);
      if(!post){
        throw new NotFoundException('post with this id doesn`t exist', )
      }
      return post;
    } catch (error){
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to load post', error.message);
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const { title, description ,image } = updatePostDto;
    try {
      const post = await this.postModel.findByIdAndUpdate(id, {title, description, image: image.fileNameFull})
      if(!post){
        throw new NotFoundException('post with this id doesn`t exist', )
      }
      return post

    }catch (error){
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Failed to load post', error.message);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.postModel.findByIdAndDelete(id)
      if(!result){
        throw new NotFoundException('Post with this ID doesn\'t exist');
      }
      return result
    }catch (error){
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to load post', error.message);
    }
  }
}
