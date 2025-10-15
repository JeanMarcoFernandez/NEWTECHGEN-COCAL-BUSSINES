<template>
  <div class="calendar-container">
    <BarraSuperior title="Calendario Personal" />

    <div class="calendar-wrapper">
      <FiltroEventos :filtros="filtros" @filtrar="aplicarFiltros" />

      <FullCalendar
        ref="calendarRef"
        :plugins="calendarPlugins"
        :initialView="vistaActual"
        :events="eventosFiltrados"
        editable
        selectable
        @dateClick="crearEvento"
        @eventClick="abrirDetalle"
      />

      <ModalEvento
        v-if="mostrarModal"
        :evento="eventoSeleccionado"
        @cerrar="cerrarModal"
        @guardar="guardarEvento"
      />
    </div>
  </div>
</template>

<script>
import "@fullcalendar/core/vdom";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import anime from "animejs";
import BarraSuperior from "../components/BarraSuperior.vue";
import FiltroEventos from "../components/FiltroEventos.vue";
import ModalEvento from "../components/ModalEvento.vue";
import "../assets/calendarTheme.css";

export default {
  name: "CalendarioPersonal",
  components: { FullCalendar, BarraSuperior, FiltroEventos, ModalEvento },
  data() {
    return {
      vistaActual: "dayGridMonth",
      calendarPlugins: [
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
        interactionPlugin,
      ],
      filtros: {
        tipo: "TODOS",
        area: "TODAS",
        visibilidad: "TODOS",
      },
      eventos: [
        {
          title: "Reunión de Gerencia",
          start: "2025-10-16T09:00:00",
          end: "2025-10-16T10:00:00",
          tipo: "REUNION",
          area: "GERENCIA",
          visibilidad: "INTERNO",
          color: "#007bff",
        },
        {
          title: "Capacitación RRHH",
          start: "2025-10-17T14:00:00",
          end: "2025-10-17T15:00:00",
          tipo: "CAPACITACION",
          area: "RECURSOS_HUMANOS",
          visibilidad: "PUBLICO",
          color: "#00c8ff",
        },
      ],
      eventosFiltrados: [],
      mostrarModal: false,
      eventoSeleccionado: null,
    };
  },
  mounted() {
    this.eventosFiltrados = this.eventos;
  },
  methods: {
    aplicarFiltros(f) {
      this.filtros = f;
      this.eventosFiltrados = this.eventos.filter((e) => {
        return (
          (f.tipo === "TODOS" || e.tipo === f.tipo) &&
          (f.area === "TODAS" || e.area === f.area) &&
          (f.visibilidad === "TODOS" || e.visibilidad === f.visibilidad)
        );
      });
    },
    crearEvento(info) {
      anime({
        targets: ".fc-day-today",
        scale: [1, 1.2],
        duration: 200,
        direction: "alternate",
        easing: "easeInOutQuad",
      });
      this.eventoSeleccionado = {
        title: "",
        start: info.dateStr,
        tipo: "REUNION",
      };
      this.mostrarModal = true;
    },
    abrirDetalle(clickInfo) {
      this.eventoSeleccionado = clickInfo.event.extendedProps;
      this.mostrarModal = true;
    },
    guardarEvento(e) {
      this.eventos.push({
        title: e.title,
        start: e.start,
        end: e.end,
        tipo: e.tipo,
        area: e.area,
        color: e.color,
      });
      this.mostrarModal = false;
    },
    cerrarModal() {
      this.mostrarModal = false;
    },
  },
};
</script>
