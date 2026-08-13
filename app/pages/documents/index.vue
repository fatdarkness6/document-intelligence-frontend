<script setup lang="ts">
definePageMeta({ middleware: "auth" });

useSeoMeta({ title: "Documents | DocIntel" });

const $q = useQuasar();
const documentsApi = useDocuments();
const foldersApi = useFolders();
const tagsApi = useTags();

const page = ref(1);
const perPage = 12;
const search = ref("");
const debouncedSearch = ref("");
const favoriteOnly = ref(false);
const selectedFolder = ref<number | null>(null);
const selectedTag = ref<number | null>(null);
const uploadDialogOpen = ref(false);
const folderManagerOpen = ref(false);
const tagManagerOpen = ref(false);

let searchTimer: ReturnType<typeof setTimeout>;
let processingTimer: ReturnType<typeof setInterval> | null = null;

watch(search, (value) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    page.value = 1;
    debouncedSearch.value = value?.trim() ?? "";
  }, 400);
});

watch([favoriteOnly, selectedFolder, selectedTag], () => {
  page.value = 1;
});

const {
  data: documents,
  pending,
  error,
  refresh,
} = await useAsyncData(
  "documents-list",
  () =>
    documentsApi.getDocuments({
      search: debouncedSearch.value || undefined,
      favorite: favoriteOnly.value || undefined,
      folder_id: selectedFolder.value || undefined,
      tag_id: selectedTag.value || undefined,
      page: page.value,
      per_page: perPage,
    }),
  { watch: [page, debouncedSearch, favoriteOnly, selectedFolder, selectedTag] },
);

const { data: folders, refresh: refreshFolders } = await useAsyncData(
  "folders",
  () => foldersApi.getFolders(),
);

const { data: tags, refresh: refreshTags } = await useAsyncData("tags", () =>
  tagsApi.getTags(),
);

const hasActiveFilters = computed(
  () =>
    Boolean(debouncedSearch.value) ||
    favoriteOnly.value ||
    selectedFolder.value !== null ||
    selectedTag.value !== null,
);

const processingCount = computed(
  () =>
    documents.value?.items.filter((document) => document.status === "processing")
      .length ?? 0,
);

const favoriteCount = computed(
  () =>
    documents.value?.items.filter((document) => document.is_favorite).length ?? 0,
);

const hasProcessingDocuments = computed(() => processingCount.value > 0);

function clearFilters() {
  search.value = "";
  debouncedSearch.value = "";
  favoriteOnly.value = false;
  selectedFolder.value = null;
  selectedTag.value = null;
  page.value = 1;
}

function clearSearch() {
  search.value = "";
  debouncedSearch.value = "";
}

function stopProcessingPolling() {
  if (!processingTimer) return;
  clearInterval(processingTimer);
  processingTimer = null;
}

function startProcessingPolling() {
  if (processingTimer) return;

  processingTimer = setInterval(async () => {
    await refresh();
    if (!hasProcessingDocuments.value) stopProcessingPolling();
  }, 3000);
}

async function handleFoldersChanged() {
  selectedFolder.value = null;
  await refreshFolders();
}

async function handleTagsChanged() {
  selectedTag.value = null;
  await refreshTags();
}

async function handleUploaded() {
  page.value = 1;
  await refresh();
}

watch(
  hasProcessingDocuments,
  (hasProcessing) => {
    if (hasProcessing) startProcessingPolling();
    else stopProcessingPolling();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  clearTimeout(searchTimer);
  stopProcessingPolling();
});
</script>

<template>
  <q-page :class="$q.screen.lt.sm ? 'q-pa-sm' : 'q-pa-lg'">
    <div class="documents-container q-mx-auto">
      <DocumentsLibraryHeader
        :document-count="documents?.total ?? 0"
        :folder-count="folders?.length ?? 0"
        :favorite-count="favoriteCount"
        :processing-count="processingCount"
        :filtered="hasActiveFilters"
        @manage-folders="folderManagerOpen = true"
        @manage-tags="tagManagerOpen = true"
        @upload="uploadDialogOpen = true"
      />

      <DocumentsFiltersPanel
        v-model:search="search"
        v-model:folder="selectedFolder"
        v-model:tag="selectedTag"
        v-model:favorite="favoriteOnly"
        :active-search="debouncedSearch"
        :folders="folders ?? []"
        :tags="tags ?? []"
        :has-active-filters="hasActiveFilters"
        class="q-mt-lg"
        @clear="clearFilters"
        @clear-search="clearSearch"
      />

      <DocumentsLibraryContent
        v-model:page="page"
        :documents="documents"
        :folders="folders ?? []"
        :pending="pending"
        :has-error="Boolean(error)"
        :has-active-filters="hasActiveFilters"
        class="q-mt-lg"
        @retry="refresh"
        @clear-filters="clearFilters"
        @upload="uploadDialogOpen = true"
      />
    </div>

    <q-page-sticky
      v-if="$q.screen.lt.sm"
      position="bottom-right"
      :offset="[16, 16]"
    >
      <q-btn
        fab
        color="primary"
        icon="upload_file"
        aria-label="Upload document"
        @click="uploadDialogOpen = true"
      />
    </q-page-sticky>

    <FoldersFolderManagerDialog
      v-model="folderManagerOpen"
      @changed="handleFoldersChanged"
    />
    <TagsTagManagerDialog v-model="tagManagerOpen" @changed="handleTagsChanged" />
    <DocumentsUploadDialog
      v-model="uploadDialogOpen"
      @uploaded="handleUploaded"
    />
  </q-page>
</template>

<style scoped>
.documents-container {
  width: min(100%, 1440px);
}
</style>
