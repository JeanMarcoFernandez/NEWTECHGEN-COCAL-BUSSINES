<template>
  <div class="resource-wrapper">
    
    <div class="custom-sidebar" :class="{ 'is-open': isLeftOpen }">
      <div class="sidebar-content">
        
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-h6 font-weight-bold sidebar-title text-no-wrap">
            Filtros
          </h2>
        </div>

        <v-list bg-color="transparent">
          
          <div class="text-subtitle-2 mb-2 ml-1 text-primary font-weight-bold">Tipo de Recurso</div>
          <v-chip-group v-model="filters.tipo" column selected-class="text-primary" mandatory>
            <v-chip filter variant="outlined" value="" size="small">Todos</v-chip>
            <v-chip filter variant="outlined" value="SALA_REUNIONES" size="small">Salas</v-chip>
            <v-chip filter variant="outlined" value="VEHICULO" size="small">Vehículos</v-chip>
          </v-chip-group>

          <v-divider class="my-4"></v-divider>

          <div class="text-subtitle-2 mb-2 ml-1 text-primary font-weight-bold">Capacidad Mínima</div>
          <v-slider
            v-model="filters.capacidad"
            color="primary"
            thumb-label
            min="0"
            max="50"
            step="1"
            track-color="surface"
          ></v-slider>

          <v-btn 
            block 
            color="#3159AE" 
            class="mt-4 text-white" 
            prepend-icon="mdi-magnify"
            @click="fetchResources"
            :loading="loading"
          >
            Buscar
          </v-btn>

          <v-list-item class="mt-6 create-new-item" rounded="lg" link @click="openCreatePanel">
            <template v-slot:prepend><v-icon color="#3159AE">mdi-plus-circle</v-icon></template>
            <v-list-item-title class="text-primary font-weight-medium">Nuevo Recurso</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>

      <div class="sidebar-handle" @click="isLeftOpen = !isLeftOpen">
        <v-icon :icon="isLeftOpen ? 'mdi-chevron-left' : 'mdi-filter-variant'"></v-icon>
      </div>
    </div>

    <v-container class="resource-container" :class="{ 'dimmed': showRightPanel }">
      
      <div 
        v-if="showRightPanel" 
        class="click-overlay"
        @click="closeRightPanel"
      ></div>

      <div class="d-flex align-center justify-space-between mb-6 px-2">
        <h1 class="page-title">Gestión de Recursos</h1>
        <v-chip color="secondary" variant="flat">
          {{ resources.length }} Recursos encontrados
        </v-chip>
      </div>

      <v-row>
        <v-col 
          v-for="res in resources" 
          :key="res.id" 
          cols="12" sm="6" md="4" lg="3"
        >
          <v-card class="resource-card d-flex flex-column" elevation="0">
            <div class="card-status-strip" :class="res.en_mantenimiento ? 'bg-error' : 'bg-success'"></div>
            
            <v-card-item>
              <template v-slot:prepend>
                <v-avatar color="surface" size="48" rounded="lg">
                  <v-icon color="primary" size="28">{{ getIconByType(res.tipo) }}</v-icon>
                </v-avatar>
              </template>
              <v-card-title class="resource-name">{{ res.nombre }}</v-card-title>
              <v-card-subtitle class="mt-1 d-flex align-center">
                <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
                {{ res.ubicacion }}
              </v-card-subtitle>
            </v-card-item>

            <v-card-text class="flex-grow-1 pt-2">
              <div class="text-body-2 text-grey-darken-1 mb-3 clamp-text">
                {{ res.descripcion }}
              </div>
              
              <div class="d-flex align-center gap-2 mb-2">
                <v-chip size="x-small" variant="tonal" color="accent">
                  <v-icon start size="small">mdi-account-group</v-icon> {{ res.capacidad }} Pers.
                </v-chip>
                <v-chip size="x-small" variant="tonal" :color="res.visibilidad === 'PUBLICO' ? 'info' : 'warning'">
                  {{ res.visibilidad }}
                </v-chip>
              </div>

              <div class="d-flex align-center mt-3 pt-3 border-t">
                <v-switch
                  v-model="res.en_mantenimiento"
                  color="error"
                  density="compact"
                  hide-details
                  inset
                  @update:modelValue="toggleMaintenance(res)"
                  :loading="res.loadingMaint"
                >
                  <template v-slot:label>
                    <span class="text-caption" :class="res.en_mantenimiento ? 'text-error font-weight-bold' : ''">
                      {{ res.en_mantenimiento ? 'En Mantenimiento' : 'Operativo' }}
                    </span>
                  </template>
                </v-switch>
              </div>
            </v-card-text>

            <v-card-actions class="px-4 pb-4">
              <v-btn 
                variant="outlined" 
                color="secondary" 
                class="flex-grow-1"
                @click="openBookingPanel(res)"
                :disabled="res.en_mantenimiento"
              >
                Reservar
              </v-btn>
              <v-btn 
                icon="mdi-pencil" 
                variant="text" 
                color="accent" 
                size="small"
                @click="openEditPanel(res)"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <div v-if="!loading && resources.length === 0" class="text-center mt-12">
        <v-icon size="64" color="grey-lighten-1">mdi-package-variant-closed</v-icon>
        <h3 class="text-h6 text-grey mt-4">No se encontraron recursos</h3>
      </div>
    </v-container>

    <div class="right-event-panel" :class="{ 'is-visible': showRightPanel }">
      
      <div class="panel-header pa-4 border-b d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold" style="color: #061244; font-family: 'Funnel Display'">
          {{ panelMode === 'booking' ? 'Nueva Reserva' : (isEditing ? 'Editar Recurso' : 'Nuevo Recurso') }}
        </span>
        <v-btn icon="mdi-close" variant="text" @click="closeRightPanel"></v-btn>
      </div>

      <div class="panel-content pa-4">
        
        <div v-if="panelMode === 'booking'" class="d-flex flex-column gap-3">
          <v-alert
            v-if="selectedResource"
            color="primary"
            variant="tonal"
            icon="mdi-information"
            class="mb-4"
            density="compact"
          >
            Reservando: <strong>{{ selectedResource.nombre }}</strong>
            <div class="text-caption">Máx: {{ selectedResource.tiempo_max_reserva }} min</div>
          </v-alert>

          <v-text-field
            v-model="bookingForm.motivo"
            label="Motivo de la reserva"
            variant="outlined"
            density="compact"
            color="primary"
          ></v-text-field>

          <v-text-field
            v-model="bookingForm.fecha_inicio"
            label="Inicio"
            type="datetime-local"
            variant="outlined"
            density="compact"
            color="primary"
          ></v-text-field>

          <v-text-field
            v-model="bookingForm.fecha_fin"
            label="Fin"
            type="datetime-local"
            variant="outlined"
            density="compact"
            color="primary"
          ></v-text-field>

          <v-btn 
            block 
            size="large" 
            color="#3159AE" 
            class="text-white mt-4" 
            :loading="submitting"
            @click="submitBooking"
          >
            Confirmar Reserva
          </v-btn>
        </div>

        <div v-else class="d-flex flex-column gap-3">
          <v-text-field
            v-model="resourceForm.nombre"
            label="Nombre del Recurso"
            variant="outlined"
            density="compact"
            color="primary"
          ></v-text-field>

          <v-select
            v-model="resourceForm.tipo"
            :items="['SALA_REUNIONES', 'EQUIPO', 'VEHICULO', 'ESCRITORIO']"
            label="Tipo"
            variant="outlined"
            density="compact"
            color="primary"
          ></v-select>

          <v-textarea
            v-model="resourceForm.descripcion"
            label="Descripción"
            rows="2"
            variant="outlined"
            density="compact"
            color="primary"
          ></v-textarea>

          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model.number="resourceForm.capacidad"
                label="Capacidad"
                type="number"
                variant="outlined"
                density="compact"
                color="primary"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="resourceForm.tiempo_max_reserva"
                label="Tiempo Máx (min)"
                type="number"
                variant="outlined"
                density="compact"
                color="primary"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-text-field
            v-model="resourceForm.ubicacion"
            label="Ubicación"
            prepend-inner-icon="mdi-map-marker-outline"
            variant="outlined"
            density="compact"
            color="primary"
          ></v-text-field>

          <v-select
            v-model="resourceForm.visibilidad"
            :items="['INTERNO', 'PUBLICO', 'PRIVADO']"
            label="Visibilidad"
            variant="outlined"
            density="compact"
            color="primary"
          ></v-select>

          <v-select
            v-model.number="resourceForm.id_departamento"
            :items="departmentOptions"
            item-title="name"
            item-value="id"
            label="Departamento"
            variant="outlined"
            density="compact"
            color="primary"
          ></v-select>

          <v-btn 
            block 
            size="large" 
            color="#3159AE" 
            class="text-white mt-4" 
            :loading="submitting"
            @click="submitResource"
          >
            {{ isEditing ? 'Guardar Cambios' : 'Crear Recurso' }}
          </v-btn>
        </div>

      </div>
    </div>
    
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

// API Config
const API_BASE = 'http://localhost:3000/api'; 
const getHeaders = () => {
  let token = localStorage.getItem('token'); // 1. Intenta buscarlo directo

  // 2. Si no está directo, búscalo dentro del objeto 'usuario' (tu lógica anterior)
  if (!token) {
    const raw = localStorage.getItem('usuario');
    if (raw) {
      try {
        // Tu lógica de limpieza de JSON del componente anterior
        const jsonIndex = raw.indexOf('{');
        const jsonString = jsonIndex !== -1 ? raw.slice(jsonIndex) : raw;
        const userObj = JSON.parse(jsonString);
        
        // Asignamos el token si existe dentro del objeto usuario
        // Verifica si en tu backend se llama 'token', 'access_token' o similar
        token = userObj.token || userObj.access_token; 
      } catch (e) {
        console.error("Error al extraer token del usuario:", e);
      }
    }
  }

  // DEBUG: Abre la consola (F12) para ver si esto imprime el token o "null"
  console.log('Token enviado:', token); 

  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Estado UI
const isLeftOpen = ref(false)
const showRightPanel = ref(false)
const panelMode = ref('resource') // 'resource' (create/edit) or 'booking'
const isEditing = ref(false)
const loading = ref(false)
const submitting = ref(false)
const snackbar = reactive({ show: false, text: '', color: 'success' })

// Datos
const resources = ref([])
const selectedResource = ref(null)

// Filtros
const filters = reactive({
  tipo: '',
  capacidad: 0,
  id_departamento: null
})

// Opciones Simuladas (en app real vendrían de otra API)
const departmentOptions = [
  { id: 1, name: 'Tecnología' },
  { id: 2, name: 'RRHH' },
  { id: 3, name: 'Ventas' },
  { id: 4, name: 'Gerencia' }
]

// Formularios
const resourceForm = reactive({
  id: null,
  nombre: '',
  descripcion: '',
  tipo: 'SALA_REUNIONES',
  ubicacion: '',
  capacidad: 4,
  visibilidad: 'INTERNO',
  tiempo_max_reserva: 60,
  id_departamento: 1,
  id_empresa: 1
})

const bookingForm = reactive({
  id_recurso: null,
  motivo: '',
  fecha_inicio: '',
  fecha_fin: ''
})

// --- API ACTIONS ---

// 1. Obtener Recursos
const fetchResources = async () => {
  loading.value = true
  try {
    const params = {}
    if (filters.tipo) params.tipo = filters.tipo
    if (filters.capacidad > 0) params.capacidad_minima = filters.capacidad // Asumiendo que el back soporta esto, si no filtrar en front
    // params.id_departamento = ...
    
    const res = await axios.get(`${API_BASE}/recursos`, { params, headers: getHeaders() })
    resources.value = res.data.map(r => ({ ...r, loadingMaint: false }))
  } catch (error) {
    showSnackbar('Error al cargar recursos', 'error')
  } finally {
    loading.value = false
  }
}

// 2. Crear / Editar Recurso
const submitResource = async () => {
  if(!resourceForm.nombre || !resourceForm.ubicacion) {
    showSnackbar('Completa los campos obligatorios', 'warning')
    return
  }
  submitting.value = true
  
  try {
    if (isEditing.value) {
      // Nota: El Swagger no mostraba PUT /recursos/{id} completo, asumo existencia o uso PATCH
      // Si no existe, mostrar error. Aquí simulamos actualización o usamos create logic
       showSnackbar('Endpoint de edición completa no especificado en swagger (Solo mantenimiento)', 'warning')
    } else {
      await axios.post(`${API_BASE}/recursos`, resourceForm, { headers: getHeaders() })
      showSnackbar('Recurso creado exitosamente', 'success')
    }
    closeRightPanel()
    fetchResources()
  } catch (error) {
    console.error(error)
    showSnackbar('Error al guardar recurso', 'error')
  } finally {
    submitting.value = false
  }
}

// 3. Cambiar Mantenimiento
const toggleMaintenance = async (item) => {
  item.loadingMaint = true
  // El valor ya cambió visualmente por el v-switch, enviamos el nuevo estado
  try {
    await axios.put(`${API_BASE}/recursos/${item.id}/mantenimiento`, 
      { en_mantenimiento: item.en_mantenimiento }, 
      { headers: getHeaders() }
    )
    showSnackbar(`Estado actualizado: ${item.en_mantenimiento ? 'En mantenimiento' : 'Disponible'}`, 'success')
  } catch (error) {
    item.en_mantenimiento = !item.en_mantenimiento // Revertir visualmente
    showSnackbar('Error al cambiar estado de mantenimiento', 'error')
  } finally {
    item.loadingMaint = false
  }
}

// 4. Crear Reserva
const submitBooking = async () => {
  if(!bookingForm.fecha_inicio || !bookingForm.fecha_fin || !bookingForm.motivo) {
    showSnackbar('Todos los campos son obligatorios', 'warning')
    return
  }
  submitting.value = true

  // Formatear fechas a ISO string con Z o timezone local según requiera tu backend
  const payload = {
    id_recurso: selectedResource.value.id,
    motivo: bookingForm.motivo,
    fecha_inicio: new Date(bookingForm.fecha_inicio).toISOString(),
    fecha_fin: new Date(bookingForm.fecha_fin).toISOString()
  }

  try {
    await axios.post(`${API_BASE}/reservas-recursos`, payload, { headers: getHeaders() })
    
    await Swal.fire({
      icon: 'success',
      title: '¡Reserva Creada!',
      text: 'Tu solicitud está pendiente de aprobación (si aplica).',
      confirmButtonColor: '#3159AE'
    })
    
    closeRightPanel()
  } catch (error) {
    if (error.response && error.response.status === 409) {
        showSnackbar('Conflicto: El recurso ya está ocupado en ese horario', 'error')
    } else {
        showSnackbar('Error al crear la reserva', 'error')
    }
  } finally {
    submitting.value = false
  }
}

// --- UI HELPERS ---

const openCreatePanel = () => {
  panelMode.value = 'resource'
  isEditing.value = false
  resetResourceForm()
  showRightPanel.value = true
}

const openEditPanel = (res) => {
  panelMode.value = 'resource'
  isEditing.value = true
  Object.assign(resourceForm, res)
  showRightPanel.value = true
}

const openBookingPanel = (res) => {
  panelMode.value = 'booking'
  selectedResource.value = res
  
  // Prellenar fechas sugeridas (ej. ahora + 15 min)
  const now = new Date()
  now.setMinutes(now.getMinutes() + 15)
  const end = new Date(now)
  end.setHours(end.getHours() + 1)
  
  bookingForm.fecha_inicio = formatDateTimeLocal(now)
  bookingForm.fecha_fin = formatDateTimeLocal(end)
  bookingForm.motivo = ''
  
  showRightPanel.value = true
}

const closeRightPanel = () => {
  showRightPanel.value = false
}

const resetResourceForm = () => {
  Object.assign(resourceForm, {
    id: null, nombre: '', descripcion: '', tipo: 'SALA_REUNIONES',
    ubicacion: '', capacidad: 4, visibilidad: 'INTERNO',
    tiempo_max_reserva: 60, en_mantenimiento: false
  })
}

const showSnackbar = (text, color) => {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}

const getIconByType = (type) => {
  switch(type) {
    case 'SALA_REUNIONES': return 'mdi-google-classroom';
    case 'VEHICULO': return 'mdi-car-side';
    case 'EQUIPO': return 'mdi-laptop';
    default: return 'mdi-cube-outline';
  }
}

const formatDateTimeLocal = (date) => {
  const pad = (num) => num.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

onMounted(() => {
  fetchResources()
})
</script>

<style scoped>
.resource-wrapper {
  position: relative;
  width: 100%;
  overflow-x: hidden;
  background-color: var(--bg);
  min-height: 100vh;
}

.resource-container {
  margin-top: 120px; /* Espacio para navbar si existe */
  padding-left: 20px;
  padding-right: 20px;
  transition: opacity 0.3s ease;
}
.resource-container.dimmed {
  opacity: 0.5;
  pointer-events: none;
}

/* Títulos */
.page-title {
  font-family: var(--font-display);
  color: var(--accent);
  font-size: 2.5rem;
  font-weight: 700;
}

.resource-name {
  font-family: var(--font-tinos);
  font-weight: 700;
  color: var(--secondary);
  font-size: 1.2rem;
  white-space: normal; /* Permitir wrap */
  line-height: 1.2;
}

/* Cards */
.resource-card {
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.resource-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(49, 89, 174, 0.15);
}

.card-status-strip {
  height: 4px;
  width: 100%;
}

.clamp-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}

/* Sidebar & Panel re-usando estilos del padre para consistencia */
.custom-sidebar {
  /* Mismos estilos que el calendario */
  background: linear-gradient(190deg, var(--surface), var(--bg));
  /* ... resto en style global o scoped ... */
}

/* Ajustes específicos para Vuetify dentro del componente */
:deep(.v-chip__content) {
  font-family: var(--font-roboto);
  font-weight: 600;
}

:deep(.v-label) {
  font-family: var(--font-roboto);
}
</style>