<script setup lang="ts">
const props = defineProps<{
  documentId: number;
  folderId: number | null;
}>();

const emit = defineEmits<{ updated: [] }>();
const $q = useQuasar();
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
  <q-card flat bordered>
    <q-item>
      <q-item-section avatar>
        <q-avatar
          :color="$q.dark.isActive ? 'grey-9' : 'amber-1'"
          text-color="amber-9"
          icon="folder_open"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-medium">Folder</q-item-label>
        <q-item-label caption>Choose where this document belongs</q-item-label>
      </q-item-section>
    </q-item>

    <q-card-section class="q-pt-none">
      <q-select
        v-model="selectedFolder"
        :options="folders ?? []"
        option-label="name"
        option-value="id"
        emit-value
        map-options
        clearable
        outlined
        hide-bottom-space
        label="Document folder"
        :loading="loading"
        @update:model-value="updateFolder"
      >
        <template #prepend><q-icon name="folder" /></template>
      </q-select>
    </q-card-section>
  </q-card>
</template>
