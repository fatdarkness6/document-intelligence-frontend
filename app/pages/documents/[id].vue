<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const documentsApi = useDocuments();
const feedback = useAppFeedback();

const renameDialogOpen = ref(false);
const newFilename = ref("");
const actionLoading = ref(false);
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
  if (!question.value.trim()) return;

  asking.value = true;

  try {
    await documentChat.askQuestion(documentId, question.value.trim());

    question.value = "";

    await refreshQuestions();
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    asking.value = false;
  }
}
function openRenameDialog() {
  if (!document.value) return;

  newFilename.value = document.value.filename;
  renameDialogOpen.value = true;
}

async function handleRename() {
  if (!document.value || !newFilename.value.trim()) return;

  actionLoading.value = true;

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
    actionLoading.value = false;
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

async function handleDelete() {
  if (!document.value) return;

  feedback
    .confirm({
      title: "Delete document?",
      message: "This action cannot be undone.",
    })
    .onOk(async () => {
      try {
        await documentsApi.deleteDocument(document.value!.id);

        feedback.success("Document deleted");
        await navigateTo("/documents");
      } catch (error) {
        feedback.error(normalizeApiError(error).message);
      }
    });
}

async function handleReprocess() {
  if (!document.value) return;

  actionLoading.value = true;

  try {
    await documentsApi.reprocessDocument(document.value.id);
    await refresh();

    feedback.success("Reprocessing started");
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    actionLoading.value = false;
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
onBeforeUnmount(() => {
  stopProcessingPolling();
});
</script>

<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-gutter-sm">
      <q-btn flat round icon="edit" @click="openRenameDialog" />

      <q-btn
        flat
        round
        :icon="document.is_favorite ? 'star' : 'star_border'"
        color="amber"
        @click="handleFavorite"
      />

      <q-btn
        flat
        round
        icon="refresh"
        color="primary"
        :loading="actionLoading"
        @click="handleReprocess"
      />

      <q-btn flat round icon="delete" color="negative" @click="handleDelete" />
      <q-btn
        flat
        round
        icon="download"
        color="primary"
        :loading="reportLoading"
        @click="handleDownloadReport"
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
        <div v-if="questionsPending">
          <q-skeleton v-for="item in 3" :key="item" type="text" />
        </div>

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
        <div
          v-else-if="!questions?.length && !asking"
          class="text-grey-7 text-center q-py-lg"
        >
          No questions yet.
        </div>

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
            :loading="actionLoading"
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
    </template>
  </q-page>
</template>
