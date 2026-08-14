<script setup lang="ts">
const props = defineProps<{ documentId: number }>();
const $q = useQuasar();
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
    <q-item class="q-pa-lg">
      <q-item-section avatar>
        <q-avatar
          :color="$q.dark.isActive ? 'grey-9' : 'purple-1'"
          text-color="secondary"
          icon="auto_awesome"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6 text-weight-bold">AI Insights</q-item-label>
        <q-item-label caption>Notable patterns found in the spreadsheet</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator />

    <CommonLoadingState v-if="pending" :rows="3" height="70px" />

    <q-card-section v-else-if="error">
      <q-banner
        rounded
        :class="$q.dark.isActive ? 'bg-red-10 text-red-2' : 'bg-red-1 text-negative'"
      >
        Failed to load AI insights.
        <template #action>
          <q-btn flat no-caps color="negative" label="Retry" @click="refresh" />
        </template>
      </q-banner>
    </q-card-section>

    <q-card-section v-else-if="insights" class="insights-content text-body1 q-pa-lg">
      {{ insights.insights }}
    </q-card-section>
  </q-card>
</template>

<style scoped>
.insights-content {
  white-space: pre-line;
}
</style>
