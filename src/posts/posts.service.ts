import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.entity';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsRepository)
    private postsRepository: PostsRepository,
  ) {}

  getPosts(filterDto: GetPostsFilterDto, user: User): Promise<Post[]> {
    return this.postsRepository.getPosts(filterDto, user);
  }

  getPostById(id: number, user: User): Promise<Post> {
    return this.postsRepository.getPostById(id, user);
  }

  createPost(createPostDto: CreatePostDto, user: User): Promise<Post> {
    return this.postsRepository.createPost(createPostDto, user);
  }

  updatePost(
    id: number,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    return this.postsRepository.updatePost(id, updatePostDto, user);
  }

  closePost(id: number, user: User): Promise<Post> {
    return this.postsRepository.closePost(id, user);
  }

  deletePost(id: number, user: User): Promise<void> {
    return this.postsRepository.deletePost(id, user);
  }
}
