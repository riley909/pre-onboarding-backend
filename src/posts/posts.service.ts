import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { Post } from './post.entity';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsRepository)
    private postsRepository: PostsRepository,
  ) {}

  getPosts(filterDto: GetPostsFilterDto): Promise<Post[]> {
    return this.postsRepository.getPosts(filterDto);
  }

  getPostById(id: number): Promise<Post> {
    return this.postsRepository.getPostById(id);
  }

  createPost(createPostDto: CreatePostDto): Promise<Post> {
    return this.postsRepository.createPost(createPostDto);
  }
}
