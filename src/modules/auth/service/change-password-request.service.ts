import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { generateRandomString } from 'src/modules/shared/utils/generate-random-string.utils';
import { Connection, DeleteResult, Repository } from 'typeorm';
import { MailService } from '../../mail/mail.service';
import { ChangePasswordStatuses } from '../../shared/enum/change-password-statuses.enum';
import { User } from '../../user/model/user.entity';
import { ChangePasswordRequest } from '../change-password-request.entity';

@Injectable()
export class ChangePasswordRequestService {
  private changePasswordRequestRepository: Repository<ChangePasswordRequest>;
  private userRepository: Repository<User>;
  constructor(
    private connection: Connection,
    private mailService: MailService,
  ) {
    this.changePasswordRequestRepository = this.connection.getRepository(ChangePasswordRequest);
    this.userRepository = this.connection.getRepository(User);
  }
  
  async findByToken(token: string): Promise<ChangePasswordRequest> {
    return this.changePasswordRequestRepository.findOne({ 
      relations: ['user'],
      where: { 
        token,
        status: ChangePasswordStatuses.NEW,
      } 
    });
  }

  async create(user: User): Promise<ChangePasswordRequest> {
    const changePasswordRequest = new ChangePasswordRequest();

    changePasswordRequest.status = ChangePasswordStatuses.NEW;
    changePasswordRequest.token = generateRandomString(30),
    changePasswordRequest.createdAt = new Date(),
    changePasswordRequest.updatedAt = new Date(),
    changePasswordRequest.user = user;

    return this.changePasswordRequestRepository.save(changePasswordRequest);
  }

  async executeRequest(changePasswordRequest: ChangePasswordRequest): Promise<ChangePasswordRequest> {

    changePasswordRequest.status = ChangePasswordStatuses.DONE;
    changePasswordRequest.updatedAt = new Date();

    const user = changePasswordRequest.user;
    const password = generateRandomString(8);
    user.passwordHash = await bcrypt.hash(password, 10);

    await this.mailService.resetPasswordSuccessful(user, password);

    await this.userRepository.save(user);

    return this.changePasswordRequestRepository.save(changePasswordRequest);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.changePasswordRequestRepository.delete(id);
  }
}
