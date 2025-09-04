import { Injectable, NotFoundException } from '@nestjs/common';
import { Usuario } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from "bcrypt"


@Injectable()
export class UsersService {
        constructor(private prisma:PrismaService){}

        async onModuleInit() {
        // Este método será chamado assim que o módulo for inicializado
        console.log('Chamando o Seed');
        await this.Seed();
    }
    async Seed(){
        const admin = process.env.ADMIN_INITIAL_EMAIL;
        const password = process.env.ADMIN_INITIAL_PASSWORD;
        if(admin && password){
            const hashedpassword =await bcrypt.hash(password, 10)
            const criado = await this.prisma.usuario.upsert({
                where: { email: admin },
                update: {},
                create: {
                    nome:"ADMIN",
                    email: admin,
                    senha: hashedpassword,
                    role: 'ADMIN',
                },
            })
            if(criado){
                console.log("admin cadastrado")
            }
        }
    }
        
        async findAll(): Promise<Usuario[]> {
            return this.prisma.usuario.findMany()
        }
        async findById(id: string): Promise<Usuario | null> {
            const foundID = await this.prisma.usuario.findUnique({ where: { id } })
    
            if (!foundID) {
                throw new NotFoundException(`Usuário com ID ${id} não encontrado!`)
            }
            return foundID
        }
        async update(id: string, data): Promise<Usuario | null> {
            const foundID = await this.prisma.usuario.findUnique({ where: { id } })
    
            if (!foundID) {
                throw new NotFoundException(`Usuário com ID ${id} não encontrado!`)
            }
            return await this.prisma.usuario.update({ where: { id }, data })
        }
    
        async remove(id: string): Promise<Usuario | null> {
            const foundID = await this.prisma.usuario.findUnique({ where: { id } })
    
            if (!foundID) {
                throw new NotFoundException(`Usuário com ID ${id} não encontrado!`)
            }
            return await this.prisma.usuario.delete({ where: { id } })
    
        }
    
}
