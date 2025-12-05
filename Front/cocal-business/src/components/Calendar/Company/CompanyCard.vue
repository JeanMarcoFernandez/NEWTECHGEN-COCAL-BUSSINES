<template>
  <v-card class="company-card h-100 d-flex flex-column" elevation="0" @click="$emit('enter', company)">
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
              @click.stop="$emit('edit', company)" 
              prepend-icon="mdi-pencil"
            >
              <v-list-item-title>Editar</v-list-item-title>
            </v-list-item>
            <v-list-item 
              @click.stop="$emit('delete', company)" 
              prepend-icon="mdi-delete"
              class="text-error"
            >
              <v-list-item-title>Eliminar</v-list-item-title>
            </v-list-item>
            <v-divider class="my-1"></v-divider>
            <v-list-item 
              @click.stop="copyCompanyInfo" 
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
        @click.stop="$emit('enter', company)"
      >
        Entrar al Panel
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  company: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['enter', 'edit', 'delete'])

const getInitials = (name) => {
  if (!name) return 'EM'
  const words = name.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const getLogoColor = (name) => {
  const colors = ['primary', 'secondary', 'success', 'warning', 'info', 'error']
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

const copyCompanyInfo = () => {
  const text = `Empresa: ${props.company.nombre}\nNIT: ${props.company.nit}\nRubro: ${props.company.rubro}\nDirección: ${props.company.direccion}\nTeléfono: ${props.company.telefono}\nSitio Web: ${props.company.sitio_web}`
  navigator.clipboard.writeText(text)
  // Emitir evento para notificación
}
</script>

<style scoped>
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

.company-info-item {
  display: flex;
  align-items: center;
}

.h-100 {
  height: 100%;
}
</style>