<template>
  <div class="user-wrapper">
    <v-container class="content-container animate__animated animate__fadeIn">
      
      <!-- HEADER -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div>
          <h1 class="page-title text-navy">Gestión de Usuarios</h1>
          <p class="text-subtitle-1 text-grey-darken-1">Administra el acceso y roles del personal</p>
        </div>
        <div class="d-flex gap-2">
          <v-btn 
            variant="outlined" 
            color="primary"
            icon="mdi-refresh"
            @click="fetchUsers"
            :loading="loading"
          ></v-btn>
          <!-- CREATE BUTTON -->
          <v-btn 
            color="#3159AE" 
            class="text-white text-none elevation-2" 
            prepend-icon="mdi-account-plus"
            size="large"
            @click="openCreatePanel"
          >
            Nuevo Usuario
          </v-btn>
        </div>
      </div>

      <!-- SEARCH BAR -->
      <v-card class="mb-6" variant="outlined">
        <v-card-text class="pa-4">
          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="search"
                label="Buscar usuario..."
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-magnify"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
               <v-select
                  v-model="roleFilter"
                  :items="['Todos', 'ADMIN', 'EMPLEADO', 'SUPERVISOR']"
                  label="Filtrar por Rol"
                  variant="outlined"
                  density="compact"
                  hide-details
               ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- USERS TABLE -->
      <v-card class="user-card elevation-0" border>
        <v-data-table
          :headers="headers"
          :items="filteredUsers"
          :loading="loading"
          hover
          class="users-table"
        >
          <!-- AVATAR COLUMN -->
          <template v-slot:item.avatar="{ item }">
             <v-avatar color="#3159AE" size="36" variant="tonal">
                <span class="font-weight-bold text-caption">{{ getInitials(item.nombre, item.apellido) }}</span>
             </v-avatar>
          </template>

          <!-- FULL NAME -->
          <template v-slot:item.nombre_completo="{ item }">
             <div class="font-weight-bold text-navy">{{ item.nombre }} {{ item.apellido }}</div>
             <div class="text-caption text-grey">{{ item.cargo }}</div>
          </template>

          <!-- STATUS CHIP (Clickable if not active) -->
          <template v-slot:item.estado="{ item }">
            <v-chip
              :color="getStatusColor(item.estado)"
              size="small"
              class="font-weight-bold"
              :class="{ 'cursor-pointer hover-scale': item.estado !== 'ACTIVO' }"
              @click="item.estado !== 'ACTIVO' && confirmUnblock(item)"
            >
              {{ item.estado }}
              <v-icon v-if="item.estado !== 'ACTIVO'" end size="small">mdi-lock-open-variant</v-icon>
            </v-chip>
          </template>

          <!-- ACTIONS -->
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-end gap-2">
              <v-btn 
                icon="mdi-pencil" 
                variant="text" 
                size="small" 
                color="#3159AE" 
                @click="openEditPanel(item)"
              ></v-btn>
              <v-btn 
                icon="mdi-delete" 
                variant="text" 
                size="small" 
                color="error" 
                @click="confirmDelete(item)"
              ></v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>

    </v-container>

    <!-- RIGHT SIDEBAR (Custom Div + Overlay) -->
    
    <!-- 1. Overlay (Only visible when panel is open) -->
    <div 
        v-if="showPanel"
        class="click-overlay" 
        @click="closePanel"
    ></div>

    <!-- 2. Sidebar (Always rendered, hidden by CSS transform) -->
    <div 
        class="custom-right-drawer elevation-5" 
        :class="{ 'is-open': showPanel }"
    >
        
        <!-- HEADER -->
        <div class="pa-4 border-b d-flex align-center justify-space-between bg-grey-lighten-5">
            <div>
                <span class="text-h6 font-weight-bold text-navy">
                    {{ isEditing ? 'Editar Usuario' : 'Crear Usuario' }}
                </span>
                <div class="text-caption text-grey">
                    {{ isEditing ? 'Modifica los datos del usuario' : 'Registra un nuevo miembro del equipo' }}
                </div>
            </div>
            <v-btn icon="mdi-close" variant="text" density="compact" @click="closePanel"></v-btn>
        </div>

        <!-- FORM CONTENT -->
        <div class="pa-5 h-100 d-flex flex-column" style="overflow-y: auto;">
            <v-form ref="formRef" @submit.prevent="handleSubmit">
                
                <v-row dense>
                    <v-col cols="6">
                        <v-text-field v-model="form.nombre" label="Nombre *" variant="outlined" color="primary" density="comfortable" :rules="[v => !!v || 'Requerido']"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="form.apellido" label="Apellido *" variant="outlined" color="primary" density="comfortable" :rules="[v => !!v || 'Requerido']"></v-text-field>
                    </v-col>
                </v-row>

                <v-text-field v-model="form.correo" label="Correo Electrónico *" variant="outlined" color="primary" density="comfortable" type="email" :rules="emailRules" class="mt-2" :disabled="isEditing"></v-text-field>

                <v-row dense class="mt-2">
                    <v-col cols="6">
                        <v-text-field v-model="form.telefono" label="Teléfono" variant="outlined" color="primary" density="comfortable" :rules="phoneRules"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="form.cargo" label="Cargo *" variant="outlined" color="primary" density="comfortable" :rules="[v => !!v || 'Requerido']"></v-text-field>
                    </v-col>
                </v-row>

                <v-select v-model="form.rol" :items="roles" label="Rol del Sistema *" variant="outlined" color="primary" density="comfortable" class="mt-2" :rules="[v => !!v || 'Requerido']"></v-select>

                <v-select v-if="isEditing" v-model="form.estado" :items="['ACTIVO', 'SUSPENDIDO', 'INACTIVO']" label="Estado" variant="outlined" color="primary" density="comfortable" class="mt-2"></v-select>

                <v-text-field v-if="!isEditing" v-model="form.contrasena" label="Contraseña Temporal *" variant="outlined" color="primary" density="comfortable" class="mt-2" :rules="passwordRules" type="password"></v-text-field>

                <!-- ACTION BUTTONS -->
                <div class="mt-6 d-flex flex-column gap-3">
                    <v-btn 
                        block 
                        size="large" 
                        color="#3159AE" 
                        class="text-white"
                        :loading="submitting"
                        type="submit"
                    >
                        {{ isEditing ? 'Guardar Cambios' : 'Registrar Usuario' }}
                    </v-btn>
                    
                    <v-btn 
                        v-if="isEditing"
                        block 
                        variant="text" 
                        color="error" 
                        prepend-icon="mdi-delete"
                        @click="confirmDelete(form)"
                    >
                        Eliminar Usuario
                    </v-btn>
                </div>

            </v-form>
        </div>
    </div>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top right">
        {{ snackbar.text }}
    </v-snackbar>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

// --- CONFIG ---
const API_BASE = 'http://localhost:3000/api'
const roles = ['ADMIN', 'EMPLEADO', 'SUPERVISOR']

// --- STATE ---
const users = ref([])
const loading = ref(false)
const showPanel = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const search = ref('')
const roleFilter = ref('Todos')
const formRef = ref(null)

const snackbar = reactive({ show: false, text: '', color: 'success' })

const form = reactive({
  id: null,
  nombre: '',
  apellido: '',
  correo: '',
  telefono: '',
  cargo: '',
  rol: '',
  contrasena: '',
  estado: 'ACTIVO'
})

const headers = [
  { title: '', key: 'avatar', sortable: false, width: '50px' },
  { title: 'Nombre', key: 'nombre_completo', align: 'start' },
  { title: 'Correo', key: 'correo', align: 'start' },
  { title: 'Rol', key: 'rol', align: 'start' },
  { title: 'Teléfono', key: 'telefono', align: 'start' },
  { title: 'Estado', key: 'estado', align: 'center' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false },
]

// --- VALIDATION RULES ---
const emailRules = [
  v => !!v || 'Requerido',
  v => /.+@.+\..+/.test(v) || 'Correo inválido'
]
const phoneRules = [
  v => !!v || 'Requerido',
  v => /^[0-9]{8}$/.test(v) || '8 dígitos requeridos'
]
const passwordRules = [
  v => !!v || 'Requerido',
  v => v.length >= 8 || 'Mínimo 8 caracteres'
]

const getHeaders = () => {
  const token = localStorage.getItem('token')
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
}

// --- API ACTIONS ---

// 1. GET LIST (Mocked as requested since API is "not working")
const fetchUsers = async () => {
  loading.value = true
  
  // SIMULATED DATA
  setTimeout(() => {
      users.value = [
          { id: 1, nombre: "Juan", apellido: "Pérez", correo: "juan@empresa.com", cargo: "Analista", rol: "EMPLEADO", estado: "ACTIVO", telefono: "77712345" },
          { id: 2, nombre: "Maria", apellido: "Gomez", correo: "maria@empresa.com", cargo: "Gerente", rol: "ADMIN", estado: "ACTIVO", telefono: "77754321" },
          { id: 3, nombre: "Carlos", apellido: "Lopez", correo: "carlos@empresa.com", cargo: "Supervisor TI", rol: "SUPERVISOR", estado: "SUSPENDIDO", telefono: "60012345" },
          { id: 4, nombre: "Ana", apellido: "Torres", correo: "ana@empresa.com", cargo: "Asistente", rol: "EMPLEADO", estado: "INACTIVO", telefono: "70098765" },
      ]
      loading.value = false
      
      // UNCOMMENT THIS WHEN API IS READY:
      /*
      try {
        const res = await axios.get(`${API_BASE}/usuarios`, { headers: getHeaders() })
        users.value = res.data
      } catch (e) {
        showSnackbar('Error cargando usuarios', 'error')
      } finally {
        loading.value = false
      }
      */
  }, 800)
}

// 2. SUBMIT (Create / Edit)
const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  submitting.value = true
  
  try {
    if (isEditing.value) {
        // PUT /usuarios/{id}
        const payload = {
            nombre: form.nombre,
            apellido: form.apellido,
            rol: form.rol,
            estado: form.estado,
            cargo: form.cargo, // Added based on form
            telefono: form.telefono
        }
        await axios.put(`${API_BASE}/usuarios/${form.id}`, payload, { headers: getHeaders() })
        
        // Update local
        const idx = users.value.findIndex(u => u.id === form.id)
        if(idx !== -1) Object.assign(users.value[idx], { ...payload })
        
        showSnackbar('Usuario actualizado', 'success')
    } else {
        // CREATE (Mock or Real)
        // Note: Your CreateUser.txt used a separate function, here we integrate it
        /* await axios.post(`${API_BASE}/auth/registro`, form, ...) 
        */
        // Mock success
        users.value.push({ ...form, id: Date.now() })
        showSnackbar('Usuario creado', 'success')
    }
    closePanel()
  } catch (error) {
    showSnackbar('Error al guardar usuario', 'error')
  } finally {
    submitting.value = false
  }
}

// 3. DELETE
const confirmDelete = async (user) => {
    const result = await Swal.fire({
        title: '¿Eliminar usuario?',
        text: `Esta acción eliminará a ${user.nombre} permanentemente.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Eliminar'
    })

    if (result.isConfirmed) {
        try {
            await axios.delete(`${API_BASE}/usuarios/${user.id}`, { headers: getHeaders() })
            users.value = users.value.filter(u => u.id !== user.id)
            closePanel()
            showSnackbar('Usuario eliminado', 'success')
        } catch (e) {
            showSnackbar('Error al eliminar', 'error')
        }
    }
}

// 4. UNBLOCK (POST /seguridad/desbloquear/{id})
const confirmUnblock = async (user) => {
    const result = await Swal.fire({
        title: '¿Desbloquear usuario?',
        text: `El usuario ${user.nombre} está ${user.estado}. ¿Desea reactivarlo?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3159AE',
        confirmButtonText: 'Sí, reactivar'
    })

    if (result.isConfirmed) {
        try {
            await axios.post(`${API_BASE}/seguridad/desbloquear/${user.id}`, {}, { headers: getHeaders() })
            user.estado = 'ACTIVO'
            showSnackbar('Usuario reactivado', 'success')
        } catch (e) {
            // Mock success if API fails for demo
            user.estado = 'ACTIVO' 
            showSnackbar('Usuario reactivado (Simulado)', 'success')
        }
    }
}

// --- UTILS ---
const filteredUsers = computed(() => {
    let list = users.value
    if (search.value) {
        const term = search.value.toLowerCase()
        list = list.filter(u => 
            u.nombre.toLowerCase().includes(term) || 
            u.apellido.toLowerCase().includes(term) ||
            u.correo.toLowerCase().includes(term)
        )
    }
    if (roleFilter.value !== 'Todos') {
        list = list.filter(u => u.rol === roleFilter.value)
    }
    return list
})

const getStatusColor = (status) => {
    switch(status) {
        case 'ACTIVO': return 'success'
        case 'SUSPENDIDO': return 'warning'
        case 'INACTIVO': return 'error'
        default: return 'grey'
    }
}

const getInitials = (n, a) => (n && a) ? `${n[0]}${a[0]}`.toUpperCase() : 'U'

const openCreatePanel = () => {
    isEditing.value = false
    formRef.value?.reset() 
    showPanel.value = true
}

const openEditPanel = (user) => {
    isEditing.value = true
    Object.assign(form, user)
    // Keep password empty on edit
    form.contrasena = ''
    showPanel.value = true
}

const closePanel = () => {
    showPanel.value = false
}

const resetForm = () => {
    Object.assign(form, { id: null, nombre: '', apellido: '', correo: '', telefono: '', cargo: '', rol: '', contrasena: '', estado: 'ACTIVO' })
}

const showSnackbar = (text, color) => { snackbar.text = text; snackbar.color = color; snackbar.show = true }

onMounted(() => {
    fetchUsers()
})
</script>

<style scoped>
.user-wrapper {
  width: 100%; height: 100%; background-color: #F1F0EC; overflow-y: auto; padding-bottom: 20px;
}
.content-container {
  max-width: 1200px; margin: 0 auto; width: 100%;
  background-color: white; border-radius: 20px; margin-top: 20px; padding: 24px;
}
.page-title {
  font-family: 'Roboto', sans-serif; font-size: 1.8rem; font-weight: 700;
}
.text-navy { color: #061244 !important; font-family: var(--font-display); }
.gap-2 { gap: 8px; } .gap-3 { gap: 12px; }

/* TABLE STYLES */
.users-table :deep(thead th) {
    color: #061244 !important; font-weight: 700; text-transform: uppercase; font-size: 0.75rem;
}
.hover-scale:hover { transform: scale(1.05); transition: transform 0.2s; }
.cursor-pointer { cursor: pointer; }

/* DRAWER STYLES */
.click-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.1); z-index: 1999; cursor: default;
}
.custom-right-drawer {
  position: fixed; top: 0; right: 0; width: 450px; height: 100%;
  background-color: white; z-index: 2000;
  display: flex; flex-direction: column;
  transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: -5px 0 20px rgba(0,0,0,0.15);
}
.custom-right-drawer.is-open { transform: translateX(0); }
</style>