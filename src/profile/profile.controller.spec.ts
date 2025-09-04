import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UpdateUsuarioDto } from '../users/dto/update-usuario.dto';

const mockProfileService = {
  update: jest.fn(),
  remove: jest.fn(),
};

const mockUser = { sub: 'user-123' };


describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        { provide: ProfileService, useValue: mockProfileService },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);

    jest.clearAllMocks();
  });

  it('updateProfile', async () => {

    const dto: UpdateUsuarioDto = { nome: 'Novo Nome' };

    mockProfileService.update.mockResolvedValue({ id: 'user-123', ...dto });

    const result = await controller.updateProfile(mockUser, dto);

    expect(result).toEqual({ id: 'user-123', ...dto });
    expect(mockProfileService.update).toHaveBeenCalledWith('user-123', dto);
  });

  it('deleteProfile', async () => {
    mockProfileService.remove.mockResolvedValue({ message: 'Conta deletado com sucesso' });

    const result = await controller.deleteProfile(mockUser);

    expect(result).toEqual({ message: 'Conta deletado com sucesso' });
    expect(mockProfileService.remove).toHaveBeenCalledWith('user-123');
  });
});
