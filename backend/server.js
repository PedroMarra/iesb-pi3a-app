// server.js - API Principal do HelpIesb
// Migrado de armazenamento em memória para MySQL via Prisma ORM.
// Todas as rotas e contratos do Fórum original foram preservados.
// Adição: rotas de Horários (/schedules) e Notas (/grades) — Gestor Académico.

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client');

const schedulesRouter = require('./src/routes/schedules');
const gradesRouter = require('./src/routes/grades');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

// O campo likedBy é guardado como CSV de userIds (mantém o protótipo simples,
// igual ao array em memória original, mas compatível com o MySQL via Prisma).
function parseLikedBy(csv) {
  return csv ? csv.split(',').filter(Boolean) : [];
}
function stringifyLikedBy(arr) {
  return arr.join(',');
}

// Formata um post do Prisma para o mesmo formato que o frontend já espera
function formatPost(post, commentCount) {
  return {
    id: post.id,
    userId: post.userId,
    userName: post.user.name,
    userAvatar: post.user.avatar,
    title: post.title,
    content: post.content,
    category: post.category,
    likes: post.likes,
    likedBy: parseLikedBy(post.likedBy),
    commentCount: commentCount ?? post._count?.comments ?? 0,
    createdAt: post.createdAt.toISOString(),
  };
}

function formatComment(comment) {
  return {
    id: comment.id,
    postId: comment.postId,
    userId: comment.userId,
    userName: comment.user.name,
    userAvatar: comment.user.avatar,
    text: comment.text,
    createdAt: comment.createdAt.toISOString(),
  };
}

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    matricula: user.matricula,
    curso: user.curso,
    avatar: user.avatar,
    createdAt: user.createdAt.toISOString(),
  };
}

// ─────────────────────────────────────────────
// ROTAS - USUÁRIOS
// ─────────────────────────────────────────────

// GET /users/:id — Retorna dados de um usuário
app.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(formatUser(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});

// GET /users/:id/posts — Posts de um usuário específico
app.get('/users/:id/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { userId: req.params.id },
      include: { user: true, _count: { select: { comments: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts.map(p => formatPost(p)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar posts do usuário.' });
  }
});

// PUT /users/:id — Atualiza dados do perfil
app.put('/users/:id', async (req, res) => {
  const { name, curso } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Nome é obrigatório' });

  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name: name.trim(), ...(curso !== undefined ? { curso } : {}) },
    });
    res.json(formatUser(user));
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
});

// ─────────────────────────────────────────────
// ROTAS - POSTS (FÓRUM)
// ─────────────────────────────────────────────

// GET /posts — Lista todos os posts (com busca opcional)
app.get('/posts', async (req, res) => {
  const { search, category } = req.query;

  try {
    const where = {};

    if (category && category !== 'Todos') {
      where.category = category;
    }

    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { title: { contains: term } },
        { content: { contains: term } },
        { user: { name: { contains: term } } },
      ];
    }

    const posts = await prisma.post.findMany({
      where,
      include: { user: true, _count: { select: { comments: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(posts.map(p => formatPost(p)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar posts.' });
  }
});

// GET /posts/:id — Retorna um post específico com seus comentários
app.get('/posts/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        comments: {
          include: { user: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });

    res.json({
      ...formatPost(post, post.comments.length),
      comments: post.comments.map(formatComment),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar post.' });
  }
});

// POST /posts — Cria um novo post
app.post('/posts', async (req, res) => {
  const { userId, title, content, category } = req.body;

  if (!title || !title.trim()) return res.status(400).json({ error: 'Título é obrigatório' });
  if (!content || !content.trim()) return res.status(400).json({ error: 'Conteúdo é obrigatório' });
  if (!userId) return res.status(400).json({ error: 'Usuário é obrigatório' });

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const post = await prisma.post.create({
      data: {
        id: uuidv4(),
        userId,
        title: title.trim(),
        content: content.trim(),
        category: category || 'Geral',
        likes: 0,
        likedBy: '',
      },
      include: { user: true },
    });

    res.status(201).json(formatPost(post, 0));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar post.' });
  }
});

// DELETE /posts/:id — Remove um post (somente o autor pode)
app.delete('/posts/:id', async (req, res) => {
  const { userId } = req.body;

  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });
    if (post.userId !== userId) {
      return res.status(403).json({ error: 'Sem permissão para deletar este post' });
    }

    await prisma.post.delete({ where: { id: req.params.id } }); // comments são removidos via onDelete: Cascade
    res.json({ message: 'Post removido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover post.' });
  }
});

// POST /posts/:id/like — Curtir / descurtir um post
app.post('/posts/:id/like', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId é obrigatório' });

  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });

    const likedBy = parseLikedBy(post.likedBy);
    const alreadyLiked = likedBy.includes(userId);

    const newLikedBy = alreadyLiked
      ? likedBy.filter(id => id !== userId)
      : [...likedBy, userId];

    const newLikes = alreadyLiked ? Math.max(0, post.likes - 1) : post.likes + 1;

    const updated = await prisma.post.update({
      where: { id: req.params.id },
      data: { likes: newLikes, likedBy: stringifyLikedBy(newLikedBy) },
    });

    res.json({ likes: updated.likes, liked: !alreadyLiked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao curtir o post.' });
  }
});

// ─────────────────────────────────────────────
// ROTAS - COMENTÁRIOS
// ─────────────────────────────────────────────

// POST /posts/:id/comments — Adiciona comentário a um post
app.post('/posts/:id/comments', async (req, res) => {
  const { userId, text } = req.body;

  if (!text || !text.trim()) return res.status(400).json({ error: 'Comentário não pode ser vazio' });
  if (!userId) return res.status(400).json({ error: 'userId é obrigatório' });

  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const comment = await prisma.comment.create({
      data: {
        id: uuidv4(),
        postId: req.params.id,
        userId,
        text: text.trim(),
      },
      include: { user: true },
    });

    res.status(201).json(formatComment(comment));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar comentário.' });
  }
});

// ─────────────────────────────────────────────
// ROTAS - GESTOR ACADÉMICO (NOVO)
// ─────────────────────────────────────────────

app.use('/schedules', schedulesRouter);
app.use('/grades', gradesRouter);

// ─────────────────────────────────────────────
// HEALTHCHECK
// ─────────────────────────────────────────────

app.get('/health', async (req, res) => {
  try {
    const [postsCount, usersCount, commentsCount, schedulesCount, gradesCount] = await Promise.all([
      prisma.post.count(),
      prisma.user.count(),
      prisma.comment.count(),
      prisma.schedule.count(),
      prisma.grade.count(),
    ]);

    res.json({
      status: 'ok',
      message: 'HelpIesb API rodando!',
      posts: postsCount,
      users: usersCount,
      comments: commentsCount,
      schedules: schedulesCount,
      grades: gradesCount,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Erro ao conectar com o banco de dados.' });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 HelpIesb API rodando em http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponíveis:`);
  console.log(`   GET  /health`);
  console.log(`   GET  /posts`);
  console.log(`   GET  /posts/:id`);
  console.log(`   POST /posts`);
  console.log(`   DELETE /posts/:id`);
  console.log(`   POST /posts/:id/like`);
  console.log(`   POST /posts/:id/comments`);
  console.log(`   GET  /users/:id`);
  console.log(`   GET  /users/:id/posts`);
  console.log(`   PUT  /users/:id`);
  console.log(`   GET    /schedules`);
  console.log(`   POST   /schedules`);
  console.log(`   PUT    /schedules/:id`);
  console.log(`   DELETE /schedules/:id`);
  console.log(`   GET    /grades`);
  console.log(`   POST   /grades`);
  console.log(`   PUT    /grades/:id`);
  console.log(`   DELETE /grades/:id\n`);
});
