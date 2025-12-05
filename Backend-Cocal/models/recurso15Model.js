import { supabase } from '../db.js';

export const recurso15Model = {
  async crearRecurso(data) {
    const { data: recurso, error } = await supabase
      .from('recurso')
      .insert([data])
      .select();
    return { recurso: recurso?.[0], error };
  },

  async listarRecursos() {
    const { data: recursos, error } = await supabase
      .from('recurso')
      .select('*');
    return { recursos, error };
  },

  async obtenerRecursoPorId(id) {
    const { data: recurso, error } = await supabase
      .from('recurso')
      .select('*')
      .eq('id', id)
      .single();
    return { recurso, error };
  },

  async actualizarRecurso(id, data) {
    const { data: recurso, error } = await supabase
      .from('recurso')
      .update(data)
      .eq('id', id)
      .select();
    return { recurso: recurso?.[0], error };
  },

  async generarCodigoUnico() {
    const { data, error } = await supabase.rpc('generar_codigo_unico');
    if (error) throw new Error('Error generando código único');
    return data;
  }
};
