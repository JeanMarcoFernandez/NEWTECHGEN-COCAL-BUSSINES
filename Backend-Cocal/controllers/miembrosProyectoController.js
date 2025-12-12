import { actualizarRango, restituirMiembroModel } from "../models/miembroProyectoModel.js";

export const elevarRango = async (req, res) => {
  try {
    const { id_usuario, id_proyecto, nuevo_rol } = req.body;
    await actualizarRango(id_usuario, id_proyecto, nuevo_rol);
    res.json({ msg: "Rango elevado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rebajarRango = async (req, res) => {
  try {
    const { id_usuario, id_proyecto, nuevo_rol } = req.body;
    await actualizarRango(id_usuario, id_proyecto, nuevo_rol);
    res.json({ msg: "Rango rebajado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const restituirMiembro = async (req, res) => {
  try {
    const { id_usuario, id_proyecto } = req.body;
    await restituirMiembroModel(id_usuario, id_proyecto);
    res.json({ msg: "Miembro restituido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
