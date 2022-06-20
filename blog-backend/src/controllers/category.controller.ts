import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { CategoryService } from '../services/category/category.service';
import { CategoryDto, UpdateCategoryDto } from '../core/dtos';
import { CategoryFindCriterias } from '../core/find-criterias/category.find-criterias';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../core/enum';

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
  @Put('/find')
  async findCategory(@Body(new ValidationPipe()) categoriesCriterias: CategoryFindCriterias): Promise<CategoryDto> {
    return this.categoryService.findCategory(categoriesCriterias);
  }

  // Fetch categories based on criterias
  @Put('/findAll')
  async findCanyCategories(@Body(new ValidationPipe()) categoriesCriterias: CategoryFindCriterias): Promise<CategoryDto[]> {
    return this.categoryService.findManyCategories(categoriesCriterias);
  }

  // Get count of categories meating criterias
  @Put('/findManyCount')
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
