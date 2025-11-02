import { ApiProperty } from "@nestjs/swagger";
import { classificacao } from "@prisma/client";
import { IsBoolean, IsEnum, IsInt, IsNumber, IsString, Length, Max, Min } from "class-validator";

export class CreateFilmesDto{
    @ApiProperty({ example: 'Matrix', description: 'Título do filme' })
    @IsString()
    @Length(2, 100)
    titulo:string;

    @ApiProperty({ example: 1999, description: 'Ano de lançamento' })
    @IsInt()
    @Min(1900)
    @Max(new Date().getFullYear())
    ano:number

    @ApiProperty({ example: 136, description: 'Duração em minutos' })
    @IsInt()
    @Min(1)
    duracao:number

    @ApiProperty({ example: 'Ação', description: 'Gênero principal' })
    @IsString()
    genero:string

    @ApiProperty({ example: 29.99, description: 'Preço de venda' })
    @IsNumber()
    @Min(0.01) 
    preco: number;

    @ApiProperty({ example: true, description: 'Indica se o filme está em estoque' })
    @IsBoolean()
    emEstoque: boolean;

    @ApiProperty({ enum: classificacao, description: 'Classificação indicativa' })
    @IsEnum(classificacao)
    classificacao:classificacao
}