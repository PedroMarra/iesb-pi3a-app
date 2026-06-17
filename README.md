# 🎓 HelpIesb — PI3A IESB

Este projeto é o **app HelpIesb** (fórum acadêmico)

---

## 📁 Estrutura

```
PI3A_IESB-nicolas/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma     ← User, Post, Comment (existentes) + Schedule, Grade (novos)
│   │   └── seed.js           ← popula o banco com os MESMOS dados mock originais
│   ├── src/routes/
│   │   ├── schedules.js      ← NOVO
│   │   └── grades.js         ← NOVO
│   ├── server.js             ← rotas do fórum preservadas, agora via Prisma
│   └── package.json
│
└── frontend/
    ├── App.js                ← Schedules/Grades adicionadas ao HomeStack
    ├── src/
    │   ├── constants/colors.js   ← inalterado
    │   ├── components/           ← inalterado (PostCard, EmptyState, LoadingOverlay)
    │   ├── screens/
    │   │   ├── Home.js            ← itens do grid agora navegam de verdade
    │   │   ├── Forum.js           ← inalterado
    │   │   ├── NewPost.js         ← inalterado
    │   │   ├── PostDetails.js     ← inalterado
    │   │   ├── Profile.js         ← inalterado
    │   │   ├── Schedules.js       ← NOVO
    │   │   └── Grades.js          ← NOVO
    │   └── services/api.js        ← métodos novos adicionados ao final, resto intacto
    └── package.json          ← inalterado
```

---

## ⚙️ 1. Configurar o MySQL

```sql
CREATE DATABASE helpiesb;
```

## 🔧 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edite `.env`:
```env
DATABASE_URL="mysql://root:sua_senha@localhost:3306/helpiesb"
PORT=3000
```

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed      # popula com os mesmos dados mock do fórum original
npm run dev           # ou npm start
```

✅ Teste: `http://localhost:3000/health`

## 📱 3. Frontend

```bash
cd frontend
npm install
```

No `src/services/api.js`, ajuste `BASE_URL` (já existia essa instrução no
projeto original — não foi alterado):
```js
export const BASE_URL = 'http://SEU_IP_LOCAL:3000';
```

```bash
npx expo start
```

Escaneie o QR Code no **Expo Go** (iPhone) ou rode `--android` para o emulador.

---

## 🧭 Como acessar as novas funcionalidades

Na aba **Início**, toque em **"Notas"** ou **"Horários"** no grid de Acesso
Rápido — exatamente os mesmos botões que já existiam, agora funcionais.

---

## 🧠 Lógica de Notas (IESB)

| Fórmula | Expressão |
|---|---|
| Média Final | `(P1 × 0.4) + (P2 × 0.6)` |
| Mínimo P2 para MM | `(5 − P1×0.4) ÷ 0.6` |

| Menção | Intervalo |
|---|---|
| SS | ≥ 9.0 |
| MS | ≥ 7.0 |
| MM | ≥ 5.0 (aprovado) |
| MI | ≥ 3.0 |
| II | ≥ 0.1 |
| SR | < 0.1 |

---

## 📋 Novos Endpoints

### `/schedules`
| Método | Rota | Body |
|---|---|---|
| GET | `/schedules?userId=u1` | — |
| POST | `/schedules` | `{ subject, startTime, endTime, room, shift }` |
| PUT | `/schedules/:id` | idem |
| DELETE | `/schedules/:id` | — |

`shift`: `MATUTINO` \| `VESPERTINO` \| `NOTURNO`

### `/grades`
| Método | Rota | Body |
|---|---|---|
| GET | `/grades?userId=u1` | — |
| POST | `/grades` | `{ subject, p1, p2 }` |
| PUT | `/grades/:id` | idem |
| DELETE | `/grades/:id` | — |

Resposta enriquecida automaticamente com `media`, `mencao`, `minP2`, `aprovado`.
