<template>
  <div class="app-shell">
    <AppNavbar :active-tab="activeTab" @change-tab="activeTab = $event" />

    <main class="page">
      <section class="hero-band">
        <div>
          <p class="eyebrow">Resume Parsing and Search Platform</p>
          <h2>Find the right candidate faster.</h2>
          <p>Tryer turns resume files into searchable candidate profiles with analytics, filters, and relevance scoring.</p>
        </div>
      </section>

      <AnalyticsPanel :analytics="analytics" />

      <UploadComponent
        v-if="activeTab === 'upload'"
        @uploaded="handleUploaded"
        @notify="showToast"
      />
      <SearchComponent
        v-else-if="activeTab === 'search'"
        ref="searchRef"
      />
      <section v-else class="panel">
        <div class="section-heading">
          <p class="eyebrow">Analytics</p>
          <h2>Resume intelligence dashboard</h2>
          <p>Track candidate volume, recent uploads, and skill distribution to understand your talent pool.</p>
        </div>
        <div class="recent-list">
          <article v-for="resume in analytics.recentResumes" :key="resume._id" class="recent-row">
            <strong>{{ resume.name }}</strong>
            <span>{{ resume.location }} - {{ resume.experience }}</span>
          </article>
        </div>
      </section>
    </main>

    <ToastMessage :message="toast.message" :type="toast.type" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import AppNavbar from './components/layout/AppNavbar.vue'
import AnalyticsPanel from './components/resume/AnalyticsPanel.vue'
import SearchComponent from './components/SearchComponent.vue'
import UploadComponent from './components/UploadComponent.vue'
import ToastMessage from './components/ui/ToastMessage.vue'
import { getAnalytics, getApiError } from './services/api'

const activeTab = ref('upload')
const searchRef = ref(null)
const analytics = ref({ totalResumes: 0, topSkills: [], recentResumes: [] })
const toast = reactive({ message: '', type: 'success' })

let toastTimer

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.message = ''
  }, 3500)
}

const loadAnalytics = async () => {
  try {
    const response = await getAnalytics()
    analytics.value = response.data.data
  } catch (error) {
    showToast(getApiError(error), 'error')
  }
}

const handleUploaded = async () => {
  await loadAnalytics()
  searchRef.value?.runSearch?.()
}

onMounted(loadAnalytics)
</script>
