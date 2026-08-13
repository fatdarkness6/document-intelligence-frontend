<script setup lang="ts">
import type { Document, PaginatedResponse } from "~/types/document";
import type { Folder } from "~/types/folder";

const props = defineProps<{
  documents: PaginatedResponse<Document> | null | undefined;
  folders: Folder[];
  pending: boolean;
  hasError: boolean;
  hasActiveFilters: boolean;
}>();

const emit = defineEmits<{ retry: []; clearFilters: []; upload: [] }>();
const page = defineModel<number>("page", { required: true });
const $q = useQuasar();

const resultRange = computed(() => {
  if (!props.documents?.total) return "No documents";
  const start = (props.documents.page - 1) * props.documents.per_page + 1;
  const end = Math.min(
    props.documents.page * props.documents.per_page,
    props.documents.total,
  );
  return `${start}–${end} of ${props.documents.total}`;
});

function folderNameFor(folderId: number | null) {
  if (folderId === null) return undefined;
  return props.folders.find((folder) => folder.id === folderId)?.name;
}
</script>

<template>
  <div class="row items-center q-mb-md">
    <div>
      <div class="text-h6 text-weight-bold">
        {{ hasActiveFilters ? "Search results" : "All documents" }}
      </div>
      <div v-if="!pending" class="text-caption text-grey-7">
        {{ resultRange }}
      </div>
    </div>
    <q-space />
    <q-chip square icon="grid_view" label="Grid" />
  </div>

  <div v-if="pending" class="row q-col-gutter-md">
    <div v-for="item in 6" :key="item" class="col-12 col-sm-6 col-xl-4">
      <q-card flat bordered class="full-height">
        <q-card-section>
          <div class="row items-center justify-between">
            <q-skeleton type="QAvatar" size="48px" />
            <q-skeleton type="QChip" width="84px" />
          </div>
          <q-skeleton type="text" width="76%" class="q-mt-lg" />
          <q-skeleton type="text" width="52%" />
          <q-skeleton type="rect" height="40px" class="q-mt-lg" />
        </q-card-section>
      </q-card>
    </div>
  </div>

  <q-banner v-else-if="hasError" rounded class="bg-negative text-white">
    <template #avatar><q-icon name="cloud_off" size="28px" /></template>
    <div class="text-weight-bold">We couldn’t load your documents</div>
    <div class="text-caption">Check your connection and try again.</div>
    <template #action>
      <q-btn flat no-caps color="white" label="Try again" @click="emit('retry')" />
    </template>
  </q-banner>

  <q-card v-else-if="!documents?.items.length" flat bordered>
    <q-card-section :class="$q.screen.lt.sm ? 'q-pa-xl' : 'q-pa-xl q-py-xl'">
      <div class="column items-center text-center">
        <q-avatar
          size="80px"
          :color="$q.dark.isActive ? 'grey-9' : 'indigo-1'"
          text-color="primary"
          :icon="hasActiveFilters ? 'search_off' : 'note_add'"
        />
        <div class="text-h6 text-weight-bold q-mt-lg">
          {{ hasActiveFilters ? "No matching documents" : "Build your document library" }}
        </div>
        <div class="text-body2 text-grey-7 q-mt-sm empty-description">
          {{
            hasActiveFilters
              ? "Try a different search or clear your filters to see the full library."
              : "Upload your first file and DocIntel will make it searchable, organized, and ready to explore."
          }}
        </div>
        <div class="row justify-center q-gutter-sm q-mt-lg">
          <q-btn
            v-if="hasActiveFilters"
            outline
            no-caps
            color="primary"
            label="Clear filters"
            @click="emit('clearFilters')"
          />
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="upload_file"
            label="Upload document"
            @click="emit('upload')"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>

  <template v-else>
    <div class="row q-col-gutter-md">
      <div
        v-for="document in documents.items"
        :key="document.id"
        class="col-12 col-sm-6 col-xl-4"
      >
        <DocumentsDocumentListItem
          :document="document"
          :folder-name="folderNameFor(document.folder_id)"
        />
      </div>
    </div>

    <q-card v-if="documents.total_pages > 1" flat bordered class="q-mt-lg">
      <q-card-section class="row items-center justify-between q-gutter-md">
        <div class="text-caption text-grey-7">
          Page {{ page }} of {{ documents.total_pages }}
        </div>
        <q-pagination
          v-model="page"
          :max="documents.total_pages"
          :max-pages="$q.screen.lt.sm ? 4 : 7"
          direction-links
          :boundary-links="$q.screen.gt.xs"
        />
      </q-card-section>
    </q-card>
  </template>
</template>

<style scoped>
.empty-description {
  max-width: 520px;
}
</style>
