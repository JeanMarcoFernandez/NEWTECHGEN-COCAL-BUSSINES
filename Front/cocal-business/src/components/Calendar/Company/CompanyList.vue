<template>
  <v-container class="content-container animate__animated animate__fadeIn">
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="page-title">Portafolio de Empresas</h1>
        <p class="text-subtitle-1 text-grey-darken-1">Selecciona una organización para administrar</p>
      </div>
      <div class="d-flex gap-2">
        <v-btn 
          variant="outlined" 
          color="primary"
          icon="mdi-refresh"
          @click="$emit('refresh')"
          :loading="loading"
          :disabled="loading"
        ></v-btn>
        <v-btn 
          color="#3159AE" 
          class="text-white text-none elevation-2" 
          prepend-icon="mdi-domain-plus"
          size="large"
          @click="$emit('create')"
        >
          Nueva Empresa
        </v-btn>
      </div>
    </div>

    <CompanyFilters
      :companies="companies"
      @filter="handleFilter"
      @clear="clearFilters"
    />

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
        v-for="company in paginatedCompanies" 
        :key="company.id" 
        cols="12" md="6" lg="4"
      >
        <CompanyCard
          :company="company"
          @enter="$emit('enter-company', company)"
          @edit="$emit('edit', company)"
          @delete="$emit('delete', company)"
        />
      </v-col>
    </v-row>

    <v-pagination
      v-if="filteredCompanies.length > itemsPerPage"
      v-model="currentPage"
      :length="totalPages"
      :total-visible="5"
      class="mt-6"
    ></v-pagination>
  </v-container>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import CompanyFilters from './CompanyFilters.vue'
import CompanyCard from './CompanyCard.vue'

const props = defineProps({
  companies: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['enter-company', 'refresh', 'create', 'edit', 'delete'])

// Filtros y paginación
const searchTerm = ref('')
const filterRubro = ref('')
const currentPage = ref(1)
const itemsPerPage = 9

const filteredCompanies = computed(() => {
  let filtered = [...props.companies]
  
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
  
  return filtered
})

const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCompanies.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredCompanies.value.length / itemsPerPage))

const handleFilter = (filters) => {
  searchTerm.value = filters.searchTerm
  filterRubro.value = filters.filterRubro
  currentPage.value = 1
}

const clearFilters = () => {
  searchTerm.value = ''
  filterRubro.value = ''
}
</script>

<style scoped>
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
</style>