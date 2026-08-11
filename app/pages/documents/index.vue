<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const documentsApi = useDocuments();
const foldersApi = useFolders();
const tagsApi = useTags();

const page = ref(1);
const perPage = 10;

const search = ref("");
const debouncedSearch = ref("");
const favoriteOnly = ref(false);
const selectedFolder = ref<number | null>(null);
const selectedTag = ref<number | null>(null);
const uploadDialogOpen = ref(false);

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

onBeforeUnmount(() => {
  clearTimeout(searchTimer);
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
  {
    watch: [page, debouncedSearch, favoriteOnly, selectedFolder, selectedTag],
  },
);

const { data: folders } = await useAsyncData("folders", () =>
  foldersApi.getFolders(),
);

const { data: tags } = await useAsyncData("tags", () => tagsApi.getTags());

const hasProcessingDocuments = computed(() =>
  documents.value?.items.some((document) => document.status === "processing"),
);

function startProcessingPolling() {
  if (processingTimer) return;

  processingTimer = setInterval(async () => {
    await refresh();

    if (!hasProcessingDocuments.value) {
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
  hasProcessingDocuments,
  (hasProcessing) => {
    if (hasProcessing) {
      startProcessingPolling();
    } else {
      stopProcessingPolling();
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  stopProcessingPolling();
});
</script>

<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">Documents</div>

        <div class="text-grey-7 q-mt-xs">
          Manage and explore your documents.
        </div>
      </div>
      <DocumentsUploadDialog v-model="uploadDialogOpen" @uploaded="refresh" />
      <q-btn
        color="primary"
        icon="upload_file"
        label="Upload"
        unelevated
        no-caps
        @click="uploadDialogOpen = true"
      />
    </div>

    <!-- Filters -->
    <div class="row q-col-gutter-md items-center q-mb-lg">
      <div class="col-12 col-md">
        <q-input
          v-model="search"
          outlined
          clearable
          placeholder="Search documents..."
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <div class="col-12 col-sm-6 col-md-auto">
        <q-select
          v-model="selectedFolder"
          :options="folders ?? []"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          clearable
          outlined
          label="Folder"
          style="min-width: 180px"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-auto">
        <q-select
          v-model="selectedTag"
          :options="tags ?? []"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          clearable
          outlined
          label="Tag"
          style="min-width: 180px"
        />
      </div>

      <div class="col-12 col-md-auto">
        <q-toggle
          v-model="favoriteOnly"
          label="Favorites only"
          icon="star"
          color="amber"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="q-gutter-md">
      <q-skeleton v-for="item in 5" :key="item" type="rect" height="72px" />
    </div>

    <!-- Error -->
    <q-banner v-else-if="error" rounded class="bg-red-1 text-negative">
      Failed to load documents.

      <template #action>
        <q-btn flat color="negative" label="Retry" @click="refresh" />
      </template>
    </q-banner>

    <!-- Empty -->
    <div
      v-else-if="!documents?.items.length"
      class="column items-center justify-center q-py-xl text-center"
    >
      <q-icon name="description" size="64px" color="grey-5" />

      <div class="text-h6 q-mt-md">No documents found</div>

      <div class="text-grey-7 q-mt-xs">
        Upload a document or change your filters.
      </div>
    </div>

    <!-- Documents -->
    <template v-else>
      <q-list bordered separator>
        <DocumentsDocumentListItem
          v-for="document in documents.items"
          :key="document.id"
          :document="document"
        />
      </q-list>

      <!-- Pagination -->
      <div v-if="documents.total_pages > 1" class="flex justify-center q-mt-lg">
        <q-pagination
          v-model="page"
          :max="documents.total_pages"
          direction-links
          boundary-links
        />
      </div>
    </template>
  </q-page>
</template>
