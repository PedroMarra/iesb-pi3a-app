# 🚀 HelpIesb — Backend (API Node.js)

API REST construída com **Node.js + Express** para o aplicativo HelpIesb.

---

## 📦 Tecnologias

- **Node.js** — Ambiente de execução
- **Express** — Framework HTTP
- **CORS** — Habilitação de requisições cross-origin
- **UUID** — Geração de IDs únicos
- **Armazenamento em memória** — Sem banco de dados (adequado para projeto acadêmico)

---

## ▶️ Como Rodar

### Pré-requisitos
- Node.js v18 ou superior instalado

### Passos

```bash
# 1. Acesse a pasta do backend
cd helpiesb-backend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
npm start
```

O servidor estará disponível em: **http://localhost:3000**

Para confirmar que está rodando, acesse: http://localhost:3000/health

---

## 🌐 Endpoints Disponíveis

### Healthcheck
| Método | Rota      | Descrição              |
|--------|-----------|------------------------|
| GET    | `/health` | Status da API          |

### Posts (Fórum)
| Método | Rota                   | Descrição                              |
|--------|------------------------|----------------------------------------|
| GET    | `/posts`               | Lista todos os posts (suporta `?search=` e `?category=`) |
| GET    | `/posts/:id`           | Retorna post + comentários             |
| POST   | `/posts`               | Cria um novo post                      |
| DELETE | `/posts/:id`           | Remove um post (somente o autor)       |
| POST   | `/posts/:id/like`      | Curtir / descurtir um post             |
| POST   | `/posts/:id/comments`  | Adiciona comentário ao post            |

### Usuários
| Método | Rota               | Descrição                        |
|--------|--------------------|----------------------------------|
| GET    | `/users/:id`       | Retorna dados de um usuário      |
| GET    | `/users/:id/posts` | Posts publicados por um usuário  |
| PUT    | `/users/:id`       | Atualiza nome e curso do usuário |

---

## 📋 Exemplos de Requisições

### Criar post
```json
POST /posts
{
  "userId": "u1",
  "title": "Minha dúvida sobre PI3A",
  "content": "Alguém sabe como conectar o Expo ao Node?",
  "category": "Dúvidas"
}
```

### Adicionar comentário
```json
POST /posts/:id/comments
{
  "userId": "u1",
  "text": "Verificou o IP da máquina?"
}
```

### Curtir post
```json
POST /posts/:id/like
{
  "userId": "u1"
}
```

---

## 👥 Equipe

- Pedro Luiz Braga — 2312130181
- Nícolas Lopes do Carmo — 2513130102
- Leonardo Meira Lustosa — 2312130219

> Projeto Final — Disciplina PI3A — IESB
