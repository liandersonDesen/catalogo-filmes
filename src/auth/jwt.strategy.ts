import { Injectable, NotFoundException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { PrismaService } from '../prisma/prisma.service';

const rawSecretKey = process.env.SECRET_KEY;
if (!rawSecretKey) {
    throw new Error('SECRET_KEY is not defined');
}
const secretKey: string = rawSecretKey;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private prisma: PrismaService,
    ) {

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secretKey,
        })
    }
    async validate(payload: JwtPayload) {

        const user = await this.prisma.usuario.findUnique({ where: { id: payload.sub } });
        if (!user) throw new NotFoundException('Usuário não encontrado');

        return {
            sub: payload.sub,
            email: payload.email,
            role: payload.role
        }
    }
}