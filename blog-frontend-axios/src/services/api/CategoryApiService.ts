import { HttpApiService } from '@Services';
import { ICategory, IUpdateCategory } from "@Types";

const CATEGORY_ENDPOINT = `/category`;
class CategoryApi extends HttpApiService<ICategory> {

  getCategoryById = (id: string) => {
    return this.get(`${CATEGORY_ENDPOINT}/${id}`);
  };

  getAllCategories = () => {
    return super.getAll(`${CATEGORY_ENDPOINT}`);
  };

  createCategory = (data: any) => {
    return super.create(`${CATEGORY_ENDPOINT}/create`, data);
  };

  updateCategory = (id: string, data: IUpdateCategory) => {
    return super.update(`${CATEGORY_ENDPOINT}/update/${id}`, data);
  };

  deleteCategory = (id: string) => {
    return super.delete(`${CATEGORY_ENDPOINT}/delete/${id}`);
  };
}

export const CategoryApiService = new CategoryApi();