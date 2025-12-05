import { ref } from 'vue'
import axios from 'axios'

const API_BASE = 'http://localhost:3000/api'

// Estado reactivo
const companies = ref([])
const loading = ref(false)
const loadingDetails = ref(false)
const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Headers de autenticación
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

// Notificaciones
const showNotification = (message, color = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  showSnackbar.value = true
}

// Funciones de API
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
    handleApiError(error, 'cargar empresas')
  } finally {
    loading.value = false
  }
}

const fetchCompanyDetails = async (id) => {
  if (!id) return
  
  loadingDetails.value = true
  try {
    const response = await axios.get(`${API_BASE}/empresas/${id}`, {
      headers: getHeaders(),
      validateStatus: status => status === 200
    })
    
    return response.data
  } catch (error) {
    handleApiError(error, 'cargar detalles')
  } finally {
    loadingDetails.value = false
  }
}

const createCompany = async (companyData) => {
  try {
    const response = await axios.post(`${API_BASE}/empresas`, companyData, {
      headers: getHeaders(),
      validateStatus: status => status === 201
    })
    
    return response.data
  } catch (error) {
    throw handleApiError(error, 'crear empresa', true)
  }
}

const updateCompany = async (id, companyData) => {
  try {
    const response = await axios.put(`${API_BASE}/empresas/${id}`, companyData, {
      headers: getHeaders(),
      validateStatus: status => status === 200
    })
    
    return response.data
  } catch (error) {
    throw handleApiError(error, 'actualizar empresa', true)
  }
}

const deleteCompany = async (id) => {
  try {
    await axios.delete(`${API_BASE}/empresas/${id}`, {
      headers: getHeaders(),
      validateStatus: status => status === 204
    })
    
    return true
  } catch (error) {
    throw handleApiError(error, 'eliminar empresa', true)
  }
}

// Manejo de errores
const handleApiError = (error, action, throwError = false) => {
  console.error(`Error al ${action}:`, error)
  
  let errorMessage = `Error al ${action}`
  
  if (error.response?.status === 401) {
    errorMessage = 'Sesión expirada. Por favor, inicie sesión nuevamente.'
  } else if (error.response?.status === 403) {
    errorMessage = 'No tiene permisos para realizar esta acción.'
  } else if (error.response?.status === 404) {
    errorMessage = 'Recurso no encontrado.'
  } else if (error.response?.status === 400) {
    errorMessage = error.response?.data?.message || 'Datos inválidos.'
  }
  
  if (!throwError) {
    showNotification(errorMessage, 'error')
  } else {
    return new Error(errorMessage)
  }
}

// Rubros predefinidos
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

export function useCompanyApi() {
  return {
    // Estado
    companies,
    loading,
    loadingDetails,
    showSnackbar,
    snackbarMessage,
    snackbarColor,
    
    // Funciones
    fetchCompanies,
    fetchCompanyDetails,
    createCompany,
    updateCompany,
    deleteCompany,
    showNotification,
    
    // Datos
    rubrosOptions
  }
}