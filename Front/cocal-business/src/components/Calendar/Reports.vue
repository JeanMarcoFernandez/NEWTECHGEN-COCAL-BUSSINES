<template>
  <v-container class="fill-height align-start justify-center pa-10 mb-6" style="background-color: white;border-radius: 20px;">
    
    <!-- HEADER CONTROLS -->
    <div class="report-controls d-flex justify-space-between align-center w-100 mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold text-navy">Centro de Reportes</h2>
        <p class="text-body-2 text-grey">Generación de informes detallados del sistema</p>
      </div>
    </div>

    <!-- MAIN CONTENT AREA -->
    <div class="w-100">
      
      <!-- 1. CORPORATE REPORT (Existing - Collapsed by default or kept as first panel) -->
      <!-- I will wrap the existing report in a panel to match the new structure request -->
      <v-expansion-panels v-model="panel" multiple>
        
        <!-- PANEL 1: REPORTE CORPORATIVO (The previous content) -->
        <v-expansion-panel value="corporate">
          <v-expansion-panel-title class="text-h6 font-weight-bold text-navy">
            <v-icon color="primary" class="mr-3">mdi-chart-box</v-icon>
            Reporte Corporativo General
          </v-expansion-panel-title>
          <v-expansion-panel-text>
             <div class="d-flex justify-end mb-4">
                <v-btn color="#3159AE" class="text-white" prepend-icon="mdi-file-pdf-box" :loading="generating" @click="downloadPDF('report-corporate')">
                  Descargar PDF
                </v-btn>
             </div>
             <!-- Wrap the existing report layout in a specific ID for PDF capture -->
             <div id="report-corporate" class="report-paper elevation-3 bg-white">
            
            <!-- 1. HEADER -->
            <div class="pa-8 pb-4 border-b">
                <div class="d-flex justify-space-between align-center">
                <div class="d-flex align-center">
                    <v-avatar color="#3159AE" size="52" class="mr-4 rounded-lg">
                    <v-icon color="white" size="32">mdi-chart-box</v-icon>
                    </v-avatar>
                    <div>
                    <h1 class="text-h4 font-weight-bold text-primary mb-0" style="font-family: 'Funnel Display', sans-serif !important;">COCAL Analytics</h1>
                    <div class="text-subtitle-2 text-grey-darken-1">Informe Mensual de Gestión</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-caption text-grey">Generado: {{ new Date().toLocaleDateString() }}</div>
                    <div class="text-caption text-grey">Periodo: 2025</div>
                </div>
                </div>
            </div>

            <!-- 2. EXECUTIVE SUMMARY (Corporate Data) -->
            <div class="pa-8 py-6 bg-blue-lighten-5">
                <h3 class="text-subtitle-1 font-weight-bold text-navy mb-4 text-uppercase">Resumen Ejecutivo</h3>
                <v-row>
                <v-col cols="3" class="text-center border-r">
                    <div class="text-h4 font-weight-bold text-primary">{{ formatNumber(corporateData.totalReservations) }}</div>
                    <div class="text-caption font-weight-bold text-grey-darken-2">Reservas Totales</div>
                </v-col>
                <v-col cols="3" class="text-center border-r">
                    <div class="text-h4 font-weight-bold text-success">{{ corporateData.resourceUtilization }}%</div>
                    <div class="text-caption font-weight-bold text-grey-darken-2">Tasa Utilización</div>
                </v-col>
                <v-col cols="3" class="text-center border-r">
                    <div class="text-h4 font-weight-bold text-navy">{{ corporateData.activeUsers }}</div>
                    <div class="text-caption font-weight-bold text-grey-darken-2">Usuarios Activos</div>
                </v-col>
                <v-col cols="3" class="text-center">
                    <div class="text-h4 font-weight-bold text-orange-darken-2">{{ corporateData.satisfactionScore }}</div>
                    <div class="text-caption font-weight-bold text-grey-darken-2">Satisfacción (1-10)</div>
                </v-col>
                </v-row>
            </div>

            <div class="pa-8">
                
                <!-- 3. USAGE BY TYPE TABLE -->
                <div class="mb-8">
                <div class="d-flex align-center mb-3">
                    <v-icon color="#3159AE" class="mr-2">mdi-chart-pie</v-icon>
                    <h3 class="text-subtitle-1 font-weight-bold text-navy text-uppercase">Uso de Recursos por Categoría</h3>
                </div>
                
                <v-table density="compact" class="report-table">
                    <thead>
                    <tr>
                        <th class="text-left font-weight-bold">Categoría</th>
                        <th class="text-right font-weight-bold">Cantidad Reservas</th>
                        <th class="text-right font-weight-bold">% del Total</th>
                        <th class="text-center font-weight-bold">Tendencia</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, i) in corporateData.usageByType" :key="i">
                        <td class="font-weight-medium text-navy">{{ item.type }}</td>
                        <td class="text-right">{{ formatNumber(item.count) }}</td>
                        <td class="text-right">
                        <v-progress-linear 
                            :model-value="item.percentage" 
                            color="primary" 
                            height="6" 
                            rounded 
                            style="width: 100px; display: inline-block; vertical-align: middle;"
                            class="mr-2"
                        ></v-progress-linear>
                        {{ item.percentage }}%
                        </td>
                        <td class="text-center">
                        <v-icon 
                            size="small" 
                            :color="getTrendColor(item.trend)"
                        >
                            {{ getTrendIcon(item.trend) }}
                        </v-icon>
                        </td>
                    </tr>
                    </tbody>
                </v-table>
                </div>

                <!-- 4. BENCHMARKING TABLE -->
                <div class="mb-8">
                <div class="d-flex align-center mb-3">
                    <v-icon color="#3159AE" class="mr-2">mdi-trophy</v-icon>
                    <h3 class="text-subtitle-1 font-weight-bold text-navy text-uppercase">Ranking Departamental (Top 5)</h3>
                </div>

                <v-table density="compact" class="report-table">
                    <thead>
                    <tr>
                        <th class="text-center font-weight-bold" width="50">#</th>
                        <th class="text-left font-weight-bold">Departamento</th>
                        <th class="text-center font-weight-bold">Eficiencia</th>
                        <th class="text-center font-weight-bold">Satisfacción</th>
                        <th class="text-right font-weight-bold">Costo/Hora</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="dept in topDepartments" :key="dept.departmentId">
                        <td class="text-center">
                        <div 
                            class="rounded-circle d-flex align-center justify-center mx-auto text-white font-weight-bold"
                            :style="`width: 24px; height: 24px; background-color: ${getRankColor(dept.ranking)}`"
                        >
                            {{ dept.ranking }}
                        </div>
                        </td>
                        <td class="font-weight-bold text-navy">{{ dept.departmentName }}</td>
                        <td class="text-center">
                        <span :class="getScoreColor(dept.efficiency, true)">{{ dept.efficiency }}%</span>
                        </td>
                        <td class="text-center">{{ dept.satisfactionScore }}</td>
                        <td class="text-right">${{ dept.costPerHour }}</td>
                    </tr>
                    </tbody>
                </v-table>
                </div>
            </div>

            <!-- FOOTER -->
            <div class="pa-8 pt-4 mt-auto border-t d-flex justify-space-between align-end">
                <div>
                <p class="text-caption text-grey mb-0">New Tech Gen() - COCAL Business</p>
                <p class="text-caption text-grey mb-0">Av. 14 de Septiembre Nº 4807 esquina, La Paz</p>
                </div>
            </div>

            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- PANEL 2: USUARIOS -->
        <v-expansion-panel value="users">
          <v-expansion-panel-title class="text-h6 font-weight-bold text-navy">
            <v-icon color="success" class="mr-3">mdi-account-group</v-icon>
            Reporte de Usuarios
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="d-flex justify-end align-center mb-4">
                <v-btn color="#3159AE" class="text-white" prepend-icon="mdi-file-pdf-box" @click="downloadPDF('report-users')">Descargar PDF</v-btn>
                <v-btn class="ml-3" variant="outlined" color="primary" @click="fetchUsers" :loading="loadingUsers" icon="mdi-reload" size="small"/>
            </div>
            
            <div id="report-users" class="report-paper elevation-1 bg-white pa-8">
                <div class="d-flex justify-space-between align-center">
                <div class="report-header mb-4">
                    <h2 class="text-h5 font-weight-bold text-navy">Listado de Usuarios</h2>
                    <p class="text-caption text-grey">Personal registrado con departamento asignado</p>
                </div>
                <div class="text-right">
                    <div class="text-caption text-grey">Generado: {{ new Date().toLocaleDateString() }}</div>
                    <div class="text-caption text-grey">Periodo: 2025</div>
                </div>
                </div>
                <v-table density="compact" class="report-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre Completo</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Empresa / Dept</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in userList" :key="user.id">
                            <td>{{ user.id }}</td>
                            <td class="font-weight-medium">{{ user.nombre }} {{ user.apellido }}</td>
                            <td class="text-caption">{{ user.correo }}</td>
                            <td><v-chip size="x-small" color="primary" variant="flat">{{ user.rol }}</v-chip></td>
                            <td>
                                <div class="text-caption font-weight-bold">{{ user.empresa?.nombre }}</div>
                                <div class="text-caption text-grey">{{ user.departamento?.nombre }}</div>
                            </td>
                            <td><span :class="user.estado === 'ACTIVO' ? 'text-success' : 'text-error'">{{ user.estado }}</span></td>
                        </tr>
                        <tr v-if="userList.length === 0"><td colspan="6" class="text-center text-grey py-4">No hay datos disponibles</td></tr>
                    </tbody>
                </v-table>
                <!-- FOOTER -->
                <div class="pt-8 mt-auto border-t d-flex justify-space-between align-end">
                    <div>
                    <p class="text-caption text-grey mb-0">New Tech Gen() - COCAL Business</p>
                    <p class="text-caption text-grey mb-0">Av. 14 de Septiembre Nº 4807 esquina, La Paz</p>
                    </div>
                </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- PANEL 3: HISTORIAL DE RESERVAS -->
        <v-expansion-panel value="reservations">
          <v-expansion-panel-title class="text-h6 font-weight-bold text-navy">
            <v-icon color="warning" class="mr-3">mdi-calendar-clock</v-icon>
            Historial de Reservas
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="d-flex justify-end align-center mb-4">
                <v-btn color="#3159AE" class="text-white" prepend-icon="mdi-file-pdf-box" @click="downloadPDF('report-reservations')">Descargar PDF</v-btn>
                <v-btn class="ml-3" variant="outlined" color="primary" @click="fetchReservations" :loading="loadingUsers" icon="mdi-reload" size="small"/>
            </div>

            <div id="report-reservations" class="report-paper elevation-1 bg-white pa-8">
                <div class="d-flex justify-space-between align-center">
                <div class="report-header mb-4">
                    <h2 class="text-h5 font-weight-bold text-navy">Historial de Reservas</h2>
                    <p class="text-caption text-grey">Registro completo de movimientos</p>
                </div>
                <div class="text-right">
                    <div class="text-caption text-grey">Generado: {{ new Date().toLocaleDateString() }}</div>
                    <div class="text-caption text-grey">Periodo: 2025</div>
                </div>
                </div>
                <div class="d-flex justify-space-between align-center"></div>
                <v-table density="compact" class="report-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Recurso ID</th>
                            <th>Motivo</th>
                            <th>Inicio</th>
                            <th>Fin</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="res in reservationHistory" :key="res.id">
                            <td>{{ res.id }}</td>
                            <td>{{ res.id_recurso }}</td>
                            <td>{{ res.motivo }}</td>
                            <td class="text-caption">{{ formatDate(res.fecha_inicio) }}</td>
                            <td class="text-caption">{{ formatDate(res.fecha_fin) }}</td>
                            <td>
                                <v-chip size="x-small" :color="getStatusColor(res.estado)" variant="flat">{{ res.estado }}</v-chip>
                            </td>
                        </tr>
                        <tr v-if="reservationHistory.length === 0"><td colspan="6" class="text-center text-grey py-4">No hay datos disponibles</td></tr>
                    </tbody>
                </v-table>
                <!-- FOOTER -->
                <div class="pt-8 mt-auto border-t d-flex justify-space-between align-end">
                    <div>
                    <p class="text-caption text-grey mb-0">New Tech Gen() - COCAL Business</p>
                    <p class="text-caption text-grey mb-0">Av. 14 de Septiembre Nº 4807 esquina, La Paz</p>
                    </div>
                </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- PANEL 4: MANTENIMIENTO -->
        <v-expansion-panel value="maintenance">
          <v-expansion-panel-title class="text-h6 font-weight-bold text-navy">
            <v-icon color="error" class="mr-3">mdi-tools</v-icon>
            Reporte de Mantenimiento
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <!-- Resource Selector -->
            <v-row class="mb-4 align-center">
                <v-col cols="12" md="6">
                    <v-autocomplete
                        v-model="selectedResource"
                        :items="resourcesList"
                        item-title="nombre"
                        item-value="id"
                        label="Seleccionar Recurso"
                        variant="outlined"
                        density="compact"
                        hide-details
                        prepend-inner-icon="mdi-cube-outline"
                        @update:model-value="fetchMaintenanceHistory"
                        return-object
                    ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" class="d-flex justify-end">
                    <v-btn color="#3159AE" class="text-white" prepend-icon="mdi-file-pdf-box" :disabled="!selectedResource" @click="downloadPDF('report-maintenance')">Descargar PDF</v-btn>
                </v-col>
            </v-row>

            <div id="report-maintenance" class="report-paper elevation-1 bg-white pa-8" v-if="selectedResource">
                <div class="report-header mb-4 border-b pb-2">
                    <div class="d-flex justify-space-between">
                        <div>
                            <h2 class="text-h5 font-weight-bold text-navy">Historial de Mantenimiento</h2>
                            <p class="text-subtitle-1 text-primary font-weight-bold">{{ selectedResource.nombre }}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-caption text-grey">Generado: {{ new Date().toLocaleDateString() }}</div>
                            <div class="text-caption text-grey">Periodo: 2025</div>
                        </div>
                    </div>
                    <p class="text-caption text-grey mt-1">{{ selectedResource.descripcion }} | Ubicación: {{ selectedResource.ubicacion }}</p>
                    <v-chip class="mt-2" size="small" :color="selectedResource.en_mantenimiento ? 'error' : 'success'">
                        {{ selectedResource.en_mantenimiento ? 'EN MANTENIMIENTO' : 'OPERATIVO' }}
                    </v-chip>
                </div>

                <v-table density="compact" class="report-table">
                    <thead>
                        <tr>
                            <th>Fecha Real</th>
                            <th>Tipo</th>
                            <th>Descripción</th>
                            <th>Proveedor</th>
                            <th class="text-right">Costo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="maint in maintenanceHistory" :key="maint.id">
                            <td>{{ formatDate(maint.fecha_real) }}</td>
                            <td class="text-uppercase font-weight-medium">{{ maint.tipo }}</td>
                            <td>{{ maint.descripcion }}</td>
                            <td>{{ maint.proveedor }}</td>
                            <td class="text-right font-weight-bold">{{ maint.costo }} Bs</td>
                        </tr>
                        <tr v-if="maintenanceHistory.length === 0"><td colspan="5" class="text-center text-grey py-4">No hay registros de mantenimiento</td></tr>
                    </tbody>
                </v-table>
                <!-- FOOTER -->
                <div class="pt-8 pt-4 mt-auto border-t d-flex justify-space-between align-end">
                    <div>
                    <p class="text-caption text-grey mb-0">New Tech Gen() - COCAL Business</p>
                    <p class="text-caption text-grey mb-0">Av. 14 de Septiembre Nº 4807 esquina, La Paz</p>
                </div>
            </div>
            </div>
            <div v-else class="text-center py-8 text-grey">Seleccione un recurso para ver su reporte</div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- PANEL 5: LOGS DE AUDITORIA -->
        <v-expansion-panel value="logs">
          <v-expansion-panel-title class="text-h6 font-weight-bold text-navy">
            <v-icon color="grey-darken-3" class="mr-3">mdi-history</v-icon>
            Auditoría de Logins
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row class="mb-4 align-center">
                <v-col cols="12" md="3">
                    <v-text-field
                        v-model.number="logLimit"
                        label="Límite de registros"
                        type="number"
                        variant="outlined"
                        density="compact"
                        hide-details
                        min="1"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                    <v-btn variant="tonal" color="secondary" block @click="fetchLogs">Cargar Logs</v-btn>
                </v-col>
                <v-col cols="12" md="6" class="text-end">
                    <v-btn color="#3159AE" class="text-white" prepend-icon="mdi-file-pdf-box" @click="downloadPDF('report-logs')">Descargar PDF</v-btn>
                </v-col>
            </v-row>

            <div id="report-logs" class="report-paper elevation-1 bg-white pa-8">
                <div class="d-flex justify-space-between">
                <div class="report-header mb-4">
                    <h2 class="text-h5 font-weight-bold text-navy">Auditoría de Accesos</h2>
                    <p class="text-caption text-grey">Últimos {{ loginLogs.length }} intentos de inicio de sesión</p>
                </div>
                <div class="text-right">
                    <div class="text-caption text-grey">Generado: {{ new Date().toLocaleDateString() }}</div>
                    <div class="text-caption text-grey">Periodo: 2025</div>
                </div>
                </div>
                <v-table density="compact" class="report-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Usuario / Correo</th>
                            <th>IP</th>
                            <th>Resultado</th>
                            <th>Motivo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="log in loginLogs" :key="log.id">
                            <td class="text-caption font-family-mono">{{ formatDate(log.creado_en) }}</td>
                            <td>
                                <div class="font-weight-medium">{{ log.correo }}</div>
                                <div class="text-caption text-grey">ID: {{ log.usuario_id }}</div>
                            </td>
                            <td class="text-caption">{{ log.ip }}</td>
                            <td>
                                <v-icon :color="log.exito ? 'success' : 'error'" size="small">
                                    {{ log.exito ? 'mdi-check-circle' : 'mdi-close-circle' }}
                                </v-icon>
                                <span class="ml-1 text-caption">{{ log.exito ? 'Éxito' : 'Fallido' }}</span>
                            </td>
                            <td class="text-caption">{{ log.motivo }}</td>
                        </tr>
                    </tbody>
                </v-table>
                <!-- FOOTER -->
                <div class="pt-8 pt-4 mt-auto border-t d-flex justify-space-between align-end">
                    <div>
                    <p class="text-caption text-grey mb-0">New Tech Gen() - COCAL Business</p>
                    <p class="text-caption text-grey mb-0">Av. 14 de Septiembre Nº 4807 esquina, La Paz</p>
                    </div>
                </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

      </v-expansion-panels>

    </div>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import axios from 'axios'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const API_BASE = 'http://localhost:3000/api'
const panel = ref(['corporate']) // Default open panels
const generating = ref(false)

// --- AUTH HEADER ---
const getHeaders = () => {
  const token = localStorage.getItem('token')
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
}

const corporateData = ref({
  totalReservations: 12458,
  activeUsers: 347,
  resourceUtilization: 78,
  departmentsCount: 7,
  activeDepartments: 6,
  satisfactionScore: 8.7,
  usageByType: [
    { type: 'Salas de Reunión', count: 4520, percentage: 36, trend: 'up' },
    { type: 'Computadores', count: 3210, percentage: 26, trend: 'up' },
    { type: 'Proyectores', count: 1980, percentage: 16, trend: 'stable' },
    { type: 'Vehículos', count: 1560, percentage: 13, trend: 'down' },
    { type: 'Equipos Especiales', count: 1188, percentage: 9, trend: 'up' }
  ]
})

const benchmarkingData = ref({
  departments: [
    { departmentId: 1, departmentName: 'TI', utilizationRate: 82, efficiency: 88, satisfactionScore: 9.2, ranking: 1, costPerHour: 42 },
    { departmentId: 2, departmentName: 'Ventas', utilizationRate: 75, efficiency: 85, satisfactionScore: 8.8, ranking: 2, costPerHour: 38 },
    { departmentId: 5, departmentName: 'Finanzas', utilizationRate: 79, efficiency: 82, satisfactionScore: 8.5, ranking: 3, costPerHour: 45 },
    { departmentId: 4, departmentName: 'RRHH', utilizationRate: 72, efficiency: 78, satisfactionScore: 8.9, ranking: 4, costPerHour: 32 },
    { departmentId: 6, departmentName: 'Operaciones', utilizationRate: 65, efficiency: 72, satisfactionScore: 7.8, ranking: 5, costPerHour: 28 }
  ]
})

const topDepartments = computed(() => {
  return benchmarkingData.value.departments.sort((a, b) => a.ranking - b.ranking).slice(0, 5)
})

const highSeverityAlerts = computed(() => {
  return trendAlerts.value.filter(a => a.severity === 'high')
})

const getTrendIcon = (trend) => {
  if (trend === 'up') return 'mdi-arrow-up'
  if (trend === 'down') return 'mdi-arrow-down'
  return 'mdi-minus'
}

const getTrendColor = (trend) => {
  if (trend === 'up') return 'success'
  if (trend === 'down') return 'error'
  return 'grey'
}

const getRankColor = (rank) => {
  if (rank === 1) return '#FFD700' // Gold
  if (rank === 2) return '#C0C0C0' // Silver
  if (rank === 3) return '#CD7F32' // Bronze
  return '#90A4AE'
}

const getScoreColor = (score, isText = false) => {
  let colorClass = ''
  if (score >= 85) colorClass = 'text-success'
  else if (score >= 70) colorClass = 'text-info'
  else colorClass = 'text-warning'
  return isText ? colorClass : ''
}

// --- 2. USERS DATA ---
const userList = ref([])
const loadingUsers = ref(false)

const fetchUsers = async () => {
    loadingUsers.value = true
    try {
        const res = await axios.get(`${API_BASE}/usuarios-miembros/con-departamento`, { headers: getHeaders() })
        userList.value = res.data
    } catch (e) { console.error(e) } 
    finally { loadingUsers.value = false }
}

// --- 3. RESERVATIONS DATA ---
const reservationHistory = ref([])
const loadingReservations = ref(false)

const fetchReservations = async () => {
    loadingReservations.value = true
    try {
        const res = await axios.get(`${API_BASE}/reservas-recursos/historial`, { headers: getHeaders() })
        reservationHistory.value = res.data
    } catch (e) { console.error(e) }
    finally { loadingReservations.value = false }
}

// --- 4. MAINTENANCE DATA ---
const resourcesList = ref([])
const selectedResource = ref(null)
const maintenanceHistory = ref([])

const fetchResources = async () => {
    try {
        const res = await axios.get(`${API_BASE}/recurso15`, { headers: getHeaders() })
        resourcesList.value = res.data.recursos || []
    } catch (e) { console.error(e) }
}

const fetchMaintenanceHistory = async (resource) => {
    if(!resource) return
    try {
        const res = await axios.get(`${API_BASE}/mantenimiento/historial/${resource.id}`, { headers: getHeaders() })
        maintenanceHistory.value = res.data.historial || []
    } catch (e) { console.error(e) }
}

// --- 5. LOGS DATA ---
const loginLogs = ref([])
const logLimit = ref(50)

const fetchLogs = async () => {
    try {
        // Assuming API might accept a limit query param, though not specified in prompt, I'll allow the UI to set it
        const res = await axios.get(`${API_BASE}/auditoria/logins?limit=${logLimit.value}`, { headers: getHeaders() })
        loginLogs.value = res.data.data || []
    } catch (e) { console.error(e) }
}

// --- UTILS ---
const formatNumber = (n) => new Intl.NumberFormat('es-ES').format(n)
const formatDate = (d) => {
    if(!d) return '-'
    return new Date(d).toLocaleString('es-ES', { 
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit' 
    })
}
const getStatusColor = (status) => {
    if(status === 'CONFIRMADO') return 'success'
    if(status === 'PENDIENTE_APROBACION') return 'warning'
    if(status === 'CANCELADO') return 'error'
    return 'grey'
}

// --- PDF GENERATOR (Generic) ---
const downloadPDF = async (elementId) => {
  generating.value = true
  const element = document.getElementById(elementId)
  
  if (!element) {
      alert("Elemento no encontrado")
      generating.value = false
      return
  }

  try {
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' })
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // Auto-paging logic
    const pageHeight = 297
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    window.open(pdf.output('bloburl'), '_blank')
  } catch (error) {
    console.error("PDF Error:", error)
  } finally {
    generating.value = false
  }
}

// Load initial data
onMounted(() => {
    fetchUsers()
    fetchReservations()
    fetchResources()
    fetchLogs()
})
</script>

<style scoped>
.report-paper {
  width: 100%;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
}

.text-navy { color: #061244 !important; }
.text-primary { color: #3159AE !important; }

.report-table th {
  text-transform: uppercase;
  font-size: 0.7rem;
  color: #061244 !important;
  background-color: #F5F5F5 !important;
  height: 40px !important;
}
.report-table td { font-size: 0.8rem; border-bottom: 1px solid #f0f0f0; }
.font-family-mono { font-family: monospace; }
</style>