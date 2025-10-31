import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Ajusta según tu backend

// --- LOGIN ---
export const login = async ({ email, password }) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, {
      correo: email,
      contrasena: password,
    });

    // Guardamos el token y el rol automáticamente
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('rol', res.data.rol); // rol para control de permisos
      localStorage.setItem(
        'usuario',
        JSON.stringify({
          nombre: res.data.nombre,
          correo: res.data.correo,
          rol: res.data.rol
        })
      );
    }

    return res.data;
  } catch (err) {
    console.error('Error en login:', err.response?.data || err);
    throw err;
  }
};

// --- REGISTER ---
export const register = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    return res.data;
  } catch (err) {
    console.error('Error en register:', err.response?.data || err);
    throw err;
  }
};

// --- RESET PASSWORD ---
export const resetPassword = async (email) => {
  try {
    const res = await axios.post(`${API_URL}/auth/reset-password`, { email });
    return res.data;
  } catch (err) {
    console.error('Error en resetPassword:', err.response?.data || err);
    throw err;
  }
};

// --- CAMBIO DE CONTRASEÑA EN PRIMER LOGIN ---
export const changePasswordFirstLogin = async (correo, nuevaContrasena) => {
  try {
    const res = await axios.post(`${API_URL}/contrasena/primer-login`, {
      correo,
      nuevaContrasena,
    });
    return res.data;
  } catch (err) {
    console.error('Error en changePasswordFirstLogin:', err.response?.data || err);
    throw err;
  }
};

// --- CREAR USUARIO POR ADMIN ---
export const createUser = async (usuario) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No hay token de autenticación');

  try {
    const res = await axios.post(`${API_URL}/usuarios-admin/crear`, usuario, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error('Error creando usuario:', err.response?.data || err);
    throw err;
  }
};

// --- CERRAR SESIÓN ---
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('rol');
  localStorage.removeItem('usuario');
};
