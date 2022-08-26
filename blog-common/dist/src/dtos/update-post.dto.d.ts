import { Category } from '../entities';
import { CategoryDto } from '../dtos';
import { ImageData } from '../interfaces';
export declare class UpdatePostDto {
    title: string;
    description: string;
    body: string;
    category: CategoryDto;
    image: ImageData;
}
export interface IUpdatePostCriterias {
    category: Category;
    title: string;
    description: string;
    body: string;
    image: ImageData;
}
