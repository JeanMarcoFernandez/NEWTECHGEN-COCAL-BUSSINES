<template>
  <div class="analytics-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <h2>
        <v-icon icon="mdi-chart-line" class="mr-2"></v-icon>
        Dashboard de Analytics
      </h2>
      <div class="header-actions">
        <v-chip :color="getRoleColor(userRole)" dark class="mr-2">
          {{ userRole }}
        </v-chip>
        <v-btn
          v-if="userRole === 'ADMIN'"
          color="primary"
          @click="showKPIModal = true"
          size="small"
        >
          <v-icon icon="mdi-plus" class="mr-1"></v-icon>
          Nuevo KPI
        </v-btn>
        <v-btn
          color="secondary"
          @click="showConfigModal = true"
          size="small"
          class="ml-2"
        >
          <v-icon icon="mdi-cog" class="mr-1"></v-icon>
          Configurar
        </v-btn>
      </div>
    </div>

    <!-- Tabs -->
    <v-tabs v-model="activeTab" grow class="mb-4">
      <v-tab :value="0">
        <v-icon icon="mdi-office-building" start></v-icon>
        Corporativo
      </v-tab>
      <v-tab :value="1" :disabled="!hasDepartmentAccess">
        <v-icon icon="mdi-sitemap" start></v-icon>
        Departamento
      </v-tab>
      <v-tab :value="2" :disabled="userRole !== 'ADMIN'">
        <v-icon icon="mdi-trophy" start></v-icon>
        Benchmarking
      </v-tab>
      <v-tab :value="3" :disabled="!hasDepartmentAccess">
        <v-icon icon="mdi-bell" start></v-icon>
        Alertas
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <!-- Tab Corporativo -->
      <v-window-item :value="0">
        <div v-if="loading.corporate" class="loading-container">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <p class="mt-4">Cargando métricas corporativas...</p>
        </div>
        
        <div v-else-if="corporateData" class="corporate-view">
          <!-- Métricas principales -->
          <v-row dense>
            <v-col cols="12" sm="6" md="3">
              <v-card class="pa-3" variant="outlined">
                <div class="text-caption text-grey">Reservas Totales</div>
                <div class="text-h5 font-weight-bold">{{ formatNumber(corporateData.totalReservations) }}</div>
                <div class="text-caption text-green mt-1">
                  <v-icon icon="mdi-trending-up" size="small" class="mr-1"></v-icon>
                  +12% vs mes anterior
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-card class="pa-3" variant="outlined">
                <div class="text-caption text-grey">Usuarios Activos</div>
                <div class="text-h5 font-weight-bold">{{ formatNumber(corporateData.activeUsers) }}</div>
                <div class="text-caption text-green mt-1">
                  <v-icon icon="mdi-trending-up" size="small" class="mr-1"></v-icon>
                  +8% vs mes anterior
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-card class="pa-3" variant="outlined">
                <div class="text-caption text-grey">Utilización</div>
                <div class="text-h5 font-weight-bold">{{ corporateData.resourceUtilization }}%</div>
                <v-progress-linear
                  :model-value="corporateData.resourceUtilization"
                  color="primary"
                  height="6"
                  class="mt-2"
                ></v-progress-linear>
                <div class="text-caption text-grey mt-1">Meta: 85%</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-card class="pa-3" variant="outlined">
                <div class="text-caption text-grey">Departamentos</div>
                <div class="text-h5 font-weight-bold">{{ corporateData.departmentsCount }}</div>
                <div class="text-caption text-grey mt-1">
                  <v-icon icon="mdi-office-building" size="small" class="mr-1"></v-icon>
                  {{ corporateData.activeDepartments }} activos
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Tendencias -->
          <v-card class="mt-4" variant="outlined">
            <v-card-title class="text-subtitle-1">
              <v-icon icon="mdi-chart-line" class="mr-2"></v-icon>
              Tendencias Mensuales (Reservas)
            </v-card-title>
            <v-card-text>
              <div ref="trendChart" style="height: 250px;"></div>
            </v-card-text>
          </v-card>

          <!-- Uso por tipo -->
          <v-row class="mt-4">
            <v-col cols="12" md="6">
              <v-card variant="outlined">
                <v-card-title class="text-subtitle-1">
                  <v-icon icon="mdi-chart-pie" class="mr-2"></v-icon>
                  Uso por Tipo de Recurso
                </v-card-title>
                <v-card-text>
                  <div ref="usageChart" style="height: 250px;"></div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card variant="outlined">
                <v-card-title class="text-subtitle-1">
                  <v-icon icon="mdi-table" class="mr-2"></v-icon>
                  Distribución Detallada
                </v-card-title>
                <v-card-text>
                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Cantidad</th>
                        <th>Porcentaje</th>
                        <th>Tendencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in corporateData.usageByType" :key="item.type">
                        <td>
                          <v-icon :icon="getResourceIcon(item.type)" size="small" class="mr-2"></v-icon>
                          {{ item.type }}
                        </td>
                        <td>{{ formatNumber(item.count) }}</td>
                        <td>
                          <v-chip size="small" :color="getPercentageColor(item.percentage)">
                            {{ item.percentage }}%
                          </v-chip>
                        </td>
                        <td>
                          <v-icon 
                            :icon="item.trend === 'up' ? 'mdi-trending-up' : 'mdi-trending-down'" 
                            :color="item.trend === 'up' ? 'green' : 'red'"
                            size="small"
                          ></v-icon>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- KPIs adicionales -->
          <v-row class="mt-4">
            <v-col cols="12" md="4">
              <v-card variant="outlined">
                <v-card-title class="text-subtitle-1">
                  <v-icon icon="mdi-clock" class="mr-2"></v-icon>
                  Tiempo Promedio
                </v-card-title>
                <v-card-text>
                  <div class="text-h4 text-center">{{ corporateData.avgReservationTime }}h</div>
                  <div class="text-caption text-grey text-center">Por reserva</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card variant="outlined">
                <v-card-title class="text-subtitle-1">
                  <v-icon icon="mdi-calendar" class="mr-2"></v-icon>
                  Reservas Hoy
                </v-card-title>
                <v-card-text>
                  <div class="text-h4 text-center text-green">{{ corporateData.todayReservations }}</div>
                  <div class="text-caption text-grey text-center">
                    <v-icon icon="mdi-arrow-up" size="small" class="mr-1"></v-icon>
                    +{{ corporateData.dailyGrowth }}% vs ayer
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card variant="outlined">
                <v-card-title class="text-subtitle-1">
                  <v-icon icon="mdi-star" class="mr-2"></v-icon>
                  Satisfacción
                </v-card-title>
                <v-card-text>
                  <div class="text-h4 text-center text-amber">{{ corporateData.satisfactionScore }}/10</div>
                  <v-rating
                    :model-value="corporateData.satisfactionScore / 2"
                    size="small"
                    readonly
                    half-increments
                    color="yellow-darken-3"
                    class="justify-center mt-2"
                  ></v-rating>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
        
        <v-card v-else class="pa-8 text-center" variant="outlined">
          <v-icon icon="mdi-chart-bar" size="64" color="grey-lighten-1"></v-icon>
          <h3 class="mt-4 text-grey">No hay datos disponibles</h3>
          <p class="text-grey">Selecciona un rango de fechas o contacta al administrador</p>
          <v-btn color="primary" class="mt-4" @click="loadSampleCorporateData">
            <v-icon icon="mdi-refresh" class="mr-2"></v-icon>
            Cargar Datos de Ejemplo
          </v-btn>
        </v-card>
      </v-window-item>

      <!-- Tab Departamento -->
      <v-window-item :value="1">
        <v-card variant="outlined">
          <v-card-title>
            <v-select
              v-model="selectedDepartment"
              :items="departments"
              item-title="name"
              item-value="id"
              label="Seleccionar Departamento"
              variant="outlined"
              density="compact"
              class="mr-4"
              style="max-width: 300px;"
              @update:model-value="fetchDepartmentData"
            ></v-select>
            
            <v-btn
              v-if="selectedDepartment"
              color="success"
              @click="exportDepartmentCSV"
              :loading="loading.export"
              size="small"
              class="mr-2"
            >
              <v-icon icon="mdi-download" class="mr-1"></v-icon>
              Exportar CSV
            </v-btn>
            
            <v-btn
              v-if="selectedDepartment"
              color="primary"
              @click="loadSampleDepartmentData"
              size="small"
              variant="tonal"
            >
              <v-icon icon="mdi-chart-bar" class="mr-1"></v-icon>
              Ver Ejemplo
            </v-btn>
          </v-card-title>

          <v-card-text v-if="loading.department" class="text-center py-8">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p class="mt-4">Cargando datos del departamento...</p>
          </v-card-text>

          <v-card-text v-else-if="departmentData">
            <!-- Información general -->
            <v-row>
              <v-col cols="12" md="4">
                <v-card variant="outlined" class="h-100">
                  <v-card-title class="text-subtitle-1">
                    <v-icon icon="mdi-information" class="mr-2"></v-icon>
                    Información del Departamento
                  </v-card-title>
                  <v-card-text>
                    <v-list density="compact">
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon icon="mdi-office-building" color="primary"></v-icon>
                        </template>
                        <v-list-item-title class="font-weight-bold">Nombre</v-list-item-title>
                        <v-list-item-subtitle>{{ departmentData.departmentName }}</v-list-item-subtitle>
                      </v-list-item>
                      
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon icon="mdi-account-tie" color="primary"></v-icon>
                        </template>
                        <v-list-item-title class="font-weight-bold">Gerente</v-list-item-title>
                        <v-list-item-subtitle>{{ departmentData.manager }}</v-list-item-subtitle>
                      </v-list-item>
                      
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon icon="mdi-account-group" color="primary"></v-icon>
                        </template>
                        <v-list-item-title class="font-weight-bold">Usuarios Activos</v-list-item-title>
                        <v-list-item-subtitle>{{ departmentData.activeUsers }}</v-list-item-subtitle>
                      </v-list-item>
                      
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon icon="mdi-calendar" color="primary"></v-icon>
                        </template>
                        <v-list-item-title class="font-weight-bold">Presupuesto</v-list-item-title>
                        <v-list-item-subtitle>${{ formatNumber(departmentData.budget) }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" md="8">
                <!-- KPIs principales -->
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-card class="text-center pa-3" variant="outlined">
                      <div class="text-h4 font-weight-bold text-green">{{ departmentData.totalReservations }}</div>
                      <div class="text-caption text-grey">Reservas Totales</div>
                      <div class="text-caption text-green mt-1">
                        <v-icon icon="mdi-trending-up" size="small" class="mr-1"></v-icon>
                        +{{ departmentData.monthlyGrowth }}% este mes
                      </div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-card class="text-center pa-3" variant="outlined">
                      <div class="text-h4 font-weight-bold text-blue">{{ departmentData.utilizationRate }}%</div>
                      <div class="text-caption text-grey">Tasa de Utilización</div>
                      <v-progress-linear
                        :model-value="departmentData.utilizationRate"
                        color="blue"
                        height="6"
                        class="mt-2"
                      ></v-progress-linear>
                      <div class="text-caption text-grey mt-1">Meta: {{ departmentData.utilizationTarget }}%</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-card class="text-center pa-3" variant="outlined">
                      <div class="text-h4 font-weight-bold text-amber">{{ departmentData.avgReservationDuration }}h</div>
                      <div class="text-caption text-grey">Duración Promedio</div>
                      <div class="text-caption text-amber mt-1">
                        <v-icon icon="mdi-clock" size="small" class="mr-1"></v-icon>
                        {{ departmentData.avgPreparationTime }}min preparación
                      </div>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Horas pico -->
                <v-card class="mt-4" variant="outlined">
                  <v-card-title class="text-subtitle-1">
                    <v-icon icon="mdi-clock-outline" class="mr-2"></v-icon>
                    Horas Pico de Uso
                  </v-card-title>
                  <v-card-text>
                    <div class="d-flex flex-wrap gap-2">
                      <v-chip
                        v-for="hour in departmentData.peakHours"
                        :key="hour"
                        color="blue"
                        variant="tonal"
                        size="small"
                      >
                        {{ hour }}
                      </v-chip>
                    </div>
                    <p class="text-caption text-grey mt-2">
                      <v-icon icon="mdi-information" size="small" class="mr-1"></v-icon>
                      Mayor actividad: {{ departmentData.busiestDay }}
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Patrones de uso -->
            <v-card class="mt-4" variant="outlined">
              <v-card-title class="text-subtitle-1">
                <v-icon icon="mdi-chart-bar" class="mr-2"></v-icon>
                Patrones de Uso por Recurso
              </v-card-title>
              <v-card-text>
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th>Tipo de Recurso</th>
                      <th>Usos</th>
                      <th>Horas Totales</th>
                      <th>Eficiencia</th>
                      <th>Costo Promedio</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="pattern in departmentData.usagePatterns" :key="pattern.resourceType">
                      <td>
                        <div class="d-flex align-center">
                          <v-avatar :color="getResourceColor(pattern.resourceType)" size="24" class="mr-2">
                            <v-icon icon="mdi-desktop-classic" size="small" v-if="pattern.resourceType.includes('Computador')"></v-icon>
                            <v-icon icon="mdi-projector" size="small" v-else-if="pattern.resourceType.includes('Proyector')"></v-icon>
                            <v-icon icon="mdi-sofa" size="small" v-else-if="pattern.resourceType.includes('Sala')"></v-icon>
                            <v-icon icon="mdi-car" size="small" v-else-if="pattern.resourceType.includes('Vehículo')"></v-icon>
                            <v-icon icon="mdi-tools" size="small" v-else></v-icon>
                          </v-avatar>
                          {{ pattern.resourceType }}
                        </div>
                      </td>
                      <td>{{ pattern.usageCount }}</td>
                      <td>{{ pattern.totalHours }}h</td>
                      <td>
                        <v-chip size="small" :color="getEfficiencyColor(pattern.efficiency)" class="text-white">
                          {{ pattern.efficiency }}%
                        </v-chip>
                      </td>
                      <td>${{ pattern.avgCost }}</td>
                      <td>
                        <v-chip
                          size="small"
                          :color="pattern.status === 'Optimo' ? 'green' : pattern.status === 'Moderado' ? 'orange' : 'red'"
                          variant="tonal"
                        >
                          {{ pattern.status }}
                        </v-chip>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-card>

            <!-- Métricas adicionales -->
            <v-row class="mt-4">
              <v-col cols="12" sm="6" md="3">
                <v-card variant="outlined">
                  <v-card-text class="text-center">
                    <div class="text-h6 text-green">{{ departmentData.cancellationRate }}%</div>
                    <div class="text-caption text-grey">Tasa de Cancelación</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-card variant="outlined">
                  <v-card-text class="text-center">
                    <div class="text-h6 text-blue">{{ departmentData.noShowRate }}%</div>
                    <div class="text-caption text-grey">No Shows</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-card variant="outlined">
                  <v-card-text class="text-center">
                    <div class="text-h6 text-amber">{{ departmentData.repeatUsers }}</div>
                    <div class="text-caption text-grey">Usuarios Recurrentes</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-card variant="outlined">
                  <v-card-text class="text-center">
                    <div class="text-h6 text-red">{{ departmentData.maintenanceRequests }}</div>
                    <div class="text-caption text-grey">Solicitudes Mantenimiento</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          
          <v-card-text v-else class="text-center py-8">
            <v-icon icon="mdi-office-building-outline" size="64" color="grey-lighten-1"></v-icon>
            <h3 class="mt-4 text-grey">Selecciona un departamento</h3>
            <p class="text-grey">O haz clic en "Ver Ejemplo" para cargar datos de muestra</p>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Tab Benchmarking -->
      <v-window-item :value="2">
        <div v-if="loading.benchmarking" class="loading-container">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <p class="mt-4">Cargando benchmarking...</p>
        </div>

        <div v-else-if="benchmarkingData">
          <!-- Ranking principal -->
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="text-subtitle-1">
              <v-icon icon="mdi-trophy" class="mr-2"></v-icon>
              Ranking de Departamentos - Q4 2024
            </v-card-title>
            <v-card-text>
              <v-table>
                <thead>
                  <tr>
                    <th width="80">Posición</th>
                    <th>Departamento</th>
                    <th>Utilización</th>
                    <th>Eficiencia</th>
                    <th>Satisfacción</th>
                    <th>Costo/Hora</th>
                    <th>Tendencia</th>
                    <th>Puntuación Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="dept in benchmarkingData.departments" :key="dept.departmentId">
                    <td>
                      <v-chip
                        v-if="dept.ranking <= 3"
                        :color="getRankingColor(dept.ranking)"
                        size="small"
                        class="text-white"
                      >
                        <v-icon icon="mdi-trophy" size="small" class="mr-1" v-if="dept.ranking === 1"></v-icon>
                        <v-icon icon="mdi-medal" size="small" class="mr-1" v-else-if="dept.ranking === 2"></v-icon>
                        <v-icon icon="mdi-award" size="small" class="mr-1" v-else-if="dept.ranking === 3"></v-icon>
                        {{ dept.ranking }}
                      </v-chip>
                      <span v-else class="text-body-2">{{ dept.ranking }}</span>
                    </td>
                    <td>
                      <div class="d-flex align-center">
                        <v-avatar size="32" :color="getDeptColor(dept.departmentName)" class="mr-2">
                          <span class="text-white">{{ dept.departmentName.charAt(0) }}</span>
                        </v-avatar>
                        {{ dept.departmentName }}
                      </div>
                    </td>
                    <td>
                      <div class="d-flex align-center">
                        {{ dept.utilizationRate }}%
                        <v-progress-linear
                          :model-value="dept.utilizationRate"
                          color="primary"
                          height="6"
                          rounded
                          class="ml-2"
                          style="max-width: 100px;"
                        ></v-progress-linear>
                      </div>
                    </td>
                    <td>{{ dept.efficiency }}%</td>
                    <td>
                      <div class="d-flex align-center">
                        {{ dept.satisfactionScore }}/10
                        <v-rating
                          :model-value="dept.satisfactionScore / 2"
                          size="small"
                          readonly
                          half-increments
                          color="yellow-darken-3"
                          density="compact"
                          class="ml-2"
                        ></v-rating>
                      </div>
                    </td>
                    <td>${{ dept.costPerHour }}</td>
                    <td>
                      <v-icon 
                        :icon="dept.trend === 'up' ? 'mdi-trending-up' : 'mdi-trending-down'" 
                        :color="dept.trend === 'up' ? 'green' : 'red'"
                      ></v-icon>
                      <span :class="dept.trend === 'up' ? 'text-green' : 'text-red'">
                        {{ dept.trendValue }}%
                      </span>
                    </td>
                    <td>
                      <v-chip :color="getScoreColor(dept.totalScore)" size="small" class="text-white">
                        {{ dept.totalScore }}/100
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>

          <!-- Top por métricas -->
          <v-row>
            <v-col cols="12" md="8">
              <v-row>
                <v-col cols="12" sm="6" v-for="ranking in benchmarkingData.rankings" :key="ranking.metric">
                  <v-card variant="outlined">
                    <v-card-title class="text-subtitle-1">
                      <v-icon :icon="getMetricIcon(ranking.metric)" class="mr-2"></v-icon>
                      Top {{ ranking.metric }}
                    </v-card-title>
                    <v-card-text>
                      <v-list density="compact">
                        <v-list-item
                          v-for="(dept, index) in ranking.topDepartments"
                          :key="dept.name"
                          :value="dept.name"
                        >
                          <template v-slot:prepend>
                            <v-avatar size="28" :color="getRankAvatarColor(index)" class="text-white">
                              {{ index + 1 }}
                            </v-avatar>
                          </template>
                          <v-list-item-title>{{ dept.name }}</v-list-item-title>
                          <v-list-item-subtitle>{{ dept.value }} {{ ranking.unit }}</v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-card variant="outlined" class="h-100">
                <v-card-title class="text-subtitle-1">
                  <v-icon icon="mdi-chart-box" class="mr-2"></v-icon>
                  Resumen Ejecutivo
                </v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon icon="mdi-chart-line" color="green"></v-icon>
                      </template>
                      <v-list-item-title class="font-weight-bold">Utilización Promedio</v-list-item-title>
                      <v-list-item-subtitle>{{ benchmarkingData.summary.avgUtilization }}% (+2.3% vs trimestre anterior)</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-divider class="my-2"></v-divider>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon icon="mdi-trophy" color="amber"></v-icon>
                      </template>
                      <v-list-item-title class="font-weight-bold">Mejor Desempeño</v-list-item-title>
                      <v-list-item-subtitle>{{ benchmarkingData.summary.topPerformer.name }} ({{ benchmarkingData.summary.topPerformer.score }} puntos)</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-divider class="my-2"></v-divider>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon icon="mdi-rocket" color="blue"></v-icon>
                      </template>
                      <v-list-item-title class="font-weight-bold">Más Mejorado</v-list-item-title>
                      <v-list-item-subtitle>{{ benchmarkingData.summary.mostImproved.name }} (+{{ benchmarkingData.summary.mostImproved.improvement }}%)</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-divider class="my-2"></v-divider>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon icon="mdi-alert" color="red"></v-icon>
                      </template>
                      <v-list-item-title class="font-weight-bold">Área de Oportunidad</v-list-item-title>
                      <v-list-item-subtitle>{{ benchmarkingData.summary.opportunityArea }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Análisis de costos -->
          <v-card class="mt-4" variant="outlined">
            <v-card-title class="text-subtitle-1">
              <v-icon icon="mdi-cash-multiple" class="mr-2"></v-icon>
              Análisis de Costo-Beneficio
            </v-card-title>
            <v-card-text>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>Departamento</th>
                    <th>Inversión Total</th>
                    <th>ROI</th>
                    <th>Costo por Reserva</th>
                    <th>Valor por Hora</th>
                    <th>Recomendación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="cost in benchmarkingData.costAnalysis" :key="cost.department">
                    <td>{{ cost.department }}</td>
                    <td>${{ formatNumber(cost.totalInvestment) }}</td>
                    <td>
                      <v-chip size="small" :color="cost.roi >= 150 ? 'green' : cost.roi >= 100 ? 'blue' : 'orange'">
                        {{ cost.roi }}%
                      </v-chip>
                    </td>
                    <td>${{ cost.costPerReservation }}</td>
                    <td>${{ cost.valuePerHour }}</td>
                    <td>
                      <v-chip size="small" :color="cost.recommendation === 'Mantener' ? 'green' : 'orange'" variant="tonal">
                        {{ cost.recommendation }}
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </div>
        
        <v-card v-else class="pa-8 text-center" variant="outlined">
          <v-icon icon="mdi-chart-bell-curve" size="64" color="grey-lighten-1"></v-icon>
          <h3 class="mt-4 text-grey">Benchmarking no disponible</h3>
          <p class="text-grey">Esta función requiere rol ADMIN</p>
          <v-btn color="primary" class="mt-4" @click="loadSampleBenchmarkingData">
            <v-icon icon="mdi-chart-bar" class="mr-2"></v-icon>
            Ver Datos de Ejemplo
          </v-btn>
        </v-card>
      </v-window-item>

      <!-- Tab Alertas -->
      <v-window-item :value="3">
        <v-card variant="outlined">
          <v-card-title class="text-subtitle-1">
            <v-icon icon="mdi-bell" class="mr-2"></v-icon>
            Sistema de Alertas de Tendencias
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="fetchTrendAlerts"
              :loading="loading.alerts"
              size="small"
              variant="tonal"
              class="mr-2"
            >
              <v-icon icon="mdi-refresh" class="mr-1"></v-icon>
              Actualizar
            </v-btn>
            <v-btn
              color="secondary"
              @click="loadSampleAlertsData"
              size="small"
              variant="tonal"
            >
              <v-icon icon="mdi-eye" class="mr-1"></v-icon>
              Ver Ejemplos
            </v-btn>
          </v-card-title>

          <v-card-text>
            <!-- Filtros -->
            <div class="d-flex flex-wrap gap-3 mb-4">
              <v-chip
                v-for="severity in ['Todas', 'Alta', 'Media', 'Baja']"
                :key="severity"
                :color="severity === 'Todas' ? 'primary' : getSeverityColor(severity)"
                variant="tonal"
                @click="filterAlerts(severity)"
                :class="{ 'active-filter': activeFilter === severity }"
              >
                {{ severity }}
              </v-chip>
            </div>

            <div v-if="loading.alerts" class="text-center py-8">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <p class="mt-4">Buscando alertas...</p>
            </div>

            <div v-else-if="filteredAlerts.length === 0">
              <v-alert type="success" variant="tonal" icon="mdi-check-circle">
                <v-alert-title>¡Excelente!</v-alert-title>
                No hay alertas activas - Todas las métricas están dentro de los parámetros normales
              </v-alert>
              
              <v-alert type="info" variant="tonal" class="mt-4" icon="mdi-information">
                <v-alert-title>Métricas Monitoreadas</v-alert-title>
                <ul class="mt-2">
                  <li>Utilización de recursos por departamento</li>
                  <li>Tasa de cancelación de reservas</li>
                  <li>Tiempos de inactividad</li>
                  <li>Patrones de uso anómalos</li>
                  <li>Costos por hora vs promedio</li>
                </ul>
              </v-alert>
            </div>

            <div v-else>
              <!-- Resumen de alertas -->
              <v-row class="mb-4">
                <v-col cols="12" sm="4">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <div class="text-h4 text-red">{{ highSeverityCount }}</div>
                      <div class="text-caption text-grey">Alertas Críticas</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <div class="text-h4 text-orange">{{ mediumSeverityCount }}</div>
                      <div class="text-caption text-grey">Alertas Moderadas</div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <div class="text-h4 text-blue">{{ lowSeverityCount }}</div>
                      <div class="text-caption text-grey">Alertas Informativas</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Lista de alertas -->
              <v-alert
                v-for="alert in filteredAlerts"
                :key="alert.id"
                :type="getAlertType(alert.severity)"
                variant="tonal"
                border="start"
                class="mb-3"
              >
                <template v-slot:title>
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon :icon="getAlertIcon(alert.severity)" class="mr-2"></v-icon>
                      <strong>{{ alert.department }} - {{ alert.metric }}</strong>
                    </div>
                    <v-chip size="small" :color="getSeverityColor(alert.severity)" class="text-white">
                      {{ alert.severity === 'high' ? 'Crítica' : alert.severity === 'medium' ? 'Moderada' : 'Informativa' }}
                    </v-chip>
                  </div>
                </template>
                
                <p class="mb-2">
                  <v-icon icon="mdi-chart-line" size="small" class="mr-1"></v-icon>
                  <strong>Tendencia:</strong> De {{ formatNumber(alert.previousValue) }} 
                  a {{ formatNumber(alert.currentValue) }}
                  <v-chip size="small" :color="alert.changePercentage < 0 ? 'red' : 'green'" class="ml-2">
                    {{ alert.changePercentage > 0 ? '+' : '' }}{{ alert.changePercentage }}%
                  </v-chip>
                </p>
                
                <p class="mb-2" v-if="alert.description">
                  <v-icon icon="mdi-information" size="small" class="mr-1"></v-icon>
                  {{ alert.description }}
                </p>
                
                <p class="mb-2" v-if="alert.recommendation">
                  <v-icon icon="mdi-lightbulb" size="small" class="mr-1"></v-icon>
                  <strong>Recomendación:</strong> {{ alert.recommendation }}
                </p>
                
                <div class="d-flex justify-space-between align-center mt-3">
                  <small class="text-medium-emphasis">
                    <v-icon icon="mdi-clock" size="small" class="mr-1"></v-icon>
                    {{ formatDate(alert.timestamp) }}
                  </small>
                  
                  <div>
                    <v-btn
                      v-if="alert.severity === 'high'"
                      color="red"
                      size="x-small"
                      variant="tonal"
                      class="mr-2"
                    >
                      <v-icon icon="mdi-alarm" size="small" class="mr-1"></v-icon>
                      Urgente
                    </v-btn>
                    
                    <v-btn
                      size="x-small"
                      variant="text"
                      @click="markAsResolved(alert)"
                    >
                      <v-icon icon="mdi-check" size="small" class="mr-1"></v-icon>
                      Marcar como resuelta
                    </v-btn>
                  </div>
                </div>
              </v-alert>
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Modal KPI -->
    <v-dialog v-model="showKPIModal" max-width="500">
      <v-card>
        <v-card-title>
          <v-icon icon="mdi-plus" class="mr-2"></v-icon>
          Crear KPI Personalizado
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newKPI.nombre"
            label="Nombre del KPI"
            variant="outlined"
            class="mb-3"
            placeholder="Ej: ROI por Departamento"
            hint="Nombre descriptivo para identificar el KPI"
          ></v-text-field>
          <v-textarea
            v-model="newKPI.formula_sql"
            label="Fórmula SQL"
            variant="outlined"
            rows="3"
            placeholder="Ej: SELECT department, SUM(revenue)/SUM(cost) as roi FROM reservations GROUP BY department"
            hint="Consulta SQL que calcula el KPI. Debe retornar una columna con el valor."
          ></v-textarea>
          
          <v-alert type="info" variant="tonal" class="mt-3">
            <v-alert-title>Ejemplos de KPIs</v-alert-title>
            <ul class="mt-2">
              <li>Tasa de utilización por tipo de recurso</li>
              <li>Costo promedio por hora de reserva</li>
              <li>Eficiencia de uso por departamento</li>
              <li>Tiempo promedio entre reservas</li>
            </ul>
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showKPIModal = false">Cancelar</v-btn>
          <v-btn color="primary" @click="createKPI">Crear KPI</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Configuración -->
    <v-dialog v-model="showConfigModal" max-width="400">
      <v-card>
        <v-card-title>
          <v-icon icon="mdi-cog" class="mr-2"></v-icon>
          Configurar Dashboard
        </v-card-title>
        <v-card-text>
          <v-switch
            v-model="dashboardConfig.showTrends"
            label="Mostrar gráficos de tendencias"
            color="primary"
          ></v-switch>
          <v-switch
            v-model="dashboardConfig.showAlerts"
            label="Notificaciones de alertas"
            color="primary"
          ></v-switch>
          <v-switch
            v-model="dashboardConfig.autoRefresh"
            label="Actualización automática cada 5 min"
            color="primary"
          ></v-switch>
          
          <v-select
            v-model="dashboardConfig.defaultView"
            :items="['Corporativo', 'Departamento', 'Benchmarking', 'Alertas']"
            label="Vista predeterminada"
            variant="outlined"
            class="mt-4"
          ></v-select>
          
          <v-select
            v-model="dashboardConfig.chartTheme"
            :items="['Claro', 'Oscuro', 'Colorblind']"
            label="Tema de gráficos"
            variant="outlined"
            class="mt-2"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showConfigModal = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveDashboardConfig">Guardar Configuración</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts';

export default {
  name: 'AnalyticsDashboard',
  
  props: {
    userRole: {
      type: String,
      required: true,
      validator: value => ['ADMIN', 'GERENTE', 'USER'].includes(value)
    },
    departmentId: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      activeTab: 0,
      selectedDepartment: this.departmentId || 1, // Por defecto TI
      showKPIModal: false,
      showConfigModal: false,
      activeFilter: 'Todas',
      
      loading: {
        corporate: false,
        department: false,
        benchmarking: false,
        alerts: false,
        export: false,
        kpi: false,
        config: false
      },

      departments: [
        { id: 1, name: 'TI', manager: 'Carlos Rodríguez', icon: 'mdi-laptop' },
        { id: 2, name: 'Ventas', manager: 'Ana Martínez', icon: 'mdi-currency-usd' },
        { id: 3, name: 'Marketing', manager: 'Laura Gómez', icon: 'mdi-bullhorn' },
        { id: 4, name: 'RRHH', manager: 'Roberto Sánchez', icon: 'mdi-account-group' },
        { id: 5, name: 'Finanzas', manager: 'María López', icon: 'mdi-calculator' },
        { id: 6, name: 'Operaciones', manager: 'David Torres', icon: 'mdi-cog' },
        { id: 7, name: 'Legal', manager: 'Sofía Ramírez', icon: 'mdi-scale-balance' }
      ],

      corporateData: null,
      departmentData: null,
      benchmarkingData: null,
      trendAlerts: [],

      newKPI: {
        nombre: '',
        formula_sql: ''
      },

      dashboardConfig: {
        showTrends: true,
        showAlerts: true,
        autoRefresh: false,
        defaultView: 'Corporativo',
        chartTheme: 'Claro'
      },

      snackbar: {
        show: false,
        message: '',
        color: 'success'
      },

      trendChart: null,
      usageChart: null
    };
  },

  computed: {
    hasDepartmentAccess() {
      return this.userRole === 'ADMIN' || this.userRole === 'GERENTE';
    },
    
    filteredAlerts() {
      if (this.activeFilter === 'Todas') return this.trendAlerts;
      const severityMap = { 'Alta': 'high', 'Media': 'medium', 'Baja': 'low' };
      return this.trendAlerts.filter(alert => alert.severity === severityMap[this.activeFilter]);
    },
    
    highSeverityCount() {
      return this.trendAlerts.filter(a => a.severity === 'high').length;
    },
    
    mediumSeverityCount() {
      return this.trendAlerts.filter(a => a.severity === 'medium').length;
    },
    
    lowSeverityCount() {
      return this.trendAlerts.filter(a => a.severity === 'low').length;
    }
  },

  watch: {
    activeTab(newTab) {
      switch (newTab) {
        case 0:
          this.loadSampleCorporateData();
          break;
        case 1:
          this.loadSampleDepartmentData();
          break;
        case 2:
          if (this.userRole === 'ADMIN') {
            this.loadSampleBenchmarkingData();
          }
          break;
        case 3:
          if (this.hasDepartmentAccess) {
            this.loadSampleAlertsData();
          }
          break;
      }
    },

    selectedDepartment(newDept) {
      if (newDept && this.hasDepartmentAccess) {
        this.loadSampleDepartmentData();
      }
    }
  },

  mounted() {
    // Cargar datos iniciales automáticamente
    this.loadSampleCorporateData();
    
    if (this.departmentId && this.hasDepartmentAccess) {
      this.selectedDepartment = this.departmentId;
      this.loadSampleDepartmentData();
    }

    // Configurar axios (simulado para ejemplo)
    this.api = axios.create({
      baseURL: '/api',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  beforeUnmount() {
    // Limpiar gráficos
    if (this.trendChart) {
      this.trendChart.dispose();
    }
    if (this.usageChart) {
      this.usageChart.dispose();
    }
  },

  methods: {
    // ====================
    // DATOS DE EJEMPLO
    // ====================
    
    loadSampleCorporateData() {
      this.loading.corporate = true;
      
      // Simular carga de API
      setTimeout(() => {
        this.corporateData = {
          totalReservations: 12458,
          activeUsers: 347,
          resourceUtilization: 78,
          departmentsCount: 7,
          activeDepartments: 6,
          avgReservationTime: 3.5,
          todayReservations: 42,
          dailyGrowth: 15,
          satisfactionScore: 8.7,
          
          monthlyTrend: [
            { month: 'Ene', value: 980 },
            { month: 'Feb', value: 1050 },
            { month: 'Mar', value: 1120 },
            { month: 'Abr', value: 1080 },
            { month: 'May', value: 1250 },
            { month: 'Jun', value: 1320 },
            { month: 'Jul', value: 1420 },
            { month: 'Ago', value: 1380 },
            { month: 'Sep', value: 1520 },
            { month: 'Oct', value: 1650 },
            { month: 'Nov', value: 1580 },
            { month: 'Dic', value: 1720 }
          ],
          
          usageByType: [
            { type: 'Salas de Reunión', count: 4520, percentage: 36, trend: 'up' },
            { type: 'Computadores', count: 3210, percentage: 26, trend: 'up' },
            { type: 'Proyectores', count: 1980, percentage: 16, trend: 'stable' },
            { type: 'Vehículos', count: 1560, percentage: 13, trend: 'down' },
            { type: 'Equipos Especiales', count: 1188, percentage: 9, trend: 'up' }
          ]
        };
        
        this.loading.corporate = false;
        this.$nextTick(() => {
          this.renderCharts();
        });
      }, 800);
    },
    
    loadSampleDepartmentData() {
      if (!this.selectedDepartment) return;
      
      this.loading.department = true;
      
      // Datos de ejemplo para el departamento seleccionado
      setTimeout(() => {
        const deptId = this.selectedDepartment;
        const deptName = this.departments.find(d => d.id === deptId)?.name || 'Departamento';
        
        this.departmentData = {
          departmentId: deptId,
          departmentName: deptName,
          manager: this.departments.find(d => d.id === deptId)?.manager || 'Gerente',
          activeUsers: deptId === 1 ? 45 : deptId === 2 ? 62 : deptId === 3 ? 38 : deptId === 4 ? 28 : deptId === 5 ? 34 : 25,
          budget: deptId === 1 ? 125000 : deptId === 2 ? 185000 : deptId === 3 ? 95000 : deptId === 4 ? 75000 : deptId === 5 ? 110000 : 80000,
          totalReservations: deptId === 1 ? 2150 : deptId === 2 ? 3280 : deptId === 3 ? 1890 : deptId === 4 ? 1250 : deptId === 5 ? 1670 : 980,
          monthlyGrowth: deptId === 1 ? 12 : deptId === 2 ? 18 : deptId === 3 ? 8 : deptId === 4 ? 5 : deptId === 5 ? 10 : 3,
          utilizationRate: deptId === 1 ? 82 : deptId === 2 ? 75 : deptId === 3 ? 68 : deptId === 4 ? 72 : deptId === 5 ? 79 : 65,
          utilizationTarget: 85,
          avgReservationDuration: deptId === 1 ? 4.2 : deptId === 2 ? 3.8 : deptId === 3 ? 2.5 : deptId === 4 ? 3.2 : deptId === 5 ? 4.5 : 3.0,
          avgPreparationTime: deptId === 1 ? 15 : deptId === 2 ? 20 : deptId === 3 ? 25 : deptId === 4 ? 18 : deptId === 5 ? 22 : 30,
          peakHours: ['09:00-11:00', '14:00-16:00', '17:00-19:00'],
          busiestDay: 'Miércoles',
          
          usagePatterns: [
            { resourceType: 'Computadores Portátiles', usageCount: 850, totalHours: 2550, efficiency: 88, avgCost: 25, status: 'Optimo' },
            { resourceType: 'Salas de Conferencia A', usageCount: 420, totalHours: 1680, efficiency: 92, avgCost: 50, status: 'Optimo' },
            { resourceType: 'Proyectores 4K', usageCount: 380, totalHours: 1140, efficiency: 76, avgCost: 35, status: 'Moderado' },
            { resourceType: 'Impresoras 3D', usageCount: 210, totalHours: 630, efficiency: 65, avgCost: 120, status: 'Bajo' },
            { resourceType: 'Servidores', usageCount: 150, totalHours: 1800, efficiency: 95, avgCost: 85, status: 'Optimo' },
            { resourceType: 'Equipos de Video', usageCount: 140, totalHours: 420, efficiency: 58, avgCost: 75, status: 'Bajo' }
          ],
          
          cancellationRate: deptId === 1 ? 8 : deptId === 2 ? 12 : deptId === 3 ? 15 : deptId === 4 ? 6 : deptId === 5 ? 9 : 10,
          noShowRate: deptId === 1 ? 5 : deptId === 2 ? 8 : deptId === 3 ? 11 : deptId === 4 ? 4 : deptId === 5 ? 6 : 7,
          repeatUsers: deptId === 1 ? 32 : deptId === 2 ? 48 : deptId === 3 ? 25 : deptId === 4 ? 18 : deptId === 5 ? 29 : 15,
          maintenanceRequests: deptId === 1 ? 7 : deptId === 2 ? 3 : deptId === 3 ? 5 : deptId === 4 ? 2 : deptId === 5 ? 4 : 6
        };
        
        this.loading.department = false;
      }, 600);
    },
    
    loadSampleBenchmarkingData() {
      this.loading.benchmarking = true;
      
      setTimeout(() => {
        this.benchmarkingData = {
          departments: [
            { departmentId: 1, departmentName: 'TI', utilizationRate: 82, efficiency: 88, satisfactionScore: 9.2, ranking: 1, costPerHour: 42, trend: 'up', trendValue: 3.2, totalScore: 92 },
            { departmentId: 2, departmentName: 'Ventas', utilizationRate: 75, efficiency: 85, satisfactionScore: 8.8, ranking: 2, costPerHour: 38, trend: 'up', trendValue: 5.1, totalScore: 87 },
            { departmentId: 5, departmentName: 'Finanzas', utilizationRate: 79, efficiency: 82, satisfactionScore: 8.5, ranking: 3, costPerHour: 45, trend: 'stable', trendValue: 0.8, totalScore: 84 },
            { departmentId: 4, departmentName: 'RRHH', utilizationRate: 72, efficiency: 78, satisfactionScore: 8.9, ranking: 4, costPerHour: 32, trend: 'up', trendValue: 2.3, totalScore: 81 },
            { departmentId: 6, departmentName: 'Operaciones', utilizationRate: 65, efficiency: 72, satisfactionScore: 7.8, ranking: 5, costPerHour: 28, trend: 'down', trendValue: -1.5, totalScore: 73 },
            { departmentId: 3, departmentName: 'Marketing', utilizationRate: 68, efficiency: 70, satisfactionScore: 8.2, ranking: 6, costPerHour: 52, trend: 'stable', trendValue: 0.3, totalScore: 72 },
            { departmentId: 7, departmentName: 'Legal', utilizationRate: 58, efficiency: 65, satisfactionScore: 7.5, ranking: 7, costPerHour: 65, trend: 'down', trendValue: -3.2, totalScore: 65 }
          ],
          
          rankings: [
            { 
              metric: 'Utilización', 
              unit: '%',
              topDepartments: [
                { name: 'TI', value: 82 },
                { name: 'Finanzas', value: 79 },
                { name: 'Ventas', value: 75 }
              ]
            },
            { 
              metric: 'Eficiencia', 
              unit: '%',
              topDepartments: [
                { name: 'TI', value: 88 },
                { name: 'Ventas', value: 85 },
                { name: 'Finanzas', value: 82 }
              ]
            },
            { 
              metric: 'Satisfacción', 
              unit: '/10',
              topDepartments: [
                { name: 'TI', value: 9.2 },
                { name: 'RRHH', value: 8.9 },
                { name: 'Ventas', value: 8.8 }
              ]
            },
            { 
              metric: 'Costo/Hora', 
              unit: '$',
              topDepartments: [
                { name: 'RRHH', value: 32 },
                { name: 'Operaciones', value: 28 },
                { name: 'Ventas', value: 38 }
              ]
            }
          ],
          
          summary: {
            avgUtilization: 71,
            topPerformer: { name: 'TI', score: 92 },
            mostImproved: { name: 'Ventas', improvement: 12 },
            opportunityArea: 'Reducir costos en departamentos Marketing y Legal'
          },
          
          costAnalysis: [
            { department: 'TI', totalInvestment: 125000, roi: 185, costPerReservation: 58, valuePerHour: 120, recommendation: 'Mantener' },
            { department: 'Ventas', totalInvestment: 185000, roi: 210, costPerReservation: 56, valuePerHour: 145, recommendation: 'Mantener' },
            { department: 'Marketing', totalInvestment: 95000, roi: 135, costPerReservation: 50, valuePerHour: 85, recommendation: 'Optimizar' },
            { department: 'RRHH', totalInvestment: 75000, roi: 160, costPerReservation: 60, valuePerHour: 95, recommendation: 'Mantener' },
            { department: 'Finanzas', totalInvestment: 110000, roi: 175, costPerReservation: 66, valuePerHour: 110, recommendation: 'Mantener' },
            { department: 'Legal', totalInvestment: 80000, roi: 95, costPerReservation: 82, valuePerHour: 75, recommendation: 'Reducir' }
          ]
        };
        
        this.loading.benchmarking = false;
      }, 800);
    },
    
    loadSampleAlertsData() {
      this.loading.alerts = true;
      
      setTimeout(() => {
        this.trendAlerts = [
          {
            id: 1,
            department: 'Marketing',
            metric: 'Tasa de Utilización',
            currentValue: 68,
            previousValue: 75,
            changePercentage: -9.3,
            severity: 'high',
            timestamp: '2024-12-05T14:30:00',
            description: 'Caída significativa en el uso de recursos del departamento',
            recommendation: 'Revisar procesos de reserva y ofrecer capacitación al personal'
          },
          {
            id: 2,
            department: 'Legal',
            metric: 'Costo por Hora',
            currentValue: 65,
            previousValue: 58,
            changePercentage: 12.1,
            severity: 'high',
            timestamp: '2024-12-04T11:15:00',
            description: 'Aumento del 12% en costos operativos',
            recommendation: 'Auditar gastos y renegociar contratos con proveedores'
          },
          {
            id: 3,
            department: 'Ventas',
            metric: 'Tasa de Cancelación',
            currentValue: 12,
            previousValue: 8,
            changePercentage: 50,
            severity: 'medium',
            timestamp: '2024-12-05T09:45:00',
            description: 'Incremento en cancelaciones de último minuto',
            recommendation: 'Implementar política de cancelación con 24h de anticipación'
          },
          {
            id: 4,
            department: 'TI',
            metric: 'Tiempo de Inactividad',
            currentValue: 2.5,
            previousValue: 1.8,
            changePercentage: 38.9,
            severity: 'medium',
            timestamp: '2024-12-03T16:20:00',
            description: 'Aumento en tiempos muertos entre reservas',
            recommendation: 'Optimizar horarios y promover uso en horas valle'
          },
          {
            id: 5,
            department: 'Operaciones',
            metric: 'No Shows',
            currentValue: 7,
            previousValue: 5,
            changePercentage: 40,
            severity: 'medium',
            timestamp: '2024-12-04T13:10:00',
            description: 'Incremento en reservas no utilizadas',
            recommendation: 'Enviar recordatorios automáticos 1 hora antes'
          },
          {
            id: 6,
            department: 'RRHH',
            metric: 'Uso de Salas Pequeñas',
            currentValue: 45,
            previousValue: 55,
            changePercentage: -18.2,
            severity: 'low',
            timestamp: '2024-12-02T10:30:00',
            description: 'Disminución en uso de salas para reuniones individuales',
            recommendation: 'Promover trabajo remoto en días específicos'
          },
          {
            id: 7,
            department: 'Finanzas',
            metric: 'Eficiencia de Equipos',
            currentValue: 82,
            previousValue: 85,
            changePercentage: -3.5,
            severity: 'low',
            timestamp: '2024-12-01T15:45:00',
            description: 'Ligera disminución en eficiencia reportada',
            recommendation: 'Programar mantenimiento preventivo'
          }
        ];
        
        this.loading.alerts = false;
      }, 600);
    },
    
    // ====================
    // FUNCIONALIDADES
    // ====================
    
    async fetchCorporateData() {
      if (this.userRole !== 'ADMIN') {
        this.showNotification('Se requiere rol ADMIN', 'error');
        return;
      }
      this.loadSampleCorporateData();
    },
    
    async fetchDepartmentData() {
      if (!this.selectedDepartment || !this.hasDepartmentAccess) return;
      this.loadSampleDepartmentData();
    },
    
    async fetchBenchmarkingData() {
      if (this.userRole !== 'ADMIN') {
        this.showNotification('Solo ADMIN', 'error');
        return;
      }
      this.loadSampleBenchmarkingData();
    },
    
    async fetchTrendAlerts() {
      if (!this.hasDepartmentAccess) return;
      this.loadSampleAlertsData();
      this.showNotification('Alertas actualizadas', 'success');
    },
    
    async exportDepartmentCSV() {
      if (!this.selectedDepartment || !this.hasDepartmentAccess) return;
      
      this.loading.export = true;
      
      // Simular exportación
      setTimeout(() => {
        const deptName = this.departments.find(d => d.id === this.selectedDepartment)?.name || 'departamento';
        const csvContent = `data:text/csv;charset=utf-8,Nombre,Valor\nReservas Totales,${this.departmentData?.totalReservations || 0}\nUtilización,${this.departmentData?.utilizationRate || 0}%\nUsuarios Activos,${this.departmentData?.activeUsers || 0}\nFecha de exportación,${new Date().toLocaleDateString()}`;
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `reporte_${deptName}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.loading.export = false;
        this.showNotification(`CSV exportado: ${deptName}`, 'success');
      }, 1000);
    },
    
    async createKPI() {
      if (this.userRole !== 'ADMIN') {
        this.showNotification('Solo ADMIN puede crear KPIs', 'error');
        return;
      }

      this.loading.kpi = true;
      
      setTimeout(() => {
        this.showNotification(`KPI "${this.newKPI.nombre}" creado exitosamente`, 'success');
        this.showKPIModal = false;
        this.newKPI = { nombre: '', formula_sql: '' };
        this.loading.kpi = false;
      }, 800);
    },
    
    async saveDashboardConfig() {
      this.loading.config = true;
      
      setTimeout(() => {
        this.showNotification('Configuración guardada exitosamente', 'success');
        this.showConfigModal = false;
        this.loading.config = false;
      }, 600);
    },
    
    renderCharts() {
      if (!this.corporateData) return;

      // Destruir gráficos existentes
      if (this.trendChart) this.trendChart.dispose();
      if (this.usageChart) this.usageChart.dispose();

      // Gráfico de tendencias
      const trendElement = this.$refs.trendChart;
      if (trendElement) {
        this.trendChart = echarts.init(trendElement);
        const trendOption = {
          tooltip: { trigger: 'axis' },
          grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
          xAxis: {
            type: 'category',
            data: this.corporateData.monthlyTrend.map(t => t.month),
            axisLabel: { color: '#666' }
          },
          yAxis: {
            type: 'value',
            axisLabel: { color: '#666' }
          },
          series: [{
            data: this.corporateData.monthlyTrend.map(t => t.value),
            type: 'line',
            smooth: true,
            lineStyle: { width: 3 },
            itemStyle: { color: '#2196F3' },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(33, 150, 243, 0.3)' },
                  { offset: 1, color: 'rgba(33, 150, 243, 0.1)' }
                ]
              }
            }
          }]
        };
        this.trendChart.setOption(trendOption);
      }

      // Gráfico de uso por tipo
      const usageElement = this.$refs.usageChart;
      if (usageElement) {
        this.usageChart = echarts.init(usageElement);
        const usageOption = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: { color: '#666' }
          },
          series: [{
            name: 'Uso por Tipo',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: { show: false, position: 'center' },
            emphasis: {
              label: { show: true, fontSize: '16', fontWeight: 'bold' }
            },
            labelLine: { show: false },
            data: this.corporateData.usageByType.map(item => ({
              value: item.count,
              name: item.type
            }))
          }]
        };
        this.usageChart.setOption(usageOption);
      }

      // Redimensionar
      window.addEventListener('resize', () => {
        if (this.trendChart) this.trendChart.resize();
        if (this.usageChart) this.usageChart.resize();
      });
    },
    
    handleApiError(error) {
      console.error('API Error:', error);
      this.showNotification('Error al cargar datos', 'error');
    },
    
    // ====================
    // MÉTODOS DE UTILIDAD
    // ====================
    
    getRoleColor(role) {
      const colors = { ADMIN: 'red', GERENTE: 'blue', USER: 'green' };
      return colors[role] || 'grey';
    },
    
    getEfficiencyColor(efficiency) {
      if (efficiency >= 85) return 'green';
      if (efficiency >= 70) return 'blue';
      if (efficiency >= 60) return 'orange';
      return 'red';
    },
    
    getAlertType(severity) {
      const types = { high: 'error', medium: 'warning', low: 'info' };
      return types[severity] || 'info';
    },
    
    getAlertIcon(severity) {
      const icons = { high: 'mdi-alert-circle', medium: 'mdi-alert', low: 'mdi-information' };
      return icons[severity] || 'mdi-information';
    },
    
    getSeverityColor(severity) {
      const colors = { 
        'Alta': 'red', 'high': 'red',
        'Media': 'orange', 'medium': 'orange',
        'Baja': 'blue', 'low': 'blue'
      };
      return colors[severity] || 'grey';
    },
    
    getPercentageColor(percentage) {
      if (percentage >= 30) return 'green';
      if (percentage >= 15) return 'blue';
      return 'grey';
    },
    
    getResourceIcon(type) {
      const icons = {
        'Salas': 'mdi-door',
        'Computadores': 'mdi-laptop',
        'Proyectores': 'mdi-projector',
        'Vehículos': 'mdi-car',
        'Equipos': 'mdi-tools'
      };
      return icons[type.split(' ')[0]] || 'mdi-cube';
    },
    
    getResourceColor(type) {
      const colors = {
        'Computadores': 'blue',
        'Salas': 'green',
        'Proyectores': 'purple',
        'Vehículos': 'orange',
        'Equipos': 'red',
        'Servidores': 'indigo'
      };
      return colors[type.split(' ')[0]] || 'grey';
    },
    
    getRankingColor(rank) {
      if (rank === 1) return 'amber';
      if (rank === 2) return 'blue-grey';
      if (rank === 3) return 'brown';
      return 'grey';
    },
    
    getDeptColor(deptName) {
      const colors = {
        'TI': 'blue',
        'Ventas': 'green',
        'Marketing': 'purple',
        'RRHH': 'orange',
        'Finanzas': 'red',
        'Operaciones': 'indigo',
        'Legal': 'brown'
      };
      return colors[deptName] || 'grey';
    },
    
    getScoreColor(score) {
      if (score >= 85) return 'green';
      if (score >= 70) return 'blue';
      if (score >= 60) return 'orange';
      return 'red';
    },
    
    getMetricIcon(metric) {
      const icons = {
        'Utilización': 'mdi-chart-line',
        'Eficiencia': 'mdi-speedometer',
        'Satisfacción': 'mdi-star',
        'Costo/Hora': 'mdi-cash'
      };
      return icons[metric] || 'mdi-chart-bar';
    },
    
    getRankAvatarColor(index) {
      const colors = ['#FFD700', '#C0C0C0', '#CD7F32', '#2196F3', '#4CAF50'];
      return colors[index] || '#9E9E9E';
    },
    
    filterAlerts(severity) {
      this.activeFilter = severity;
    },
    
    markAsResolved(alert) {
      this.trendAlerts = this.trendAlerts.filter(a => a.id !== alert.id);
      this.showNotification(`Alerta "${alert.metric}" marcada como resuelta`, 'success');
    },
    
    formatNumber(num) {
      return new Intl.NumberFormat('es-ES').format(num);
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    showNotification(message, type = 'success') {
      this.snackbar = {
        show: true,
        message,
        color: type
      };
    }
  }
};
</script>

<style scoped>
.dashboard-header {
  margin-top: 130px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  text-align: center;
}

.corporate-view {
  padding: 8px;
}

.metric-card {
  height: 100%;
  transition: transform 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.active-filter {
  border: 2px solid currentColor !important;
}

.h-100 {
  height: 100%;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>