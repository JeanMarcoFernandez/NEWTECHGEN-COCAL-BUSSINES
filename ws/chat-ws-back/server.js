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


const allowedOrigins = [
  "http://localhost:5173",
  /\.trycloudflare\.com$/, // dominios de túnel temporales
  /\.cloudflare\.dev$/     // dominios de túnel permanentes
];


app.use(cors({
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin)) {
      return callback(null, true);
    }
    console.warn("❌ Bloqueado por CORS:", origin);
    return callback(new Error("CORS not allowed"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());


app.use("/api/usuarios", userRoutes);
app.use("/api/grupos", groupRoutes);
app.use("/api/mensajes", messageRoutes);


const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin)) {
        return callback(null, true);
      }
      console.warn("❌ Bloqueado WS por CORS:", origin);
      return callback(new Error("CORS not allowed"));
    },
    methods: ["GET", "POST"]
  }
});


chatSocket(io);


const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
  res.send("✅ Backend WS activo y escuchando correctamente en puerto " + PORT);
});


io.on("connection", (socket) => {
  console.log("🟢 Nuevo cliente conectado:", socket.id);

  socket.emit("server_message", "Bienvenido al servidor WebSocket 👋");

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Backend modular WebSocket corriendo en puerto ${PORT}`);
});
