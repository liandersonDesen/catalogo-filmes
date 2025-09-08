# 🎬 Catálogo de Filmes com NestJS

## 📖 Descrição do Projeto
Este é um projeto **back-end** para um catálogo de filmes, desenvolvido com **NestJS**, **Prisma** e **PostgreSQL**.  
A API RESTful permite gerenciar filmes e usuários com as seguintes funcionalidades:

- ✅ Cadastro e login de usuários com segurança  
- 🎥 Gerenciamento de filmes (**CRUD completo**)  
- 🔑 Autenticação com **JWT (JSON Web Tokens)** para proteger as rotas  
- 🔒 Criptografia de senhas usando **Bcrypt**  
- 🧪 Testes unitários e de integração (**Jest**)  
- 🐳 Contêinerização completa da aplicação e do banco de dados com **Docker Compose**

---

## 🚀 Tecnologias Utilizadas
- [NestJS](https://nestjs.com/) — Framework Node.js para aplicações escaláveis  
- [Prisma](https://www.prisma.io/) — ORM moderno e intuitivo  
- [PostgreSQL](https://www.postgresql.org/) — Banco de dados relacional  
- [Docker Compose](https://docs.docker.com/compose/) — Gerenciamento de múltiplos contêineres  
- [Bcrypt](https://www.npmjs.com/package/bcrypt) — Hash de senhas  
- [JWT](https://jwt.io/) — Autenticação segura  
- [Jest](https://jestjs.io/) — Testes automatizados  

---

## ⚙️ Configuração do Ambiente e Execução

### 🔹Clone o repositório:

```bash
git clone https://github.com/liandersonDesen/catalogo-filmes.git
cd catalogo-filmes
```
### 🔹 Pré-requisitos
- Docker  
- Docker Compose  

### 🔹 Variáveis de Ambiente (.env)
 
#### Antes de rodar o projeto

- Crie um arquivo chamado **`.env`** na raiz do projeto, copiando o conteúdo do arquivo **`.env.example`**.

- Preencha o novo arquivo **`.env`** com os valores corretos para o seu ambiente.


### 🔹 Executando com Docker Compose

Suba os contêineres da aplicação e do banco de dados:

```bash
docker-compose up --build
```

> O comando `--build` garante que as imagens sejam recriadas a partir dos Dockerfiles.  
> Após inicialização, a aplicação estará disponível em:  
👉 **http://localhost:3000**

---

## 🗄️ Estrutura do Banco de Dados
O **Prisma** gerencia o schema e aplica migrações automaticamente ao iniciar o contêiner.

### 🔹 Modelos do Prisma
Arquivo: `prisma/schema.prisma`  

- **Filmes**: título, ano, gênero, duração  
- **Usuario**: nome, e-mail, senha, role (`ADMIN` ou `MEMBRO`)  

---

## 📌 Rotas da API
A documentação da API está disponível em:  
👉 **http://localhost:3000/api** (via Swagger)

### 🔹 Autenticação (`/auth`)
- `POST /auth/register` → Registra um novo usuário  
- `POST /auth/login` → Login e retorno de token JWT  

### 🔹 Perfil (`/profile`)  
> Requer **JWT no cabeçalho**: `Authorization: Bearer <token>`  

- `PUT /profile` → Atualiza o perfil do usuário logado  
- `DELETE /profile` → Remove a conta do usuário logado  

### 🔹 Filmes (`/filmes`)  
> Operações de escrita requerem **ADMIN**  

- `GET /filmes` → Lista todos os filmes  
- `GET /filmes/:id` → Busca um filme pelo ID  
- `POST /filmes` → Cria um novo filme  
- `PUT /filmes/:id` → Atualiza um filme  
- `DELETE /filmes/:id` → Remove um filme  

### 🔹 Usuários (`/users`)  
> Requer **JWT + ADMIN**  

- `GET /users` → Lista todos os usuários  
- `GET /users/:id` → Busca usuário por ID  
- `PUT /users/:id` → Atualiza informações do usuário  
- `DELETE /users/:id` → Remove um usuário  

---

## 📌 Exemplos de Requests

### 🔹 Registro de Usuário
**Request**  
```json
POST /auth/register
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Response**  
```json
{
  "id": "uuid",
  "nome": "João Silva",
  "email": "joao@email.com",
  "role": "MEMBRO"
}
```

---

### 🔹 Login de Usuário
**Request**  
```json
POST /auth/login
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Response**  
```json
{
  "access_token": "jwt_token_aqui"
}
```

---

### 🔹 Criação de Filme (ADMIN)
**Request**  
```json
POST /filmes
Authorization: Bearer <token>

{
  "titulo": "Inception",
  "ano": 2010,
  "duracao": 148
}
```

**Response**  
```json
{
  "id": "uuid",
  "titulo": "Inception",
  "ano": 2010,
  "duracao": 148
}
```

---

## 🧪 Testes

Acesse o contêiner da aplicação:

```bash
docker-compose exec api sh
```

Execute os testes unitários:

```bash
npm run test
```

---

## 👨‍💻 Autor
**José Lianderson Ribeiro** — [LiandersonDesen](https://github.com/LiandersonDesen)

---

## 📜 Licença
Este projeto está sob a licença **MIT**.
