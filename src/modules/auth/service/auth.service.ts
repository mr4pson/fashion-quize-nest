import { User } from '../../user/model/user.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Connection, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegistrationDto } from '../registration.dto';
import { Answer } from 'src/modules/answer/answer.entity';
import { MailService } from 'src/modules/mail/mail.service';
import { generateRandomString } from 'src/modules/shared/utils/generate-random-string.utils';

@Injectable()
export class AuthService {
  private userRepository: Repository<User>;
  private answerRepository: Repository<Answer>;
  constructor(
    private jwtService: JwtService,
    private connection: Connection,
    private mailService: MailService,
  ) {
    this.userRepository = this.connection.getRepository(User);
    this.answerRepository = this.connection.getRepository(Answer);
  }

  async validateUser(login: string, pass: string): Promise<User | null> {
    const user: User = await this.userRepository.findOne({ where: { login } });

    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { ...secureUser } = user;
      return secureUser;
    }

    return null;
  }

  async login(user: User) {
    const payload = {
      id: user.id,
      roles: user.roles,
      name: user.name,
      age: user.age,
      city: user.city,
      login: user.login,
      createdAt: user.createdAt,
    };
    return {
      accessToken: this.jwtService.sign(payload)
    }
  }

  findById(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async registrate(answerData: RegistrationDto): Promise<Answer> {
    const password = generateRandomString(8);

    const userPayload: User = this.userRepository.create({
      login: answerData.email,
      name: answerData.name,
      roles: '["USER"]',
      age: answerData.age,
      city: answerData.city,
      passwordHash: await bcrypt.hash(password, 10),
    });

    await this.mailService.userRegistrationSuccessful(userPayload, password);

    const user = await this.userRepository.save(userPayload);

    const answer = new Answer();
    answer.data = answerData.data;
    answer.user = user;

    return this.answerRepository.save(answer);
  }
}
