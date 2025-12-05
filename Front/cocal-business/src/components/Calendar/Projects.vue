<template>
  <v-container style="background-color: white; border-radius: 20px; margin-bottom: 15px;">
    <div class="project-wrapper animate__animated animate__fadeIn">

      <!-- HEADER -->
       <div class="dashboard-header d-flex align-center px-6 py-4 bg-white border-b">
        <v-btn 
          variant="tonal" 
          color="grey-darken-3" 
          prepend-icon="mdi-arrow-left" 
          class="mr-6 font-weight-medium"
          @click="goBack"
        >
          Volver al listado
        </v-btn>
        
        <v-divider vertical class="mr-6 my-1"></v-divider>

        <div>
            <h2 class="text-h5 font-weight-bold text-navy">
            Proyectos
            </h2>
            <p class="text-subtitle-2 text-grey">
            Gestionando proyectos de: <span class="font-weight-bold text-primary">{{ departmentName || 'Cargando...' }}</span>
            </p>
        </div>   

        <div class="ml-auto">
          <v-btn 
            variant="outlined" 
            color="primary"
            icon="mdi-refresh"
            @click="fetchProjects"
            :loading="loading"
            :disabled="loading"
          ></v-btn>
        </div>     
      </div>

      <!-- SEARCH & ACTIONS -->
      <div class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between mb-6 gap-3 pt-4">
        <v-row class="w-100">
            <v-col cols="12" md="9">
                <v-text-field
                  v-model="searchTerm"
                  placeholder="Buscar proyecto..."
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-magnify"
                  hide-details
                  bg-color="white"
                  class="flex-grow-1"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="3" class="d-flex justify-end">
                <v-btn 
                    color="#3159AE" 
                    class="text-white text-none elevation-2" 
                    prepend-icon="mdi-folder-plus"
                    size="large"
                    @click="openCreateForm"
                    block
                >
                Nuevo proyecto
                </v-btn>
            </v-col>
        </v-row>
      </div>

      <!-- STATES -->
      <div v-if="loading" class="d-flex justify-center mt-12">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </div>

      <div v-else-if="filteredProjects.length === 0" class="text-center mt-12 pa-6 border-dashed rounded-lg">
        <v-icon size="60" color="grey-lighten-2" class="mb-3">mdi-folder-remove-outline</v-icon>
        <h3 class="text-body-1 text-grey font-weight-medium">
          {{ searchTerm ? 'No hay resultados para tu búsqueda' : 'No hay proyectos registrados en este departamento' }}
        </h3>
      </div>

      <!-- GRID -->
      <v-row v-else>
        <v-col 
          v-for="proj in filteredProjects" 
          :key="proj.id" 
          cols="12" sm="6" lg="4"
        >
          <v-card class="project-card h-100 d-flex flex-column" elevation="0">
            <div class="card-header-bg-proj"></div>
            
            <v-card-item class="pt-8">
              <div class="d-flex align-start justify-space-between">
                <v-chip size="x-small" :color="proj.visibilidad === 'INTERNO' ? 'blue-lighten-4' : 'green-lighten-4'" class="text-navy font-weight-bold" variant="flat">
                    {{ proj.visibilidad }}
                </v-chip>
                
                <!-- EDIT PENCIL ICON -->
                <v-btn 
                    icon="mdi-pencil" 
                    variant="text" 
                    density="compact" 
                    color="grey-darken-1"
                    size="small"
                    @click.stop="openEditForm(proj)"
                ></v-btn>
              </div>

              <v-card-title class="text-h6 font-weight-bold mt-3 text-navy" style="white-space: normal;word-wrap: break-word;">
                {{ proj.nombre }}
              </v-card-title>
            </v-card-item>

            <v-card-text class="flex-grow-1 pt-2">
              <p class="text-body-2 text-grey-darken-1 line-clamp-3">
                {{ proj.descripcion || 'Sin descripción detallada.' }}
              </p>
            </v-card-text>

            <v-divider></v-divider>
            
            <!-- ACTION BUTTONS -->
            <v-card-actions class="pa-2 bg-grey-lighten-5 d-flex align-center gap-2 ml-auto">
                <div class="pa-1 bg-grey-lighten-5 text-caption text-grey text-start pl-3 pb-2 d-flex align-start">
                  <v-icon size="x-small" class="mr-1">mdi-calendar-range</v-icon>
                  {{ formatDate(proj.fecha_inicio) }} - {{ formatDate(proj.fecha_fin) }}
                </div>
                <!-- 2. CIRCULAR CALENDAR -->
                <v-tooltip location="top" text="Ver Calendario del Departamento">
                    <template v-slot:activator="{ props }">
                    <v-btn 
                        v-bind="props"
                        icon 
                        variant="tonal" 
                        color="#3159AE"
                        class="rounded-circle"
                        @click.stop="goToCalendar(proj.id)"
                    >
                        <v-icon>mdi-calendar-month</v-icon>
                    </v-btn>
                    </template>
                </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- DRAWER / SHEET -->
      <template v-if="showForm">
          <!-- MOBILE -->
          <v-bottom-sheet v-if="mobile && showForm" v-model="showForm" inset>
              <v-card class="rounded-t-xl" style="max-height: 90vh; display: flex; flex-direction: column;">
                  <div class="pa-4 border-b d-flex justify-space-between align-center bg-grey-lighten-5">
                      <span class="text-h6 font-weight-bold text-navy">
                          {{ isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto' }}
                      </span>
                      <v-btn icon="mdi-close" variant="text" density="compact" @click="showForm = false"></v-btn>
                  </div>
                  <div class="pa-4 overflow-y-auto">
                      <ProjectFormContent 
                        :form="form" 
                        :loading="submitting" 
                        :is-editing="isEditing"
                        @submit="submitForm" 
                        @delete="confirmDelete"
                        @cancel="showForm = false" 
                      />
                  </div>
              </v-card>
          </v-bottom-sheet>

          <!-- DESKTOP -->
          <template v-else>
              <div class="click-overlay" @click="showForm = false"></div>

              <div class="custom-right-drawer elevation-5" :class="{ 'is-open': showForm }">
                  <div class="pa-4 border-b d-flex align-center justify-space-between bg-grey-lighten-5 panel-content">
                      <div>
                          <span class="text-h6 font-weight-bold text-navy">
                              {{ isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto' }}
                          </span>
                          <div class="text-caption text-grey">
                              {{ isEditing ? 'Modifica los datos del proyecto' : `Registra un nuevo proyecto para ${departmentName}` }}
                          </div>
                      </div>
                  </div>
                  
                  <div class="pa-5 h-100 d-flex flex-column" style="overflow-y: auto;">
                      <ProjectFormContent 
                          :form="form" 
                          :loading="submitting" 
                          :is-editing="isEditing"
                          @submit="submitForm" 
                          @delete="confirmDelete"
                          @cancel="showForm = false" 
                      />
                  </div>
              </div>
          </template>
      </template>

      <v-snackbar v-model="snackbar.show" :color="snackbar.color">
        {{ snackbar.text }}
      </v-snackbar>

    </div>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, computed, defineComponent, h, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import axios from 'axios'
import Swal from 'sweetalert2' 
import { VTextField, VTextarea, VSelect, VBtn } from 'vuetify/components'

const props = defineProps({
  departmentId: { type: [Number, String], required: true },
  departmentName: { type: String, default: 'el Departamento' }
})

const { mobile } = useDisplay()
const API_BASE = 'http://localhost:3000/api'
const router = useRouter()

// --- STATE ---
const projects = ref([])
const loading = ref(false)
const submitting = ref(false)
const showForm = ref(false)
const isEditing = ref(false)
const searchTerm = ref('')
const snackbar = reactive({ show: false, text: '', color: 'success' })

const raw = localStorage.getItem('usuario');
const jsonIndex = raw.indexOf('{');
const jsonString = raw.slice(jsonIndex);
const user = JSON.parse(jsonString);

const form = reactive({
  id: null,
  nombre: '',
  descripcion: '',
  visibilidad: 'INTERNO',
  responsable: user.id,
  fecha_inicio: '',
  fecha_fin: ''
})

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
}

// 1. LIST (GET /proyectos/departamento/{id})
const fetchProjects = async () => {
  if (!props.departmentId) return
  loading.value = true
  try {
    const res = await axios.get(`${API_BASE}/proyectos/departamento/${props.departmentId}`, { headers: getHeaders() })
    projects.value = res.data
  } catch (error) {
    showSnackbar('Error cargando proyectos', 'error')
  } finally {
    loading.value = false
  }
}

// 2. SUBMIT (Create POST / Update PUT)
const submitForm = async () => {
  if (!form.nombre) { showSnackbar('El nombre es obligatorio', 'warning'); return }
  
  submitting.value = true
  try {
    if (isEditing.value) {
        // --- EDIT MODE (PUT to /proyectos/{id}) ---
        const payload = {
            id: form.id,
            // id_empresa: 1, // Optional: if API requires it, you might need to fetch it or pass it
            id_departamento: props.departmentId,
            nombre: form.nombre,
            descripcion: form.descripcion,
            visibilidad: form.visibilidad,
            responsable: user.id,
            fecha_inicio: form.fecha_inicio,
            fecha_fin: form.fecha_fin
        }
        
        await axios.put(`${API_BASE}/proyectos/${form.id}`, payload, { headers: getHeaders() })
        
        // Update local list
        const index = projects.value.findIndex(p => p.id === form.id)
        if (index !== -1) {
            projects.value[index] = { ...projects.value[index], ...payload }
        }
        showSnackbar('Cambios guardados correctamente', 'success')

    } else {
        // --- CREATE MODE (POST to /proyectos/departamento) ---
        const payload = {
            id_departamento: props.departmentId,
            nombre: form.nombre,
            descripcion: form.descripcion,
            visibilidad: form.visibilidad,
            responsable: user.id,
            fecha_inicio: form.fecha_inicio,
            fecha_fin: form.fecha_fin
        }
        const res = await axios.post(`${API_BASE}/proyectos/departamento`, payload, { headers: getHeaders() })
        projects.value.push(res.data)
        showSnackbar('Proyecto creado exitosamente', 'success')
    }
    
    showForm.value = false
    resetForm()

  } catch (error) {
    console.error(error)
    showSnackbar('Error al guardar el proyecto', 'error')
  } finally {
    submitting.value = false
  }
}

// 3. DELETE (DELETE /proyectos/{id})
const confirmDelete = async () => {
    const result = await Swal.fire({
        title: '¿Eliminar proyecto?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
        submitting.value = true
        try {
            await axios.delete(`${API_BASE}/proyectos/${form.id}`, { headers: getHeaders() })
            projects.value = projects.value.filter(p => p.id !== form.id)
            showForm.value = false
            showSnackbar('Proyecto eliminado', 'success')
        } catch (error) {
            showSnackbar('Error al eliminar el proyecto', 'error')
        } finally {
            submitting.value = false
        }
    }
}

// --- UTILS ---
const filteredProjects = computed(() => {
  if (!searchTerm.value) return projects.value
  const term = searchTerm.value.toLowerCase()
  return projects.value.filter(p => p.nombre.toLowerCase().includes(term))
})

const goBack = () => {
  router.back() // Equivalent to router.go(-1)
}

const openCreateForm = () => {
    isEditing.value = false
    resetForm()
    showForm.value = true
}

const openEditForm = (proj) => {
    isEditing.value = true
    Object.assign(form, {
        id: proj.id,
        nombre: proj.nombre,
        descripcion: proj.descripcion,
        visibilidad: proj.visibilidad,
        responsable: proj.responsable,
        // Ensure dates are YYYY-MM-DD for input type="date"
        fecha_inicio: proj.fecha_inicio ? proj.fecha_inicio.slice(0, 10) : '',
        fecha_fin: proj.fecha_fin ? proj.fecha_fin.slice(0, 10) : ''
    })
    showForm.value = true
}

const resetForm = () => {
  // Default responsible ID set to 7 as per your input example, or leave null
  Object.assign(form, { id: null, nombre: '', descripcion: '', visibilidad: 'INTERNO', responsable: 7, fecha_inicio: '', fecha_fin: '' })
}

const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('es-ES') : '-'
const showSnackbar = (text, color) => { snackbar.text = text; snackbar.color = color; snackbar.show = true }
const goToCalendar = (id) => router.push({name: 'ProjectCalendar', params: { id: id }})

onMounted(() => fetchProjects())
watch(() => props.departmentId, (newId) => { if (newId) fetchProjects() })

// --- FORM CONTENT COMPONENT ---
const ProjectFormContent = defineComponent({
  props: ['form', 'loading', 'isEditing'], 
  emits: ['submit', 'cancel', 'delete'],   
  setup(props, { emit }) {
    return () => h('div', { class: 'd-flex flex-column gap-4 h-100' }, [
      h(VTextField, { modelValue: props.form.nombre, 'onUpdate:modelValue': v => props.form.nombre = v, label: 'Nombre del Proyecto *', variant: 'outlined', color: 'primary', density: 'comfortable' }),
      
      h('div', { class: 'd-flex gap-2' }, [
          h(VTextField, { 
              modelValue: props.form.fecha_inicio, 
              'onUpdate:modelValue': v => props.form.fecha_inicio = v, 
              label: 'Fecha Inicio', 
              type: 'date',
              variant: 'outlined', 
              color: 'primary', 
              density: 'comfortable',
              class: 'flex-grow-1'
          }),
          h(VTextField, { 
              modelValue: props.form.fecha_fin, 
              'onUpdate:modelValue': v => props.form.fecha_fin = v, 
              label: 'Fecha Fin', 
              type: 'date',
              variant: 'outlined', 
              color: 'primary', 
              density: 'comfortable',
              class: 'flex-grow-1' 
          }),
      ]),

      h('div', { class: 'd-flex gap-2' }, [
          h(VSelect, { 
              modelValue: props.form.visibilidad, 
              'onUpdate:modelValue': v => props.form.visibilidad = v, 
              items: ['PRIVADO', 'INTERNO', 'PUBLICO'], 
              label: 'Visibilidad', 
              variant: 'outlined', 
              color: 'primary', 
              density: 'comfortable',
              class: 'flex-grow-1'
          }),
      ]),

      h(VTextarea, { modelValue: props.form.descripcion, 'onUpdate:modelValue': v => props.form.descripcion = v, label: 'Descripción', variant: 'outlined', color: 'primary', rows: 3 }),
      
      // Footer Buttons
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
})
</script>

<style scoped>
.project-wrapper { width: 100%; height: 100%; padding-bottom: 15px; }
.text-navy { color: #061244 !important; font-family: var(--font-display) !important; }
.project-card { border-radius: 12px; border: 1px solid rgba(0, 0, 0, 0.08); position: relative; overflow: hidden; transition: all 0.3s ease; background: #fff; cursor: pointer; }
.card-header-bg-proj { height: 8px; background: linear-gradient(90deg, #183581 0%, #3159AE 100%); position: absolute; top: 0; left: 0; width: 100%; }
.company-logo { border: 1px solid #f0f0f0; }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.gap-1 { gap: 4px; } .gap-2 { gap: 8px; } .gap-3 { gap: 12px; } .gap-4 { gap: 16px; }
.click-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.05); z-index: 1999; cursor: default; }
.custom-right-drawer { position: fixed; top: 0; right: 0; width: 450px; height: 100%; background-color: white; z-index: 2000; transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); display: flex; flex-direction: column; box-shadow: -5px 0 20px rgba(0,0,0,0.15); }
.custom-right-drawer.is-open { transform: translateX(0); }
.panel-content { overflow-y: auto; flex-grow: 1; }
</style>