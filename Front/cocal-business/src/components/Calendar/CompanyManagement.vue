<template>
  <div class="company-wrapper">
    
    <v-container v-if="currentView === 'list'" class="content-container animate__animated animate__fadeIn">
      
      <div class="d-flex align-center justify-space-between mb-6">
        <div>
          <h1 class="page-title">Portafolio de Empresas</h1>
          <p class="text-subtitle-1 text-grey-darken-1">Selecciona una organización para administrar</p>
        </div>
        <div class="d-flex gap-2">
          <!-- Botón de actualizar -->
          <v-btn 
            variant="outlined" 
            color="primary"
            icon="mdi-refresh"
            @click="fetchCompanies"
            :loading="loading"
            :disabled="loading"
          ></v-btn>
          <v-btn 
            color="#3159AE" 
            class="text-white text-none elevation-2" 
            prepend-icon="mdi-domain-plus"
            size="large"
            @click="openCreatePanel"
          >
            Nueva Empresa
          </v-btn>
        </div>
      </div>

      <!-- FILTROS (NUEVO) -->
      <v-card class="mb-6" variant="outlined">
        <v-card-text class="pa-4">
          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="searchTerm"
                label="Buscar empresa..."
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-magnify"
                clearable
                @update:model-value="filterCompanies"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="filterRubro"
                :items="['Todos', ...rubrosOptions]"
                label="Filtrar por rubro"
                variant="outlined"
                density="compact"
                clearable
                @update:model-value="filterCompanies"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3" class="d-flex align-center">
              <v-chip v-if="filteredCompanies.length !== companies.length" 
                color="primary" variant="flat" size="small">
                Mostrando {{ filteredCompanies.length }} de {{ companies.length }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <div v-if="loading" class="d-flex justify-center mt-12">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </div>

      <div v-else-if="filteredCompanies.length === 0" class="text-center mt-12">
        <v-icon size="80" color="grey-lighten-2">mdi-domain-off</v-icon>
        <h3 class="text-h6 text-grey mt-4">
          {{ searchTerm || filterRubro ? 'No hay resultados para tu búsqueda' : 'No hay empresas registradas' }}
        </h3>
        <v-btn v-if="searchTerm || filterRubro" variant="text" color="primary" @click="clearFilters" class="mt-2">
          Limpiar filtros
        </v-btn>
      </div>

      <v-row v-else>
        <v-col 
          v-for="company in filteredCompanies" 
          :key="company.id" 
          cols="12" md="6" lg="4"
        >
          <v-card class="company-card h-100 d-flex flex-column" elevation="0" @click="enterCompany(company)">
            <div class="card-header-bg"></div>
            
            <v-card-item class="pt-8">
              <div class="d-flex align-start justify-space-between">
                <v-avatar color="white" size="64" class="elevation-3 company-logo" :class="getLogoColor(company.nombre)">
                  <span class="text-h5 font-weight-bold">{{ getInitials(company.nombre) }}</span>
                </v-avatar>
                
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn 
                      icon="mdi-dots-vertical" 
                      variant="text" 
                      size="small" 
                      v-bind="props"
                      @click.stop
                    ></v-btn>
                  </template>
                  <v-list density="compact">
                    <v-list-item 
                      @click.stop="openEditPanel(company)" 
                      prepend-icon="mdi-pencil"
                    >
                      <v-list-item-title>Editar</v-list-item-title>
                    </v-list-item>
                    <v-list-item 
                      @click.stop="confirmDeleteCompany(company)" 
                      prepend-icon="mdi-delete"
                      class="text-error"
                    >
                      <v-list-item-title>Eliminar</v-list-item-title>
                    </v-list-item>
                    <v-divider class="my-1"></v-divider>
                    <v-list-item 
                      @click.stop="copyCompanyInfo(company)" 
                      prepend-icon="mdi-content-copy"
                    >
                      <v-list-item-title>Copiar información</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>

              <v-card-title class="text-h6 font-weight-bold mt-3 text-wrap" style="line-height: 1.2;">
                {{ company.nombre }}
                <v-tooltip location="top" v-if="company.nombre.length > 30">
                  <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" size="small" color="grey" class="ml-1">mdi-information-outline</v-icon>
                  </template>
                  <span>{{ company.nombre }}</span>
                </v-tooltip>
              </v-card-title>
              <v-chip size="x-small" color="secondary" variant="flat" class="mt-1">
                {{ company.rubro || 'Sin rubro' }}
              </v-chip>
            </v-card-item>

            <v-card-text class="flex-grow-1">
              <div class="company-info-item">
                <v-icon size="small" color="grey">mdi-map-marker</v-icon>
                <span class="text-truncate ml-2">{{ company.direccion || 'Sin dirección' }}</span>
              </div>
              <div class="company-info-item mt-2">
                <v-icon size="small" color="grey">mdi-identifier</v-icon>
                <span class="ml-2">NIT: {{ company.nit }}</span>
              </div>
              <div class="company-info-item mt-2" v-if="company.telefono">
                <v-icon size="small" color="grey">mdi-phone</v-icon>
                <span class="ml-2">{{ company.telefono }}</span>
              </div>
              <div class="company-info-item mt-2" v-if="company.sitio_web">
                <v-icon size="small" color="grey">mdi-web</v-icon>
                <a :href="company.sitio_web" target="_blank" class="ml-2 text-primary text-decoration-none">
                  {{ company.sitio_web }}
                </a>
              </div>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pa-4 bg-grey-lighten-5">
              <v-btn 
                block 
                variant="outlined" 
                color="primary"
                append-icon="mdi-arrow-right"
                @click.stop="enterCompany(company)"
              >
                Entrar al Panel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- PAGINACIÓN (NUEVO) -->
      <v-pagination
        v-if="filteredCompanies.length > itemsPerPage"
        v-model="currentPage"
        :length="totalPages"
        :total-visible="5"
        class="mt-6"
        @update:model-value="paginateCompanies"
      ></v-pagination>
    </v-container>

    <!-- VISTA DASHBOARD - MEJORADA -->
    <div v-else class="company-dashboard animate__animated animate__fadeInRight">
      
      <v-progress-linear v-if="loadingDetails" indeterminate color="secondary" height="4"></v-progress-linear>

      <div class="dashboard-header d-flex align-center px-6 py-4 bg-white border-b">
        
        <v-btn 
          variant="tonal" 
          color="grey-darken-3" 
          prepend-icon="mdi-arrow-left" 
          class="mr-6 font-weight-medium"
          @click="exitCompany"
        >
          Volver al listado
        </v-btn>
        
        <v-divider vertical class="mr-6 my-1"></v-divider>

        <div class="d-flex align-center">
          <v-avatar color="primary" variant="tonal" size="40" class="mr-3">
            <span class="font-weight-bold">{{ getInitials(selectedCompany?.nombre) }}</span>
          </v-avatar>
          <div>
            <div class="text-overline text-grey" style="line-height: 1;">Panel de Administración</div>
            <h2 class="text-h5 font-weight-bold text-primary mb-0">{{ selectedCompany?.nombre }}</h2>
          </div>
        </div>

        <v-spacer></v-spacer>
        
        <!-- ACCIONES RÁPIDAS -->
        <div class="d-flex gap-2">
          <v-btn 
            variant="text" 
            prepend-icon="mdi-pencil" 
            color="primary"
            @click="selectedCompany && openEditPanel(selectedCompany)"
          >
            Editar
          </v-btn>
          <v-btn 
            variant="text" 
            prepend-icon="mdi-web" 
            :href="selectedCompany?.sitio_web" 
            target="_blank" 
            v-if="selectedCompany?.sitio_web"
            color="primary"
          >
            Sitio Web
          </v-btn>
          <v-btn 
            variant="tonal" 
            prepend-icon="mdi-refresh" 
            color="secondary"
            @click="selectedCompany && fetchCompanyDetails(selectedCompany.id)"
            :loading="loadingDetails"
          >
            Actualizar
          </v-btn>
        </div>
      </div>

      <v-container class="mt-6">
        <!-- ESTADÍSTICAS RÁPIDAS -->
        <v-row>
          <v-col cols="12" md="3">
            <v-card class="pa-4" variant="outlined" style="background: white;">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-overline text-grey">NIT</div>
                  <div class="text-h6 font-weight-bold">{{ selectedCompany?.nit }}</div>
                </div>
                <v-avatar color="primary" variant="tonal" size="40">
                  <v-icon>mdi-identifier</v-icon>
                </v-avatar>
              </div>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="3">
            <v-card class="pa-4" variant="outlined" style="background: white;">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-overline text-grey">Contacto</div>
                  <div class="text-h6 font-weight-bold">{{ selectedCompany?.telefono || 'No disponible' }}</div>
                </div>
                <v-avatar color="success" variant="tonal" size="40">
                  <v-icon>mdi-phone</v-icon>
                </v-avatar>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="3">
            <v-card class="pa-4" variant="outlined" style="background: white;">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-overline text-grey">Rubro</div>
                  <div class="text-h6 font-weight-bold">{{ selectedCompany?.rubro || 'Sin especificar' }}</div>
                </div>
                <v-avatar color="secondary" variant="tonal" size="40">
                  <v-icon>mdi-briefcase</v-icon>
                </v-avatar>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="3">
            <v-card class="pa-4" variant="outlined" style="background: white;" link @click="copyCompanyInfo(selectedCompany)">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-overline text-grey">Acciones</div>
                  <div class="text-caption text-grey">Copiar información</div>
                </div>
                <v-avatar color="info" variant="tonal" size="40">
                  <v-icon>mdi-content-copy</v-icon>
                </v-avatar>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- DETALLES COMPLETOS -->
        <v-row class="mt-6">
          <v-col cols="12" md="8">
            <v-card class="pa-5" variant="outlined">
              <v-card-title class="text-h6 font-weight-bold mb-4">
                <v-icon class="mr-2">mdi-information-outline</v-icon>
                Información de la Empresa
              </v-card-title>
              
              <v-divider class="mb-4"></v-divider>
              
              <v-table density="comfortable">
                <tbody>
                  <tr>
                    <td class="font-weight-bold text-grey-darken-2">Nombre/Razón Social:</td>
                    <td>{{ selectedCompany?.nombre }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold text-grey-darken-2">NIT:</td>
                    <td>{{ selectedCompany?.nit }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold text-grey-darken-2">Rubro:</td>
                    <td>
                      <v-chip size="small" color="primary" variant="flat">
                        {{ selectedCompany?.rubro || 'No especificado' }}
                      </v-chip>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold text-grey-darken-2">Dirección:</td>
                    <td>{{ selectedCompany?.direccion || 'No especificada' }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold text-grey-darken-2">Teléfono:</td>
                    <td>{{ selectedCompany?.telefono || 'No especificado' }}</td>
                  </tr>
                  <tr v-if="selectedCompany?.sitio_web">
                    <td class="font-weight-bold text-grey-darken-2">Sitio Web:</td>
                    <td>
                      <a :href="selectedCompany.sitio_web" target="_blank" class="text-primary text-decoration-none">
                        {{ selectedCompany.sitio_web }}
                        <v-icon size="small" class="ml-1">mdi-open-in-new</v-icon>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold text-grey-darken-2">Estado:</td>
                    <td>
                      <v-chip size="small" color="success" variant="flat" prepend-icon="mdi-check-circle">
                        Activo
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-card class="pa-5" variant="outlined">
              <v-card-title class="text-h6 font-weight-bold mb-4">
                <v-icon class="mr-2">mdi-cog</v-icon>
                Acciones Rápidas
              </v-card-title>
              
              <v-divider class="mb-4"></v-divider>
              
              <div class="d-flex flex-column gap-3">
                <v-btn 
                  variant="outlined" 
                  color="primary" 
                  block 
                  prepend-icon="mdi-pencil"
                  @click="selectedCompany && openEditPanel(selectedCompany)"
                >
                  Editar Empresa
                </v-btn>
                
                <v-btn 
                  variant="outlined" 
                  color="secondary" 
                  block 
                  prepend-icon="mdi-sitemap"
                  @click="manageStructure"
                >
                  Gestionar Estructura
                </v-btn>
                
                <v-btn 
                  variant="outlined" 
                  color="info" 
                  block 
                  prepend-icon="mdi-download"
                  @click="exportCompanyData"
                >
                  Exportar Datos
                </v-btn>
                
                <v-btn 
                  variant="outlined" 
                  color="error" 
                  block 
                  prepend-icon="mdi-delete"
                  @click="selectedCompany && confirmDeleteCompany(selectedCompany)"
                >
                  Eliminar Empresa
                </v-btn>
              </div>
              
              <v-divider class="my-4"></v-divider>
              
              <div class="text-caption text-grey">
                <v-icon size="small" class="mr-1">mdi-information</v-icon>
                Última actualización: {{ new Date().toLocaleDateString() }}
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- FORMULARIO (MEJORADO) -->
    <v-navigation-drawer
      v-model="showFormPanel"
      location="right"
      temporary
      width="450"
      class="form-drawer elevation-5"
    >
      <div class="pa-4 border-b d-flex align-center justify-space-between bg-grey-lighten-5">
        <div>
          <span class="text-h6 font-weight-bold text-primary">
            {{ isEditing ? 'Editar Empresa' : 'Nueva Empresa' }}
          </span>
          <div class="text-caption text-grey">
            {{ isEditing ? 'Actualiza la información de la empresa' : 'Completa los datos para registrar una nueva empresa' }}
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" density="compact" @click="showFormPanel = false"></v-btn>
      </div>

      <v-form ref="formRef" @submit.prevent="submitForm" class="pa-5 d-flex flex-column gap-4" style="overflow-y: auto; height: calc(100% - 120px);">
        <v-text-field
          v-model="form.nombre"
          label="Nombre / Razón Social *"
          variant="outlined"
          color="primary"
          density="comfortable"
          :rules="[v => !!v || 'Requerido', v => v.length <= 100 || 'Máximo 100 caracteres']"
          required
          counter="100"
        ></v-text-field>

        <v-text-field
          v-model="form.nit"
          label="NIT *"
          variant="outlined"
          color="primary"
          density="comfortable"
          :rules="[v => !!v || 'Requerido', v => /^\d{6,20}$/.test(v) || 'NIT inválido (6-20 dígitos)']"
          required
          placeholder="Ej: 1234567890"
        ></v-text-field>

        <v-autocomplete
          v-model="form.rubro"
          :items="rubrosOptions"
          label="Rubro"
          variant="outlined"
          color="primary"
          density="comfortable"
          clearable
          :rules="[v => !v || v.length <= 50 || 'Máximo 50 caracteres']"
          counter="50"
        ></v-autocomplete>

        <v-textarea
          v-model="form.direccion"
          label="Dirección"
          variant="outlined"
          color="primary"
          density="compact"
          rows="2"
          auto-grow
          :rules="[v => !v || v.length <= 200 || 'Máximo 200 caracteres']"
          counter="200"
        ></v-textarea>

        <v-text-field
          v-model="form.telefono"
          label="Teléfono"
          variant="outlined"
          color="primary"
          density="compact"
          :rules="[v => !v || /^[0-9+\-\s]{7,15}$/.test(v) || 'Teléfono inválido']"
          placeholder="Ej: +591 76543210"
        ></v-text-field>

        <v-text-field
          v-model="form.sitio_web"
          label="Sitio Web"
          variant="outlined"
          color="primary"
          density="compact"
          placeholder="https://"
          :rules="[v => !v || /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/.test(v) || 'URL inválida']"
        ></v-text-field>
        
        <v-divider></v-divider>
        
        <div class="text-caption text-grey">
          <v-icon size="small" class="mr-1">mdi-alert-circle</v-icon>
          Campos marcados con * son obligatorios
        </div>
      </v-form>

      <template v-slot:append>
        <div class="pa-4 border-t bg-white d-flex gap-3">
          <v-btn 
            variant="outlined" 
            color="grey" 
            block 
            size="large"
            @click="showFormPanel = false"
          >
            Cancelar
          </v-btn>
          <v-btn 
            block 
            size="large" 
            color="#3159AE" 
            class="text-white"
            :loading="submitting"
            @click="submitForm"
            :disabled="!form.nombre || !form.nit"
          >
            {{ isEditing ? 'Guardar Cambios' : 'Registrar Empresa' }}
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- SNACKBAR PARA NOTIFICACIONES -->
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="4000" location="top right">
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ snackbarIcon }}</v-icon>
        <span>{{ snackbarMessage }}</span>
      </div>
      <template v-slot:actions>
        <v-btn icon="mdi-close" variant="text" size="small" @click="showSnackbar = false"></v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

// Agregar al inicio del script, después de los refs
const formRef = ref(null)
const searchTerm = ref('')
const filterRubro = ref('')
const currentPage = ref(1)
const itemsPerPage = 9
const filteredCompanies = ref([])

// Computed para páginas
const totalPages = computed(() => Math.ceil(filteredCompanies.value.length / itemsPerPage))

// Métodos nuevos para el template
const filterCompanies = () => {
  let filtered = [...companies.value]
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(company => 
      company.nombre.toLowerCase().includes(term) ||
      company.nit.toLowerCase().includes(term) ||
      (company.rubro && company.rubro.toLowerCase().includes(term))
    )
  }
  
  if (filterRubro.value && filterRubro.value !== 'Todos') {
    filtered = filtered.filter(company => company.rubro === filterRubro.value)
  }
  
  filteredCompanies.value = filtered
  currentPage.value = 1
  paginateCompanies()
}

const paginateCompanies = () => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  // Para uso en template, mostrar solo la página actual
}

const clearFilters = () => {
  searchTerm.value = ''
  filterRubro.value = ''
  filterCompanies()
}

const getLogoColor = (name) => {
  const colors = ['primary', 'secondary', 'success', 'warning', 'info', 'error']
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

const copyCompanyInfo = (company) => {
  const text = `Empresa: ${company.nombre}\nNIT: ${company.nit}\nRubro: ${company.rubro}\nDirección: ${company.direccion}\nTeléfono: ${company.telefono}\nSitio Web: ${company.sitio_web}`
  navigator.clipboard.writeText(text)
  showNotification('Información copiada al portapapeles', 'success', 'mdi-content-copy')
}

const manageStructure = () => {
  showNotification('Función de gestión de estructura en desarrollo', 'info')
}

const exportCompanyData = () => {
  showNotification('Función de exportación en desarrollo', 'info')
}

const getNotificationIcon = (color) => {
  switch(color) {
    case 'success': return 'mdi-check-circle'
    case 'error': return 'mdi-alert-circle'
    case 'warning': return 'mdi-alert'
    case 'info': return 'mdi-information'
    default: return 'mdi-information'
  }
}

// --- CONFIGURACIÓN BASE ---
const API_BASE = 'http://localhost:3000/api'

// --- HEADERS CON AUTENTICACIÓN ---
const getHeaders = () => {
  const token = localStorage.getItem('token') || 
                JSON.parse(localStorage.getItem('usuario') || '{}').token ||
                JSON.parse(localStorage.getItem('usuario') || '{}').access_token
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

// --- ESTADO REACTIVO ---
const companies = ref([])
const loading = ref(false)
const loadingDetails = ref(false)
const submitting = ref(false)
const showFormPanel = ref(false)
const isEditing = ref(false)
const currentView = ref('list') // 'list' o 'dashboard'
const selectedCompany = ref(null)

// Snackbar notifications
const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const form = reactive({
  id: null,
  nombre: '',
  nit: '',
  rubro: '',
  direccion: '',
  telefono: '',
  sitio_web: ''
})

const rubrosOptions = [
  'Tecnología',
  'Consultoría', 
  'Salud',
  'Educación',
  'Finanzas',
  'Comercio',
  'Construcción',
  'Manufactura',
  'Transporte',
  'Turismo',
  'Agroindustria',
  'Otros'
]

// ==========================================
// IMPLEMENTACIÓN COMPLETA DE LAS 5 APIS
// ==========================================

// [1] GET /api/empresas - Listar todas las empresas
const fetchCompanies = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${API_BASE}/empresas`, {
      headers: getHeaders(),
      validateStatus: status => status === 200
    })
    
    companies.value = response.data
    showNotification('Empresas cargadas correctamente', 'success')
  } catch (error) {
    console.error('Error al cargar empresas:', error)
    
    if (error.response?.status === 401) {
      showNotification('Sesión expirada. Por favor, inicie sesión nuevamente.', 'error')
      // Opcional: redirigir a login
    } else if (error.response?.status === 403) {
      showNotification('No tiene permisos para ver empresas.', 'error')
    } else {
      showNotification('Error al cargar empresas', 'error')
    }
  } finally {
    loading.value = false
  }
}

// [2] GET /api/empresas/{id} - Obtener una empresa por ID
const fetchCompanyDetails = async (id) => {
  if (!id) return
  
  loadingDetails.value = true
  try {
    const response = await axios.get(`${API_BASE}/empresas/${id}`, {
      headers: getHeaders(),
      validateStatus: status => status === 200
    })
    
    selectedCompany.value = response.data
    localStorage.setItem('currentCompany', JSON.stringify(response.data))
  } catch (error) {
    console.error('Error al cargar detalles:', error)
    
    if (error.response?.status === 404) {
      showNotification('Empresa no encontrada', 'error')
      exitCompany()
    } else if (error.response?.status === 401) {
      showNotification('Sesión expirada', 'error')
    } else if (error.response?.status === 403) {
      showNotification('No tiene permisos para ver esta empresa', 'error')
    } else {
      showNotification('Error al cargar detalles', 'error')
    }
  } finally {
    loadingDetails.value = false
  }
}

// [3] POST /api/empresas - Crear una nueva empresa
const createCompany = async (companyData) => {
  submitting.value = true
  try {
    const response = await axios.post(`${API_BASE}/empresas`, companyData, {
      headers: getHeaders(),
      validateStatus: status => status === 201
    })
    
    showNotification('Empresa creada exitosamente', 'success')
    return response.data
  } catch (error) {
    console.error('Error al crear empresa:', error)
    
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'Datos inválidos')
    } else if (error.response?.status === 401) {
      throw new Error('Sesión expirada')
    } else if (error.response?.status === 403) {
      throw new Error('No tiene permisos para crear empresas')
    } else {
      throw new Error('Error al crear la empresa')
    }
  } finally {
    submitting.value = false
  }
}

// [4] PUT /api/empresas/{id} - Actualizar una empresa existente
const updateCompany = async (id, companyData) => {
  submitting.value = true
  try {
    const response = await axios.put(`${API_BASE}/empresas/${id}`, companyData, {
      headers: getHeaders(),
      validateStatus: status => status === 200
    })
    
    showNotification('Empresa actualizada exitosamente', 'success')
    return response.data
  } catch (error) {
    console.error('Error al actualizar empresa:', error)
    
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'Datos inválidos')
    } else if (error.response?.status === 401) {
      throw new Error('Sesión expirada')
    } else if (error.response?.status === 403) {
      throw new Error('No tiene permisos para actualizar empresas')
    } else if (error.response?.status === 404) {
      throw new Error('Empresa no encontrada')
    } else {
      throw new Error('Error al actualizar la empresa')
    }
  } finally {
    submitting.value = false
  }
}

// [5] DELETE /api/empresas/{id} - Eliminar una empresa
const deleteCompany = async (id) => {
  try {
    await axios.delete(`${API_BASE}/empresas/${id}`, {
      headers: getHeaders(),
      validateStatus: status => status === 204
    })
    
    showNotification('Empresa eliminada exitosamente', 'success')
    return true
  } catch (error) {
    console.error('Error al eliminar empresa:', error)
    
    if (error.response?.status === 401) {
      throw new Error('Sesión expirada')
    } else if (error.response?.status === 403) {
      throw new Error('No tiene permisos para eliminar empresas')
    } else if (error.response?.status === 404) {
      throw new Error('Empresa no encontrada')
    } else {
      throw new Error('Error al eliminar la empresa')
    }
  }
}

// ==========================================
// FUNCIONES PRINCIPALES DEL COMPONENTE
// ==========================================

// Función principal para enviar formulario (crear o editar)
const submitForm = async () => {
  // Validación básica
  if (!form.nombre.trim()) {
    showNotification('El nombre es requerido', 'error')
    return
  }
  
  if (!form.nit.trim()) {
    showNotification('El NIT es requerido', 'error')
    return
  }
  
  try {
    let result
    
    if (isEditing.value) {
      // Actualizar empresa existente
      result = await updateCompany(form.id, {
        nombre: form.nombre,
        nit: form.nit,
        rubro: form.rubro,
        direccion: form.direccion,
        telefono: form.telefono,
        sitio_web: form.sitio_web
      })
      
      // Actualizar en la lista
      const index = companies.value.findIndex(c => c.id === form.id)
      if (index !== -1) {
        companies.value[index] = { ...companies.value[index], ...result }
      }
      
      // Si estamos viendo esta empresa, actualizar detalles
      if (selectedCompany.value?.id === form.id) {
        selectedCompany.value = { ...selectedCompany.value, ...result }
      }
    } else {
      // Crear nueva empresa
      result = await createCompany({
        nombre: form.nombre,
        nit: form.nit,
        rubro: form.rubro,
        direccion: form.direccion,
        telefono: form.telefono,
        sitio_web: form.sitio_web
      })
      
      // Agregar a la lista
      companies.value.push(result)
    }
    
    // Cerrar panel y limpiar formulario
    showFormPanel.value = false
    resetForm()
    
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: error.message,
      icon: 'error',
      confirmButtonText: 'Entendido'
    })
  }
}

// Confirmar eliminación de empresa
const confirmDeleteCompany = async (company) => {
  const result = await Swal.fire({
    title: '¿Eliminar empresa?',
    text: `¿Está seguro de eliminar "${company.nombre}"? Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })
  
  if (result.isConfirmed) {
    try {
      await deleteCompany(company.id)
      
      // Eliminar de la lista
      companies.value = companies.value.filter(c => c.id !== company.id)
      
      // Si estamos viendo esta empresa, regresar al listado
      if (selectedCompany.value?.id === company.id) {
        exitCompany()
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Entendido'
      })
    }
  }
}

// ==========================================
// NAVEGACIÓN Y PERSISTENCIA
// ==========================================

const enterCompany = (company) => {
  // Guardar en estado local
  selectedCompany.value = company
  currentView.value = 'dashboard'
  
  // Persistir en localStorage
  localStorage.setItem('currentCompany', JSON.stringify(company))
  
  // Agregar al historial del navegador
  window.history.pushState({ view: 'dashboard', companyId: company.id }, '')
  
  // Obtener detalles frescos de la API
  fetchCompanyDetails(company.id)
}

const exitCompany = () => {
  selectedCompany.value = null
  currentView.value = 'list'
  localStorage.removeItem('currentCompany')
  
  // Si hay historial, retroceder
  if (window.history.state?.view === 'dashboard') {
    window.history.back()
  }
}

// Manejar botón "Atrás" del navegador
const handlePopState = (event) => {
  if (!event.state || event.state.view !== 'dashboard') {
    selectedCompany.value = null
    currentView.value = 'list'
    localStorage.removeItem('currentCompany')
  }
}

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

// Notificaciones
const showNotification = (message, color = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  showSnackbar.value = true
}

// Panel de creación
const openCreatePanel = () => {
  isEditing.value = false
  resetForm()
  showFormPanel.value = true
}

// Panel de edición
const openEditPanel = (company) => {
  isEditing.value = true
  Object.assign(form, company)
  showFormPanel.value = true
}

// Resetear formulario
const resetForm = () => {
  Object.assign(form, {
    id: null,
    nombre: '',
    nit: '',
    rubro: '',
    direccion: '',
    telefono: '',
    sitio_web: ''
  })
}

// Obtener iniciales para avatar
const getInitials = (name) => {
  if (!name) return 'EM'
  const words = name.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// ==========================================
// LIFECYCLE HOOKS
// ==========================================

onMounted(async () => {
  // Configurar listener para botón "Atrás"
  window.addEventListener('popstate', handlePopState)
  
  // Restaurar estado previo si existe
  const savedCompany = localStorage.getItem('currentCompany')
  if (savedCompany) {
    try {
      const company = JSON.parse(savedCompany)
      selectedCompany.value = company
      currentView.value = 'dashboard'
      
      // Cargar detalles frescos
      await fetchCompanyDetails(company.id)
    } catch (e) {
      console.error('Error al restaurar empresa:', e)
      localStorage.removeItem('currentCompany')
      currentView.value = 'list'
    }
  }
  
  // Cargar lista de empresas
  await fetchCompanies()
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})
</script>

<style scoped>
.company-wrapper {
  width: 100%;
  height: 100%;
  background-color: var(--bg);
  padding-top: 140px;
  overflow-y: auto;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.page-title {
  font-family: 'Roboto', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
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

.company-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(49, 89, 174, 0.15) !important;
  border-color: rgba(49, 89, 174, 0.2);
}

.card-header-bg {
  height: 60px;
  background: linear-gradient(135deg, #3159AE 0%, #061244 100%);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.company-logo {
  border: 4px solid #fff;
  margin-top: -10px;
  font-family: sans-serif;
}

.company-dashboard {
  background-color: #f8f9fc;
  min-height: 100vh;
}

.dashboard-header {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.gap-2 {
  gap: 8px;
}

.gap-4 {
  gap: 16px;
}

.h-100 {
  height: 100%;
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.form-drawer {
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}

/* Estilos para scroll personalizado */
.company-wrapper::-webkit-scrollbar {
  width: 8px;
}

.company-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.company-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.company-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>