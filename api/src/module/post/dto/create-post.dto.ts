import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MinLength } from "class-validator";
import {
    FileData,
    HasMimeType,
    IsFileData,
    MaxFileSize,
    MimeType,
  } from "nestjs-formdata-interceptor";

export class CreatePostDto {
    @ApiProperty({
      description: 'Post Title (min 12 char)',
      example: 'Post about dogs and animals',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(12)
    title: string;

    @ApiProperty({
      description: 'Post Description(min 50 char)',
      example: 'Post about dogs and animals adn other value of string is boolean or not baby',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(50)
    description: string;

    @ApiProperty({
      description: 'Image (jpg,png,jpeg)',
    })
    @IsNotEmpty()
    @IsFileData({ each: true })
    @HasMimeType([MimeType["image/jpg"], "image/png", "image/jpeg"], { each: true })
    @MaxFileSize(4000000, { each: true })
  
    image: FileData;
}
