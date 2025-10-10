import express from "express";
import { ensureUser, getUsers } from "../controllers/userController.js";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "nombre requerido" });
    const user = await ensureUser(nombre);
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
