import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { Public } from 'src/auth/decorator/public.decorator';
import { User } from 'src/auth/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@UseGuards(AuthGuard())
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  @Public()
  getPosts(
    @Query('take') take: number,
    @Query('page') page: number,
    @Query() filterDto: GetPostsFilterDto,
  ) {
    return this.postsService.getPosts({ take, page }, filterDto);
  }

  @Get('/:id')
  getPostById(@Param('id') id: number, @GetUser() user: User) {
    return this.postsService.getPostById(id, user);
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return this.postsService.createPost(createPostDto, user);
  }

  @Patch('/:id')
  updatePost(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: User,
  ) {
    return this.postsService.updatePost(id, updatePostDto, user);
  }

  @Patch('/:id/close')
  closePost(@Param('id') id: number, @GetUser() user: User) {
    return this.postsService.closePost(id, user);
  }

  @Delete('/:id')
  deletePost(@Param('id') id: number, @GetUser() user: User) {
    return this.postsService.deletePost(id, user);
  }
}
