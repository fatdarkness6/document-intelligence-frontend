<script setup lang="ts">
import type { Document } from "~/types/document";

definePageMeta({ middleware: "auth" });

usePageSeo({
  title: "Documents",
  description:
    "Browse, search, organize, and upload documents in your private DocIntel library.",
  noIndex: true,
});

const $q = useQuasar();
const documentsApi = useDocuments();
const foldersApi = useFolders();
const tagsApi = useTags();
const processingStore = useDocumentProcessingStore();

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
const subscribedProcessingIds = new Set<number>();
const handledTerminalUpdates = new Map<number, string | number>();

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

async function handleFoldersChanged() {
  selectedFolder.value = null;
  await refreshFolders();
}

async function handleTagsChanged() {
  selectedTag.value = null;
  await refreshTags();
}

async function handleUploaded(document: Document) {
  if (
    document.status === "processing" &&
    !subscribedProcessingIds.has(document.id)
  ) {
    subscribedProcessingIds.add(document.id);
    processingStore.subscribe(document.id);
  }

  page.value = 1;
  await refresh();
}

watch(
  () =>
    documents.value?.items
      .filter((document) => document.status === "processing")
      .map((document) => document.id) ?? [],
  (processingIds) => {
    const nextIds = new Set(processingIds);

    for (const documentId of subscribedProcessingIds) {
      if (nextIds.has(documentId)) continue;
      processingStore.unsubscribe(documentId);
      subscribedProcessingIds.delete(documentId);
    }

    for (const documentId of nextIds) {
      if (subscribedProcessingIds.has(documentId)) continue;
      subscribedProcessingIds.add(documentId);
      processingStore.subscribe(documentId);
    }
  },
  { immediate: true },
);

watch(
  () => processingStore.updates,
  async (updates) => {
    let shouldRefresh = false;

    for (const document of documents.value?.items ?? []) {
      const update = updates[document.id];
      if (!update) continue;

      document.status = update.status;

      if (update.status === "processing") {
        handledTerminalUpdates.delete(document.id);
        continue;
      }

      const marker = update.event_id ?? update.received_at;
      if (handledTerminalUpdates.get(document.id) === marker) continue;

      handledTerminalUpdates.set(document.id, marker);
      shouldRefresh = true;
    }

    if (shouldRefresh) await refresh();
  },
  { deep: true },
);

onBeforeUnmount(() => {
  clearTimeout(searchTimer);

  for (const documentId of subscribedProcessingIds) {
    processingStore.unsubscribe(documentId);
  }

  subscribedProcessingIds.clear();
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
