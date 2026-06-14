<template>
  <div class="state-block">
    <div class="state-icon">{{ icon }}</div>
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'i' },
  title: { type: String, required: true },
  message: { type: String, required: true },
})
</script>
