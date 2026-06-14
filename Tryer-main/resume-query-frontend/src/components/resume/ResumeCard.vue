<template>
  <article class="resume-card">
    <div class="card-header">
      <div>
        <h3>{{ resume.name || 'Unknown Candidate' }}</h3>
        <p>{{ resume.location || 'Location unavailable' }}</p>
      </div>
      <span class="score">{{ resume.matchScore || 0 }}%</span>
    </div>

    <div class="candidate-meta">
      <span>{{ resume.experience || 'Experience N/A' }}</span>
      <span>{{ resume.email || 'Email N/A' }}</span>
      <span>{{ resume.phone || 'Phone N/A' }}</span>
    </div>

    <div class="chips">
      <span v-for="skill in visibleSkills" :key="skill">{{ skill }}</span>
      <span v-if="extraSkillCount">+{{ extraSkillCount }} more</span>
    </div>

    <p v-if="resume.projects?.length" class="projects">
      {{ resume.projects.slice(0, 3).join(', ') }}
    </p>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  resume: { type: Object, required: true },
})

const visibleSkills = computed(() => (props.resume.skills || []).slice(0, 8))
const extraSkillCount = computed(() => Math.max((props.resume.skills || []).length - visibleSkills.value.length, 0))
</script>
