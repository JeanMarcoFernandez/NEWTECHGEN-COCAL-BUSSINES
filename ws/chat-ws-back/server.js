import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { chatSocket } from "./sockets/chatSocket.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: ["http://localhost:5173", /\.trycloudflare\.com$/], methods: ["GET","POST"] }
});

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", userRoutes);
app.use("/api/grupos", groupRoutes);
app.use("/api/mensajes", messageRoutes);

chatSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Backend modular WebSocket corriendo en puerto ${PORT}`);
});
