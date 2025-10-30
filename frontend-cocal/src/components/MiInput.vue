<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-semibold">{{ label }}</label>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="border border-gray-300 rounded-lg p-2 focus:outline-blue-500"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text',
  },
});
defineEmits(['update:modelValue']);
</script>
