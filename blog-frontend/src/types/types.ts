import { ImageData } from "shared/interfaces";
import { CategoryDto } from "shared/dtos";

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface IErrors {
  [key: string]: string | string[];
}

export interface ImageSizeProps {
  maxWidth:number,  
  maxHeight:number,
}

export type IPostEditingFormState = {
  categoryTitle: string;
  title: string;
  description: string;
  body: string;
  imageChanged: boolean;
}

export interface IPostEditingState {
  content?: string;
  formState: IPostEditingFormState,
  category?: CategoryDto,
  postImage?: ImageData,
  postUrl: string,
  isDirty: boolean
}
