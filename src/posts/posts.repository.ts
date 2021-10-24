import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { GetPostsFilterDto } from './dto/get-posts-filter.dto';
import { Post } from './post.entity';

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
}
