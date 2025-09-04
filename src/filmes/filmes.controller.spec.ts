import { Test, TestingModule } from "@nestjs/testing";
import { FilmesController } from "./filmes.controller"
import { FilmesService } from "./filmes.service"
import { CreateFilmesDto } from "./dto/create-filmes.dto";
import { UpdateFilmesDto } from "./dto/update-filmes.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { classificacao, Filmes } from '@prisma/client';

const mockFilmes: Filmes[] = [
    {
        id: "ndnndnd",
        titulo: "a volta dos que não foram",
        ano: 2050,
        duracao: 12,
        genero: "comedia",
        classificacao: classificacao.LIVRE
    },
    {
        id: "ndnndnkjhgfx",
        titulo: "A casa bem assombrada",
        ano: 1500,
        duracao: 120,
        genero: "comedia",
        classificacao: classificacao.MAIS10
    }
]

const mockFilmesService= {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
}

describe("Filmes Controller Tests", ()=>{
    let controller :FilmesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers:[FilmesController],
            providers:[{provide:FilmesService, useValue:mockFilmesService}]
        }).compile();

        controller = module.get<FilmesController>(FilmesController)
         jest.clearAllMocks();  
    })

  it('deve listar todos os filmes', async () => {
    
    mockFilmesService.findAll.mockResolvedValue(mockFilmes)
    
    const result = await controller.findAllFilm();
    expect(result).toEqual(mockFilmes);
    
    expect(mockFilmesService.findAll).toHaveBeenCalledWith();
  });

  it('deve listar um filme pelo id', async () => {
    const id= "ndnndnd";
    
    mockFilmesService.findById.mockResolvedValue(mockFilmes[0])
    
    const result = await controller.findOneFilm(id);
    expect(result).toEqual(mockFilmes[0]);
    
    expect(mockFilmesService.findById).toHaveBeenCalledWith(id);
  });

  it('deve lançar NotFoundException se o id do filmes não for encontrado', async () => {
    const id = 'abc';
    mockFilmesService.findById.mockRejectedValue(new NotFoundException(`Filme com ID ${id} não encontrado!`));

    await expect(controller.findOneFilm(id)).rejects.toThrow(NotFoundException); 
  });
  it('deve criar um filme', async () => {
    const filmDto: CreateFilmesDto = { 
        titulo: "a volta dos que não foram",
        ano: 2050,
        duracao: 12,
        genero: "comedia",
        classificacao: classificacao.LIVRE
    };
     
    mockFilmesService.create.mockResolvedValue(mockFilmes[0])

    const result = await controller.CreateFilm(filmDto);
    expect(result).toEqual(mockFilmes[0]);
    
    expect(mockFilmesService.create).toHaveBeenCalledWith(filmDto);
  });
  it('deve lançar BadRequestException ao tentar criar filme inválido', async () => {
    const filmDto: CreateFilmesDto = {
        titulo: "",
        ano: 0,
        duracao: -10,
        genero: "",
        classificacao: classificacao.LIVRE
    };
    mockFilmesService.create.mockRejectedValue(new BadRequestException('Dados inválidos'));

    await expect(controller.CreateFilm(filmDto)).rejects.toThrow(BadRequestException);
  });
  it('deve atualizar um filme', async () => {
    const filmDto: UpdateFilmesDto={ 
        ano: 2100
    }

    const updatedfilmes={...mockFilmes[0],...filmDto}
    mockFilmesService.update.mockResolvedValue(updatedfilmes)

    const result = await controller.updateFilm("ndnndnd", filmDto);
    expect(result).toEqual(updatedfilmes);
    expect(mockFilmesService.update).toHaveBeenCalledWith("ndnndnd", filmDto);
  });
  it('deve lançar NotFoundException se o id do filmes não for encontrado', async () => {
    const id = 'abc';
    const filmDto: UpdateFilmesDto = { ano: 2100 };
    
    mockFilmesService.update.mockRejectedValue(new NotFoundException(`Filme com ID ${id} não encontrado!`));

    await expect(controller.updateFilm(id, filmDto)).rejects.toThrow(NotFoundException);
  });

  it('deve deletar um filme', async () => {

    mockFilmesService.remove.mockResolvedValue(mockFilmes[0])

    const result = await controller.deleteFilm("ndnndnd");
    expect(result).toEqual(mockFilmes[0]);
    
    expect(mockFilmesService.remove).toHaveBeenCalledWith("ndnndnd");
  });

  it('deve lançar NotFoundException se o id do filmes não for encontrado', async () => {
    const id = 'abc';
    mockFilmesService.remove.mockRejectedValue(new NotFoundException(`Filme com ID ${id} não encontrado!`));

    await expect(controller.deleteFilm(id)).rejects.toThrow(NotFoundException); 
  });
})
