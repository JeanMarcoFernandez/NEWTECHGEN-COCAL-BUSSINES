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

// --- CAMBIO DE CONTRASEÑA EN PRIMER LOGIN ---
export const changePasswordFirstLogin = async (correo, nuevaContrasena) => {
  return await axios.post(`http://localhost:3000/api/contrasena/primer-login`, {
    correo,
    nuevaContrasena,
  });
};
