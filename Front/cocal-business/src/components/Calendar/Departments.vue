<template>
  <v-container class="departments-container">
    <div class="department-wrapper animate__animated animate__fadeIn">

      <div class="dashboard-header d-flex align-center px-6 py-4 bg-white border-b">
        <v-btn 
          variant="tonal" 
          color="grey-darken-3" 
          prepend-icon="mdi-arrow-left" 
          class="mr-6 font-weight-medium"
          to="/empresas"
        >
          Volver al listado
        </v-btn>
        
        <v-divider vertical class="mr-6 my-1"></v-divider>

        <div>
            <h2 class="text-h5 font-weight-bold text-navy">
            Departamentos
            </h2>
            <p class="text-subtitle-2 text-grey">
            Gestionando áreas de: <span class="font-weight-bold text-primary">{{ companyName }}</span>
            </p>
        </div>   

        <div class="ml-auto">
          <v-btn 
            variant="outlined" 
            color="primary"
            icon="mdi-refresh"
            @click="fetchDepartments"
            :loading="loading"
            :disabled="loading"
          ></v-btn>
        </div>     
      </div>

      <div class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between mb-6 gap-3 pt-4">
        <v-row class="w-100">
            <v-col cols="12" md="9">
                <v-text-field
                  v-model="searchTerm"
                  placeholder="Buscar departamento..."
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
                    prepend-icon="mdi-domain-plus"
                    size="large"
                    @click="openCreateForm"
                    block
                >
                Nuevo departamento
                </v-btn>
            </v-col>
        </v-row>
      </div>

      <div v-if="loading" class="d-flex justify-center mt-12">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </div>

      <div v-else-if="filteredDepartments.length === 0" class="text-center mt-12 pa-6 border-dashed rounded-lg">
        <v-icon size="60" color="grey-lighten-2" class="mb-3">mdi-domain-off</v-icon>
        <h3 class="text-body-1 text-grey font-weight-medium">
          {{ searchTerm ? 'No hay resultados para tu búsqueda' : 'No hay departamentos registrados' }}
        </h3>
      </div>

      <v-row v-else>
        <v-col 
          v-for="dept in filteredDepartments" 
          :key="dept.id" 
          cols="12" sm="6" lg="4"
        >
          <v-card class="company-card h-100 d-flex flex-column" elevation="0">
            <div class="card-header-bg-dept"></div>
            
            <v-card-item class="pt-8">
              <div class="d-flex align-start justify-space-between">
                
                <v-chip size="x-small" :color="dept.visibilidad === 'INTERNO' ? 'secondary' : 'success'" variant="flat" class="mt-1">
                  {{ dept.visibilidad }}
                </v-chip>

                <v-btn 
                    icon="mdi-pencil" 
                    variant="text" 
                    density="compact" 
                    color="grey-darken-1"
                    size="small"
                    @click.stop="openEditForm(dept)"
                ></v-btn>
              </div>

              <v-card-title class="text-h6 font-weight-bold mt-3 text-navy text-truncate">
                {{ dept.nombre }}
              </v-card-title>
              
              <div class="mt-1">
                <v-chip size="x-small" variant="outlined" color="grey-darken-2">
                  {{ dept.area }}
                </v-chip>
              </div>
            </v-card-item>

            <v-card-text class="flex-grow-1 pt-2">
              <p class="text-body-2 text-grey-darken-1 line-clamp-3">
                {{ dept.descripcion || 'Sin descripción detallada.' }}
              </p>
            </v-card-text>

            <v-divider></v-divider>
            
            <!-- NEW ACTION BUTTONS -->
            <v-card-actions class="pa-2 bg-grey-lighten-5 d-flex align-center gap-2">
                <!-- 1. VER PROYECTOS -->
                <v-btn 
                    class="flex-grow-1 text-none font-weight-bold" 
                    variant="flat" 
                    color="#3159AE" 
                    style="color: white;"
                    elevation="0"
                    prepend-icon="mdi-folder-open-outline"
                    @click.stop="goToProjects(dept)"
                >
                    VER PROYECTOS
                </v-btn>

                <!-- 2. CIRCULAR CALENDAR -->
                <v-tooltip location="top" text="Ver Calendario del Departamento">
                    <template v-slot:activator="{ props }">
                    <v-btn 
                        v-bind="props"
                        icon 
                        variant="tonal" 
                        color="#3159AE"
                        class="rounded-circle"
                        @click.stop="goToCalendar(dept)"
                    >
                        <v-icon>mdi-calendar-month</v-icon>
                    </v-btn>
                    </template>
                </v-tooltip>
            </v-card-actions>
            
            <div class="pa-1 bg-grey-lighten-5 text-caption text-grey text-start">
               Creado: {{ formatDate(dept.creado_en) }}
            </div>
          </v-card>
        </v-col>
      </v-row>

      <template v-if="showForm">
          <v-bottom-sheet v-if="mobile && showForm" v-model="showForm" inset>
              <v-card class="rounded-t-xl" style="max-height: 90vh; display: flex; flex-direction: column;">
                  <div class="pa-4 border-b d-flex justify-space-between align-center bg-grey-lighten-5">
                      <span class="text-h6 font-weight-bold text-navy">
                        {{ isEditing ? 'Editar Departamento' : 'Nuevo Departamento' }}
                      </span>
                      <v-btn icon="mdi-close" variant="text" density="compact" @click="showForm = false"></v-btn>
                  </div>
                  <div class="pa-4 overflow-y-auto">
                      <DepartmentFormContent 
                        :form="form" 
                        :loading="submitting" 
                        :is-editing="isEditing"
                        @submit="submitForm" 
                        @delete="confirmDelete"
                      />
                  </div>
              </v-card>
          </v-bottom-sheet>
      </template>

      <template v-if="!mobile">
              <div 
                  v-if="showForm"
                  class="click-overlay"
                  @click="showForm = false"
              ></div>

              <div
                  class="custom-right-drawer elevation-5"
                  :class="{ 'is-open': showForm }"
              >
                  <div class="pa-4 border-b d-flex align-center justify-cemter bg-grey-lighten-5 panel-content">
                      <div>
                          <span class="text-h6 font-weight-bold text-navy">
                            {{ isEditing ? 'Editar Departamento' : 'Nuevo Departamento' }}
                          </span>
                          <div class="text-caption text-grey">
                            {{ isEditing ? 'Modifica los datos del área' : `Registra una nueva área para ${companyName}` }}
                          </div>
                      </div>
                  </div>
                  
                  <div class="pa-5 h-100 d-flex flex-column" style="overflow-y: auto;">
                      <DepartmentFormContent 
                          :form="form" 
                          :loading="submitting" 
                          :is-editing="isEditing"
                          @submit="submitForm" 
                          @delete="confirmDelete"
                      />
                  </div>
              </div>
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
import { VTextField, VTextarea, VSelect, VBtn, VDivider } from 'vuetify/components'

// --- CONFIG ---
const { mobile } = useDisplay()
const API_BASE = 'http://localhost:3000/api'
const router = useRouter()

// --- STATE ---
const departments = ref([])
const loading = ref(false)
const submitting = ref(false)
const showForm = ref(false)
const searchTerm = ref('')
const isEditing = ref(false)
const editingId = ref(null)

const props = defineProps({
  companyId: {
    type: [Number, String],
    required: true
  },
  companyName: {
    type: String,
    default: 'la Empresa'
  }
})

const snackbar = reactive({ show: false, text: '', color: 'success' })

const form = reactive({
  id: null,
  nombre: '',
  descripcion: '',
  area: 'SISTEMAS',
  visibilidad: 'INTERNO',
  creado_en: ''
})

// Areas comunes para el select
const areaOptions = [
  { title: 'GERENCIA', value: 'GERENCIA' },
  { title: 'CONTABILIDAD', value: 'CONTABILIDAD' },
  { title: 'RECURSOS HUMANOS', value: 'RECURSOS_HUMANOS' }, 
  { title: 'SISTEMAS', value: 'SISTEMAS' },
  { title: 'MARKETING', value: 'MARKETING' },
  { title: 'PRODUCCION', value: 'PRODUCCION' }
]

// --- API ACTIONS ---

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
}

// 1. LISTAR (GET)
const fetchDepartments = async () => {
  if (!props.companyId) return
  
  loading.value = true
  try {
    const res = await axios.get(`${API_BASE}/departamentos/empresa/${props.companyId}`, {
      headers: getHeaders()
    })
    departments.value = res.data
  } catch (error) {
    console.error(error)
    showSnackbar('Error cargando departamentos', 'error')
  } finally {
    loading.value = false
  }
}

// 2. SUBMIT (Create POST / Update POST)
const submitForm = async () => {
  if (!form.nombre) { showSnackbar('El nombre es obligatorio', 'warning'); return }
  
  submitting.value = true
  try {
    if (isEditing.value) {
        // --- EDIT MODE (POST to /departamentos/{id}) ---
        const payload = {
            id: form.id,
            id_empresa: props.companyId,
            nombre: form.nombre,
            descripcion: form.descripcion,
            area: form.area,
            visibilidad: form.visibilidad,
            creado_en: form.creado_en
        }
        
        await axios.post(`${API_BASE}/departamentos/${form.id}`, payload, { headers: getHeaders() })
        
        // Update local list
        const index = departments.value.findIndex(d => d.id === form.id)
        if (index !== -1) {
            departments.value[index] = { ...departments.value[index], ...payload }
        }
        showSnackbar('Cambios guardados correctamente', 'success')

    } else {
        // --- CREATE MODE (POST to /departamentos) ---
        const payload = {
            id_empresa: props.companyId,
            nombre: form.nombre,
            descripcion: form.descripcion,
            area: form.area,
            visibilidad: form.visibilidad
        }
        const res = await axios.post(`${API_BASE}/departamentos`, payload, { headers: getHeaders() })
        departments.value.push(res.data)
        showSnackbar('Departamento creado exitosamente', 'success')
    }
    
    showForm.value = false
    resetForm()

  } catch (error) {
    console.error(error)
    showSnackbar('Error al guardar el departamento', 'error')
  } finally {
    submitting.value = false
  }
}

// 3. DELETE (DELETE /departamentos/{id})
const confirmDelete = async () => {
    const result = await Swal.fire({
        title: '¿Eliminar departamento?',
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
            await axios.delete(`${API_BASE}/departamentos/${form.id}`, { headers: getHeaders() })
            departments.value = departments.value.filter(d => d.id !== form.id)
            showForm.value = false
            showSnackbar('Departamento eliminado', 'success')
        } catch (error) {
            showSnackbar('Error al eliminar el departamento', 'error')
        } finally {
            submitting.value = false
        }
    }
}


// --- UTILS ---

const filteredDepartments = computed(() => {
  if (!searchTerm.value) return departments.value
  const term = searchTerm.value.toLowerCase()
  return departments.value.filter(d => 
    d.nombre.toLowerCase().includes(term) || 
    d.area.toLowerCase().includes(term)
  )
})

const openCreateForm = () => {
    isEditing.value = false
    resetForm()
    showForm.value = true
}

const openEditForm = (dept) => {
    isEditing.value = true
    // Fill form with dept data
    Object.assign(form, {
        id: dept.id,
        nombre: dept.nombre,
        descripcion: dept.descripcion,
        area: dept.area,
        visibilidad: dept.visibilidad,
        creado_en: dept.creado_en
    })
    showForm.value = true
}

const resetForm = () => {
  form.nombre = ''
  form.descripcion = ''
  form.area = 'SISTEMAS'
  form.visibilidad = 'INTERNO'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-ES')
}

const showSnackbar = (text, color) => {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}

const goToProjects = (dept) => {
  router.push({
    name: 'DepartmentProjects',
    params: { 
      id: dept.id 
    },
    query: { 
      name: dept.nombre 
    }
  })
}
const goToCalendar = (dept) => console.log("Calendario de:", dept.nombre)

// --- LIFECYCLE ---
onMounted(() => {
  fetchDepartments()
})

watch(() => props.companyId, (newId) => {
  if (newId) fetchDepartments()
})

// --- SUB-COMPONENTE: CONTENIDO DEL FORMULARIO ---
// Definido aquí para reutilizarlo en Mobile y Desktop sin duplicar código
const DepartmentFormContent = defineComponent({
  props: ['form', 'loading', 'isEditing'],
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    return () => h('div', { class: 'd-flex flex-column gap-4' }, [
      h(VTextField, {
        modelValue: props.form.nombre,
        'onUpdate:modelValue': v => props.form.nombre = v,
        label: 'Nombre del Departamento *',
        variant: 'outlined',
        color: 'primary',
        density: 'comfortable'
      }),
      
      h(VSelect, {
          modelValue: props.form.area,
          'onUpdate:modelValue': v => props.form.area = v,
          items: areaOptions,
          itemTitle: 'title', 
          itemValue: 'value', 
          label: 'Área / Categoría',
          variant: 'outlined',
          color: 'primary',
          density: 'comfortable'
      }),

      h(VSelect, {
        modelValue: props.form.visibilidad,
        'onUpdate:modelValue': v => props.form.visibilidad = v,
        items: ['PRIVADO', 'INTERNO', 'PUBLICO'],
        label: 'Visibilidad',
        variant: 'outlined',
        color: 'primary',
        density: 'comfortable'
      }),

      h(VTextarea, {
        modelValue: props.form.descripcion,
        'onUpdate:modelValue': v => props.form.descripcion = v,
        label: 'Descripción',
        variant: 'outlined',
        color: 'primary',
        rows: 3
      }),
        h('div', { class: 'd-flex gap-2 mt-2 align-center' }, [
            
            // Botón Principal (Guardar / Crear)
            h(VBtn, {
                color: '#3159AE',
                class: 'text-white flex-grow-1', // Ocupa todo el espacio si está solo
                size: 'large',
                loading: props.loading,
                elevation: 2,
                onClick: () => emit('submit')
            }, () => props.isEditing ? 'Guardar Cambios' : 'Crear Departamento'), // <--- Texto dinámico

            // Botón Eliminar (SOLO aparece si isEditing es true)
            props.isEditing ? h(VBtn, {
                color: 'error',
                variant: 'tonal',
                size: 'large',
                icon: 'mdi-delete',
                class: 'ml-2',
                title: 'Eliminar Departamento',
                onClick: () => emit('delete')
            }) : null
        ])
    ])
  }
})
</script>

<style scoped>
.departments-container {
  background-color: white; border-radius: 20px; margin-bottom: 15px;
}


.department-wrapper {
  width: 100%;
  height: 100%;
  padding-bottom: 15px;
}

.text-navy {
  color: #061244 !important;
  font-family: var(--font-display) !important;
}

.company-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #fff;
  cursor: pointer;
}

.card-header-bg-dept {
  height: 8px; /* Tira delgada arriba */
  background: linear-gradient(90deg, #3159AE 0%, #061244 100%);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.company-logo {
  border: 1px solid #f0f0f0;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }

/* --- OVERLAY LOGIC --- */
.click-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.05); /* Very subtle dim, not a heavy backdrop */
  z-index: 1999; /* Sit below the drawer, but above content */
  cursor: default;
}

/* --- DRAWER LOGIC --- */
.custom-right-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 450px;
  height: 100%;
  background-color: white;
  z-index: 2000; /* Must be higher than overlay */
  
  /* Slide Animation */
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
}

.custom-right-drawer.is-open {
  transform: translateX(0);
}

.panel-content {
  overflow-y: auto;
  flex-grow: 1;
}
</style>