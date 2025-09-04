import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TipoUsuario, Usuario } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from "bcrypt"

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));


const mockUsuario: Usuario[] = [
    {   
        id: "ndnndnkjhgfx",
        nome:"JOSE",
        email:"jose@gmail.com",
        senha:"lkjcxcvbnm",
        role:TipoUsuario.MEMBRO
    },{   
        id: "çlkjhgfds",
        nome:"Admin",
        email:"admin@adm.io",
        senha:"qawsdfghbjnkm",
        role:TipoUsuario.ADMIN
    },
]

const mockPrisma = {
    usuario: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        upsert: jest.fn()
    }
}

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  const OLD_ENV = process.env;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    
    
    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    
    jest.clearAllMocks();
    
    jest.resetModules();
    process.env = { ...OLD_ENV };

  });

  afterAll(() => {
      process.env = OLD_ENV;
    });

    it("deve listar todos os usuários", async () => {
        mockPrisma.usuario.findMany.mockResolvedValue(mockUsuario)
        const result = await service.findAll();
        expect(result).toEqual(mockUsuario);
        expect(mockPrisma.usuario.findMany).toHaveBeenCalledWith();
    });
    it("deve listar um usuários por id", async () => {
        const id= "ndnndnd"   
        mockPrisma.usuario.findUnique.mockResolvedValue(mockUsuario[0])
        const result = await service.findById(id);
        expect(result).toEqual(mockUsuario[0]);
        expect(mockPrisma.usuario.findUnique).toHaveBeenCalledWith({where: {id}});
    });
    
    it('deve lançar NotFoundException se o id do usuários não for encontrado', async () => {
        const id="abc"
        mockPrisma.usuario.findUnique.mockResolvedValue(null);
        await expect(service.findById(id)).rejects.toThrow(NotFoundException);
    });
    it("deve atualizar um usuário por id", async () => {
        const dto:UpdateUsuarioDto = {
        nome:"jose"
        };
        const id= "ndnndnd"
        
        mockPrisma.usuario.findUnique.mockResolvedValue(mockUsuario[0]);
        
        const updatedusuario={...mockUsuario[0],...dto}
        mockPrisma.usuario.update.mockResolvedValue(updatedusuario)

        const result = await service.update(id,dto as any);
        expect(result).toEqual(updatedusuario);
        expect(mockPrisma.usuario.update).toHaveBeenCalledWith({ where: { id }, data:dto });
    });
    it('deve lançar NotFoundException se o id do usuários não for encontrado', async () => {
        const id="abc"
        mockPrisma.usuario.findUnique.mockResolvedValue(null);
        await expect(service.update(id,{})).rejects.toThrow(NotFoundException);
    });
      it("deve deletar um usuário por id", async () => {
        const id= "ndnndnd"      
        
        mockPrisma.usuario.findUnique.mockResolvedValue(mockUsuario[0]);
        mockPrisma.usuario.delete.mockResolvedValue(mockUsuario[0])
        
        const result = await service.remove(id);
        expect(result).toEqual(mockUsuario[0]);
        expect(mockPrisma.usuario.delete).toHaveBeenCalledWith({where: {id}});
    });
    
    it('deve lançar NotFoundException se o id do usuários não for encontrado', async () => {
        const id="abc"
        mockPrisma.usuario.findUnique.mockResolvedValue(null);
        await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  
  it('deve chamar o Seed ao inicializar o módulo', async () => {
     const seedSpy = jest.spyOn(service, 'Seed').mockResolvedValue(undefined);

    await service.onModuleInit();

    expect(seedSpy).toHaveBeenCalled();
  });
it('deve criar admin se variáveis de ambiente existirem', async () => {
      process.env.ADMIN_INITIAL_EMAIL = 'admin@email.com';
      process.env.ADMIN_INITIAL_PASSWORD = 'senha123';

      const hashed = 'hashed_pass';
      (bcrypt.hash as jest.Mock).mockResolvedValue(true)

      mockPrisma.usuario.upsert.mockResolvedValue({
        ...mockUsuario[1],
        email: process.env.ADMIN_INITIAL_EMAIL,
        senha: hashed,
      });

      await service['Seed']();

      expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
      expect(mockPrisma.usuario.upsert).toHaveBeenCalled();
    });
});
