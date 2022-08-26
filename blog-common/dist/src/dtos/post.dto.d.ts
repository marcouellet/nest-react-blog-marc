import { UserDto } from './user.dto';
import { CategoryDto } from './category.dto';
import { ImageData } from '../interfaces';
export declare class PostDto {
    id?: string;
    title: string;
    description: string;
    body: string;
    category?: CategoryDto;
    image: ImageData;
    user: UserDto;
    publishDate?: Date;
}
