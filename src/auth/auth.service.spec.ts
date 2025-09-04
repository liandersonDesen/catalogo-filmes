import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { TipoUsuario, Usuario } from '@prisma/client';
import { RegisterUserDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from "bcrypt"

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const mockUser:Usuario={
      id: '1',
      nome: 'Jose',
      email: 'jose@gmail.com',
      senha:"qasxcvnmkiu765redcvb",
      role: TipoUsuario.COMUM,
    }
const mockPrisma = {
  usuario: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwt = {
  sign: jest.fn(),
};


describe('AuthService', () => {
  let service: AuthService;
  let jwt:JwtService;
  let prisma:PrismaService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt }]
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);

    jest.clearAllMocks()
  });

  it('registerUser', async () => {
    const Registerdto:RegisterUserDto={
      nome: 'Teste',
      email: 'teste@email.com',
      senha: '123456'
    }

    mockPrisma.usuario.findUnique.mockResolvedValue(null);
    mockPrisma.usuario.create.mockResolvedValue(mockUser);

    const result = await service.registerUser(Registerdto);

    expect(mockPrisma.usuario.findUnique).toHaveBeenCalledWith({
      where: { email: Registerdto.email },
    });

    expect(mockPrisma.usuario.create).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('deve lançar erro se email já estiver em uso', async () => {
    const Registerdto:RegisterUserDto={
      nome: 'Teste',
      email: 'teste@email.com',
      senha: '123456'
    }
    mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);

    await expect(service.registerUser(Registerdto)).rejects.toThrow(new ConflictException("Email já está em uso!!"));
  });

  it('validateUser', async () => {

      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);
       
      (bcrypt.compare as jest.Mock).mockResolvedValue(true)
      const result = await service.validateUser('teste@email.com', '123456');

      expect(result).toEqual(mockUser);
    });

    it('deve lançar erro se usuário não existir', async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(null);

      await expect(service.validateUser('inexistente@email.com', '123456')).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar erro se senha for inválida', async () => {
      
      mockPrisma.usuario.findUnique.mockResolvedValue(mockUser);
      
      (bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(service.validateUser('jose@gmail.com', 'errada')).rejects.toThrow(UnauthorizedException);
    });
    
it('login deve retornar access_token válido', async () => {

    jest.spyOn(service, 'validateUser').mockResolvedValueOnce({
      id: '1',
      email: mockUser.email,
      role: TipoUsuario.COMUM,
    } as any);

    mockJwt.sign.mockReturnValue('mockedToken')
    const result = await service.login({
      email: mockUser.email,
      senha: '123456'
    });

    expect(service.validateUser).toHaveBeenCalled();
    expect(mockJwt.sign).toHaveBeenCalledWith({
      sub: '1',
      email: mockUser.email,
      role: TipoUsuario.COMUM,
    });
    expect(result).toEqual({ acess_token: 'mockedToken' });
  });
});
