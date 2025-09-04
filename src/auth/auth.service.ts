import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from "bcrypt"
import { Usuario } from '@prisma/client';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {

    constructor(
        private jwt: JwtService,
        private prisma: PrismaService
    ) { }

    async registerUser(userData: RegisterUserDto) {
        const userExists = await this.prisma.usuario.findUnique({
            where: { email: userData.email }
        })

        if (userExists) throw new ConflictException("Email já está em uso!!")

        const hashedPassword = await bcrypt.hash(userData.senha, 10)

        const novoUsuario = await this.prisma.usuario.create({
            data: {
                nome: userData.nome,
                email: userData.email,
                senha: hashedPassword
            },
            select: {
                id: true,
                nome: true,
                email: true,
                role: true
            }
        })

        return novoUsuario

    }

    async validateUser(email: string, senha: string): Promise<Usuario> {
        const usuario = await this.prisma.usuario.findUnique({ where: { email } })
        if (!usuario) throw new UnauthorizedException("Credenciais inválidas!")

        const isMath = await bcrypt.compare(senha, usuario.senha)
        if (!isMath) throw new UnauthorizedException("Credenciais inválidas!")

        return usuario
    }

    async login(Credencials: LoginDto) {
        const user = await this.validateUser(Credencials.email, Credencials.senha)
        const payload:JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role
        }
        return {
            acess_token: this.jwt.sign(payload)
        }
    }

}
