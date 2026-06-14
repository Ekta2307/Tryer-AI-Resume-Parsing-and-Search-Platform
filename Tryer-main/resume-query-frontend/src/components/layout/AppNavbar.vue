<template>
  <header class="navbar">
    <div>
      <p class="eyebrow">AI Resume Intelligence</p>
      <h1>Tryer</h1>
    </div>
    <nav class="nav-actions" aria-label="Primary">
      <button :class="{ active: activeTab === 'upload' }" @click="$emit('change-tab', 'upload')">Upload</button>
      <button :class="{ active: activeTab === 'search' }" @click="$emit('change-tab', 'search')">Search</button>
      <button :class="{ active: activeTab === 'analytics' }" @click="$emit('change-tab', 'analytics')">Analytics</button>
    </nav>
  </header>
</template>

<script setup>
defineProps({
  activeTab: { type: String, required: true },
})

defineEmits(['change-tab'])
</script>
