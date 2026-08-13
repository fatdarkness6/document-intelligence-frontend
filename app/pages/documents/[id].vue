<script setup lang="ts">
import DocumentHeader from "~/components/documents/detail/DocumentHeader.vue";
import SummaryCard from "~/components/documents/detail/SummaryCard.vue";
import ChatCard from "~/components/documents/detail/ChatCard.vue";
import TagsCard from "~/components/documents/detail/TagsCard.vue";
import FolderCard from "~/components/documents/detail/FolderCard.vue";
import SpreadsheetAnalysisCard from "~/components/documents/detail/SpreadsheetAnalysisCard.vue";
import SpreadsheetInsightsCard from "~/components/documents/detail/SpreadsheetInsightsCard.vue";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const documentsApi = useDocuments();

const documentId = Number(route.params.id);

if (!Number.isInteger(documentId) || documentId < 1) {
  throw createError({
    statusCode: 404,
    statusMessage: "Document not found",
  });
}

const {
  data: document,
  pending,
  error,
  refresh,
} = await useAsyncData(`document-${documentId}`, () =>
  documentsApi.getDocument(documentId),
);

const isSpreadsheet = computed(() => {
  const fileType = document.value?.file_type.toLowerCase();

  return fileType === "csv" || fileType === "xlsx";
});

let processingTimer: ReturnType<typeof setInterval> | null = null;

function stopProcessingPolling() {
  if (!processingTimer) return;

  clearInterval(processingTimer);
  processingTimer = null;
}

function startProcessingPolling() {
  if (!import.meta.client || processingTimer) return;

  processingTimer = setInterval(async () => {
    await refresh();

    if (document.value?.status !== "processing") {
      stopProcessingPolling();
    }
  }, 3000);
}

watch(
  () => document.value?.status,
  (status) => {
    if (status === "processing") {
      startProcessingPolling();
    } else {
      stopProcessingPolling();
    }
  },
  { immediate: true },
);

onBeforeUnmount(stopProcessingPolling);
</script>

<template>
  <q-page class="q-pa-md">
    <div v-if="pending" class="q-gutter-md">
      <q-skeleton type="text" width="40%" />
      <q-skeleton type="rect" height="180px" />
      <q-skeleton type="rect" height="250px" />
    </div>

    <q-banner v-else-if="error" rounded class="bg-red-1 text-negative">
      Failed to load document.

      <template #action>
        <q-btn flat color="negative" label="Retry" @click="refresh" />
      </template>
    </q-banner>

    <template v-else-if="document">
      <DocumentHeader :document="document" @updated="refresh" />

      <div class="q-gutter-y-md">
        <SummaryCard :summary="document.summary" />

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <TagsCard
              :document-id="document.id"
              :assigned-tags="document.tags"
              @updated="refresh"
            />
          </div>

          <div class="col-12 col-md-6">
            <FolderCard
              :document-id="document.id"
              :folder-id="document.folder_id"
              @updated="refresh"
            />
          </div>
        </div>

        <ChatCard :document-id="document.id" :status="document.status" />

        <template v-if="isSpreadsheet">
          <SpreadsheetAnalysisCard :document-id="document.id" />
          <SpreadsheetInsightsCard :document-id="document.id" />
        </template>
      </div>
    </template>
  </q-page>
</template>
