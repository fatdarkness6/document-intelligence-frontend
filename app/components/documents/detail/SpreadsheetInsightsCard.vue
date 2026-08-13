<script setup lang="ts">
const props = defineProps<{
  documentId: number;
}>();

const analysisApi = useDocumentAnalysis();

const {
  data: insights,
  pending,
  error,
  refresh,
} = await useAsyncData(
  `document-${props.documentId}-insights`,
  () => analysisApi.getInsights(props.documentId),
);
</script>

<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="row items-center q-gutter-sm">
        <q-icon name="auto_awesome" color="primary" size="24px" />
        <div class="text-h6">AI Insights</div>
      </div>
    </q-card-section>

    <q-separator />

    <CommonLoadingState v-if="pending" :rows="4" height="100px" />

    <q-card-section v-else-if="error">
      <q-banner rounded class="bg-red-1 text-negative">
        Failed to load AI insights.

        <template #action>
          <q-btn flat color="negative" label="Retry" @click="refresh" />
        </template>
      </q-banner>
    </q-card-section>

    <q-card-section v-else-if="insights">
      <div class="insights-content">
        {{ insights.insights }}
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.insights-content {
  white-space: pre-line;
  line-height: 1.8;
}
</style>
