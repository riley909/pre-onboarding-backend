import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
