// backend/src/routes/grades.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── Regras de Negócio (IESB) ───────────────────────────────────────────────
function calcFinalGrade(p1, p2) {
  if (p1 == null || p2 == null) return null;
  return parseFloat(((p1 * 0.4) + (p2 * 0.6)).toFixed(2));
}

function calcMinP2(p1) {
  if (p1 == null) return null;
  const min = (5 - p1 * 0.4) / 0.6;
  return parseFloat(Math.max(0, min).toFixed(2));
}

function getMencao(media) {
  if (media == null) return null;
  if (media >= 9)   return 'SS';
  if (media >= 7)   return 'MS';
  if (media >= 5)   return 'MM';
  if (media >= 3)   return 'MI';
  if (media >= 0.1) return 'II';
  return 'SR';
}

function enrichGrade(grade) {
  const media = calcFinalGrade(grade.p1, grade.p2);
  return {
    ...grade,
    media,
    mencao: getMencao(media),
    minP2: grade.p1 != null ? calcMinP2(grade.p1) : null,
    aprovado: media != null ? media >= 5 : null,
  };
}

// ─── Rotas ───────────────────────────────────────────────────────────────

// GET /grades?userId=u1
router.get('/', async (req, res) => {
  const { userId } = req.query;
  try {
    const grades = await prisma.grade.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json(grades.map(enrichGrade));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar notas.' });
  }
});

// GET /grades/:id
router.get('/:id', async (req, res) => {
  try {
    const grade = await prisma.grade.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!grade) return res.status(404).json({ error: 'Nota não encontrada.' });
    res.json(enrichGrade(grade));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar nota.' });
  }
});

// POST /grades
router.post('/', async (req, res) => {
  const { userId, subject, p1, p2 } = req.body;

  if (!userId || !subject) {
    return res.status(400).json({ error: 'Usuário e disciplina são obrigatórios.' });
  }
  if (p1 != null && (p1 < 0 || p1 > 10)) {
    return res.status(400).json({ error: 'P1 deve ser entre 0 e 10.' });
  }
  if (p2 != null && (p2 < 0 || p2 > 10)) {
    return res.status(400).json({ error: 'P2 deve ser entre 0 e 10.' });
  }

  try {
    const grade = await prisma.grade.create({
      data: {
        userId,
        subject,
        p1: p1 != null ? parseFloat(p1) : null,
        p2: p2 != null ? parseFloat(p2) : null,
      },
    });
    res.status(201).json(enrichGrade(grade));
  } catch (error) {
    console.error(error);
    if (error.code === 'P2003') {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(500).json({ error: 'Erro ao criar nota.' });
  }
});

// PUT /grades/:id
router.put('/:id', async (req, res) => {
  const { subject, p1, p2 } = req.body;

  if (!subject) {
    return res.status(400).json({ error: 'Nome da disciplina é obrigatório.' });
  }
  if (p1 != null && (p1 < 0 || p1 > 10)) {
    return res.status(400).json({ error: 'P1 deve ser entre 0 e 10.' });
  }
  if (p2 != null && (p2 < 0 || p2 > 10)) {
    return res.status(400).json({ error: 'P2 deve ser entre 0 e 10.' });
  }

  try {
    const grade = await prisma.grade.update({
      where: { id: Number(req.params.id) },
      data: {
        subject,
        p1: p1 != null ? parseFloat(p1) : null,
        p2: p2 != null ? parseFloat(p2) : null,
      },
    });
    res.json(enrichGrade(grade));
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Nota não encontrada.' });
    }
    res.status(500).json({ error: 'Erro ao atualizar nota.' });
  }
});

// DELETE /grades/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.grade.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Nota removida com sucesso.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Nota não encontrada.' });
    }
    res.status(500).json({ error: 'Erro ao remover nota.' });
  }
});

module.exports = router;
