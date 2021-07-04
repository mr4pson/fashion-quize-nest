import { Body, Controller, Get, NotFoundException, Post, Request, UseGuards, Query } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { User } from '../user/model/user.entity';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './service/auth.service';
import { MailService } from '../mail/mail.service';
import { ChangePasswordRequestService } from './service/change-password-request.service';

@Controller('auth')
export class AuthController {
  private userRepository: Repository<User>;
  constructor(
    private authService: AuthService,
    private mailService: MailService,
    private changePasswordRequestService: ChangePasswordRequestService,
    private connection: Connection
  ) {
    this.userRepository = this.connection.getRepository(User);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userData = await this.userRepository.findOne(req.user.id);
    return {
      id: userData.id,
      login: userData.login,
      fullName: userData.name,
      roles: userData.roles,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    const user = await this.userRepository.findOne(req.user.id);
    return this.authService.login(user);
  }

  @Post('reset-password')
  async resetPassword(@Body() data: { login: string }) {
    const user = await this.userRepository.findOne({ where: { login: data.login } });

    if (user) {
      const changePasswordRequest = await this.changePasswordRequestService.create(user);
      return this.mailService.sendResetPasswordConfirmation(user, changePasswordRequest.token);
    }
    throw new NotFoundException();
  }
  
  @Post('reset-password-confirmation')
  async resetPasswordConfirmation(@Body() data: { token: string }) {

    const changePasswordRequest = await this.changePasswordRequestService.findByToken(data.token);

    if (changePasswordRequest) {
      return await this.changePasswordRequestService.executeRequest(changePasswordRequest);
    }
    throw new NotFoundException();
  }
}
