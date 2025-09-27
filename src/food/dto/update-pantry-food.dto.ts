import { PartialType } from '@nestjs/swagger';
import { CreatePantryFoodDto } from './create-pantry-food.dto';

export class UpdatePantryFoodDto extends PartialType(CreatePantryFoodDto) {}
