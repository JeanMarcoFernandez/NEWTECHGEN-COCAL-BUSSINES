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
              <v-row>
                <v-col cols="12">
                  <v-btn 
                    block 
                    variant="outlined" 
                    color="primary"
                    append-icon="mdi-arrow-right"
                    @click.stop="enterCompany(company)"
                  >
                    Entrar al Panel
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <v-btn 
                    block 
                    variant="outlined" 
                    color="primary"
                    append-icon="mdi-arrow-right"
                    @click.stop="enterDepartment(company)"
                  >
                    Ver departamentos
                  </v-btn>
                </v-col>
              </v-row>
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
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="2000">
      <span>{{ snackbarMessage }}</span>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

import CompanyList from '@/Company/CompanyList.vue'
import CompanyDashboard from '@/Company/CompanyDashboard.vue'
import CompanyForm from '@/Company/CompanyForm.vue'
import NotificationSnackbar from '@/Company/NotificationSnackbar.vue'

// Estado
const currentView = ref('list')
const selectedCompany = ref(null)
const showFormPanel = ref(false)
const isEditing = ref(false)
const formCompany = ref(null)

// API y estado compartido
const {
  companies,
  loading,
  loadingDetails,
  showSnackbar,
  snackbarMessage,
  snackbarColor,
  fetchCompanies,
  fetchCompanyDetails,
  createCompany,
  updateCompany,
  deleteCompany,
  showNotification
} = useCompanyApi()

// Navegación
const enterCompany = async (company) => {
  selectedCompany.value = company
  currentView.value = 'dashboard'
  localStorage.setItem('currentCompany', JSON.stringify(company))
  window.history.pushState({ view: 'dashboard', companyId: company.id }, '')
  await fetchCompanyDetails(company.id)
}

const exitCompany = () => {
  selectedCompany.value = null
  currentView.value = 'list'
  localStorage.removeItem('currentCompany')
  if (window.history.state?.view === 'dashboard') {
    window.history.back()
  }
}

// Gestión de formulario
const openCreatePanel = () => {
  isEditing.value = false
  formCompany.value = null
  showFormPanel.value = true
}

const openEditPanel = (company) => {
  isEditing.value = true
  formCompany.value = { ...company }
  showFormPanel.value = true
}

const closeFormPanel = () => {
  showFormPanel.value = false
  formCompany.value = null
}

const submitForm = async (companyData) => {
  try {
    if (isEditing.value) {
      const result = await updateCompany(formCompany.value.id, companyData)
      
      // Actualizar en la lista
      const index = companies.value.findIndex(c => c.id === formCompany.value.id)
      if (index !== -1) {
        companies.value[index] = { ...companies.value[index], ...result }
      }
      
      // Si estamos viendo esta empresa, actualizar detalles
      if (selectedCompany.value?.id === formCompany.value.id) {
        selectedCompany.value = { ...selectedCompany.value, ...result }
      }
    } else {
      const result = await createCompany(companyData)
      companies.value.push(result)
    }
    
    showFormPanel.value = false
    showNotification(
      isEditing.value ? 'Empresa actualizada exitosamente' : 'Empresa creada exitosamente',
      'success'
    )
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: error.message,
      icon: 'error',
      confirmButtonText: 'Entendido'
    })
  }
}

// Eliminación
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
      companies.value = companies.value.filter(c => c.id !== company.id)
      
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

const router = useRouter()

const enterDepartment = (company) => {
  router.push({
    name: 'Departamentos',
    params: { 
      id: company.id 
    },
    query: {
      name: company.nombre
    }
  })
}

// Manejar botón "Atrás" del navegador
const handlePopState = (event) => {
  if (!event.state || event.state.view !== 'dashboard') {
    selectedCompany.value = null
    currentView.value = 'list'
    localStorage.removeItem('currentCompany')
  }
}

// Lifecycle
onMounted(async () => {
  window.addEventListener('popstate', handlePopState)
  
  // Restaurar estado previo
  const savedCompany = localStorage.getItem('currentCompany')
  if (savedCompany) {
    try {
      const company = JSON.parse(savedCompany)
      selectedCompany.value = company
      currentView.value = 'dashboard'
      await fetchCompanyDetails(company.id)
    } catch (e) {
      console.error('Error al restaurar empresa:', e)
      localStorage.removeItem('currentCompany')
    }
  }
  
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
  overflow-y: auto;
  margin-bottom: 20px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  background-color: white;
  border-radius: 20px;
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