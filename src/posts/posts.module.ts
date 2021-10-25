import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostsRepository]), ConfigModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
