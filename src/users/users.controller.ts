import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Put, UseGuards, Request  } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard,AdminGuard)
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }
    @ApiBearerAuth()
    @Get()
    @ApiOperation({ summary: 'Listar todos os usuários' })
    @ApiResponse({ status: 200, description: 'Lista de usuários' })
    async findAllUser() {
        return this.userService.findAll()
    }
    @ApiBearerAuth()
    @Get(':id')
    @ApiOperation({ summary: 'Buscar um usuário por ID' })
    @ApiResponse({ status: 200, description: 'Usuário encontrado' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    async findOneUser(@Param('id') id: string) {
        return this.userService.findById(id)
    }
    @ApiBearerAuth()
    @Put(':id')
    @ApiOperation({ summary: 'Atualizar um usuário por ID' })
    @ApiBody({ type: UpdateUsuarioDto })
    @ApiResponse({ status: 200, description: 'Usuário atualizado' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    async updateUser( @Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
        return this.userService.update(id, dto);
    }
    @ApiBearerAuth()
    @Delete(':id')
    @ApiOperation({ summary: 'Remover um usuário por ID' })
    @ApiResponse({ status: 200, description: 'Usuário removido com sucesso' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
    async deleteUser(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}
