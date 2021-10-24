import { IsOptional, IsString } from 'class-validator';

export class GetPostsFilterDto {
  @IsOptional()
  @IsString()
  search: string;
}
