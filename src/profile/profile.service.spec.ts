import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { TipoUsuario, Usuario } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { NotFoundException } from '@nestjs/common';

const mockUsuario: Usuario = {
  id: "ndnndnkjhgfx",
  nome: "JOSE",
  email: "jose@gmail.com",
  senha: "lkjcxcvbnm",
  role: TipoUsuario.MEMBRO
}

const mockPrisma = {
  usuario: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn()
  }
}
describe('ProfileService', () => {
  let service: ProfileService;
  let prisma: PrismaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();


    service = module.get<ProfileService>(ProfileService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();

  });
  it("deve atualizar um usuário por id", async () => {
    const dto: UpdateProfileDto = {
      nome: "jose"
    };
    const id = "ndnndnd"

    mockPrisma.usuario.findUnique.mockResolvedValue(mockUsuario);

    const updatedusuario = { ...mockUsuario, ...dto }
    mockPrisma.usuario.update.mockResolvedValue(updatedusuario)

    const result = await service.update(id, dto as any);
    expect(result).toEqual(updatedusuario);
    expect(prisma.usuario.update).toHaveBeenCalledWith({ where: { id }, data: dto,select:{id:true,nome:true,email:true,role:true} });
  });
  it('deve lançar NotFoundException se o id do usuários não for encontrado', async () => {
    const id = "abc"
    mockPrisma.usuario.findUnique.mockResolvedValue(null);
    await expect(service.update(id, {})).rejects.toThrow(NotFoundException);
  });
  it("deve deletar um usuário por id", async () => {
    const id = "ndnndnd"

    mockPrisma.usuario.findUnique.mockResolvedValue(mockUsuario);
    mockPrisma.usuario.delete.mockResolvedValue({ message: 'Conta deletado com sucesso' })

    const result = await service.remove(id);
    expect(result).toEqual({ message: 'Conta deletado com sucesso' });
    expect(prisma.usuario.delete).toHaveBeenCalledWith({ where: { id } });
  });

  it('deve lançar NotFoundException se o id do usuários não for encontrado', async () => {
    const id = "abc"
    mockPrisma.usuario.findUnique.mockResolvedValue(null);
    await expect(service.remove(id)).rejects.toThrow(NotFoundException);
  });
});
