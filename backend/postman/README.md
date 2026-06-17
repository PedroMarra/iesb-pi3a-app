# 📬 Postman — HelpIesb API

Esta pasta contém a collection completa de todos os endpoints da API,
organizada por módulo, mais um environment pronto para uso local.

## Arquivos

- `HelpIesb.postman_collection.json` — todos os requests (Health, Usuários,
  Fórum/Posts, Fórum/Comentários, Horários, Notas)
- `HelpIesb.postman_environment.json` — variáveis (`base_url`, `user_id`, etc.)

## Como importar

1. Abra o Postman → **Import**
2. Arraste os dois arquivos `.json` desta pasta
3. No canto superior direito, selecione o environment **"HelpIesb - Local"**
4. Certifique-se de que o backend está rodando (`npm run dev` na pasta `backend`)

## Organização da Collection

| Pasta | Conteúdo |
|---|---|
| **Health** | Healthcheck da API |
| **Usuários** | GET usuário, GET posts do usuário, PUT atualizar perfil |
| **Fórum - Posts** | Listar (com filtros), detalhe, criar, curtir, excluir |
| **Fórum - Comentários** | Adicionar comentário a um post |
| **Horários** | CRUD completo de horários de aula |
| **Notas** | CRUD completo de notas, com cálculo de média/menção/previsão de P2 |

## Fluxo de teste sugerido

1. **Health** → confirma que a API está no ar
2. **Usuários → GET Usuário por ID** → vê o usuário `u1` (Pedro Braga)
3. **Fórum - Posts → POST Criar Post** → cria um post; o `id` é salvo
   automaticamente em `{{created_post_id}}`
4. **Fórum - Comentários → POST Adicionar Comentário** → comenta no post
   `{{post_id}}` (padrão: `p1`, já existente via seed)
5. **Horários → POST Criar Horário** → cria um horário; o `id` vai para
   `{{schedule_id}}`, usado automaticamente nos requests de PUT/DELETE abaixo
6. **Notas → POST Criar Nota (somente P1)** → veja no campo `minP2` da
   resposta a nota mínima necessária na P2
7. **Notas → PUT Atualizar Nota (lançar P2)** → veja `media`, `mencao` e
   `aprovado` calculados automaticamente

## Variáveis de ambiente

| Variável | Descrição | Valor padrão |
|---|---|---|
| `base_url` | URL da API | `http://localhost:3000` |
| `user_id` | Usuário logado nos testes | `u1` |
| `other_user_id` | Segundo usuário (para testar comentários de outra pessoa) | `u2` |
| `post_id` | Post existente via seed, usado nos testes de GET/comentário/like | `p1` |
| `created_post_id` | Preenchido automaticamente após criar um post | — |
| `created_comment_id` | Preenchido automaticamente após criar um comentário | — |
| `schedule_id` | Preenchido automaticamente após criar um horário | — |
| `grade_id` | Preenchido automaticamente após criar uma nota | — |

> 💡 Se for testar contra o celular/emulador (mesma API usada pelo app),
> troque `base_url` para o IP da sua máquina, ex: `http://192.168.1.10:3000`.
