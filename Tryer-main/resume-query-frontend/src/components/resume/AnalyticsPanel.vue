<template>
  <section class="analytics-grid">
    <article class="metric-card">
      <span>Total Resumes</span>
      <strong>{{ analytics.totalResumes || 0 }}</strong>
      <p>Parsed candidate profiles in MongoDB</p>
    </article>

    <article class="metric-card wide">
      <span>Top Skills</span>
      <div v-if="analytics.topSkills?.length" class="skill-bars">
        <div v-for="skill in analytics.topSkills" :key="skill.skill" class="skill-row">
          <div>
            <strong>{{ skill.skill }}</strong>
            <small>{{ skill.count }} candidate{{ skill.count === 1 ? '' : 's' }}</small>
          </div>
          <div class="bar">
            <span :style="{ width: `${skillWidth(skill.count)}%` }"></span>
          </div>
        </div>
      </div>
      <p v-else>No skills available yet.</p>
    </article>
  </section>
</template>

<script setup>
const props = defineProps({
  analytics: { type: Object, required: true },
})

const skillWidth = (count) => {
  const max = Math.max(...(props.analytics.topSkills || []).map((skill) => skill.count), 1)
  return Math.max(12, Math.round((count / max) * 100))
}
</script>
