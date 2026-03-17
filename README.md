# 🎬 Movie Catalog – Grupo 29

Sistema web para gerenciamento de catálogo pessoal de filmes.  
O usuário pode buscar filmes, adicioná‑los ao catálogo, marcar como assistidos, favoritar e avaliar filmes.

---

# 🚀 Deploy

### Frontend
https://movie-catalog-grupo29.vercel.app/

### Backend API
https://movie-catalog-grupo29-production.up.railway.app/

### Documentação da API (Swagger)
https://movie-catalog-grupo29-production.up.railway.app/api-docs/

---

# 🛠 Tecnologias Utilizadas

## Frontend
- React
- Axios
- CSS

## Backend
- Node.js
- Express

## Banco de Dados
- Firebase Firestore

## Integrações
- TMDB API (The Movie Database)

## DevOps / Cloud
- Deploy frontend: Vercel
- Deploy backend: Railway
- Banco de dados: Firebase
- CI/CD: GitHub Actions
- Containerização: Docker
- Documentação da API: Swagger / OpenAPI

---

# ☁️ Arquitetura do Sistema
Usuário
↓
Frontend (React - Vercel)
↓
Backend API (Node.js / Express - Railway)
↓
Firebase Firestore (Banco de dados)

API externa utilizada:
TMDB API


---

# 🎯 Funcionalidades

- Autenticação de usuário
- Buscar filmes via TMDB
- Adicionar filmes ao catálogo
- Marcar como assistido
- Favoritar filmes
- Avaliar filmes (1–5 estrelas)
- Dashboard com estatísticas
- API REST documentada com Swagger

---

# 🔗 Principais Endpoints da API

| Método | Endpoint | Descrição |
|------|------|------|
| GET | `/movies/:userId` | Lista filmes do usuário |
| POST | `/movies` | Adiciona novo filme |
| PUT | `/movies/:id` | Atualiza um filme |
| DELETE | `/movies/:id` | Remove um filme |

---

# 👥 Equipe

**Grupo 29 - N697**

- Alfredo Nunes De Souza Junior — 2322726  
- Ana Braveza Costa — 2526931  
- Andreza Lívia Martins Rocha — 2415652  
- Francisco Rodrigo Bernardo Rocha — 2415533  
- Luana Veras Alves — 2425145  
- Otávio Rodrigues Da Silva Júnior — 2415518  

---

# 📘 Projeto Acadêmico

Projeto desenvolvido para a disciplina **Desenvolvimento de Software em Nuvem**, demonstrando conceitos como:

- API REST
- Deploy em nuvem
- Containerização
- CI/CD
- Documentação de API

---

# 📑 Documentação da API

A documentação da API pode ser acessada via Swagger:

https://movie-catalog-grupo29-production.up.railway.app/api-docs/
