<template>
  <v-snackbar
    v-model="internalShow"
    :color="color"
    :timeout="timeout"
    :location="location"
    :transition="transition"
    :multi-line="multiLine"
    :vertical="vertical"
    :elevation="elevation"
    :close-on-content-click="closeOnContentClick"
    class="notification-snackbar"
  >
    <div class="d-flex align-center notification-content">
      <!-- Icono dinámico según el tipo -->
      <v-icon v-if="showIcon" :icon="computedIcon" class="mr-2" size="small"></v-icon>
      
      <!-- Contenido del mensaje -->
      <div class="flex-grow-1">
        <div v-if="title" class="text-body-1 font-weight-medium">{{ title }}</div>
        <div :class="messageClasses">{{ message }}</div>
      </div>
      
      <!-- Acciones adicionales -->
      <div v-if="actionLabel" class="ml-4">
        <v-btn
          :color="actionColor"
          variant="text"
          size="small"
          @click="handleAction"
          class="text-none"
        >
          {{ actionLabel }}
        </v-btn>
      </div>
    </div>
    
    <!-- Botón de cierre -->
    <template v-if="showClose" v-slot:actions>
      <v-btn
        icon
        variant="text"
        size="small"
        :color="closeButtonColor"
        @click="close"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  // Control de visibilidad
  show: {
    type: Boolean,
    default: false
  },
  
  // Contenido
  message: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  
  // Apariencia
  color: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning', 'info', 'primary', 'secondary'].includes(value)
  },
  icon: {
    type: String,
    default: ''
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  
  // Comportamiento
  timeout: {
    type: Number,
    default: 4000
  },
  location: {
    type: String,
    default: 'top right',
    validator: (value) => ['top', 'bottom', 'top left', 'top right', 'bottom left', 'bottom right'].includes(value)
  },
  transition: {
    type: String,
    default: 'v-snackbar-transition'
  },
  multiLine: {
    type: Boolean,
    default: false
  },
  vertical: {
    type: Boolean,
    default: false
  },
  elevation: {
    type: Number,
    default: 6
  },
  
  // Acciones
  actionLabel: {
    type: String,
    default: ''
  },
  actionColor: {
    type: String,
    default: 'white'
  },
  
  // Cierre
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnContentClick: {
    type: Boolean,
    default: false
  },
  closeButtonColor: {
    type: String,
    default: 'white'
  },
  
  // Auto-desaparición
  autoHide: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'action', 'update:show'])

// Control interno de visibilidad
const internalShow = ref(props.show)

// Observar cambios en la propiedad show
watch(() => props.show, (newVal) => {
  internalShow.value = newVal
})

// Observar cambios internos y emitir al padre
watch(() => internalShow.value, (newVal) => {
  if (!newVal && props.show) {
    emit('update:show', false)
  }
  if (!newVal) {
    emit('close')
  }
})

// Icono computado basado en el color
const computedIcon = computed(() => {
  if (props.icon) return props.icon
  
  switch (props.color) {
    case 'success': return 'mdi-check-circle'
    case 'error': return 'mdi-alert-circle'
    case 'warning': return 'mdi-alert'
    case 'info': return 'mdi-information'
    case 'primary': return 'mdi-information-outline'
    default: return 'mdi-information-outline'
  }
})

// Clases para el mensaje
const messageClasses = computed(() => {
  const classes = []
  if (props.title) {
    classes.push('text-caption')
  } else {
    classes.push('text-body-2')
  }
  return classes
})

// Métodos
const close = () => {
  internalShow.value = false
}

const handleAction = () => {
  emit('action')
  if (props.autoHide) {
    close()
  }
}

// Auto-ocultar cuando el timeout se complete
watch(internalShow, (isVisible) => {
  if (isVisible && props.autoHide && props.timeout > 0) {
    setTimeout(() => {
      if (internalShow.value) {
        close()
      }
    }, props.timeout)
  }
})
</script>

<style scoped>
.notification-snackbar {
  z-index: 9999;
}

.notification-content {
  min-height: 48px;
}

/* Animación personalizada para entrada/salida */
.notification-snackbar :deep(.v-snackbar__wrapper) {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Estilos responsivos */
@media (max-width: 600px) {
  .notification-snackbar :deep(.v-snackbar__content) {
    padding: 12px;
  }
  
  .notification-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .notification-content .ml-4 {
    margin-left: 0;
    margin-top: 8px;
    align-self: flex-end;
  }
}
</style>