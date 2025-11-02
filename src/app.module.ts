import { Module } from '@nestjs/common';
import { FilmesModule } from './filmes/filmes.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { AppController } from './app.controller';
@Module({
  imports: [FilmesModule, PrismaModule, AuthModule, UsersModule, ProfileModule],
  controllers:[AppController]
})
export class AppModule {}
