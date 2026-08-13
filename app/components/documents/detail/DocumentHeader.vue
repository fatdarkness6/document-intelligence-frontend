<script setup lang="ts">
import type { Document } from "~/types/document";
import RenameDialog from "./RenameDialog.vue";

const props = defineProps<{
  document: Document;
}>();

const emit = defineEmits<{
  updated: [];
}>();

const documentsApi = useDocuments();
const feedback = useAppFeedback();

const renameDialogOpen = ref(false);
const reprocessing = ref(false);
const deleting = ref(false);
const downloading = ref(false);

async function toggleFavorite() {
  try {
    await documentsApi.toggleFavorite(
      props.document.id,
      !props.document.is_favorite,
    );

    emit("updated");
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  }
}

async function reprocessDocument() {
  reprocessing.value = true;

  try {
    await documentsApi.reprocessDocument(props.document.id);

    emit("updated");
    feedback.success("Reprocessing started");
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    reprocessing.value = false;
  }
}

function deleteDocument() {
  feedback
    .confirm({
      title: "Delete document?",
      message: "This action cannot be undone.",
    })
    .onOk(async () => {
      deleting.value = true;

      try {
        await documentsApi.deleteDocument(props.document.id);

        feedback.success("Document deleted");
        await navigateTo("/documents");
      } catch (error) {
        feedback.error(normalizeApiError(error).message);
      } finally {
        deleting.value = false;
      }
    });
}

async function downloadReport() {
  downloading.value = true;

  try {
    const blob = await documentsApi.downloadReport(props.document.id);
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");

    link.href = url;
    link.download = `${props.document.filename}-report.pdf`;
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    downloading.value = false;
  }
}
</script>

<template>
  <header class="row items-start justify-between q-col-gutter-md q-mb-lg">
    <div class="col-12 col-md">
      <div class="row items-center q-gutter-sm">
        <div class="text-h4 text-weight-bold">
          {{ document.filename }}
        </div>

        <CommonStatusChip :status="document.status" />
      </div>

      <div class="text-grey-7 q-mt-xs">
        {{ document.file_type.toUpperCase() }}
      </div>
    </div>

    <div class="col-12 col-md-auto">
      <div class="row q-gutter-xs">
        <q-btn
          flat
          round
          icon="edit"
          aria-label="Rename document"
          @click="renameDialogOpen = true"
        />

        <q-btn
          flat
          round
          :icon="document.is_favorite ? 'star' : 'star_border'"
          color="amber"
          :aria-label="
            document.is_favorite ? 'Remove from favorites' : 'Add to favorites'
          "
          @click="toggleFavorite"
        />

        <q-btn
          flat
          round
          icon="refresh"
          color="primary"
          :loading="reprocessing"
          aria-label="Reprocess document"
          @click="reprocessDocument"
        />

        <q-btn
          flat
          round
          icon="download"
          color="primary"
          :loading="downloading"
          aria-label="Download report"
          @click="downloadReport"
        />

        <q-btn
          flat
          round
          icon="delete"
          color="negative"
          :loading="deleting"
          aria-label="Delete document"
          @click="deleteDocument"
        />
      </div>
    </div>
  </header>

  <RenameDialog
    v-model="renameDialogOpen"
    :document-id="document.id"
    :filename="document.filename"
    @renamed="emit('updated')"
  />
</template>
