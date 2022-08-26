import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { UserRole } from '@blog-common/enum';
import { CategoryDto, UpdateCategoryDto } from '@blog-common/dtos';
import { CategoryFindCriterias } from '@blog-common/find-criterias/category.find-criterias';
import { CategoryService } from '@Services/category/category.service';

import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('category')
export class CategoryController {

  constructor(private readonly categoryService: CategoryService) {}

  // Fetch all category
  @Get()
  async getAll(): Promise<CategoryDto[]> {
    return this.categoryService.getAllCategories();
  }

  // Fetch a particular category using ID
  @Get(':id')
  async getCategory(@Param('id') id: string): Promise<CategoryDto> {
    return this.categoryService.getCategoryById(id);
  }

  // Submit a new category
  @Post('/create')
  @Auth([UserRole.ADMIN])
  async createCategory(@Body(new ValidationPipe()) categoryDto: CategoryDto): Promise<CategoryDto> {
    return this.categoryService.createCategory(categoryDto);
  }

  // Update a category
  @Put('/update/:id')
  @Auth([UserRole.ADMIN])
  async updateCategory(@Param('id') id: string,
                       @Body(new ValidationPipe()) updateCategoryDto: UpdateCategoryDto): Promise<CategoryDto> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  // Fetch a category based on criterias
  @Post('/find')
  async findCategory(@Body(new ValidationPipe()) categoriesCriterias: CategoryFindCriterias): Promise<CategoryDto> {
    return this.categoryService.findCategory(categoriesCriterias);
  }

  // Fetch categories based on criterias
  @Post('/findMany')
  async findCanyCategories(@Body(new ValidationPipe()) categoriesCriterias: CategoryFindCriterias): Promise<CategoryDto[]> {
    return this.categoryService.findManyCategories(categoriesCriterias);
  }

  // Get count of categories meating criterias
  @Post('/findManyCount')
  async findManyCategorysCount(@Body(new ValidationPipe()) categoriesCriterias: CategoryFindCriterias): Promise<number> {
    return this.categoryService.findManyCategoriesCount(categoriesCriterias);
  }

  // Delete a category
  @Delete('/delete/:id')
  @Auth([UserRole.ADMIN])
  async deleteCategory(@Param('id') id: string): Promise<CategoryDto> {
    return this.categoryService.deleteCategory(id);
  }
}
