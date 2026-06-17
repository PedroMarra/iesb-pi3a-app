# 🎓 HelpIesb — Aplicativo Mobile (React Native + Expo)

Aplicativo de suporte e interação para alunos do IESB, com fórum de dúvidas integrado ao backend Node.js.

---

## 📱 Funcionalidades

- **Home**: Dashboard com acesso rápido a ferramentas e boas-vindas personalizadas
- **Fórum**: Feed de publicações com busca, filtro por categoria e pull-to-refresh
- **Detalhes do Post**: Curtir, comentar e excluir publicações em tempo real
- **Nova Publicação**: Formulário validado para criação de posts com categorias
- **Perfil**: Visualização e edição de dados do aluno, com histórico de posts

---

## 🛠️ Tecnologias

- **React Native 0.81** + **Expo ~54**
- **React Navigation 6** (Stack + Bottom Tabs)
- **Axios** — Requisições HTTP à API
- **StyleSheet + Flexbox** — Estilização nativa responsiva

---

## ⚙️ Como Rodar

### Pré-requisitos
- Node.js v18+
- Expo Go instalado no celular (ou emulador Android/iOS)
- **Backend rodando** (ver README do `helpiesb-backend`)

### 1. Configurar o IP da API

Edite o arquivo `src/services/api.js` e troque `SEU_IP_AQUI` pelo IP da sua máquina na rede local:

```js
// src/services/api.js
export const BASE_URL = 'http://192.168.1.XX:3000'; // ← seu IP aqui
```

> ⚠️ **Importante**: Use o IP da sua rede Wi-Fi, **não** `localhost`.  
> Windows: `ipconfig` → "Endereço IPv4"  
> Mac/Linux: `ifconfig` → `en0` ou `wlan0`

### 2. Instalar dependências e iniciar

```bash
# 1. Acesse a pasta do app
cd PI3A_IESB

# 2. Instale as dependências
npm install

# 3. Inicie o Expo
npx expo start
```

### 3. Abrir no celular

Escaneie o QR Code com o **Expo Go** (Android) ou a Câmera (iOS).

---

## 📁 Estrutura do Projeto

```
PI3A_IESB/
├── App.js                        # Raiz da navegação (React Navigation)
├── src/
│   ├── components/
│   │   ├── PostCard.js           # Card reutilizável de post
│   │   ├── LoadingOverlay.js     # Indicador de carregamento
│   │   └── EmptyState.js         # Estado vazio genérico
│   ├── constants/
│   │   └── colors.js             # Paleta de cores do IESB
│   ├── screens/
│   │   ├── Home.js               # Dashboard inicial
│   │   ├── Forum.js              # Feed do fórum com FlatList
│   │   ├── PostDetails.js        # Detalhes, curtidas e comentários
│   │   ├── NewPost.js            # Formulário de nova publicação
│   │   └── Profile.js            # Perfil e edição de dados
│   └── services/
│       └── api.js                # Configuração do Axios + chamadas à API
└── assets/                       # Ícones e splash screen
```

---

## ✅ Requisitos Técnicos Atendidos

| Requisito | Implementação |
|-----------|---------------|
| Componentes Core | View, Text, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator, Modal |
| Flexbox / StyleSheet | Todas as telas estilizadas via StyleSheet com Flexbox |
| useState | Gerenciamento de inputs, loading, modal, likes, etc. |
| React Navigation | Stack + Bottom Tabs com ≥ 3 telas |
| FlatList | Fórum e Categorias com `keyExtractor` e rolagem otimizada |
| Formulário com validação | NewPost valida campos obrigatórios e comprimento mínimo |
| API Node.js + Express | Backend próprio com 9 endpoints REST |
| GET (buscar dados) | Forum e Profile consomem API com Axios |
| POST/DELETE (enviar dados) | Criar post, curtir, comentar, deletar |
| ActivityIndicator + Alert | Feedback visual em toda requisição de rede |
| Componentização | PostCard, LoadingOverlay, EmptyState reutilizáveis |

---

## 👥 Equipe

- Pedro Luiz Braga — 2312130181
- Nícolas Lopes do Carmo — 2513130102
- Leonardo Meira Lustosa — 2312130219

> Projeto Final — Disciplina PI3A — IESB
