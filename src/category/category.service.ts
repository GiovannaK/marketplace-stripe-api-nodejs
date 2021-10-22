import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.create({
      ...createCategoryDto,
    });

    if (!category) {
      throw new InternalServerErrorException('Cannot create category');
    }

    return this.categoryRepository.save(category);
  }

  async findCategoryById(id: string) {
    const category = await this.categoryRepository.findOne(id);

    if (!category) {
      throw new NotFoundException('Category not found, try a different id');
    }

    return category;
  }

  async findAllCategories() {
    const categories = await this.categoryRepository.find();
    return categories;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findCategoryById(id);

    await this.categoryRepository.update(category, {
      ...updateCategoryDto,
    });

    const updatedCategory = this.categoryRepository.create({
      ...category,
      ...updateCategoryDto,
    });

    await this.categoryRepository.save(updatedCategory);

    return updatedCategory;
  }

  async deleteCategory(id: string) {
    const category = await this.findCategoryById(id);

    if (!category) {
      new InternalServerErrorException('Cannot delete category');
    }
    return this.categoryRepository.remove(category);
  }
}
