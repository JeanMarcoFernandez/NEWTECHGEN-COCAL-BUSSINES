// services/analyticsService.js
import { supabase } from '../db.js';

export const analyticsService = {

  // 1. Métricas corporativas (uso por tipo + tendencias)
  obtenerMetricaCorporativa: async () => {
    // Uso por tipo
    const { data: recursos, error: errorRecursos } = await supabase
      .from('recurso')
      .select(`
        tipo,
        reserva_recurso!inner(id, fecha_inicio, fecha_fin, estado)
      `)
      .in('reserva_recurso.estado', ['APROBADA','EN_USO','FINALIZADA']);

    if (errorRecursos) throw errorRecursos;

    const usoPorTipo = recursos.map(r => ({
      tipo: r.tipo,
      totalReservas: r.reserva_recurso?.length || 0,
      horasTotales: r.reserva_recurso?.reduce((acc, rr) => {
        const inicio = new Date(rr.fecha_inicio);
        const fin = new Date(rr.fecha_fin);
        return acc + ((fin - inicio)/1000/3600);
      }, 0) || 0
    }));

    // Tendencia mensual
    const { data: reservas, error: errorReservas } = await supabase
      .from('reserva_recurso')
      .select('fecha_inicio');

    if (errorReservas) throw errorReservas;

    const tendencia = reservas.reduce((acc, r) => {
      const mes = new Date(r.fecha_inicio).toISOString().slice(0,7);
      acc[mes] = (acc[mes] || 0) + 1;
      return acc;
    }, {});

    return {
      usoPorTipo,
      tendenciaReservas: tendencia
    };
  },

  // 2. Uso por departamento
  obtenerUsoDepartamento: async (id_departamento) => {
    const { data: recursos, error } = await supabase
      .from('recurso')
      .select(`
        id,
        tipo,
        reserva_recurso(id, fecha_inicio, fecha_fin, estado)
      `)
      .eq('id_departamento', id_departamento);

    if (error) throw error;

    return recursos.map(r => ({
      tipo: r.tipo,
      totalReservas: r.reserva_recurso?.length || 0,
      horasUsadas: r.reserva_recurso?.reduce((acc, rr) => {
        const inicio = new Date(rr.fecha_inicio);
        const fin = new Date(rr.fecha_fin);
        return acc + ((fin - inicio)/1000/3600);
      }, 0) || 0
    }));
  },

  // 3. Benchmarking entre departamentos
  benchmarkingDepartamentos: async () => {
    const { data: departamentos, error } = await supabase
      .from('departamento')
      .select(`
        id,
        nombre,
        recurso!inner(id, reserva_recurso(id, fecha_inicio, fecha_fin, estado))
      `);

    if (error) throw error;

    return departamentos.map(d => {
      let totalReservas = 0;
      let horasUsadas = 0;
      d.recurso.forEach(r => {
        if (r.reserva_recurso) {
          totalReservas += r.reserva_recurso.length;
          horasUsadas += r.reserva_recurso.reduce((acc, rr) => {
            const inicio = new Date(rr.fecha_inicio);
            const fin = new Date(rr.fecha_fin);
            return acc + ((fin - inicio)/1000/3600);
          }, 0);
        }
      });
      return {
        departamento: d.nombre,
        totalReservas,
        horasUsadas
      };
    }).sort((a,b) => b.horasUsadas - a.horasUsadas);
  },

  // 4. Exportar dataset de un departamento
  obtenerDatasetDepartamento: async (id_departamento) => {
    const { data, error } = await supabase
      .from('reserva_recurso')
      .select(`
        id,
        id_recurso,
        fecha_inicio,
        fecha_fin,
        estado,
        motivo,
        recurso!inner(nombre)
      `)
      .eq('recurso.id_departamento', id_departamento);

    if (error) throw error;

    return data.map(d => ({
      id: d.id,
      recurso: d.recurso.nombre,
      fecha_inicio: d.fecha_inicio,
      fecha_fin: d.fecha_fin,
      estado: d.estado,
      motivo: d.motivo
    }));
  },

  // 5. Detección de tendencias negativas
  detectarTendenciasNegativas: async () => {
    const { data: reservas, error } = await supabase
      .from('reserva_recurso')
      .select('fecha_inicio');

    if (error) throw error;

    const mensual = {};
    reservas.forEach(r => {
      const mes = new Date(r.fecha_inicio).toISOString().slice(0,7);
      mensual[mes] = (mensual[mes] || 0) + 1;
    });

    const meses = Object.keys(mensual).sort();
    const alertas = [];
    for (let i=1; i<meses.length; i++) {
      const variacion = ((mensual[meses[i]] - mensual[meses[i-1]]) / mensual[meses[i-1]]) * 100;
      if (variacion < -20) {
        alertas.push({ mes: meses[i], variacion });
      }
    }
    return alertas;
  },

  // 6. Guardar KPI personalizado
  guardarKpi: async ({ nombre, formula_sql, userId }) => {
    const { data, error } = await supabase
      .from('kpi')
      .insert([{ nombre, formula_sql, creado_por: userId }])
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  // 7. Guardar configuración de dashboard
  guardarDashboardConfig: async (userId, layout) => {
    const { data, error } = await supabase
      .from('config_dashboard')
      .upsert([{ id_usuario: userId, layout }], { onConflict: 'id_usuario' })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

};
