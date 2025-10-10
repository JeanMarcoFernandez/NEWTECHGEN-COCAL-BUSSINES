import express from "express";
import { getPrivateMessages } from "../controllers/messageController.js";
const router = express.Router();

router.get("/privado", async (req, res) => {
  try {
    const { u1, u2 } = req.query;
    const mensajes = await getPrivateMessages(u1, u2);
    res.json(mensajes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
