<template>
  <section class="panel">
    <div class="section-heading">
      <p class="eyebrow">Smart Search</p>
      <h2>Rank candidates by relevance</h2>
      <p>Use partial, case-insensitive filters. Match score is calculated from the selected search terms with TF-IDF ranking.</p>
    </div>

    <form class="search-grid" @submit.prevent="runSearch(1)">
      <input v-model="filters.q" placeholder="Keyword, role, or project" />
      <input v-model="filters.name" placeholder="Candidate name" />
      <input v-model="filters.skills" placeholder="Skills: Vue, Node, MongoDB" />
      <input v-model="filters.experience" placeholder="Experience text" />
      <input v-model="filters.location" placeholder="Location" />
      <input v-model="filters.minExperience" type="number" min="0" placeholder="Min years" />
      <button class="primary-button" type="submit" :disabled="isLoading">
        <span v-if="isLoading" class="spinner"></span>
        {{ isLoading ? 'Searching' : 'Search' }}
      </button>
    </form>

    <StateBlock
      v-if="error"
      icon="!"
      title="Search failed"
      :message="error"
    />

    <StateBlock
      v-else-if="!isLoading && !results.length"
      icon="0"
      title="No candidates to show"
      message="Upload resumes or adjust filters to discover matching candidates."
    />

    <div v-else class="results-grid">
      <ResumeCard v-for="resume in results" :key="resume._id" :resume="resume" />
    </div>

    <div v-if="meta.totalPages > 1" class="pagination">
      <button :disabled="meta.page === 1 || isLoading" @click="runSearch(meta.page - 1)">Previous</button>
      <span>Page {{ meta.page }} of {{ meta.totalPages }}</span>
      <button :disabled="meta.page === meta.totalPages || isLoading" @click="runSearch(meta.page + 1)">Next</button>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import ResumeCard from './resume/ResumeCard.vue'
import StateBlock from './ui/StateBlock.vue'
import { getApiError, searchResumes } from '../services/api'

const filters = reactive({
  q: '',
  name: '',
  skills: '',
  experience: '',
  location: '',
  minExperience: '',
  limit: 9,
})

const results = ref([])
const meta = ref({ page: 1, totalPages: 1, total: 0 })
const error = ref('')
const isLoading = ref(false)

const runSearch = async (page = 1) => {
  isLoading.value = true
  error.value = ''

  try {
    const response = await searchResumes({ ...filters, page })
    results.value = response.data.data
    meta.value = response.data.meta
  } catch (requestError) {
    error.value = getApiError(requestError)
  } finally {
    isLoading.value = false
  }
}

defineExpose({ runSearch })

onMounted(() => runSearch())
</script>
