import { Test, TestingModule } from "@nestjs/testing";
import { FilmesService } from "./filmes.service";
import { PrismaService } from "../prisma/prisma.service";
import { classificacao, Filmes } from '@prisma/client';
import { CreateFilmesDto } from "./dto/create-filmes.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UpdateFilmesDto } from "./dto/update-filmes.dto";
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

const mockPrisma = {
    filmes: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }
}

describe("FilmesService", () => {
    let service: FilmesService;
    let prisma : PrismaService
    // Antes de cada teste, criamos uma instância do FilmesService com o PrismaService mockado
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FilmesService,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        service = module.get<FilmesService>(FilmesService);
        prisma = module.get<PrismaService>(PrismaService);
    });
    it("deve criar um novo filme", async () => {
        const dto:CreateFilmesDto = { 
        titulo: "a volta dos que não foram",
        ano: 2050,
        duracao: 12,
        genero: "comedia",
        classificacao: classificacao.LIVRE
     };
        mockPrisma.filmes.create.mockResolvedValue(mockFilmes[0])

        const result = await service.create(dto as any);
        expect(result).toEqual(mockFilmes[0]);
        expect(mockPrisma.filmes.create).toHaveBeenCalledWith({ data: dto });
    });
    it("deve listar todos os filmes", async () => {
        mockPrisma.filmes.findMany.mockResolvedValue(mockFilmes)
        const result = await service.findAll();
        expect(result).toEqual(mockFilmes);
        expect(mockPrisma.filmes.findMany).toHaveBeenCalledWith();
    });
    it("deve listar um filmes por id", async () => {
        const id= "ndnndnd"   
        mockPrisma.filmes.findUnique.mockResolvedValue(mockFilmes[0])
        const result = await service.findById(id);
        expect(result).toEqual(mockFilmes[0]);
        expect(mockPrisma.filmes.findUnique).toHaveBeenCalledWith({where: {id}});
    });
    
    it('deve lançar NotFoundException se o id do filmes não for encontrado', async () => {
        const id="abc"
        mockPrisma.filmes.findUnique.mockResolvedValue(null);
        await expect(service.findById(id)).rejects.toThrow(NotFoundException);
    });
    it("deve atualizar um filme por id", async () => {
        const dto:UpdateFilmesDto = {
        ano: 2052
        };
        const id= "ndnndnd"
        
        mockPrisma.filmes.findUnique.mockResolvedValue(mockFilmes[0]);
        
        const updatedfilmes={...mockFilmes[0],...dto}
        mockPrisma.filmes.update.mockResolvedValue(updatedfilmes)

        const result = await service.update(id,dto as any);
        expect(result).toEqual(updatedfilmes);
        expect(mockPrisma.filmes.update).toHaveBeenCalledWith({ where: { id }, data:dto });
    });
    it('deve lançar NotFoundException se o id do filmes não for encontrado', async () => {
        const id="abc"
        mockPrisma.filmes.findUnique.mockResolvedValue(null);
        await expect(service.update(id,{})).rejects.toThrow(NotFoundException);
    });
      it("deve deletar um filme por id", async () => {
        const id= "ndnndnd"      
        
        mockPrisma.filmes.findUnique.mockResolvedValue(mockFilmes[0]);
        mockPrisma.filmes.delete.mockResolvedValue(mockFilmes[0])
        
        const result = await service.remove(id);
        expect(result).toEqual(mockFilmes[0]);
        expect(mockPrisma.filmes.delete).toHaveBeenCalledWith({where: {id}});
    });
    
    it('deve lançar NotFoundException se o id do filmes não for encontrado', async () => {
        const id="abc"
        mockPrisma.filmes.findUnique.mockResolvedValue(null);
        await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  

})
