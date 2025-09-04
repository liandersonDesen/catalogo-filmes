import { ApiProperty } from "@nestjs/swagger";
import { classificacao } from "@prisma/client";
import { IsEnum, IsInt, IsString, Length, Max, Min, MinLength } from "class-validator";

export class CreateUsuarioDto{
    @ApiProperty({ example: 'josé', description: 'Nome do usuario' })
    @IsString()
    @MinLength(3)
    nome:string;

    @ApiProperty({ example:"jose@gmail.com", description: 'Email do usuario' })
    @MinLength(1)
    @IsString()
    email:string

    @ApiProperty({ example: "jose1234", description: 'Senha do usuario' })
    @IsString()
    @MinLength(1)
    senha:string
}