<script setup lang="ts">
const model = defineModel<boolean>({ required: true });

const props = defineProps<{
  documentId: number;
  filename: string;
}>();

const emit = defineEmits<{
  renamed: [];
}>();

const documentsApi = useDocuments();
const feedback = useAppFeedback();

const newFilename = ref("");
const loading = ref(false);

watch(
  model,
  (open) => {
    if (open) {
      newFilename.value = props.filename;
    }
  },
  { immediate: true },
);

async function renameDocument() {
  const filename = newFilename.value.trim();

  if (!filename) return;

  loading.value = true;

  try {
    await documentsApi.renameDocument(props.documentId, filename);

    model.value = false;
    emit("renamed");
    feedback.success("Document renamed successfully");
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <q-dialog v-model="model">
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
          @keyup.enter="renameDocument"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />

        <q-btn
          color="primary"
          label="Save"
          unelevated
          :disable="!newFilename.trim()"
          :loading="loading"
          @click="renameDocument"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
