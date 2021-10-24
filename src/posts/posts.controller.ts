import { Controller, Get, Param, Query } from '@nestjs/common';
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

  @Get('/:id')
  getPostById(@Param('id') id: number): Promise<Post> {
    return this.postsService.getPostById(id);
  }
}
