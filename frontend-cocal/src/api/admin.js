import axios from 'axios';

export const createUser = async (usuario) => {
  const token = localStorage.getItem('token'); // token del ADMIN logueado
  if (!token) throw new Error('No hay token de autenticación');

  try {
    const response = await axios.post(
      'http://localhost:3000/api/usuarios-admin/crear',
      usuario,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error('Error creando usuario:', err.response?.data || err);
    throw err; // relanzamos para que el componente que llama pueda manejarlo
  }
};
