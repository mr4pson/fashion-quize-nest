import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { Connection, Repository } from 'typeorm';
import { User } from '../user/model/user.entity';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  private userRepository: Repository<User>;
  constructor(
    private authService: AuthService,
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
}
