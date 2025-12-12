import { getUsuariosPorDepartamento, getUsuariosConDepartamento } from "../models/usuariosMiembrosModel.js";

export const usuariosPorDepartamento = async (req, res) => {
  try {
    const { id_departamento } = req.params;
    const usuarios = await getUsuariosPorDepartamento(id_departamento);
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const usuariosConDepartamento = async (req, res) => {
  try {
    const usuarios = await getUsuariosConDepartamento();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
