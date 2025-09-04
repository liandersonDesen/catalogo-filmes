// users/users.controller.ts
import { Controller, Put, Delete, Body, UseGuards, Logger } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { GetUser } from '../common/decorators/user.decorator';
import { UpdateUsuarioDto } from '../users/dto/update-usuario.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';


@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Put()
  @ApiOperation({ summary: 'Atualizar meu perfil' })
  @ApiBody({ type: UpdateUsuarioDto })
  @ApiResponse({ status: 200, description: 'Perfil atualizado' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  async updateProfile(
    @GetUser() user: any,
    @Body() updateUserDto: UpdateUsuarioDto,
  ) {
    return this.profileService.update(user.sub, updateUserDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Deletar minha conta' })
  @ApiResponse({ status: 200, description: 'conta deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'perfil não encontrado' })
  async deleteProfile(@GetUser() user: any) {
    return this.profileService.remove(user.sub);
  }
}