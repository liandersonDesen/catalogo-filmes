import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginReponseDto } from './dto/login-response.dto'
import { ConflictException, UnauthorizedException } from '@nestjs/common';

const mockAuthService = {
  registerUser: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {provide: AuthService, useValue: mockAuthService},
      ], 
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('registerUser', async () => {
    const dto: RegisterUserDto = {
      nome: 'Teste',
      email: 'teste@email.com',
      senha: '123456',
    };

    mockAuthService.registerUser.mockResolvedValue({
      id: 'user123',
      nome: 'Teste',
      email: 'teste@email.com',
      role: 'COMUM',
    });

    const result = await controller.registerUser(dto);

    expect(service.registerUser).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      id: 'user123',
      nome: 'Teste',
      email: 'teste@email.com',
      role: 'COMUM',
    });
  });

  it('deve lançar ConflictException quando email já está em uso', async () => {
    const dto: RegisterUserDto = {
      nome: 'Teste',
      email: 'teste@email.com',
      senha: '123456',
    };

    mockAuthService.registerUser.mockRejectedValue(new ConflictException('Email já está em uso'));

    await expect(controller.registerUser(dto)).rejects.toThrow(new ConflictException('Email já está em uso'));
  });

  it('login', async () => {
    const dto: LoginDto = {
      email: 'teste@email.com',
      senha: '123456',
    };

    const mockResult: LoginReponseDto = {
      acess_token: 'mocked_token',
    };

    mockAuthService.login.mockResolvedValue(mockResult);

    const result = await controller.login(dto);

    expect(service.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResult);
  });

  it('deve lançar UnauthorizedException se as credenciais estiverem inválidas', async () => {
    const dto: LoginDto = {
      email: 'teste@email.com',
      senha: 'senha_errada',
    };

    mockAuthService.login.mockRejectedValue(new UnauthorizedException('Credenciais inválidas!'));

    await expect(controller.login(dto)).rejects.toThrow(new UnauthorizedException('Credenciais inválidas!'));
  });
});