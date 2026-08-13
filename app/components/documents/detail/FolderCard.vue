<script setup lang="ts">
const props = defineProps<{
  documentId: number;
  folderId: number | null;
}>();

const emit = defineEmits<{
  updated: [];
}>();

const documentsApi = useDocuments();
const foldersApi = useFolders();
const feedback = useAppFeedback();

const selectedFolder = ref<number | null>(props.folderId);
const loading = ref(false);

const { data: folders } = await useAsyncData("document-folders", () =>
  foldersApi.getFolders(),
);

watch(
  () => props.folderId,
  (folderId) => {
    selectedFolder.value = folderId;
  },
);

async function updateFolder(folderId: number | null) {
  loading.value = true;

  try {
    await documentsApi.moveToFolder(props.documentId, folderId);

    emit("updated");
    feedback.success("Folder updated");
  } catch (error) {
    selectedFolder.value = props.folderId;
    feedback.error(normalizeApiError(error).message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <q-card flat bordered class="full-height">
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
        :loading="loading"
        @update:model-value="updateFolder"
      />
    </q-card-section>
  </q-card>
</template>
