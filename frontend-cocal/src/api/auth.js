import axios from 'axios';

const API_URL = 'http://localhost:3000/api';


export const login = async ({ correo, contrasena }) => {
  return axios.post(`${API_URL}/auth/login`, { correo, contrasena });
};


export const register = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    return res.data;
  } catch (err) {
    throw err;
  }
};


export const resetPassword = async (email) => {
  return await axios.post(`${API_URL}/auth/reset-password`, { email });
};

export const changePassword = async (data, token) => {
  return await axios.put(`${API_URL}/auth/change-password`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export async function solicitarRestablecimiento(email) {
  return await axios.post(`${API_URL}/contrasena/restablecer`, { correo: email });
}


export async function restablecerContrasena(token, nuevaContrasena) {
  return await axios.put(`${API_URL}/contrasena/restablecer/${token}`, { nuevaContrasena });
}

export async function verificar2FA(correo, codigo) {
 
  return await axios.post(`${API_URL}/auth/verificar-2fa`, { correo, codigo });
}

export async function reenviar2FA(usuario_id, correo, nombre) {
  return await axios.post(`${API_URL}/auth/enviar-2fa`, { usuario_id, correo, nombre });
}