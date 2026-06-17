// backend/src/routes/schedules.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const VALID_SHIFTS = ['MATUTINO', 'VESPERTINO', 'NOTURNO'];

// GET /schedules?userId=u1 — lista os horários de um usuário
router.get('/', async (req, res) => {
  const { userId } = req.query;
  try {
    const schedules = await prisma.schedule.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar horários.' });
  }
});

// GET /schedules/:id
router.get('/:id', async (req, res) => {
  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!schedule) return res.status(404).json({ error: 'Horário não encontrado.' });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar horário.' });
  }
});

// POST /schedules
router.post('/', async (req, res) => {
  const { userId, subject, startTime, endTime, room, shift } = req.body;

  if (!userId || !subject || !startTime || !endTime || !room || !shift) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }
  if (!VALID_SHIFTS.includes(shift)) {
    return res.status(400).json({ error: 'Turno inválido. Use MATUTINO, VESPERTINO ou NOTURNO.' });
  }

  try {
    const schedule = await prisma.schedule.create({
      data: { userId, subject, startTime, endTime, room, shift },
    });
    res.status(201).json(schedule);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2003') {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(500).json({ error: 'Erro ao criar horário.' });
  }
});

// PUT /schedules/:id
router.put('/:id', async (req, res) => {
  const { subject, startTime, endTime, room, shift } = req.body;

  if (!subject || !startTime || !endTime || !room || !shift) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }
  if (!VALID_SHIFTS.includes(shift)) {
    return res.status(400).json({ error: 'Turno inválido.' });
  }

  try {
    const schedule = await prisma.schedule.update({
      where: { id: Number(req.params.id) },
      data: { subject, startTime, endTime, room, shift },
    });
    res.json(schedule);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Horário não encontrado.' });
    }
    res.status(500).json({ error: 'Erro ao atualizar horário.' });
  }
});

// DELETE /schedules/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.schedule.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Horário removido com sucesso.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Horário não encontrado.' });
    }
    res.status(500).json({ error: 'Erro ao remover horário.' });
  }
});

module.exports = router;
