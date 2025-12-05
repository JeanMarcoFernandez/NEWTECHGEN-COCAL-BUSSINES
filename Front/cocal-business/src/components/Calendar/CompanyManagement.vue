<template>
  <div class="company-wrapper">
    <CompanyList 
      v-if="currentView === 'list'"
      @enter-company="enterCompany"
      @refresh="fetchCompanies"
      @create="openCreatePanel"
      @edit="openEditPanel"
      @delete="confirmDeleteCompany"
    />
    
    <CompanyDashboard 
      v-else-if="currentView === 'dashboard' && selectedCompany"
      :company="selectedCompany"
      @exit="exitCompany"
      @edit="openEditPanel"
      @refresh="fetchCompanyDetails"
      @delete="confirmDeleteCompany"
    />
    
    <CompanyForm
      :show="showFormPanel"
      :company="formCompany"
      :is-editing="isEditing"
      @close="closeFormPanel"
      @submit="submitForm"
    />
    
    <NotificationSnackbar
      :show="showSnackbar"
      :message="snackbarMessage"
      :color="snackbarColor"
      @close="showSnackbar = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCompanyApi } from '@/api/useCompanyApi'
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

// Manejo de estado del navegador
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
  padding-top: 140px;
  overflow-y: auto;
}

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