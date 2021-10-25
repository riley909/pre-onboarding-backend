import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStatus } from './post-status.enum';
import { Post } from './post.entity';
import * as dayjs from 'dayjs';

@EntityRepository(Post)
export class PostsRepository extends Repository<Post> {
  async getPosts(filterDto: GetPostsFilterDto): Promise<Post[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('post');

    if (search) {
      query.andWhere(
        '(LOWER(post.title) LIKE LOWER(:search) OR LOWER(post.content) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const posts = await query.getMany();
      return posts;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getPostById(id: number): Promise<Post> {
    const found = await this.findOne(id);

    if (!found) {
      throw new NotFoundException(`게시글 ID "${id}"번이 존재하지 않습니다.`);
    }
    return found;
  }

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const { title, content } = createPostDto;
    const now: string = dayjs().format('YYYY-MM-DD');

    const post = this.create({
      title,
      content,
      created: now,
      status: PostStatus.OPEN,
    });
    await this.save(post);
    return post;
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const { title, content } = updatePostDto;
    const post = await this.getPostById(id);

    post.title = title;
    post.content = content;
    await this.save(post);
    return post;
  }

  async closePost(id: number): Promise<Post> {
    const post = await this.getPostById(id);
    post.status = PostStatus.CLOSE;
    await this.save(post);
    return post;
  }

  async deletePost(id: number): Promise<void> {
    const post = await this.getPostById(id);

    if (!post) {
      throw new NotFoundException(`게시글 ID "${id}"번이 존재하지 않습니다.`);
    }

    if (post.status === PostStatus.CLOSE) {
      await this.delete(id);
    } else {
      throw new ConflictException(
        `게시글 ID "${id}"번이 닫힌 상태가 아닙니다. 상태를 "CLOSE" 로 변경한 뒤 삭제해 주세요.`,
      );
    }
  }
}
