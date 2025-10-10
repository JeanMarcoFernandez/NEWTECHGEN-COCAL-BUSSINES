import express from "express";
import { ensureGroup, getGroupMessages } from "../controllers/groupController.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { nombre } = req.body;
    const group = await ensureGroup(nombre);
    res.json(group);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:nombre/mensajes", async (req, res) => {
  try {
    const { nombre } = req.params;
    const mensajes = await getGroupMessages(nombre);
    res.json(mensajes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
