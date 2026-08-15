<script setup lang="ts">
import DocumentHeader from "~/components/documents/detail/DocumentHeader.vue";
import SummaryCard from "~/components/documents/detail/SummaryCard.vue";
import ChatCard from "~/components/documents/detail/ChatCard.vue";
import TagsCard from "~/components/documents/detail/TagsCard.vue";
import FolderCard from "~/components/documents/detail/FolderCard.vue";
import SpreadsheetAnalysisCard from "~/components/documents/detail/SpreadsheetAnalysisCard.vue";
import SpreadsheetInsightsCard from "~/components/documents/detail/SpreadsheetInsightsCard.vue";

definePageMeta({ middleware: "auth" });

const $q = useQuasar();
const route = useRoute();
const documentsApi = useDocuments();
const processingStore = useDocumentProcessingStore();
const activeTab = ref("overview");

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

usePageSeo({
  title: () => document.value?.filename ?? "Document",
  description: () =>
    document.value
      ? `Review the summary, AI conversation, and insights for ${document.value.filename}.`
      : "Review a private document, summary, AI conversation, and insights in DocIntel.",
  noIndex: true,
});

const isSpreadsheet = computed(() => {
  const fileType = document.value?.file_type.toLowerCase();
  return fileType === "csv" || fileType === "xlsx";
});

const processingUpdate = computed(
  () => processingStore.updates[documentId],
);
const streamConnectionState = computed(
  () => processingStore.connectionStates[documentId],
);
const processingProgress = computed(() => {
  const progress = processingUpdate.value?.progress;
  if (typeof progress !== "number") return null;
  return Math.min(100, Math.max(0, progress));
});

let subscribedToProcessing = false;
let handledTerminalUpdate: string | number | undefined;

watch(
  () => document.value?.status,
  (status) => {
    if (status === "processing" && !subscribedToProcessing) {
      subscribedToProcessing = true;
      processingStore.subscribe(documentId);
      return;
    }

    if (status !== "processing" && subscribedToProcessing) {
      subscribedToProcessing = false;
      processingStore.unsubscribe(documentId);
    }
  },
  { immediate: true },
);

watch(processingUpdate, async (update) => {
  if (!update || !document.value) return;

  document.value.status = update.status;

  if (update.status === "processing") {
    handledTerminalUpdate = undefined;
    return;
  }

  const marker = update.event_id ?? update.received_at;
  if (handledTerminalUpdate === marker) return;

  handledTerminalUpdate = marker;
  await refresh();
});

onBeforeUnmount(() => {
  if (subscribedToProcessing) {
    processingStore.unsubscribe(documentId);
  }
});
</script>

<template>
  <q-page :class="$q.screen.lt.sm ? 'q-pa-sm' : 'q-pa-lg'">
    <div class="document-workspace q-mx-auto">
      <template v-if="pending">
        <q-skeleton type="text" width="180px" />
        <q-card flat bordered class="q-mt-md">
          <q-card-section :class="$q.screen.lt.sm ? 'q-pa-md' : 'q-pa-lg'">
            <div class="row items-center no-wrap">
              <q-skeleton type="QAvatar" size="64px" />
              <div class="col q-ml-md">
                <q-skeleton type="text" width="45%" height="34px" />
                <q-skeleton type="text" width="28%" />
              </div>
            </div>
          </q-card-section>
        </q-card>
        <q-skeleton type="rect" height="420px" class="q-mt-md" />
      </template>

      <q-banner v-else-if="error" rounded class="bg-negative text-white">
        <template #avatar><q-icon name="cloud_off" size="28px" /></template>
        <div class="text-weight-bold">We couldn’t load this document</div>
        <div class="text-caption">Try loading the document workspace again.</div>
        <template #action>
          <q-btn flat no-caps color="white" label="Try again" @click="refresh" />
        </template>
      </q-banner>

      <template v-else-if="document">
        <DocumentHeader :document="document" @updated="refresh" />

        <q-banner
          v-if="document.status === 'processing'"
          rounded
          :class="
            $q.dark.isActive
              ? 'bg-blue-10 text-blue-2'
              : 'bg-blue-1 text-primary'
          "
          class="q-mt-md"
        >
          <template #avatar><q-spinner color="primary" size="26px" /></template>
          <div class="row items-center q-gutter-sm">
            <div class="text-weight-medium">
              {{ processingUpdate?.message || "Document processing is in progress" }}
            </div>
            <q-badge
              v-if="processingUpdate?.stage"
              outline
              color="primary"
              :label="processingUpdate.stage.replaceAll('_', ' ')"
            />
          </div>
          <div class="text-caption">
            Summary and AI chat will become available automatically when it is ready.
          </div>
          <q-linear-progress
            v-if="processingProgress !== null"
            rounded
            size="8px"
            color="primary"
            track-color="blue-2"
            :value="processingProgress / 100"
            class="q-mt-sm"
          />

          <template v-if="streamConnectionState === 'error'" #action>
            <q-btn
              flat
              no-caps
              color="primary"
              icon="sync_problem"
              label="Reconnect"
              @click="processingStore.retry(documentId)"
            />
          </template>
        </q-banner>

        <q-banner
          v-else-if="document.status === 'failed'"
          rounded
          :class="
            $q.dark.isActive
              ? 'bg-red-10 text-red-2'
              : 'bg-red-1 text-negative'
          "
          class="q-mt-md"
        >
          <template #avatar><q-icon name="error_outline" size="28px" /></template>
          <div class="text-weight-medium">Document processing failed</div>
          <div class="text-caption">
            Use the Actions menu above to reprocess this document.
          </div>
        </q-banner>

        <q-card flat bordered class="q-mt-md overflow-hidden">
          <q-tabs
            v-model="activeTab"
            align="left"
            active-color="primary"
            indicator-color="primary"
            narrow-indicator
            outside-arrows
            mobile-arrows
          >
            <q-tab
              name="overview"
              icon="dashboard"
              :label="$q.screen.gt.xs ? 'Overview' : undefined"
            />
            <q-tab
              name="chat"
              icon="forum"
              :label="$q.screen.gt.xs ? 'AI Chat' : undefined"
            />
            <q-tab
              v-if="isSpreadsheet"
              name="spreadsheet"
              icon="table_chart"
              :label="$q.screen.gt.xs ? 'Spreadsheet Data' : undefined"
            />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeTab" animated keep-alive>
            <q-tab-panel
              name="overview"
              :class="$q.screen.lt.sm ? 'q-pa-sm' : 'q-pa-lg'"
            >
              <div class="row q-col-gutter-md">
                <div class="col-12 col-lg-8">
                  <SummaryCard :summary="document.summary" />
                </div>

                <div class="col-12 col-lg-4">
                  <div class="column q-gutter-md">
                    <FolderCard
                      :document-id="document.id"
                      :folder-id="document.folder_id"
                      @updated="refresh"
                    />
                    <TagsCard
                      :document-id="document.id"
                      :assigned-tags="document.tags"
                      @updated="refresh"
                    />
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel
              name="chat"
              :class="$q.screen.lt.sm ? 'q-pa-sm' : 'q-pa-lg'"
            >
              <ChatCard :document-id="document.id" :status="document.status" />
            </q-tab-panel>

            <q-tab-panel
              v-if="isSpreadsheet"
              name="spreadsheet"
              :class="$q.screen.lt.sm ? 'q-pa-sm' : 'q-pa-lg'"
            >
              <div class="column q-gutter-md">
                <SpreadsheetInsightsCard :document-id="document.id" />
                <SpreadsheetAnalysisCard :document-id="document.id" />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </template>
    </div>
  </q-page>
</template>

<style scoped>
.document-workspace {
  width: min(100%, 1440px);
}
</style>
