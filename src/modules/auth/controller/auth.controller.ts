import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Connection, Repository } from 'typeorm';
import { Admin } from '../../admin/model/admin.entity';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { LocalAuthGuard } from '../guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  private adminRepository: Repository<Admin>;
  constructor(
    private authService: AuthService,
    private connection: Connection
  ) {
    this.adminRepository = this.connection.getRepository(Admin);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    const admin =  await this.adminRepository.findOne(req.user.id);
    return this.authService.login(admin);
  }
}
