import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './service/auth.service';
import { LocalStrategy } from './service/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './service/jwt.strategy';
import { ChangePasswordRequestService } from './service/change-password-request.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') }
      }),
      inject: [ConfigService]
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    ChangePasswordRequestService,
  ]
})
export class AuthModule {}
