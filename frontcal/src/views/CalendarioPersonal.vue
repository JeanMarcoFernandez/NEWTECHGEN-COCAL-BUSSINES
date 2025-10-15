<template>
  <div class="calendar-container">
    <BarraSuperior title="Calendario Personal" />

    <div class="calendar-wrapper">
      <FiltroEventos :filtros="filtros" @filtrar="aplicarFiltros" />

      <!-- 🕒 Muestra carga mientras se preparan eventos -->
      <div v-if="!calendarReady" class="loading">
        <p>Cargando calendario...</p>
      </div>

      <!-- ✅ Renderiza calendario solo cuando todo está listo -->
      <FullCalendar
        v-else
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
      // ✅ Inicializa todo desde el principio
      vistaActual: "dayGridMonth",
      calendarReady: false,
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
    // ✅ ya no hay delay en los plugins, solo en los eventos
    setTimeout(() => {
      this.eventosFiltrados = this.eventos;
      this.calendarReady = true;

      // 🧩 Garantiza que la vista se actualice solo cuando el ref exista
      this.$nextTick(() => {
        const calendarEl = this.$refs.calendarRef;
        if (calendarEl && calendarEl.getApi) {
          const api = calendarEl.getApi();
          if (api.view.type !== this.vistaActual) {
            api.changeView(this.vistaActual);
          }
        }
      });
    }, 200);
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
      this.eventosFiltrados = [...this.eventos];
      this.mostrarModal = false;
    },
    cerrarModal() {
      this.mostrarModal = false;
    },
  },
};
</script>

<style scoped>
.calendar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(120deg, #0d1b2a, #1b263b);
  color: #fff;
  overflow-y: auto;
}

.calendar-wrapper {
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  margin-top: 6rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.3);
}

.loading {
  color: #ccc;
  padding: 3rem;
  font-size: 1.3rem;
  text-align: center;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}

.fc {
  background: #fff;
  border-radius: 12px;
  color: #000;
  padding: 1rem;
  min-height: 700px;
}
</style>
