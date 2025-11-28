// controllers/administracionEmpresaDepartamentoController.js
import { supabase } from '../db.js';

import { obtenerEmpresaPorId } from '../models/empresaModel.js';
import {
  obtenerDepartamentosPorEmpresa,
  obtenerDepartamentoPorId,
  eliminarDepartamento,
} from '../models/departamentoModel.js';

// 🔹 GET /api/admin/empresa-departamento/:idEmpresa/departamentos
// Lista todos los departamentos de una empresa
export async function listarDepartamentosDeEmpresaAdmin(req, res) {
  try {
    const { idEmpresa } = req.params;

    const empresa = await obtenerEmpresaPorId(idEmpresa);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa no encontrada.' });
    }

    const departamentos = await obtenerDepartamentosPorEmpresa(idEmpresa);

    return res.json({
      empresa_id: Number(idEmpresa),
      empresa_nombre: empresa.nombre,
      total_departamentos: departamentos.length,
      departamentos,
    });
  } catch (error) {
    console.error('Error listarDepartamentosDeEmpresaAdmin:', error);
    return res.status(500).json({
      message: 'Error al listar los departamentos de la empresa.',
      error: error.message,
    });
  }
}

// 🔹 DELETE /api/admin/empresa-departamento/:idEmpresa/departamentos/:idDepartamento
// Elimina un departamento de una empresa (con validación de pertenencia)
export async function eliminarDepartamentoDeEmpresaAdmin(req, res) {
  try {
    const { idEmpresa, idDepartamento } = req.params;

    // 1) Validar empresa
    const empresa = await obtenerEmpresaPorId(idEmpresa);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa no encontrada.' });
    }

    // 2) Validar departamento
    const departamento = await obtenerDepartamentoPorId(idDepartamento);
    if (!departamento) {
      return res.status(404).json({ message: 'Departamento no encontrado.' });
    }

    // 3) Verificar que el departamento pertenezca a esa empresa
    if (String(departamento.id_empresa) !== String(idEmpresa)) {
      return res.status(400).json({
        message: 'El departamento no pertenece a la empresa indicada.',
      });
    }

    // ⚠️ OJO: por ON DELETE CASCADE esto puede eliminar proyectos, usuarios relacionados, etc.
    await eliminarDepartamento(idDepartamento);

    return res.json({
      message: 'Departamento eliminado correctamente.',
      empresa_id: Number(idEmpresa),
      departamento_eliminado: Number(idDepartamento),
    });
  } catch (error) {
    console.error('Error eliminarDepartamentoDeEmpresaAdmin:', error);
    return res.status(500).json({
      message: 'Error al eliminar el departamento de la empresa.',
      error: error.message,
    });
  }
}

// 🔹 GET /api/admin/empresa-departamento/:idEmpresa/resumen
// Resumen corporativo: #departamentos, #usuarios, #proyectos
export async function resumenEmpresaDepartamentoAdmin(req, res) {
  try {
    const { idEmpresa } = req.params;

    const empresa = await obtenerEmpresaPorId(idEmpresa);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa no encontrada.' });
    }

    // Departamentos de la empresa
    const { data: departamentos, error: depError } = await supabase
      .from('departamento')
      .select('id')
      .eq('id_empresa', idEmpresa);

    if (depError) throw depError;

    // Usuarios de la empresa
    const { data: usuarios, error: usrError } = await supabase
      .from('usuario')
      .select('id')
      .eq('id_empresa', idEmpresa);

    if (usrError) throw usrError;

    // Proyectos asociados a la empresa (column id_empresa ya añadida por tu ALTER TABLE)
    const { data: proyectos, error: proyError } = await supabase
      .from('proyecto')
      .select('id')
      .eq('id_empresa', idEmpresa);

    if (proyError) throw proyError;

    return res.json({
      empresa: {
        id: empresa.id,
        nombre: empresa.nombre,
        rubro: empresa.rubro,
      },
      resumen: {
        total_departamentos: departamentos?.length || 0,
        total_usuarios: usuarios?.length || 0,
        total_proyectos: proyectos?.length || 0,
      },
    });
  } catch (error) {
    console.error('Error resumenEmpresaDepartamentoAdmin:', error);
    return res.status(500).json({
      message: 'Error al obtener el resumen empresa-departamentos.',
      error: error.message,
    });
  }
}
