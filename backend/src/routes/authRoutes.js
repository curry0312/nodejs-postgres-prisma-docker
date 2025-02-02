import express from "express";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import prisma from "../prismaClient.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password)
      res.status(401).json({ error: "username and password are required" });

    const user = await prisma.user.findUnique({
      where: { username },
    });


    if (user) return res.status(409).json({ error: "User already exists" });

    const newUser = await prisma.user.create({
      data: {
        username,
        password: bcrypt.hashSync(password, 10),
      },
    })

    const defaultTodo = await prisma.todo.create({
      data: {
        task: "Default todo",
        completed: false,
        user: { connect: { id: newUser.id } },
      },
    });


    const token = jsonwebtoken.sign(
      { id: newUser.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    })
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jsonwebtoken.sign({ id: user.id }, process.env.JWT_SECRET);
      res.json({ message: "Login successful", token });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
