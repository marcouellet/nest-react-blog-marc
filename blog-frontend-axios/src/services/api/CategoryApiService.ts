import { HttpApiService } from '@Services';
import { CategoryDto, UpdateCategoryDto } from "@blog-common/dtos";

const CATEGORY_ENDPOINT = `/category`;
class CategoryApi extends HttpApiService<CategoryDto> {

  getCategoryById = (id: string) => {
    return this.get(`${CATEGORY_ENDPOINT}/${id}`);
  };

  getAllCategories = () => {
    return super.getAll(`${CATEGORY_ENDPOINT}`);
  };

  createCategory = (data: any) => {
    return super.create(`${CATEGORY_ENDPOINT}/create`, data);
  };

  updateCategory = (id: string, data: UpdateCategoryDto) => {
    return super.update(`${CATEGORY_ENDPOINT}/update/${id}`, data);
  };

  deleteCategory = (id: string) => {
    return super.delete(`${CATEGORY_ENDPOINT}/delete/${id}`);
  };
}

export const CategoryApiService = new CategoryApi();