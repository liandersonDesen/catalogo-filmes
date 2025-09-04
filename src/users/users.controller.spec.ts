import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TipoUsuario, Usuario } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

const mockUsuario: Usuario[] = [
    {   
        id: "ndnndnkjhgfx",
        nome:"JOSE",
        email:"jose@gmail.com",
        senha:"lkjcxcvbnm",
        role:TipoUsuario.COMUM
    },{   
        id: "çlkjhgfds",
        nome:"Admin",
        email:"admin@adm.io",
        senha:"qawsdfghbjnkm",
        role:TipoUsuario.ADMIN
    },
]

const mockUserService= {
        findAll: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
}

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers:[{provide:UsersService, useValue:mockUserService}]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('deve listar todos os filmes', async () => {
    
    mockUserService.findAll.mockResolvedValue(mockUsuario)
    
    const result = await controller.findAllUser();
    expect(result).toEqual(mockUsuario);
    
    expect(mockUserService.findAll).toHaveBeenCalledWith();
  });

  it('deve listar um filme pelo id', async () => {
    const id= "ndnndnd";
    
    mockUserService.findById.mockResolvedValue(mockUsuario[0])
    
    const result = await controller.findOneUser(id);
    expect(result).toEqual(mockUsuario[0]);
    
    expect(mockUserService.findById).toHaveBeenCalledWith(id);
  });

  it('deve lançar NotFoundException se o id do filmes não for encontrado', async () => {
    const id = 'abc';
    mockUserService.findById.mockRejectedValue(new NotFoundException(`Filme com ID ${id} não encontrado!`));

    await expect(controller.findOneUser(id)).rejects.toThrow(NotFoundException); 
  });
  
  it('deve atualizar um filme', async () => {
    const UserUpdateDto: UpdateUsuarioDto={ 
        nome:"lianderson"
    }

    const updatedusuario={...mockUsuario[0],...UserUpdateDto}
    mockUserService.update.mockResolvedValue(updatedusuario)

    const result = await controller.updateUser("ndnndnd", UserUpdateDto);
    expect(result).toEqual(updatedusuario);
    expect(mockUserService.update).toHaveBeenCalledWith("ndnndnd", UserUpdateDto);
  });
  it('deve lançar NotFoundException se o id do filmes não for encontrado', async () => {
    const id = 'abc'; 
    const UserUpdateDto: UpdateUsuarioDto={ 
        nome:"lianderson"
    }
    
    mockUserService.update.mockRejectedValue(new NotFoundException(`Filme com ID ${id} não encontrado!`));

    await expect(controller.updateUser(id, UserUpdateDto)).rejects.toThrow(NotFoundException);
  });

  it('deve deletar um filme', async () => {

    mockUserService.remove.mockResolvedValue(mockUsuario[0])

    const result = await controller.deleteUser("ndnndnd");
    expect(result).toEqual(mockUsuario[0]);
    
    expect(mockUserService.remove).toHaveBeenCalledWith("ndnndnd");
  });

  it('deve lançar NotFoundException se o id do filmes não for encontrado', async () => {
    const id = 'abc';
    mockUserService.remove.mockRejectedValue(new NotFoundException(`Filme com ID ${id} não encontrado!`));

    await expect(controller.deleteUser(id)).rejects.toThrow(NotFoundException); 
  });
});
