// src/api/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Ajusta según tu backend

// --- LOGIN ---
export const login = async (credentials) => {
  return await axios.post(`${API_URL}/auth/login`, credentials);
};

// --- REGISTER ---
export const register = async (userData) => {
  return await axios.post(`${API_URL}/auth/register`, userData);
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