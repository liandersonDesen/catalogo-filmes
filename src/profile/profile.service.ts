import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from "bcrypt"

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService
  ) { }

  async update(id: string, data: UpdateProfileDto) {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    let hashedpassword
    if(data.senha) hashedpassword = await bcrypt.hash(data.senha, 10)
    return this.prisma.usuario.update({ where: { id },data: {...data, senha:hashedpassword},select:{id:true,nome:true,email:true,role:true}});
  }

  async remove(id: string) {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    await this.prisma.usuario.delete({ where: { id } });
    return { message: 'Conta deletado com sucesso' };
  }
}