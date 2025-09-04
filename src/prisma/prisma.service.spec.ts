import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(() => {
    service = new PrismaService();

    // mockando os métodos do PrismaClient
    service.$connect = jest.fn();
    service.$disconnect = jest.fn();
  });

  it('deve chamar $connect no onModuleInit', async () => {
    await service.onModuleInit();
    expect(service.$connect).toHaveBeenCalled();
  });

  it('deve chamar $disconnect no onModuleDestroy', async () => {
    await service.onModuleDestroy();
    expect(service.$disconnect).toHaveBeenCalled();
  });
});