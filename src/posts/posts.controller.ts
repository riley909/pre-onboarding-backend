import { Controller, Get, Query } from '@nestjs/common';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { Post } from './post.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  getPosts(@Query() filterDto: GetPostsFilterDto): Promise<Post[]> {
    return this.postsService.getPosts(filterDto);
  }
}
