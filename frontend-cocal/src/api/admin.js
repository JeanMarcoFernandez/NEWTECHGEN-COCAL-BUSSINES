import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // cambia según tu backend

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creando usuario:', error);
    throw error;
  }
};
