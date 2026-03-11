**🎬 Movie Catalog – Grupo 29**

Sistema web para gerenciamento de catálogo pessoal de filmes.
O usuário pode buscar filmes, adicioná‑los ao catálogo, marcar como assistidos, favoritar e avaliar.*

**Deploy**
*Frontend*
https://movie-catalog-grupo29.vercel.app/

*Backend API*
https://movie-catalog-grupo29-production.up.railway.app/

*Documentação da API (Swagger)*
https://movie-catalog-grupo29-production.up.railway.app/api-docs/

**Tecnologias Utilizadas**
*Frontend*
- React
- Axios
- CSS

*Backend*
- Node.js
- Express
- Banco de Dados
- Firebase Firestore

*Integrações*
- TMDB API (The Movie Database)

*DevOps / Cloud*
- Deploy frontend: Vercel
- Deploy backend: Railway
- Banco de dados: Firebase
- CI/CD: GitHub Actions
- Containerização: Docker
- Documentação da API: Swagger / OpenAPI

**Arquitetura do Sistema**
*Usuário*
   ↓
*React (Vercel)*
   ↓
*API Node.js / Express (Railway)*
   ↓
*Firebase Firestore*
   ↓
*TMDB API*

**Funcionalidades**
*Autenticação de usuário*
*Buscar filmes via TMDB*
*Adicionar filmes ao catálogo*
*Marcar como assistido*
*Favoritar filmes*
*Avaliar filmes (1–5 estrelas)*
*Dashboard com estatísticas*
*API REST documentada com Swagger*

**Principais Endpoints da API**
*GET*    /movies/:userId
*POST*   /movies
*PUT*    /movies/:id
*DELETE* /movies/:id

**Equipe**
*Grupo 29 - N697*

**Projeto Acadêmico**
Projeto desenvolvido para disciplina de Desenvolvimento de Software em Nuvem, demonstrando:
*API REST*
*Deploy em nuvem*
*Containerização*
*CI/CD*
*Documentação de API*