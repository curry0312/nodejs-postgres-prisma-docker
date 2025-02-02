import express from "express";

import prisma from "../prismaClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.userId;

  try {
    const todos = await prisma.todo.findMany({
      where: { userId: userId, user: { id: userId } },
    });

    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const userId = req.userId;
  const { task } = req.body;
  try {
    if (!task) return res.status(401).json({ error: "task is required" });

    const todo = await prisma.todo.create({
      data: {
        task,
        completed: false,
        userId: userId,
      },
    });
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;
  const userId = req.userId;
  try {
    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id), userId },
      data: { completed: !!completed },
    });
    res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const deletedTodo = await prisma.todo.delete({
      where: { id: parseInt(id), userId },
    });
    res.json(deletedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
