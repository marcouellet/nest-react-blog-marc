import { ImageData } from '../interfaces';
import { CategoryDto } from './category.dto';
import { UserDto } from './user.dto';
export declare class CreatePostDto {
    title: string;
    description: string;
    body: string;
    category: CategoryDto;
    image: ImageData;
    user: UserDto;
}
