import { User } from '../../user/model/user.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Connection, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private userRepository: Repository<User>;
  constructor(
    private jwtService: JwtService,
    private connection: Connection
  ) {
    this.userRepository = this.connection.getRepository(User);
  }

  async validateUser(login: string, pass: string): Promise<User | null> {
    const user: User = await this.userRepository.findOne({ where: { login } });

    if (user && await bcrypt.compare(pass, user.password)) {
      const { ...secureUser } = user;
      return secureUser;
    }

    return null;
  }

  async login(user: User) {
    const payload = { id: user.id };
    return {
      accessToken: this.jwtService.sign(payload)
    }
  }
}
