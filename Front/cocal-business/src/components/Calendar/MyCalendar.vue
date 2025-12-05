<template>
  <div class="calendar-wrapper">
    
    <!-- Left Side Bar -->
    <div class="custom-sidebar" :class="{ 'is-open': isLeftOpen }">
      <div class="sidebar-content">
        
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-h6 font-weight-bold sidebar-title text-no-wrap">
            Mis Calendarios
          </h2>
        </div>

        <v-list density="compact" bg-color="transparent">
          <v-list-item
            v-for="cal in calendars"
            :key="cal.id"
            class="calendar-list-item mb-1"
            rounded="lg"
            link
          >
            <template v-slot:prepend>
              <v-btn
                icon
                variant="text"
                density="comfortable"
                @click="cal.visible = !cal.visible"
              >
                <v-icon 
                  :color="cal.visible ? cal.color : 'grey-lighten-1'"
                  size="24"
                >
                  {{ cal.visible ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                </v-icon>
              </v-btn>
            </template>
            <v-list-item-title class="calendar-name">{{ cal.title }}</v-list-item-title>
            
            <template v-slot:append>
              <div class="hover-actions">
                 <v-menu location="bottom end">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" variant="text" density="compact" v-bind="props" size="small" color="#061244"></v-btn>
                  </template>
                  <v-list density="compact" elevation="2">
                    <v-list-item @click="openEditDialog(cal)" title="Editar"></v-list-item>
                    <v-list-item @click="deleteCalendar(cal.id)" title="Eliminar" class="text-error"></v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </template>
          </v-list-item>

          <v-list-item class="mt-4 create-new-item" rounded="lg" link @click="openCreateDialog">
            <template v-slot:prepend><v-icon color="#3159AE">mdi-plus</v-icon></template>
            <v-list-item-title class="text-primary font-weight-medium">Crear Nuevo</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>

      <div class="sidebar-handle" @click="isLeftOpen = !isLeftOpen">
        <v-icon :icon="isLeftOpen ? 'mdi-chevron-left' : 'mdi-calendar-multiple'"></v-icon>
      </div>
    </div>

    <!-- Calendar -->
    <v-container class="calendar-container" :class="{ 'dimmed': showEventPanel }">
      <div 
        v-if="showEventPanel" 
        class="click-overlay"
        @click="closeEventPanel"
      ></div>

        <v-card class="calendar-card pa-4">
            <FullCalendar :options="calendarOptions" />
        </v-card>
    </v-container>

    <!-- Right Side Bar -->
      <div 
      v-if="!mobile" 
      class="right-event-panel" 
      :class="{ 'is-visible': showEventPanel }"
    >
      <div class="panel-header pa-4 border-b d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold" style="color: #061244; font-family: 'Funnel Display'">
          <span v-if="panelMode === 'create'">Nuevo Evento</span>
          <span v-else-if="panelMode === 'edit'">Editar Evento</span>
          <span v-else>Detalles del Evento</span>
        </span>
        <v-btn icon="mdi-close" variant="text" @click="closeEventPanel"></v-btn>
      </div>
      
      <div class="panel-content pa-4">
        <EventDetails
            v-if="panelMode === 'view'"
            :form="eventForm"
            :calendars="calendars"
            @edit="switchToEditMode"
            @delete="deleteEvent"
        />

        <EventForm 
            v-else
            :form="eventForm" 
            :calendars="calendars" 
            :is-editing="isEventEditing"
            :loading="submittingEvent"
            @submit="saveEvent" 
            @delete="deleteEvent" 
            />
      </div>
    </div>

    <!-- Bottom sheet for mobile -->
    <v-bottom-sheet v-if="mobile" v-model="showEventPanel" inset>
  <v-card class="rounded-t-xl" style="max-height: 85vh; display: flex; flex-direction: column;">
    
    <div class="pa-4 border-b d-flex justify-space-between align-center">
      <div style="position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 40px; height: 4px; background: #e0e0e0; border-radius: 4px;"></div>

      <span class="text-h6 font-weight-bold mt-2" style="color: #061244; font-family: 'Funnel Display'">
        <span v-if="panelMode === 'create'">Nuevo Evento</span>
        <span v-else-if="panelMode === 'edit'">Editar Evento</span>
        <span v-else>Detalles</span>
      </span>
      
      <v-btn icon="mdi-close" variant="text" density="compact" class="mt-2" @click="showEventPanel = false"></v-btn>
    </div>

    <div class="pa-4" style="overflow-y: auto;">
      
      <EventDetails
        v-if="panelMode === 'view'"
        :form="eventForm"
        :calendars="calendars"
        @edit="switchToEditMode"
        @delete="deleteEvent"
      />

      <EventForm 
        v-else
        :form="eventForm" 
        :calendars="calendars" 
        :is-editing="panelMode === 'edit'"
        :loading="submittingEvent"
        @submit="saveEvent" 
        @delete="deleteEvent" 
      />
      
    </div>
  </v-card>
</v-bottom-sheet>

    <v-dialog v-model="dialogOpen" max-width="400">
      <v-card class="rounded-xl pa-4">
        <v-card-title class="text-h6 font-weight-bold">
          {{ isEditing ? 'Editar Calendario' : 'Nuevo Calendario' }}
        </v-card-title>
        
        <v-card-text>
          <v-text-field
            v-model="calendarForm.title"
            label="Nombre del calendario"
            variant="outlined"
            density="compact"
            color="primary"
            class="mb-4"
          ></v-text-field>

          <div class="text-subtitle-2 mb-2">Color del evento</div>
          <v-color-picker
            v-model="calendarForm.color"
            mode="hex"
            hide-inputs
            width="100%"
            class="mx-auto"
            elevation="0"
          ></v-color-picker>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialogOpen = false">Cancelar</v-btn>
          <v-btn 
            color="#3159AE" 
            variant="flat" 
            class="dialog-btn px-4"
            @click="saveCalendar"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="2000">
      {{ snackbar.text }}
    </v-snackbar>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useDisplay } from 'vuetify'
import axios from 'axios'
import Swal from 'sweetalert2'

// FullCalendar Imports
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'

const { mobile } = useDisplay()

// API config
const API_BASE = 'http://localhost:3000/api'; 

// Helper to get headers with token
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

const calendars = ref([])
const allEvents = ref([])

const loadingEvents = ref(false)
const submitting = ref(false)
const isLeftOpen = ref(false) 
const showEventPanel = ref(false) 
const submittingEvent = ref(false)
const panelMode = ref('view')

const dialogOpen = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const isEventEditing = ref(false) 
const currentEventId = ref(null)

const calendarForm = reactive({
  title: '',
  color: '#3159AE' 
})

const raw = localStorage.getItem('usuario');
const jsonIndex = raw.indexOf('{');
const jsonString = raw.slice(jsonIndex);
const user = JSON.parse(jsonString);

const eventForm = reactive({
  calendarId: null,
  titulo: '',
  descripcion: '',
  tipo: 'REUNION',
  fecha_inicio: '',
  fecha_fin: '',
  visibilidad: 'INTERNO',
  estado: 'PROGRAMADO',
  responsable: user.id
})
const snackbar = reactive({ show: false, text: '', color: 'error' })

// Open dialog to Create Calendar
function openCreateDialog() {
  isEditing.value = false
  editingId.value = null
  calendarForm.title = ''
  calendarForm.color = '#3159AE'
  dialogOpen.value = true
}

// Open dialog to Edit Calendar
function openEditDialog(cal) {
  isEditing.value = true
  editingId.value = cal.id
  calendarForm.title = cal.title
  calendarForm.color = cal.color
  dialogOpen.value = true
}

const showSnackbar = (text, color) => {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}

// --- Calendar API ---

const fetchCalendarsAndEvents = async () => {
  try {
    const resCal = await axios.get(`${API_BASE}/calendarios/usuario/mis`, { headers: getHeaders() })
    
    calendars.value = resCal.data.map(c => ({
      id: c.id,
      title: c.nombre,
      timezone: c.zona_horaria,
      color: c.color || getRandomColor(), 
      visible: true
    }))

    await fetchAllEvents()

  } catch (error) {
    console.error('Error cargando datos:', error)
    showSnackbar('Error cargando calendarios', 'error')
  }
}

const fetchAllEvents = async () => {
  loadingEvents.value = true
  let accumulated = []

  try {
    const promises = calendars.value.map(async (cal) => {
        try {
            const res = await axios.get(`${API_BASE}/calendarios/usuario/${cal.id}/eventos`, { headers: getHeaders() })
            
            return res.data.map(ev => ({
                id: ev.id,
                title: ev.titulo,
                start: ev.fecha_inicio,
                end: ev.fecha_fin,
                color: cal.color, 
                extendedProps: {
                    calendarId: cal.id, 
                    descripcion: ev.descripcion,
                    tipo: ev.tipo,
                    visibilidad: ev.visibilidad,
                    estado: ev.estado,
                    responsable: ev.responsable
                }
            }))
        } catch (e) {
            console.error(e)
            return []
        }
    })

    const results = await Promise.all(promises)
    results.forEach(events => accumulated.push(...events))
    
    allEvents.value = accumulated;
    
    updateVisibleEvents();

  } catch (err) {
    showSnackbar('Error obteniendo eventos', 'error')
  } finally {
    loadingEvents.value = false
  }
}

watch(calendars, () => {
  updateVisibleEvents();
}, { deep: true });

const updateVisibleEvents = () => {
  const visibleCalendarIds = calendars.value
    .filter(c => c.visible)
    .map(c => c.id);

  const filtered = allEvents.value.filter(ev => {
    return visibleCalendarIds.includes(ev.extendedProps.calendarId);
  });

  calendarOptions.events = filtered;
};

const saveCalendar = async () => {
  if (!calendarForm.title) return
  submitting.value = true

  const payload = {
    nombre: calendarForm.title,
    zona_horaria: "America/La_Paz"
  }

  try {
    if (isEditing.value) {
      await axios.patch(`${API_BASE}/calendarios/usuario/${editingId.value}`, payload, { headers: getHeaders() })
      
      const index = calendars.value.findIndex(c => c.id === editingId.value)
      if (index !== -1) {
        calendars.value[index].title = calendarForm.title
        calendars.value[index].color = calendarForm.color
      }
      showSnackbar('Calendario editado exitosamente', 'success')
      fetchAllEvents()

    } else {
      const response = await axios.post(`${API_BASE}/calendarios/usuario`, payload, { headers: getHeaders() })
      
      const newCal = response.data
      calendars.value.push({
        id: newCal.id || Date.now(),
        title: calendarForm.title,
        color: calendarForm.color,
        visible: true
      })
      showSnackbar('Calendario creado exitosamente.', 'success')
    }
    dialogOpen.value = false
  } catch (error) {
    console.error('Error saving calendar:', error)
    showSnackbar('Error guardando cambios', 'error')
  } finally {
    submitting.value = false
  }
}

// Delete
const deleteCalendar = async (id) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción eliminará el calendario permanentemente.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3159AE', 
    cancelButtonColor: '#d33',     
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    background: '#F1F0EC',         
    customClass: {
      title: 'swal-font-title',    
      popup: 'swal-rounded'
    }
  })

  // If user clicked "Cancel", stop here
  if (!result.isConfirmed) return

  try {
    await axios.delete(`${API_BASE}/calendarios/usuario/${id}`, { headers: getHeaders() })
    calendars.value = calendars.value.filter(c => c.id !== id)
    showSnackbar('Calendario eliminado exitosamente', 'success')

    fetchAllEvents()
  } catch (error) {
    console.error('Error deleting calendar:', error)
    showSnackbar('Error al eliminar calendario', 'error')
  }
}

// --- Event API ---
const handleDateClick = (arg) => {
    isEventEditing.value = false
  currentEventId.value = null
  panelMode.value = 'create'

  eventForm.fecha_inicio = `${arg.dateStr}T09:00`
  eventForm.fecha_fin = `${arg.dateStr}T10:00`
  
  eventForm.titulo = ''
  eventForm.descripcion = ''
  eventForm.tipo = 'REUNION'
  eventForm.visibilidad = 'INTERNO'

  if (calendars.value.length > 0) {
    eventForm.calendarId = calendars.value[0].id
  }

  showEventPanel.value = true
}

function handleEventClick(info) {
  const ev = info.event
  const props = ev.extendedProps

  isEventEditing.value = true
  currentEventId.value = parseInt(ev.id) 
  panelMode.value = 'view'

  // Llenar Formulario
  eventForm.titulo = ev.title
  eventForm.calendarId = props.calendarId
  eventForm.descripcion = props.descripcion
  eventForm.tipo = props.tipo
  eventForm.visibilidad = props.visibilidad
  eventForm.estado = props.estado || 'PROGRAMADO'
  eventForm.responsable = props.responsable
  
  eventForm.fecha_inicio = formatIsoDate(ev.startStr || ev.start)
  eventForm.fecha_fin = formatIsoDate(ev.endStr || ev.end)

  showEventPanel.value = true
}

const switchToEditMode = () => {
  panelMode.value = 'edit'
}

// POST or PATCH event
const saveEvent = async () => {
  // 1. Validation
  if (!eventForm.titulo || !eventForm.calendarId) {
    showSnackbar('El título y el calendario son obligatorios', 'warning')
    return
  }

  submittingEvent.value = true
  
  // 2. Helper to ensure API receives seconds (ISO format)
  // Input: "2025-11-27T09:00" -> Output: "2025-11-27T09:00:00"
  const ensureSeconds = (dateStr) => {
    return dateStr && dateStr.length === 16 ? `${dateStr}:00` : dateStr
  }

  // 3. Prepare Payload
  const payload = {
    titulo: eventForm.titulo,
    descripcion: eventForm.descripcion,
    tipo: eventForm.tipo,
    fecha_inicio: ensureSeconds(eventForm.fecha_inicio),
    fecha_fin: ensureSeconds(eventForm.fecha_fin),
    responsable: eventForm.responsable,
    visibilidad: eventForm.visibilidad,
    estado: eventForm.estado
  }

  try {
    if (isEventEditing.value) {
      // EDIT
      
      await axios.patch(`${API_BASE}/calendarios/usuario/eventos/${currentEventId.value}`, payload, { headers: getHeaders() })
      
      const index = allEvents.value.findIndex(e => e.id === currentEventId.value)
      
      if (index !== -1) {
        const newCal = calendars.value.find(c => c.id === eventForm.calendarId)
        
        allEvents.value[index] = {
          ...allEvents.value[index],
          title: payload.titulo,
          start: payload.fecha_inicio,
          end: payload.fecha_fin,
          color: newCal ? newCal.color : '#3159AE',
          extendedProps: {
            calendarId: eventForm.calendarId,
            descripcion: payload.descripcion,
            tipo: payload.tipo,
            visibilidad: payload.visibilidad,
            estado: payload.estado,
            responsable: payload.responsable
          }
        }
      }
      
      showSnackbar('Evento actualizado', 'success')

    } else {
      // CREATE
      
      const res = await axios.post(`${API_BASE}/calendarios/usuario/${eventForm.calendarId}/eventos`, payload, { headers: getHeaders() })
      
      const selectedCal = calendars.value.find(c => c.id === eventForm.calendarId)
      
      allEvents.value.push({
        id: res.data.id || Date.now(),
        title: payload.titulo,
        start: payload.fecha_inicio,
        end: payload.fecha_fin,
        color: selectedCal ? selectedCal.color : '#3159AE',
        extendedProps: {
            calendarId: eventForm.calendarId,
            descripcion: payload.descripcion,
            tipo: payload.tipo,
            visibilidad: payload.visibilidad,
            estado: 'PROGRAMADO',
            responsable: payload.responsable
        }
      })
      
      showSnackbar('Evento creado', 'success')
    }

    updateVisibleEvents()
    
    showEventPanel.value = false

  } catch (error) {
    console.error('Error saving event:', error)
    showSnackbar('Error al guardar el evento', 'error')
  } finally {
    submittingEvent.value = false
  }
}

// Delete event
const deleteEvent = async () => {
  if (!currentEventId.value) return

  // Diálogo de Confirmación con SweetAlert2
  const result = await Swal.fire({
    title: '¿Eliminar evento?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (!result.isConfirmed) return

  try {
    await axios.delete(`${API_BASE}/calendarios/usuario/eventos/${currentEventId.value}`, { headers: getHeaders() })
    
    calendarOptions.events = calendarOptions.events.filter(e => e.id != currentEventId.value)
    
    showEventPanel.value = false
    showSnackbar('Evento eliminado', 'success')

  } catch (error) {
    console.error(error)
    showSnackbar('No se pudo eliminar el evento', 'error')
  }

  allEvents.value = allEvents.value.filter(e => e.id != currentEventId.value)
  updateVisibleEvents()
}

const closeEventPanel = () => {
  showEventPanel.value = false
}

const formatIsoDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const pad = (n) => n < 10 ? '0' + n : n
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const ensureSeconds = (dateStr) => {
  return dateStr.length === 16 ? `${dateStr}:00` : dateStr
}

const getRandomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16)

// Reactive Calendar Options
const calendarOptions = reactive({
  plugins: [ 
    dayGridPlugin, 
    timeGridPlugin, 
    interactionPlugin 
  ],
  initialView: 'dayGridMonth', // Default view
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  editable: true, // Allows dragging
  selectable: true, // Allows selecting date ranges
  weekends: true,
  locales: [ esLocale ],
  locale: [ 'es' ],
  allDaySlot: false,
  expandRows: true,
  height: '100%',
  
  // Event Handlers
  dateClick: handleDateClick,
  eventClick: handleEventClick,

})

onMounted(() => {
    fetchCalendarsAndEvents()
})
</script>

<script>
import { h } from 'vue'
import { VTextField, VTextarea, VSelect, VBtn, VChip, VIcon } from 'vuetify/components'

const EventForm = ({
  props: {
    form: { type: Object, required: true },
    calendars: { type: Array, default: () => [] },
    isEditing: { type: Boolean, default: false }, // <--- Aquí aseguramos que Vue detecte el cambio
    loading: { type: Boolean, default: false }
  },
  emits: ['submit', 'delete'],
  setup(props, { emit }) {
    // Retornamos la función de renderizado
    return () => {
      const f = props.form

      return h('div', { class: 'd-flex flex-column gap-3' }, [
        // 1. Selector de Calendario
        h(VSelect, {
          modelValue: f.calendarId,
          'onUpdate:modelValue': v => f.calendarId = v,
          items: props.calendars, 
          itemTitle: 'title',
          itemValue: 'id',
          label: 'Calendario',
          variant: 'outlined',
          density: 'compact',
          color: 'primary',
          prependInnerIcon: 'mdi-calendar'
        }),

        // 2. Título
        h(VTextField, { 
          modelValue: f.titulo, 
          'onUpdate:modelValue': v => f.titulo = v,
          label: 'Título del evento', 
          variant: 'outlined', 
          density: 'compact',
          color: 'primary' 
        }),
        
        // 3. Descripción
        h(VTextarea, { 
          modelValue: f.descripcion, 
          'onUpdate:modelValue': v => f.descripcion = v,
          label: 'Descripción', 
          variant: 'outlined', 
          density: 'compact',
          color: 'primary',
          rows: 2
        }),

        // 4. Fechas (Fila)
          h(VTextField, {
            modelValue: f.fecha_inicio,
            'onUpdate:modelValue': v => f.fecha_inicio = v,
            label: 'Inicio',
            type: 'datetime-local',
            variant: 'outlined',
            density: 'compact',
            color: 'primary',
            class: 'flex-grow-1'
          }),
          h(VTextField, {
            modelValue: f.fecha_fin,
            'onUpdate:modelValue': v => f.fecha_fin = v,
            label: 'Fin',
            type: 'datetime-local',
            variant: 'outlined',
            density: 'compact',
            color: 'primary',
            class: 'flex-grow-1'
          }),

        // 5. Tipo y Visibilidad (Fila)
            h(VSelect, {
              modelValue: f.tipo,
              'onUpdate:modelValue': v => f.tipo = v,
              items: ['REUNION', 'CAPACITACION', 'PROYECTO', 'REVISION'],
              label: 'Tipo',
              variant: 'outlined',
              density: 'compact',
              color: 'primary'
            }),

            h(VSelect, {
              modelValue: f.visibilidad,
              'onUpdate:modelValue': v => f.visibilidad = v,
              items: ['PRIVADO', 'INTERNO', 'PUBLICO'],
              label: 'Visibilidad',
              variant: 'outlined',
              density: 'compact',
              color: 'primary'
            }),

        // 6. BOTONES DE ACCIÓN
        h('div', { class: 'd-flex gap-2 mt-2 align-center' }, [
            
            // Botón Principal (Guardar / Crear)
            h(VBtn, {
                color: '#3159AE',
                class: 'text-white flex-grow-1', // Ocupa todo el espacio si está solo
                size: 'large',
                loading: props.loading,
                elevation: 2,
                onClick: () => emit('submit')
            }, () => props.isEditing ? 'Guardar Cambios' : 'Crear Evento'), // <--- Texto dinámico

            // Botón Eliminar (SOLO aparece si isEditing es true)
            props.isEditing ? h(VBtn, {
                color: 'error',
                variant: 'tonal',
                size: 'large',
                icon: 'mdi-delete',
                class: 'ml-2',
                title: 'Eliminar Evento',
                onClick: () => emit('delete')
            }) : null
        ])
      ])
    }
  }
})

const EventDetails = ({
  props: {
    form: { type: Object, required: true }, // Reutilizamos el objeto form que ya tiene los datos
    calendars: { type: Array, default: () => [] }
  },
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    
    // Helper para formatear fechas bonitas (ej: "Jueves, 27 Nov - 09:00")
    const formatDate = (isoString) => {
      if (!isoString) return ''
      const date = new Date(isoString)
      return new Intl.DateTimeFormat('es-ES', { 
        weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
      }).format(date)
    }

    // Obtener info del calendario (nombre y color)
    const calendarInfo = computed(() => {
      return props.calendars.find(c => c.id === props.form.calendarId) || { title: 'Desconocido', color: 'grey' }
    })

    return () => {
      const f = props.form
      
      return h('div', { class: 'd-flex flex-column h-100' }, [
        
        // 1. Contenido Scrolleable
        h('div', { class: 'flex-grow-1' }, [
          
          // Badge del Calendario
          h(VChip, {
            color: calendarInfo.value.color,
            class: 'mb-4 font-weight-bold',
            variant: 'tonal',
            size: 'small'
          }, () => calendarInfo.value.title),

          // Título
          h('h2', { 
            class: 'text-h4 font-weight-bold mb-2',
            style: { fontFamily: 'Funnel Display, sans-serif', color: '#061244', lineHeight: '1.2' }
          }, f.titulo),

          // Fechas
          h('div', { class: 'd-flex align-center text-subtitle-1 mb-6 text-grey-darken-1' }, [
            h(VIcon, { icon: 'mdi-clock-outline', size: 'small', class: 'mr-2' }),
            h('span', `${formatDate(f.fecha_inicio)}`),
            h('span', { class: 'mx-2' }, '→'),
            h('span', `${formatDate(f.fecha_fin)}`)
          ]),

          // Descripción
          f.descripcion ? h('div', { class: 'mb-4' }, [
            h('div', { class: 'text-caption font-weight-bold text-uppercase text-grey mb-1' }, 'Descripción'),
            h('p', { class: 'text-body-1', style: { whiteSpace: 'pre-wrap' } }, f.descripcion)
          ]) : null,

          // Metadata (Tipo y Visibilidad)
          h('div', { class: 'd-flex gap-2 mt-4' }, [
            h(VChip, { size: 'small', variant: 'outlined' }, () => `Tipo: ${f.tipo}`),
            h(VChip, { size: 'small', variant: 'outlined' }, () => `Vis: ${f.visibilidad}`)
          ])
        ]),

        // 2. Botones de Acción (FABs en la parte inferior derecha)
        h('div', { class: 'd-flex justify-end gap-3 mt-4 pt-4' }, [
          // Botón Editar (Lápiz)
          h(VBtn, {
            icon: 'mdi-pencil',
            color: '#3159AE', // Tu color primario
            variant: 'flat',
            size: 'large',
            elevation: 3,
            class: 'text-white ma-2',
            onClick: () => emit('edit')
          }),

          // Botón Eliminar
          h(VBtn, {
            icon: 'mdi-delete',
            color: 'error',
            variant: 'flat',
            size: 'large',
            elevation: 3,
            class: 'ma-2',
            onClick: () => emit('delete')
          })
        ])
      ])
    }
  }
})
</script>

<style>
.calendar-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: var(--bg);
}

.calendar-container {
  margin-top: 120px;
}

.calendar-card {
  color: var(--bg);
}

@media (max-width: 960px) {
    .calendar-wrapper {
        height: 100vh;
    }

    .calendar-container {
    height: 100%; 
    display: flex;
    flex-direction: column;
    padding: 0 !important; 
    }

    .calendar-card {
        height: 85%;
    }

    .fc {
        flex-grow: 1 !important;
        height: 100% !important; 
    }
}

.click-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050; 
  background: rgba(0,0,0,0.05); 
}

/* Full Calendar */

.fc {
  --fc-page-bg-color: var(--bg);
  --fc-neutral-bg-color: var(--surface);
  --fc-list-event-hover-bg-color: var(--surface);
  
  --fc-border-color: #d1d9e6;
  
  font-family: var(--font-roboto);
  color: var(--accent);
}

.fc .fc-toolbar-title {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--accent);
  font-size: 2rem;
  letter-spacing: -0.5px;
  text-transform: capitalize;
}

.fc .fc-button {
  background-color: var(--primary);
  border-color: var(--primary);
  font-family: var(--font-roboto);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 6px; 
  box-shadow: 0 2px 4px rgba(6, 18, 68, 0.2);
  transition: all 0.2s ease;
}

.fc .fc-button:hover {
  background-color: var(--secondary);
  border-color: var(--secondary);
  transform: translateY(-1px);
}

.fc .fc-button:not(:disabled).fc-button-active,
.fc .fc-button:not(:disabled):active {
  background-color: var(--accent);
  border-color: var(--accent);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
}

.fc .fc-icon {
  color: #ffffff; 
  font-size: 1.2em;
}

.fc-col-header-cell-cushion {
  color: var(--secondary);
  font-family: var(--font-display);
  font-weight: 600;
  text-transform: uppercase;
  text-decoration: none; 
  padding-bottom: 10px;
}

.fc-daygrid-day-number {
  color: var(--secondary);
  font-family: var(--font-roboto);
  font-weight: 700;
  text-decoration: none;
}

.fc .fc-day-today {
  background-color: var(--surface) !important;
}

.fc-event {
  cursor: pointer;
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 2px rgba(6, 18, 68, 0.1);
  margin-bottom: 2px;
}

.fc-event-main {
  color: #ffffff; 
  font-family: var(--font-tinos);
  padding: 4px 8px;
  font-size: 0.95rem;
}
.fc-event:hover {
  filter: brightness(0.9); 
}

.fc-timegrid-slot-label-cushion {
  font-family: var(--font-roboto);
  color: var(--primary);
}

@media (max-width: 960px) {
  .fc .fc-header-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-bottom: 1em !important;
    padding: 0 4px;
  }

  .fc .fc-toolbar-chunk {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .fc .fc-toolbar-title {
    font-size: 1.25rem !important; 
    margin: 0 10px !important;
    text-align: center;
    width: 100%; 
    order: -1; 
  }

  .fc .fc-button {
    padding: 4px 8px !important;
    font-size: 0.75rem !important; 
    height: auto !important; 
    line-height: 1.5 !important;
  }

  .fc .fc-button .fc-icon {
    font-size: 1em !important; 
  }
}

@media (max-width: 600px) {
  .fc .fc-toolbar-title {
    font-size: 1.1rem !important;
  }

  .fc-col-header-cell-cushion {
    font-size: 0.75rem; 
    padding-bottom: 2px;
  }
  
  .fc-daygrid-day-number {
    font-size: 0.8rem;
    padding: 2px !important;
  }

  .fc-event-main {
    font-size: 0.75rem !important;
    padding: 2px 4px !important;
  }
}

.custom-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: 100%;
  background: linear-gradient(190deg, var(--surface), var(--bg));
  box-shadow: 4px 0 15px rgba(0,0,0,0.1);
  z-index: 1000;


  transform: translateX(-300px); 
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.custom-sidebar.is-open {
  transform: translateX(0); 
}

.sidebar-content {
    position: relative;
  top: 120px;
  padding: 20px;
  overflow-y: auto;
}

.sidebar-handle {
  position: absolute;
  bottom: 50px; 
  right: -40px; 
  width: 40px;
  height: 50px;
  
  /* Shape: Semi-Circle / Tab */
  background-color: var(--primary); 
  border-radius: 0 25px 25px 0; 
  
  /* Alignment */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 4px 2px 5px rgba(0,0,0,0.15);
  color: white;
}

.sidebar-handle:hover {
  background-color: var(--secondary);
  transition: all 0.2s ease;
}

/* Sidebar Title Font */
.sidebar-title {
  font-family: var(--font-display) !important;
  color: var(--accent);
}

.dialog-btn {
    background-color: var(--secondary) !important;
    font-family: var(--font-display);
}

/* Events panel */

.right-event-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px; /* Wider for form */
  height: 100%;
  background-color: #ffffff;
  box-shadow: -5px 0 20px rgba(0,0,0,0.1);
  z-index: 1100; /* Highest priority */
  
  /* Slide Animation */
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
}

.right-event-panel.is-visible {
  transform: translateX(0);
}

.panel-content {
  overflow-y: auto;
  flex-grow: 1;
}

/* --- MOBILE SHEET HANDLE --- */
.sheet-handle {
  width: 40px;
  height: 5px;
  background-color: #e0e0e0;
  border-radius: 10px;
}

/* SWAL */

.swal-font-title {
  font-family: var(--font-display) !important;
  color: var(--accent) !important; 
}

div:where(.swal2-container) div:where(.swal2-popup) {
  border-radius: 20px !important;
  font-family: var(--font-roboto) !important;
}

div:where(.swal2-container) button:where(.swal2-styled).swal2-confirm {
  background-color: var(--primary) !important; 
  color: #ffffff !important;            
  border-radius: 8px !important;      
  font-family: 'Roboto Flex', sans-serif !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 6px rgba(49, 89, 174, 0.3) !important; 
  padding: 10px 24px !important;
}

div:where(.swal2-container) button:where(.swal2-styled).swal2-cancel {
  background-color: #d32f2f !important; 
  color: #ffffff !important;            
  border-radius: 8px !important;
  font-family: 'Roboto Flex', sans-serif !important;
  font-weight: 500 !important;
}

div:where(.swal2-container) div:where(.swal2-popup) {
  background-color: var(--bg) !important;
  border-radius: 20px !important;
  color: var(--accent) !important;           
}

div:where(.swal2-container) .swal2-title {
  font-family: 'Funnel Display', sans-serif !important;
}

</style>