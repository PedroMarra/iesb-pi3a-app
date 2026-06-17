// backend/prisma/seed.js
// Popula o banco com os MESMOS dados mock que já existiam no server.js original
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding banco de dados...');

  // ── Usuários (idênticos aos do server.js original) ──────────────────────
  const pedro = await prisma.user.upsert({
    where: { matricula: '2312130181' },
    update: {},
    create: {
      id: 'u1',
      name: 'Pedro Braga',
      matricula: '2312130181',
      curso: 'Engenharia de Software',
      avatar: 'https://i.pravatar.cc/150?u=pedro',
    },
  });

  const maria = await prisma.user.upsert({
    where: { matricula: '2312130042' },
    update: {},
    create: {
      id: 'u2',
      name: 'Maria Souza',
      matricula: '2312130042',
      curso: 'Ciência da Computação',
      avatar: 'https://i.pravatar.cc/150?u=maria',
    },
  });

  const joao = await prisma.user.upsert({
    where: { matricula: '2312130088' },
    update: {},
    create: {
      id: 'u3',
      name: 'João Silva',
      matricula: '2312130088',
      curso: 'Sistemas de Informação',
      avatar: 'https://i.pravatar.cc/150?u=joao',
    },
  });

  // ── Posts (idênticos aos do server.js original) ─────────────────────────
  const p1 = await prisma.post.upsert({
    where: { id: 'p1' },
    update: {},
    create: {
      id: 'p1',
      userId: maria.id,
      title: 'Calculadora de notas incrível!',
      content: 'Amei a nova ferramenta da calculadora de notas. Finalmente consigo calcular minha média sem erro. Alguém mais está usando?',
      category: 'Ferramentas',
      likes: 10,
      likedBy: '',
    },
  });

  const p2 = await prisma.post.upsert({
    where: { id: 'p2' },
    update: {},
    create: {
      id: 'p2',
      userId: joao.id,
      title: 'Erro no Portal do Aluno',
      content: 'Mais alguém está com erro ao tentar acessar o Portal? Fica dando timeout toda vez que tento ver minhas notas.',
      category: 'Suporte',
      likes: 22,
      likedBy: '',
    },
  });

  const p3 = await prisma.post.upsert({
    where: { id: 'p3' },
    update: {},
    create: {
      id: 'p3',
      userId: pedro.id,
      title: 'Dúvida cruel em PI3A',
      content: 'Galera, alguém conseguiu conectar o backend Node com o Expo no Windows? Já tentei de tudo e continuo pegando erro de Network Request Failed. Socorro!',
      category: 'Dúvidas',
      likes: 15,
      likedBy: '',
    },
  });

  // ── Comentários (idênticos aos do server.js original) ───────────────────
  await prisma.comment.upsert({
    where: { id: 'c1' },
    update: {},
    create: {
      id: 'c1',
      postId: p1.id,
      userId: joao.id,
      text: 'Sim! Muito útil mesmo, uso todo semestre!',
    },
  });

  await prisma.comment.upsert({
    where: { id: 'c2' },
    update: {},
    create: {
      id: 'c2',
      postId: p3.id,
      userId: maria.id,
      text: 'Verificou se o IP no fetch está correto? Não use localhost, use o IP da sua máquina na rede local!',
    },
  });

  console.log('✅ Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
