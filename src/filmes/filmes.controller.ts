import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateFilmesDto } from './dto/create-filmes.dto';
import { FilmesService } from './filmes.service';
import { UpdateFilmesDto } from './dto/update-filmes.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'; 
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { MembroGuard } from '../auth/membro.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('filmes')
export class FilmesController {
    constructor(private filmService:FilmesService){}
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Post()
    @ApiOperation({ summary: 'Criar um novo filme' })
    @ApiBody({ type: CreateFilmesDto })
    @ApiResponse({ status: 201, description: 'Filme criado com sucesso'})
    async CreateFilm(@Body() data:CreateFilmesDto){
        return this.filmService.create(data)
    } 
    @ApiBearerAuth()
    @Get()
    @ApiOperation({ summary: 'Listar todos os filmes' })
    @ApiResponse({ status: 200, description: 'Lista de filmes' })
    async findAllFilm(){
        return this.filmService.findAll()
    }
    @ApiBearerAuth()
    @Get(':id')
    @ApiOperation({ summary: 'Buscar um filme por ID' })
    @ApiResponse({ status: 200, description: 'Filme encontrado'})
    @ApiResponse({ status: 404, description: 'Filme não encontrado' })
    async findOneFilm(@Param('id') id: string) {
        return this.filmService.findById(id)
    }
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Atualizar um filme por ID' })
    @ApiBody({ type: UpdateFilmesDto })
    @ApiResponse({ status: 200, description: 'Filme atualizado'})
    @ApiResponse({ status: 404, description: 'Filme não encontrado' })
    async updateFilm(@Param('id') id: string, @Body() dto: UpdateFilmesDto) {
        return this.filmService.update(id, dto);
    }
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Remover um filme por ID' })
    @ApiResponse({ status: 200, description: 'Filme removido com sucesso' })
    @ApiResponse({ status: 404, description: 'Filme não encontrado' })
    async deleteFilm(@Param('id') id: string) {
        return this.filmService.remove(id);
    }
}
