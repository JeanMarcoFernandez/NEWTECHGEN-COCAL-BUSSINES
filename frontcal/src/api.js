import axios from 'axios';
const API = import.meta.env.VITE_API || 'http://localhost:3000/api';

export const api = {
  empresas: {
    list: () => axios.get(`${API}/empresas`).then(r=>r.data),
    create: (payload) => axios.post(`${API}/empresas`, payload).then(r=>r.data),
    update: (id,payload) => axios.put(`${API}/empresas/${id}`, payload).then(r=>r.data),
    remove: (id) => axios.delete(`${API}/empresas/${id}`).then(r=>r.data),
  },
  departamentos: {
    list: () => axios.get(`${API}/departamentos`).then(r=>r.data),
    listByEmpresa: (id) => axios.get(`${API}/departamentos/empresa/${id}`).then(r=>r.data),
    create: (payload) => axios.post(`${API}/departamentos`, payload).then(r=>r.data),
    update: (id,p) => axios.put(`${API}/departamentos/${id}`, p).then(r=>r.data),
    remove: (id) => axios.delete(`${API}/departamentos/${id}`).then(r=>r.data),
  },
  usuarios: {
    list: () => axios.get(`${API}/usuarios`).then(r=>r.data),
    create: (p) => axios.post(`${API}/usuarios`, p).then(r=>r.data),
  }
};
