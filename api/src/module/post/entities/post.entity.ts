import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;
@Schema({ timestamps: true })
export class Post {
    @Prop({
        type: String,
        required: true
    })
    title: string;

    @Prop({
        type: String,
        required: true
    })
    image: string;
    
    @Prop({
        type: String,
        required: true
    })
    description: string;
}

export const PostSchema = SchemaFactory.createForClass(Post)