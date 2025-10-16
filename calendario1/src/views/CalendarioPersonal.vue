<template>
  <div class="calendar-page">
    <BarraSuperior title="📅 Calendario Personal" />

    <main class="main-content">
      <section class="filters-section">
        <FiltroEventos :filtros="filtros" @filtrar="aplicarFiltros" />
      </section>

      <section class="calendar-section">
        <div v-if="!calendarReady" class="loading">
          <p>Cargando calendario...</p>
        </div>

        <FullCalendar
          v-else
          ref="calendarRef"
          :options="calendarOptions"
          class="calendar"
        />
      </section>
    </main>

    <ModalEvento
      v-if="mostrarModal"
      :evento="eventoSeleccionado"
      @cerrar="cerrarModal"
      @guardar="guardarEvento"
    />
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import * as anime from "animejs/lib/anime.es.js";
import BarraSuperior from "../components/BarraSuperior.vue";
import FiltroEventos from "../components/FiltroEventos.vue";
import ModalEvento from "../components/ModalEvento.vue";

export default {
  name: "CalendarioPersonal",
  components: { FullCalendar, BarraSuperior, FiltroEventos, ModalEvento },
  data() {
    return {
      calendarReady: false,
      filtros: { tipo: "TODOS", area: "TODAS", visibilidad: "TODOS" },
      eventos: [
        {
          title: "Reunión de Gerencia",
          start: "2025-10-16T09:00:00",
          end: "2025-10-16T10:00:00",
          tipo: "REUNION",
          area: "GERENCIA",
          visibilidad: "INTERNO",
          color: "#3b82f6",
        },
        {
          title: "Capacitación RRHH",
          start: "2025-10-17T14:00:00",
          end: "2025-10-17T15:00:00",
          tipo: "CAPACITACION",
          area: "RECURSOS_HUMANOS",
          visibilidad: "PUBLICO",
          color: "#10b981",
        },
      ],
      eventosFiltrados: [],
      mostrarModal: false,
      eventoSeleccionado: null,
      calendarOptions: {},
    };
  },
  mounted() {
    this.eventosFiltrados = this.eventos;

    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
      },
      buttonText: {
        today: "Hoy",
        month: "Mes",
        week: "Semana",
        day: "Día",
        list: "Lista",
      },
      locale: "es",
      events: this.eventosFiltrados,
      editable: true,
      selectable: true,
      dateClick: this.crearEvento,
      eventClick: this.abrirDetalle,
      height: "auto",
    };

    setTimeout(() => (this.calendarReady = true), 300);
  },
  methods: {
    aplicarFiltros(f) {
      this.filtros = f;
      this.eventosFiltrados = this.eventos.filter(
        (e) =>
          (f.tipo === "TODOS" || e.tipo === f.tipo) &&
          (f.area === "TODAS" || e.area === f.area) &&
          (f.visibilidad === "TODOS" || e.visibilidad === f.visibilidad)
      );
      this.calendarOptions.events = this.eventosFiltrados;
    },
    crearEvento(info) {
      anime({
        targets: ".fc-daygrid-day.fc-day-today",
        scale: [1, 1.2],
        duration: 250,
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
      this.eventos.push(e);
      this.eventosFiltrados = [...this.eventos];
      this.calendarOptions.events = this.eventosFiltrados;
      this.mostrarModal = false;
    },
    cerrarModal() {
      this.mostrarModal = false;
    },
  },
};
</script>

<style scoped>
.calendar-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f4f6f9;
  color: #1f2937;
}

.main-content {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.filters-section {
  margin-bottom: 1rem;
  width: 100%;
  max-width: 1100px;
}

.calendar-section {
  background: white;
  width: 100%;
  max-width: 1100px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.loading {
  color: #6b7280;
  padding: 3rem;
  font-size: 1.2rem;
  text-align: center;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.fc {
  background: white;
  color: #111;
  border-radius: 12px;
}

.fc-toolbar-title {
  font-weight: 600;
  color: #1f2937;
}

.fc-button {
  background: #2563eb;
  border: none;
  color: white;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  transition: 0.2s;
}

.fc-button:hover {
  background: #1e40af;
}

.fc-today-button {
  background: #10b981 !important;
}
</style>
