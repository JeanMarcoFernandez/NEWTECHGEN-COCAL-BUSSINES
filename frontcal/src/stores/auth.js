import { defineStore } from 'pinia';
import axios from 'axios';

const API = import.meta.env.VITE_API || 'http://localhost:4000/api';

export const useAuth = defineStore('auth', {
  state: () => ({ token:null, user:null }),
  actions: {
    async login(correo, contrasena){
      const { data } = await axios.post(`${API}/auth/login`, { correo, contrasena });
      this.token = data.token; this.user = data.user;
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    },
    logout(){ this.token=null; this.user=null; delete axios.defaults.headers.common['Authorization']; }
  }
});
