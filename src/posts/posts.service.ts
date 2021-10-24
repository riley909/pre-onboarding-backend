import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsRepository)
    private postsRepository: PostsRepository,
  ) {}
}
