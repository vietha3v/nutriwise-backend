import { PartialType } from '@nestjs/swagger';
import { CreateFoodPreferenceDto } from './create-food-preference.dto';

export class UpdateFoodPreferenceDto extends PartialType(CreateFoodPreferenceDto) {}
