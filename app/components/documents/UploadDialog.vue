<script setup lang="ts">
import type { Document } from "~/types/document";

const model = defineModel<boolean>();

const emit = defineEmits<{
  uploaded: [document: Document];
}>();

const documentsApi = useDocuments();
const feedback = useAppFeedback();

const file = ref<File | null>(null);
const loading = ref(false);
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_EXTENSIONS = ["pdf", "docx", "txt", "csv", "xlsx"];

function validateFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    feedback.error("Unsupported file type");
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    feedback.error("File must be smaller than 20 MB");
    return false;
  }

  return true;
}
async function upload() {
  if (!file.value) return;

  if (!validateFile(file.value)) {
    file.value = null;
    return;
  }

  loading.value = true;

  try {
    const document = await documentsApi.uploadDocument(file.value);

    feedback.success("Document uploaded successfully");

    file.value = null;
    model.value = false;

    emit("uploaded", document);
  } catch (error) {
    const apiError = normalizeApiError(error);

    feedback.error(apiError.message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <q-dialog v-model="model">
    <q-card style="width: 500px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6">Upload document</div>
      </q-card-section>

      <q-card-section>
        <q-file
          v-model="file"
          outlined
          label="Choose document"
          accept=".pdf,.docx,.txt,.csv,.xlsx"
        >
          <template #prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />

        <q-btn
          color="primary"
          label="Upload"
          unelevated
          :disable="!file"
          :loading="loading"
          @click="upload"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
