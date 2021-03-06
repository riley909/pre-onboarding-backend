import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Like, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStatus } from './post-status.enum';
import { Post } from './post.entity';
import * as dayjs from 'dayjs';
import { User } from 'src/auth/user.entity';
import { Pagination, PaginationOptions } from 'src/paginate';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';

@EntityRepository(Post)
export class PostsRepository extends Repository<Post> {
  async getPosts(
    options: PaginationOptions,
    filterDto: GetPostsFilterDto,
  ): Promise<Pagination<Post>> {
    const { take, page } = options;
    const { status, search } = filterDto;

    const [results, total] = await this.findAndCount({
      where: search && [
        { title: Like(`%${search}%`) },
        { content: Like(`%${search}%`) },
      ],
      select: ['id', 'title', 'content', 'created', 'status', 'user'],
      take: take,
      skip: take * (page - 1),
      order: { id: 'DESC' },
    });

    try {
      return new Pagination<Post>({
        results,
        total,
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getPostById(id: number, user: User): Promise<Post> {
    const found = await this.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`게시글 ID "${id}"번이 존재하지 않습니다.`);
    }
    return found;
  }

  async createPost(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const { title, content } = createPostDto;
    const now: string = dayjs().format('YYYY-MM-DD');

    const post = this.create({
      title,
      content,
      created: now,
      status: PostStatus.OPEN,
      user,
    });
    await this.save(post);
    return post;
  }

  async updatePost(
    id: number,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const { title, content } = updatePostDto;

    try {
      const post = await this.getPostById(id, user);
      if (title) post.title = title;
      if (content) post.content = content;

      await this.save(post);
      return post;
    } catch (e) {
      throw new UnauthorizedException(`해당 사용자의 게시글이 아닙니다.`);
    }
  }

  async closePost(id: number, user: User): Promise<Post> {
    try {
      const post = await this.getPostById(id, user);
      post.status = PostStatus.CLOSE;
      await this.save(post);
      return post;
    } catch (e) {
      throw new UnauthorizedException(`해당 사용자의 게시글이 아닙니다.`);
    }
  }

  async deletePost(id: number, user: User): Promise<string> {
    const post = await this.getPostById(id, user);

    if (post.status === PostStatus.CLOSE) {
      await this.delete(id);
    } else {
      throw new ConflictException(
        `게시글 ID "${id}"번이 닫힌 상태가 아닙니다. 상태를 "CLOSE" 로 변경한 뒤 삭제해 주세요.`,
      );
    }
    return `게시글 ID "${id}"번이 완전히 삭제되었습니다.`;
  }
}
