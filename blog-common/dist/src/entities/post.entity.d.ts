import { User, Category } from './';
import { ImageData } from '../interfaces';
export declare class Post {
    id?: string;
    title: string;
    description: string;
    body: string;
    category: Category;
    image: ImageData;
    user: User;
    publishDate: Date;
}
export declare const minimumPostTitleLength = 3;
export declare const minimumPostDescriptionLength = 10;
export declare const minimumPostBodyLength = 10;
