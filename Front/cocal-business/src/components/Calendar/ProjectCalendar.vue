<template>
  <div class="calendar-wrapper d-flex flex-column fill-height w-100 bg-light-beige">
    
    <!-- 1. TOP INFO CARD (Replaces Left Sidebar) -->
    <div class="px-6 pt-6 pb-2 flex-shrink-0">
      <v-card class="rounded-xl pa-4 d-flex flex-wrap align-center justify-space-between" elevation="0" border>
        
        <!-- Project Details -->
        <div class="d-flex align-center gap-4 mr-4">
          <v-avatar color="#E7ECF3" size="56" class="rounded-lg">
            <v-icon color="#3159AE" size="32">mdi-rocket-launch</v-icon>
          </v-avatar>
          
          <div>
            <div class="d-flex align-center gap-2 mb-1">
              <h1 class="text-h6 font-weight-bold text-navy ma-1" style="font-family: 'Funnel Display', sans-serif;">
                {{ projectInfo.nombre || 'Cargando Proyecto...' }}
              </h1>
              <v-chip 
                v-if="projectInfo.visibilidad"
                size="x-small" 
                :color="projectInfo.visibilidad === 'INTERNO' ? 'blue-lighten-4' : 'green-lighten-4'" 
                class="font-weight-bold text-navy" 
                variant="flat"
              >
                {{ projectInfo.visibilidad }}
              </v-chip>
            </div>
            <p class="text-body-2 text-grey-darken-1 ma-1 text-truncate" style="max-width: 600px;">
              {{ projectInfo.descripcion }}
            </p>
          </div>
        </div>

        <!-- Meta / Actions -->
        <div class="d-flex align-center gap-4 mt-4 mt-md-0">
           <div class="text-end hidden-sm-and-down">
              <div class="text-caption text-grey">Fechas del Proyecto</div>
              <div class="font-weight-medium text-navy">
                {{ formatDate(projectInfo.fecha_inicio) }} — {{ formatDate(projectInfo.fecha_fin) }}
              </div>
           </div>
           
           <v-divider vertical class="mx-2 hidden-sm-and-down" style="height: 40px"></v-divider>

           <v-btn 
             variant="text" 
             color="grey-darken-2" 
             prepend-icon="mdi-arrow-left"
             @click="$router.go(-1)"
           >
             Volver
           </v-btn>
        </div>

      </v-card>
    </div>

    <!-- 2. MAIN CALENDAR AREA -->
    <div class="flex-grow-1 px-6 pb-6 pt-2" style="overflow: hidden;">
      <v-card class="fill-height rounded-xl pa-3 shadow-sm" style="overflow: hidden;">
        <!-- Click Overlay for closing panels -->
        <div 
          v-if="showEventPanel && !mobile" 
          class="click-overlay"
          @click="showEventPanel = false"
        ></div>

        <FullCalendar :options="calendarOptions" class="fill-height" />
      </v-card>
    </div>

    <!-- 3. RIGHT PANEL (Event Form) -->
    <div 
      v-if="!mobile"
      class="right-panel-container border-s" 
      :class="{ 'collapsed': !showEventPanel }"
    >
      <div class="right-content h-100 d-flex flex-column">
        <!-- Header -->
        <div class="panel-header pa-4 border-b d-flex justify-space-between align-center">
          <span class="text-h6 font-weight-bold text-navy" style="font-family: 'Funnel Display'">
            <span v-if="panelMode === 'create'">Nuevo Evento</span>
            <span v-else-if="panelMode === 'edit'">Editar Evento</span>
            <span v-else>Detalles</span>
          </span>
          <v-btn icon="mdi-close" variant="text" density="compact" @click="showEventPanel = false"></v-btn>
        </div>

        <!-- Content -->
        <div class="panel-content pa-4 flex-grow-1" style="overflow-y: auto;">
          <EventDetails
            v-if="panelMode === 'view'"
            :form="eventForm"
            @edit="switchToEditMode"
            @delete="deleteEvent"
          />
          <EventForm 
            v-else
            :form="eventForm" 
            :is-editing="panelMode === 'edit'"
            :loading="submittingEvent"
            @submit="saveEvent" 
            @delete="deleteEvent" 
          />
        </div>
      </div>
    </div>

    <!-- 4. MOBILE BOTTOM SHEET -->
    <v-bottom-sheet v-if="mobile" v-model="showEventPanel" inset>
       <v-card class="rounded-t-xl" style="max-height: 85vh; display: flex; flex-direction: column;">
          <div class="pa-4 border-b d-flex justify-space-between align-center bg-grey-lighten-5">
            <span class="text-h6 font-weight-bold text-navy">
               {{ panelMode === 'create' ? 'Nuevo Evento' : (panelMode === 'edit' ? 'Editar' : 'Detalles') }}
            </span>
            <v-btn icon="mdi-close" variant="text" density="compact" @click="showEventPanel = false"></v-btn>
          </div>
          <div class="pa-4 overflow-y-auto">
             <EventDetails v-if="panelMode === 'view'" :form="eventForm" @edit="switchToEditMode" @delete="deleteEvent" />
             <EventForm v-else :form="eventForm" :is-editing="panelMode === 'edit'" :loading="submittingEvent" @submit="saveEvent" @delete="deleteEvent" />
          </div>
       </v-card>
    </v-bottom-sheet>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
        {{ snackbar.text }}
    </v-snackbar>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineComponent, h } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import axios from 'axios'
import Swal from 'sweetalert2'
import { VTextField, VTextarea, VSelect, VBtn, VChip, VIcon } from 'vuetify/components'

// FullCalendar Imports
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'

const route = useRoute()
const { mobile } = useDisplay()
const API_BASE = 'http://localhost:3000/api'
const projectId = route.params.id

// --- STATE ---
const projectInfo = ref({})
const calendarId = ref(null) // ID of the specific calendar for this project
const loading = ref(false)
const showEventPanel = ref(false)
const panelMode = ref('view')
const submittingEvent = ref(false)
const snackbar = reactive({ show: false, text: '', color: 'success' })

const eventForm = reactive({
  id: null,
  titulo: '',
  descripcion: '',
  tipo: 'REUNION',
  fecha_inicio: '',
  fecha_fin: '',
  visibilidad: 'PRIVADO',
  estado: 'PROGRAMADO',
  responsable: 0 
})

// --- AUTH HEADER ---
const getHeaders = () => {
  const token = localStorage.getItem('token')
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
}

// --- 1. INITIALIZATION LOGIC ---
onMounted(async () => {
  loading.value = true
  await fetchProjectDetails()
  if (projectInfo.value.id) {
      await ensureProjectCalendar() // Checks if exists, or creates it
  }
  loading.value = false
})

// Get Project Info
const fetchProjectDetails = async () => {
  try {
    const res = await axios.get(`${API_BASE}/proyectos/${projectId}`, { headers: getHeaders() })
    projectInfo.value = res.data
  } catch (error) {
    console.error("Error fetching project:", error)
    showSnackbar('Error cargando información del proyecto', 'error')
  }
}

// Check/Create Calendar
const ensureProjectCalendar = async () => {
  try {
    // A. Check if exists
    const res = await axios.get(`${API_BASE}/calendarios/departamento/proyecto/${projectId}`, { headers: getHeaders() })
    
    if (res.data && res.data.length > 0) {
      // Found existing calendar
      calendarId.value = res.data[0].id
      await fetchEvents()
    } else {
      // B. Create new calendar
      console.log("No calendar found. Creating one...")
      const payload = {
        id_proyecto: parseInt(projectId),
        id_departamento: projectInfo.value.id_departamento,
        nombre: projectInfo.value.nombre, // Same name as project
        descripcion: "",
        zona_horaria: "America/La_Paz"
      }
      
      const createRes = await axios.post(`${API_BASE}/calendarios/departamento`, payload, { headers: getHeaders() })
      
      // Depending on API response structure, grab ID. Assuming returns object with ID.
      // If backend returns just created object:
      if (createRes.data && createRes.data.id) {
          calendarId.value = createRes.data.id
          await fetchEvents() // It will be empty, but good to init
      } else {
          // If backend returns list or something else, handle accordingly.
          // Fallback: fetch list again
          const retryRes = await axios.get(`${API_BASE}/calendarios/departamento/proyecto/${projectId}`, { headers: getHeaders() })
          if(retryRes.data[0]) calendarId.value = retryRes.data[0].id
      }
    }
  } catch (error) {
    console.error("Error initializing calendar:", error)
    showSnackbar('Error inicializando el calendario del proyecto', 'error')
  }
}

// Fetch Events
const fetchEvents = async () => {
  if (!calendarId.value) return

  try {
    const res = await axios.get(`${API_BASE}/calendarios/departamento/${calendarId.value}/eventos`, { headers: getHeaders() })
    
    // Map API events to FullCalendar
    calendarOptions.events = res.data.map(ev => ({
        id: ev.id,
        title: ev.titulo,
        start: ev.fecha_inicio,
        end: ev.fecha_fin,
        color: '#3159AE', // Standard project color
        extendedProps: {
            descripcion: ev.descripcion,
            tipo: ev.tipo,
            visibilidad: ev.visibilidad,
            estado: ev.estado,
            responsable: ev.responsable
        }
    }))
  } catch (error) {
    console.error(error)
    showSnackbar('Error cargando eventos', 'error')
  }
}

// --- 2. EVENT ACTIONS (CRUD) ---

const saveEvent = async () => {
    if (!eventForm.titulo) return
    submittingEvent.value = true

    const payload = {
        titulo: eventForm.titulo,
        descripcion: eventForm.descripcion,
        tipo: eventForm.tipo,
        fecha_inicio: ensureISO(eventForm.fecha_inicio),
        fecha_fin: ensureISO(eventForm.fecha_fin),
        responsable: eventForm.responsable || 0, // Default 0
        estado: eventForm.estado,
        visibilidad: eventForm.visibilidad
    }

    try {
        if (panelMode.value === 'edit') {
            // PATCH Modify
            await axios.patch(`${API_BASE}/calendarios/departamento/eventos/${eventForm.id}`, payload, { headers: getHeaders() })
            showSnackbar('Evento actualizado', 'success')
        } else {
            // POST Create
            await axios.post(`${API_BASE}/calendarios/departamento/${calendarId.value}/eventos`, payload, { headers: getHeaders() })
            showSnackbar('Evento creado', 'success')
        }
        
        await fetchEvents() // Refresh calendar
        showEventPanel.value = false

    } catch (error) {
        console.error(error)
        showSnackbar('Error al guardar el evento', 'error')
    } finally {
        submittingEvent.value = false
    }
}

const deleteEvent = async () => {
    const confirm = await Swal.fire({
        title: '¿Eliminar evento?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Eliminar'
    })

    if (!confirm.isConfirmed) return

    try {
        await axios.delete(`${API_BASE}/calendarios/departamento/eventos/${eventForm.id}`, { headers: getHeaders() })
        await fetchEvents()
        showEventPanel.value = false
        showSnackbar('Evento eliminado', 'success')
    } catch (error) {
        showSnackbar('Error al eliminar evento', 'error')
    }
}

// --- UTILS ---
const handleDateClick = (arg) => {
  panelMode.value = 'create'
  resetForm()
  // Set defaults from click
  eventForm.fecha_inicio = `${arg.dateStr}T09:00`
  eventForm.fecha_fin = `${arg.dateStr}T10:00`
  showEventPanel.value = true
}

const handleEventClick = (info) => {
  const ev = info.event
  const p = ev.extendedProps
  
  panelMode.value = 'view'
  eventForm.id = ev.id
  eventForm.titulo = ev.title
  eventForm.descripcion = p.descripcion
  eventForm.tipo = p.tipo
  eventForm.visibilidad = p.visibilidad
  eventForm.estado = p.estado
  eventForm.responsable = p.responsable
  
  // Format dates for input (remove Z and seconds if needed for datetime-local, but API wants ISO)
  // For datetime-local input we need YYYY-MM-DDTHH:mm
  eventForm.fecha_inicio = ev.startStr.slice(0, 16)
  eventForm.fecha_fin = ev.endStr ? ev.endStr.slice(0, 16) : ''
  
  showEventPanel.value = true
}

const switchToEditMode = () => panelMode.value = 'edit'

const resetForm = () => {
    Object.assign(eventForm, { id: null, titulo: '', descripcion: '', tipo: 'REUNION', visibilidad: 'PRIVADO', estado: 'PROGRAMADO' })
}

const ensureISO = (dateStr) => {
    // If input is YYYY-MM-DDTHH:mm, append seconds and Z or timezone
    // The API input example shows full ISO: 2025-12-05T21:25:52.652Z
    if (!dateStr) return new Date().toISOString()
    if (dateStr.length === 16) return new Date(dateStr).toISOString()
    return new Date(dateStr).toISOString()
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '-'
const showSnackbar = (text, color) => { snackbar.text = text; snackbar.color = color; snackbar.show = true }

// --- CALENDAR OPTIONS ---
const calendarOptions = reactive({
  plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
  locale: esLocale,
  initialView: 'dayGridMonth',
  headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' },
  height: '100%',
  allDaySlot: false,
  expandRows: true,
  selectable: true,
  dateClick: handleDateClick,
  eventClick: handleEventClick,
  events: []
})

// --- SUB-COMPONENTS (Reusing logic) ---

const EventDetails = defineComponent({
  props: ['form'],
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    return () => h('div', { class: 'd-flex flex-column h-100' }, [
        h('div', { class: 'flex-grow-1' }, [
            h(VChip, { color: '#3159AE', variant: 'tonal', size: 'small', class: 'mb-4 font-weight-bold' }, () => props.form.tipo),
            h('h2', { class: 'text-h5 font-weight-bold text-navy mb-2' }, props.form.titulo),
            h('div', { class: 'text-body-2 text-grey mb-4' }, [
                h(VIcon, { size: 'small', class: 'mr-2' }, () => 'mdi-clock-outline'),
                `${new Date(props.form.fecha_inicio).toLocaleString()} - ${new Date(props.form.fecha_fin).toLocaleTimeString()}`
            ]),
            h('p', { class: 'text-body-1' }, props.form.descripcion)
        ]),
        h('div', { class: 'd-flex justify-end gap-3 mt-4 pt-4 border-t' }, [
            h(VBtn, { icon: 'mdi-delete', color: 'error', variant: 'flat', onClick: () => emit('delete') }),
            h(VBtn, { icon: 'mdi-pencil', color: '#3159AE', class: 'text-white', variant: 'flat', onClick: () => emit('edit') })
        ])
    ])
  }
})

const EventForm = defineComponent({
  props: ['form', 'loading', 'isEditing'],
  emits: ['submit', 'delete'],
  setup(props, { emit }) {
    return () => h('div', { class: 'd-flex flex-column gap-3' }, [
        h(VTextField, { modelValue: props.form.titulo, 'onUpdate:modelValue': v => props.form.titulo = v, label: 'Título', variant: 'outlined', density: 'compact' }),
        h(VSelect, { modelValue: props.form.tipo, 'onUpdate:modelValue': v => props.form.tipo = v, items: ['REUNION', 'ENTREGA', 'HITO', 'OTRO'], label: 'Tipo', variant: 'outlined', density: 'compact' }),
        h('div', { class: 'd-flex gap-2' }, [
            h(VTextField, { modelValue: props.form.fecha_inicio, 'onUpdate:modelValue': v => props.form.fecha_inicio = v, label: 'Inicio', type: 'datetime-local', variant: 'outlined', density: 'compact' }),
            h(VTextField, { modelValue: props.form.fecha_fin, 'onUpdate:modelValue': v => props.form.fecha_fin = v, label: 'Fin', type: 'datetime-local', variant: 'outlined', density: 'compact' })
        ]),
        h(VTextarea, { modelValue: props.form.descripcion, 'onUpdate:modelValue': v => props.form.descripcion = v, label: 'Descripción', variant: 'outlined', rows: 3 }),
        h(VSelect, { modelValue: props.form.visibilidad, 'onUpdate:modelValue': v => props.form.visibilidad = v, items: ['PRIVADO', 'PUBLICO', 'INTERNO'], label: 'Visibilidad', variant: 'outlined', density: 'compact' }),
        
        h(VBtn, { color: '#3159AE', class: 'text-white mt-2', block: true, loading: props.loading, onClick: () => emit('submit') }, () => props.isEditing ? 'Guardar Cambios' : 'Crear Evento'),
        props.isEditing ? h(VBtn, { color: 'error', variant: 'text', block: true, onClick: () => emit('delete') }, () => 'Eliminar Evento') : null
    ])
  }
})
</script>

<style scoped>
.bg-light-beige { background-color: #F1F0EC; }
.text-navy { color: #061244 !important; }
.click-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.05); z-index: 1050; }
.right-panel-container {
  position: fixed; top: 0; right: 0; width: 400px; height: 100%;
  background-color: #fff; z-index: 1100; transition: transform 0.3s;
  box-shadow: -5px 0 20px rgba(0,0,0,0.1);
}
.right-panel-container.collapsed { transform: translateX(100%); }
</style>