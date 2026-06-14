<template>
  <section class="panel">
    <div class="section-heading">
      <p class="eyebrow">Bulk Upload</p>
      <h2>Parse PDF and DOCX resumes</h2>
      <p>Upload multiple resumes at once. Tryer extracts candidate details, blocks duplicate files, and updates analytics automatically.</p>
    </div>

    <label class="dropzone" :class="{ dragging: isDragging }" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop">
      <input type="file" multiple accept=".pdf,.docx" @change="handleFileChange" />
      <span>Drop resumes here or browse files</span>
      <small>PDF and DOCX only, up to 25 files per upload</small>
    </label>

    <div v-if="files.length" class="file-list">
      <div v-for="file in files" :key="file.name + file.size" class="file-row">
        <span>{{ file.name }}</span>
        <small>{{ formatSize(file.size) }}</small>
      </div>
    </div>

    <div v-if="isUploading" class="progress-track">
      <span :style="{ width: `${progress}%` }"></span>
    </div>

    <button class="primary-button" :disabled="!files.length || isUploading" @click="submit">
      <span v-if="isUploading" class="spinner"></span>
      {{ isUploading ? `Uploading ${progress}%` : 'Upload Resumes' }}
    </button>

    <div v-if="summary" class="upload-summary">
      <strong>{{ summary.uploaded.length }}</strong> uploaded,
      <strong>{{ summary.duplicates.length }}</strong> duplicate,
      <strong>{{ summary.failed.length }}</strong> failed
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { getApiError, uploadResumes } from '../services/api'

const emit = defineEmits(['uploaded', 'notify'])

const files = ref([])
const progress = ref(0)
const isDragging = ref(false)
const isUploading = ref(false)
const summary = ref(null)

const allowedExtensions = ['pdf', 'docx']

const setFiles = (selectedFiles) => {
  files.value = Array.from(selectedFiles).filter((file) => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    return allowedExtensions.includes(extension)
  })
}

const handleFileChange = (event) => {
  setFiles(event.target.files)
}

const handleDrop = (event) => {
  isDragging.value = false
  setFiles(event.dataTransfer.files)
}

const formatSize = (size) => `${(size / 1024 / 1024).toFixed(2)} MB`

const submit = async () => {
  if (!files.value.length) return

  isUploading.value = true
  progress.value = 0

  try {
    const response = await uploadResumes(files.value, (event) => {
      progress.value = Math.round((event.loaded * 100) / (event.total || 1))
    })

    summary.value = response.data.data
    emit('notify', response.data.message, 'success')
    emit('uploaded')
    files.value = []
  } catch (error) {
    emit('notify', getApiError(error), 'error')
  } finally {
    isUploading.value = false
  }
}
</script>
