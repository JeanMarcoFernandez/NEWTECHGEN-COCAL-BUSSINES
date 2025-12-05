<template>
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
            @update:model-value="emitFilter"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="filterRubro"
            :items="rubrosOptions"
            label="Filtrar por rubro"
            variant="outlined"
            density="compact"
            clearable
            @update:model-value="emitFilter"
          ></v-select>
        </v-col>
        <v-col cols="12" md="3" class="d-flex align-center">
          <v-chip v-if="hasFilters" color="primary" variant="flat" size="small">
            Mostrando {{ filteredCount }} de {{ totalCount }}
          </v-chip>
        </v-col>
        <v-col cols="12" md="2" class="d-flex align-center">
          <v-btn 
            v-if="hasFilters"
            variant="text" 
            color="primary" 
            size="small"
            prepend-icon="mdi-filter-remove"
            @click="clearFilters"
          >
            Limpiar
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  companies: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['filter', 'clear'])

const searchTerm = ref('')
const filterRubro = ref('')

const rubrosOptions = computed(() => {
  const rubros = [...new Set(props.companies.map(c => c.rubro).filter(Boolean))]
  return ['Todos', ...rubros]
})

const filteredCount = computed(() => {
  if (!searchTerm.value && !filterRubro.value) return props.companies.length
  
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
  
  return filtered.length
})

const hasFilters = computed(() => {
  return !!searchTerm.value || (!!filterRubro.value && filterRubro.value !== 'Todos')
})

const totalCount = computed(() => props.companies.length)

const emitFilter = () => {
  emit('filter', {
    searchTerm: searchTerm.value,
    filterRubro: filterRubro.value
  })
}

const clearFilters = () => {
  searchTerm.value = ''
  filterRubro.value = ''
  emit('clear')
}
</script>