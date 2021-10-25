import { Body, Controller, Get, Post, Param, Query } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  getPosts(@Query() filterDto: GetPostsFilterDto) {
    return this.postsService.getPosts(filterDto);
  }

  @Get('/:id')
  getPostById(@Param('id') id: number) {
    return this.postsService.getPostById(id);
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }
}
