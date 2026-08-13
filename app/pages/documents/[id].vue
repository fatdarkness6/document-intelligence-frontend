<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const documentsApi = useDocuments();
const feedback = useAppFeedback();
const analysisApi = useDocumentAnalysis();

const renameDialogOpen = ref(false);
const newFilename = ref("");
const renameLoading = ref(false);
const reprocessLoading = ref(false);
const deleteLoading = ref(false);
const foldersApi = useFolders();
const selectedFolder = ref<number | null>(null);
const folderLoading = ref(false);
const tagsApi = useTags();
const selectedTag = ref<number | null>(null);
const tagLoading = ref(false);
const reportLoading = ref(false);
const question = ref("");
const asking = ref(false);

let processingTimer: ReturnType<typeof setInterval> | null = null;
const documentChat = useDocumentChat();

const documentId = Number(route.params.id);

const {
  data: document,
  pending,
  error,
  refresh,
} = await useAsyncData(`document-${documentId}`, () =>
  documentsApi.getDocument(documentId),
);

async function handleAskQuestion() {
  const askedQuestion = question.value.trim();

  if (!askedQuestion) return;

  asking.value = true;

  try {
    const response = await documentChat.askQuestion(documentId, askedQuestion);

    question.value = "";

    await refreshQuestions();

    // Find the newly stored question
    const currentQuestion = (questions.value ?? [])
      .filter((item) => item.question === askedQuestion)
      .sort((a, b) => b.id - a.id)[0];

    if (currentQuestion) {
      currentQuestion.sources = response.sources;
    }
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    asking.value = false;
  }
}

function formatNumber(value: number | null) {
  if (value === null) return "—";

  return Number(value.toFixed(2)).toLocaleString();
}

function openRenameDialog() {
  if (!document.value) return;

  newFilename.value = document.value.filename;
  renameDialogOpen.value = true;
}

async function handleRename() {
  if (!document.value || !newFilename.value.trim()) return;

  renameLoading.value = true;

  try {
    await documentsApi.renameDocument(
      document.value.id,
      newFilename.value.trim(),
    );

    await refresh();

    renameDialogOpen.value = false;
    feedback.success("Document renamed successfully");
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    renameLoading.value = false;
  }
}

async function handleFavorite() {
  if (!document.value) return;

  try {
    await documentsApi.toggleFavorite(
      document.value.id,
      !document.value.is_favorite,
    );

    await refresh();
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  }
}

function handleDelete() {
  if (!document.value) return;

  feedback
    .confirm({
      title: "Delete document?",
      message: "This action cannot be undone.",
    })
    .onOk(async () => {
      deleteLoading.value = true;

      try {
        await documentsApi.deleteDocument(document.value!.id);

        feedback.success("Document deleted");
        await navigateTo("/documents");
      } catch (error) {
        feedback.error(normalizeApiError(error).message);
      } finally {
        deleteLoading.value = false;
      }
    });
}

async function handleReprocess() {
  if (!document.value) return;

  reprocessLoading.value = true;

  try {
    await documentsApi.reprocessDocument(document.value.id);
    await refresh();

    feedback.success("Reprocessing started");
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    reprocessLoading.value = false;
  }
}

const { data: folders } = await useAsyncData("document-folders", () =>
  foldersApi.getFolders(),
);

watch(
  document,
  (value) => {
    selectedFolder.value = value?.folder_id ?? null;
  },
  { immediate: true },
);

async function handleFolderChange(folderId: number | null) {
  if (!document.value) return;

  folderLoading.value = true;

  try {
    await documentsApi.moveToFolder(document.value.id, folderId);

    await refresh();

    feedback.success("Folder updated");
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    folderLoading.value = false;
  }
}

const { data: tags } = await useAsyncData("document-tags", () =>
  tagsApi.getTags(),
);

async function handleAddTag() {
  if (!document.value || !selectedTag.value) return;

  tagLoading.value = true;

  try {
    await documentsApi.addTag(document.value.id, selectedTag.value);

    selectedTag.value = null;

    await refresh();

    feedback.success("Tag added");
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    tagLoading.value = false;
  }
}

async function handleRemoveTag(tagId: number) {
  if (!document.value) return;

  tagLoading.value = true;

  try {
    await documentsApi.removeTag(document.value.id, tagId);

    await refresh();

    feedback.success("Tag removed");
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    tagLoading.value = false;
  }
}

async function handleDownloadReport() {
  if (!document.value) return;

  reportLoading.value = true;

  try {
    const blob = await documentsApi.downloadReport(document.value.id);

    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");

    link.href = url;
    link.download = `${document.value.filename}-report.pdf`;

    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    reportLoading.value = false;
  }
}

function startProcessingPolling() {
  if (processingTimer) return;

  processingTimer = setInterval(async () => {
    await refresh();

    if (document.value?.status !== "processing") {
      stopProcessingPolling();
    }
  }, 3000);
}

function stopProcessingPolling() {
  if (!processingTimer) return;

  clearInterval(processingTimer);
  processingTimer = null;
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

const {
  data: questions,
  pending: questionsPending,
  error: questionsError,
  refresh: refreshQuestions,
} = await useAsyncData(`document-${documentId}-questions`, () =>
  documentChat.getQuestions(documentId),
);

const isSpreadsheet = computed(() => {
  const type = document.value?.file_type?.toLowerCase();

  return type === "csv" || type === "xlsx";
});

const {
  data: analysis,
  pending: analysisPending,
  error: analysisError,
  refresh: refreshAnalysis,
} = await useAsyncData(
  `document-${documentId}-analysis`,
  () => analysisApi.getAnalysis(documentId),
  {
    immediate: false,
  },
);

const {
  data: insights,
  pending: insightsPending,
  error: insightsError,
  refresh: refreshInsights,
} = await useAsyncData(
  `document-${documentId}-insights`,
  () => analysisApi.getInsights(documentId),
  {
    immediate: false,
  },
);

watch(
  isSpreadsheet,
  async (value) => {
    if (!value) return;

    await Promise.all([refreshAnalysis(), refreshInsights()]);
  },
  { immediate: true },
);
onBeforeUnmount(() => {
  stopProcessingPolling();
});
</script>

<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-btn
        flat
        round
        icon="edit"
        @click="openRenameDialog"
        aria-label="Rename document"
      />

      <q-btn
        flat
        round
        :icon="document.is_favorite ? 'star' : 'star_border'"
        color="amber"
        @click="handleFavorite"
        :aria-label="
          document.is_favorite ? 'Remove from favorites' : 'Add to favorites'
        "
      />

      <q-btn
        flat
        round
        icon="refresh"
        color="primary"
        :loading="reprocessLoading"
        @click="handleReprocess"
        aria-label="Reprocess document"
      />

      <q-btn
        flat
        round
        icon="delete"
        color="negative"
        :loading="deleteLoading"
        @click="handleDelete"
        aria-label="Delete document"
      />
      <q-btn
        flat
        round
        icon="download"
        color="primary"
        :loading="reportLoading"
        @click="handleDownloadReport"
        aria-label="Delete document"
      />

      <q-chip
        :color="
          document.status === 'completed'
            ? 'positive'
            : document.status === 'failed'
              ? 'negative'
              : 'primary'
        "
        text-color="white"
      >
        {{ document.status }}
      </q-chip>
    </div>
    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <div class="text-h6">AI Chat</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <!-- History loading -->
        <CommonLoadingState v-if="questionsPending" :rows="3" height="48px" />

        <!-- History error -->
        <q-banner
          v-else-if="questionsError"
          class="bg-red-1 text-negative"
          rounded
        >
          Failed to load conversation history.

          <template #action>
            <q-btn
              flat
              label="Retry"
              color="negative"
              @click="refreshQuestions"
            />
          </template>
        </q-banner>

        <!-- Empty -->
        <CommonEmptyState
          v-else-if="!questions?.length && !asking"
          icon="forum"
          title="No questions yet"
          description="Ask something about this document to start the conversation."
        />

        <!-- Conversation -->
        <div v-else class="column">
          <template v-for="item in questions ?? []" :key="item.id">
            <!-- User -->
            <q-chat-message
              name="You"
              :text="[item.question]"
              sent
              bg-color="primary"
              text-color="white"
            />

            <!-- AI -->
            <q-chat-message
              name="AI"
              :text="[item.answer]"
              bg-color="grey-2"
              text-color="dark"
            />
            <q-expansion-item
              v-if="item.sources?.length"
              icon="menu_book"
              :label="`Sources (${item.sources.length})`"
              dense
              class="q-mb-md"
            >
              <q-list bordered separator class="rounded-borders">
                <q-item v-for="source in item.sources" :key="source.chunk_id">
                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      {{
                        source.page_number
                          ? `Page ${source.page_number}`
                          : `Chunk ${source.chunk_index + 1}`
                      }}
                    </q-item-label>

                    <q-item-label caption lines="3">
                      {{ source.preview }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </template>

          <!-- AI thinking -->
          <q-chat-message
            v-if="asking"
            name="AI"
            bg-color="grey-2"
            text-color="dark"
          >
            <q-spinner-dots size="24px" color="primary" />
          </q-chat-message>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Question input -->
      <q-card-section>
        <q-input
          v-model="question"
          outlined
          type="textarea"
          autogrow
          placeholder="Ask something about this document..."
          :disable="document?.status !== 'completed' || asking"
          @keyup.ctrl.enter="handleAskQuestion"
        >
          <template #append>
            <q-btn
              round
              flat
              icon="send"
              color="primary"
              :loading="asking"
              :disable="!question.trim() || document?.status !== 'completed'"
              @click="handleAskQuestion"
            />
          </template>
        </q-input>

        <div
          v-if="document?.status !== 'completed'"
          class="text-grey-7 text-caption q-mt-sm"
        >
          Chat becomes available when processing is complete.
        </div>
      </q-card-section>
    </q-card>
    <q-separator />

    <q-dialog v-model="renameDialogOpen">
      <q-card style="width: 420px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Rename document</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newFilename"
            outlined
            label="Filename"
            autofocus
            @keyup.enter="handleRename"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />

          <q-btn
            color="primary"
            label="Save"
            unelevated
            :loading="renameLoading"
            @click="handleRename"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-sm">Tags</div>

        <div class="row q-gutter-sm q-mb-md">
          <q-chip
            v-for="tag in document.tags"
            :key="tag.id"
            removable
            color="primary"
            text-color="white"
            @remove="handleRemoveTag(tag.id)"
          >
            {{ tag.name }}
          </q-chip>
        </div>

        <div class="row q-col-gutter-sm items-center">
          <div class="col">
            <q-select
              v-model="selectedTag"
              :options="tags ?? []"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              outlined
              clearable
              label="Add tag"
            />
          </div>

          <div class="col-auto">
            <q-btn
              color="primary"
              icon="add"
              label="Add"
              unelevated
              :disable="!selectedTag"
              :loading="tagLoading"
              @click="handleAddTag"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-sm">Folder</div>

        <q-select
          v-model="selectedFolder"
          :options="folders ?? []"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          clearable
          outlined
          label="Select folder"
          :loading="folderLoading"
          @update:model-value="handleFolderChange"
        />
      </q-card-section>
    </q-card>
    <!-- Loading -->
    <div v-if="pending" class="q-gutter-md">
      <q-skeleton type="text" width="40%" />
      <q-skeleton type="rect" height="180px" />
      <q-skeleton type="rect" height="250px" />
    </div>

    <!-- Error -->
    <q-banner v-else-if="error" rounded class="bg-red-1 text-negative">
      Failed to load document.

      <template #action>
        <q-btn flat color="negative" label="Retry" @click="refresh" />
      </template>
    </q-banner>

    <!-- Document -->
    <template v-else-if="document">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h4 text-weight-bold">
            {{ document.filename }}
          </div>

          <div class="text-grey-7 q-mt-xs">
            {{ document.file_type.toUpperCase() }}
          </div>
        </div>

        <q-chip
          :color="
            document.status === 'completed'
              ? 'positive'
              : document.status === 'failed'
                ? 'negative'
                : 'primary'
          "
          text-color="white"
        >
          {{ document.status }}
        </q-chip>
      </div>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6 q-mb-md">AI Summary</div>

          <div v-if="document.summary">
            {{ document.summary }}
          </div>

          <div v-else class="text-grey-7">No summary available yet.</div>
        </q-card-section>
      </q-card>
      <!-- Spreadsheet Analysis -->
      <q-card v-if="isSpreadsheet" flat bordered class="q-mt-md">
        <q-card-section>
          <div class="text-h6">Spreadsheet Analysis</div>
        </q-card-section>

        <q-separator />

        <!-- Loading -->
        <CommonLoadingState v-if="analysisPending" :rows="3" height="100px" />

        <!-- Error -->
        <q-card-section v-else-if="analysisError">
          <q-banner rounded class="bg-red-1 text-negative">
            Failed to load spreadsheet analysis.

            <template #action>
              <q-btn
                flat
                color="negative"
                label="Retry"
                @click="refreshAnalysis"
              />
            </template>
          </q-banner>
        </q-card-section>

        <!-- Analysis -->
        <template v-else-if="analysis">
          <!-- Rows / Columns -->
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-card flat bordered class="q-pa-md">
                  <div class="text-grey-7">Rows</div>

                  <div class="text-h4 text-weight-bold">
                    {{ analysis.rows }}
                  </div>
                </q-card>
              </div>

              <div class="col-12 col-sm-6">
                <q-card flat bordered class="q-pa-md">
                  <div class="text-grey-7">Columns</div>

                  <div class="text-h4 text-weight-bold">
                    {{ analysis.columns }}
                  </div>
                </q-card>
              </div>
            </div>
          </q-card-section>

          <!-- Column information -->
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium q-mb-md">Columns</div>

            <q-markup-table flat bordered wrap-cells>
              <thead>
                <tr>
                  <th class="text-left">Column</th>
                  <th class="text-left">Type</th>
                  <th class="text-right">Missing values</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="column in analysis.column_info" :key="column.name">
                  <td class="text-left text-weight-medium">
                    {{ column.name }}
                  </td>

                  <td class="text-left">
                    <q-chip dense>
                      {{ column.type }}
                    </q-chip>
                  </td>

                  <td class="text-right">
                    <span
                      :class="
                        column.missing_values > 0
                          ? 'text-negative text-weight-medium'
                          : 'text-positive'
                      "
                    >
                      {{ column.missing_values }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>

          <!-- Numeric statistics -->
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium q-mb-md">
              Numeric Statistics
            </div>

            <q-markup-table flat bordered wrap-cells>
              <thead>
                <tr>
                  <th class="text-left">Column</th>
                  <th class="text-right">Count</th>
                  <th class="text-right">Mean</th>
                  <th class="text-right">Std</th>
                  <th class="text-right">Min</th>
                  <th class="text-right">25%</th>
                  <th class="text-right">50%</th>
                  <th class="text-right">75%</th>
                  <th class="text-right">Max</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(stats, name) in analysis.numeric_summary"
                  :key="name"
                >
                  <td class="text-left text-weight-medium">
                    {{ name }}
                  </td>

                  <td class="text-right">
                    {{ stats.count }}
                  </td>

                  <td class="text-right">
                    {{ formatNumber(stats.mean) }}
                  </td>

                  <td class="text-right">
                    {{ formatNumber(stats.std) }}
                  </td>

                  <td class="text-right">
                    {{ formatNumber(stats.min) }}
                  </td>

                  <td class="text-right">
                    {{ formatNumber(stats["25%"]) }}
                  </td>

                  <td class="text-right">
                    {{ formatNumber(stats["50%"]) }}
                  </td>

                  <td class="text-right">
                    {{ formatNumber(stats["75%"]) }}
                  </td>

                  <td class="text-right">
                    {{ formatNumber(stats.max) }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </template>
      </q-card>
      <q-card v-if="isSpreadsheet" flat bordered class="q-mt-md">
        <q-card-section>
          <div class="row items-center q-gutter-sm">
            <q-icon name="auto_awesome" color="primary" size="24px" />

            <div class="text-h6">AI Insights</div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- Loading -->
        <CommonLoadingState v-if="pending" :rows="4" height="100px" />

        <!-- Error -->
        <q-card-section v-else-if="insightsError">
          <q-banner rounded class="bg-red-1 text-negative">
            Failed to load AI insights.

            <template #action>
              <q-btn
                flat
                color="negative"
                label="Retry"
                @click="refreshInsights"
              />
            </template>
          </q-banner>
        </q-card-section>

        <!-- Insights -->
        <q-card-section v-else-if="insights">
          <div class="insights-content">
            {{ insights.insights }}
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>
<style scoped lang="scss">
.insights-content {
  white-space: pre-line;
  line-height: 1.8;
}
</style>
