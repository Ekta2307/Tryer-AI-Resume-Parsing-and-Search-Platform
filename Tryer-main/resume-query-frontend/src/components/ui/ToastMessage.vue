<template>
  <transition name="toast">
    <div v-if="message" :class="['toast', type]">
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'success' },
})
</script>
