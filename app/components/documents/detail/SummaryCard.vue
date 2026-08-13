<script setup lang="ts">
defineProps<{
  summary: string | null;
}>();
</script>

<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="text-h6 q-mb-md">AI Summary</div>

      <div v-if="summary">
        {{ summary }}
      </div>

      <div v-else class="text-grey-7">No summary available yet.</div>
    </q-card-section>
  </q-card>
</template>
