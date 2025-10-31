// src/api/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Ajusta según tu backend

// --- LOGIN ---
export const login = async ({ email, password }) => {
  return axios.post(`${API_URL}/auth/login`, {
    correo: email,
    contrasena: password, // coincide con el backend
  });
};


// --- REGISTER ---
export const register = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    return res.data; // así devuelves el mensaje de éxito
  } catch (err) {
    // lanza error para que el componente lo capture
    throw err;
  }
};

// --- RESET PASSWORD (envía enlace) ---
export const resetPassword = async (email) => {
  return await axios.post(`${API_URL}/auth/reset-password`, { email });
};

// --- CHANGE PASSWORD (usuario cambia su contraseña) ---
export const changePassword = async (data, token) => {
  // data = { oldPassword, newPassword }
  return await axios.put(
    `${API_URL}/auth/change-password`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export async function verificar2FA(correo, codigo) {
  return await axios.post(`${API_URL}/verificar-2fa`, { correo, codigo });
}

export async function reenviar2FA(usuario_id, correo, nombre) {
  return await axios.post(`${API_URL}/enviar-2fa`, { usuario_id, correo, nombre });
}