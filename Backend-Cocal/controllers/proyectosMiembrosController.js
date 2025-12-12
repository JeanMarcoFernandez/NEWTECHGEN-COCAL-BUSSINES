import {
  agregarDepartamentoAProyecto,
  getDepartamentosPorProyecto,
  agregarMiembroAProyecto
} from "../models/proyectoMiembrosModel.js";

export const asignarDepartamentoAProyecto = async (req, res) => {
  try {
    const { id_proyecto, id_departamento } = req.body;
    await agregarDepartamentoAProyecto(id_proyecto, id_departamento);
    res.json({ msg: "Departamento asignado al proyecto" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verDepartamentosDelProyecto = async (req, res) => {
  try {
    const { id_proyecto } = req.params;
    const departamentos = await getDepartamentosPorProyecto(id_proyecto);
    res.json(departamentos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const agregarMiembro = async (req, res) => {
  try {
    const { id_proyecto, id_usuario, rol } = req.body;
    const miembro = await agregarMiembroAProyecto(id_proyecto, id_usuario, rol);
    res.json({ msg: "Miembro agregado al proyecto", miembro });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
