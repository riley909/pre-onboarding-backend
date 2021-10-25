import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { email, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      email,
      password: hashedPassword,
    });

    try {
      await this.save(user);
      return `회원 가입이 완료되었습니다.`;
    } catch (e) {
      if (e.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException(`이미 가입된 이메일 입니다`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
