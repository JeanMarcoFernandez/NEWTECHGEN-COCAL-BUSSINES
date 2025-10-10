<template>
  <div class="container">
    <div v-if="!joined" class="join-screen">
      <h1>💬 Chat WS</h1>
      <input v-model="username" placeholder="Tu nombre" />
      <button @click="joinChat">Entrar</button>
    </div>

    <div v-else class="chat-screen">
      <div class="sidebar">
        <h3>Usuarios</h3>
        <button @click="toggleMode">
          {{ groupMode ? 'Modo Grupo' : 'Chat 1 a 1' }}
        </button>
        <ul>
          <li
            v-for="u in users"
            :key="u.id"
            :class="{ active: selectedUser?.nombre === u.nombre }"
            @click="selectUser(u)"
          >
            {{ u.nombre }}
          </li>
        </ul>
      </div>

      <div class="chat">
        <div class="messages">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            :class="msg.from === username ? 'msg me' : 'msg'"
          >
            <strong>{{ msg.from }}:</strong> {{ msg.contenido }}
          </div>
        </div>

        <div class="input-box">
          <input
            v-model="message"
            placeholder="Escribe un mensaje..."
            @keyup.enter="sendMessage"
          />
          <button @click="sendMessage">Enviar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { io } from "socket.io-client";
import axios from "axios";

const username = ref("");
const joined = ref(false);
const socket = ref(null);
const users = ref([]);
const messages = ref([]);
const message = ref("");
const selectedUser = ref(null);
const groupMode = ref(true);
const grupo = "ForoGeneral";

async function joinChat() {
  if (!username.value.trim()) {
    alert("Escribe un nombre");
    return;
  }

  await axios.post("/api/usuarios", { nombre: username.value });
  joined.value = true;

  // conectar socket
  socket.value = io("http://localhost:3000");
  socket.value.emit("join", username.value);

  socket.value.on("group_message", (msg) => {
    if (msg.grupo === grupo) messages.value.push(msg);
  });

  socket.value.on("private_message", (msg) => {
    messages.value.push(msg);
  });

  const res = await axios.get("/api/usuarios");
  users.value = res.data;
}

function toggleMode() {
  groupMode.value = !groupMode.value;
}

function selectUser(u) {
  selectedUser.value = u;
  groupMode.value = false;
}

function sendMessage() {
  if (!message.value.trim()) return;

  if (groupMode.value) {
    socket.value.emit("group_message", { grupo, contenido: message.value });
  } else if (selectedUser.value) {
    socket.value.emit("private_message", {
      to: selectedUser.value.nombre,
      contenido: message.value,
    });
  }
  message.value = "";
}
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #111;
  color: white;
}

.container {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.join-screen {
  text-align: center;
}

.join-screen input {
  padding: 10px;
  width: 200px;
  border: none;
  margin: 10px;
  border-radius: 5px;
}

.join-screen button {
  padding: 10px 20px;
  border: none;
  background: #0078ff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.chat-screen {
  display: flex;
  width: 80%;
  height: 80%;
  border: 1px solid #444;
  border-radius: 10px;
  overflow: hidden;
}

.sidebar {
  background: #222;
  width: 25%;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 10px 0;
  flex: 1;
  overflow-y: auto;
}

.sidebar li {
  padding: 8px;
  cursor: pointer;
  border-radius: 5px;
}

.sidebar li:hover {
  background: #333;
}

.sidebar li.active {
  background: #0078ff;
}

.sidebar button {
  margin-bottom: 10px;
  padding: 8px;
  border: none;
  background: #0078ff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #181818;
}

.messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.msg {
  margin: 5px 0;
}

.msg.me {
  text-align: right;
}

.input-box {
  display: flex;
  padding: 10px;
  background: #222;
}

.input-box input {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: #333;
  color: white;
}

.input-box button {
  margin-left: 10px;
  padding: 10px 20px;
  background: #0078ff;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}
</style>
