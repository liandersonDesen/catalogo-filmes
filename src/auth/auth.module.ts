import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService,PrismaService,JwtStrategy],
    imports:[
    JwtModule.register({
      secret:process.env.SECRET_KEY,
      signOptions:{expiresIn:'1h'}
    })
  ]
})
export class AuthModule {}
