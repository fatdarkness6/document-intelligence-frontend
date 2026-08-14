<script setup lang="ts">
import type { Document } from "~/types/document";
import RenameDialog from "./RenameDialog.vue";

const props = defineProps<{ document: Document }>();
const emit = defineEmits<{ updated: [] }>();

const $q = useQuasar();
const documentsApi = useDocuments();
const feedback = useAppFeedback();

const renameDialogOpen = ref(false);
const favoriting = ref(false);
const reprocessing = ref(false);
const deleting = ref(false);
const downloading = ref(false);

const fileAppearance = computed(() => {
  switch (props.document.file_type.toLowerCase()) {
    case "pdf":
      return { icon: "picture_as_pdf", color: "red", softColor: "red-1" };
    case "docx":
      return { icon: "article", color: "blue", softColor: "blue-1" };
    case "csv":
    case "xlsx":
      return { icon: "table_chart", color: "green", softColor: "green-1" };
    default:
      return { icon: "description", color: "purple", softColor: "purple-1" };
  }
});

const formattedSize = computed(() => {
  const bytes = props.document.size_bytes;
  if (!bytes) return "0 KB";

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** unitIndex;
  return `${value.toFixed(unitIndex === 0 || value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
});

const formattedDate = computed(() => {
  const date = new Date(props.document.created_at);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
});

async function toggleFavorite() {
  favoriting.value = true;
  try {
    await documentsApi.toggleFavorite(
      props.document.id,
      !props.document.is_favorite,
    );
    emit("updated");
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    favoriting.value = false;
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
  <q-breadcrumbs class="q-mb-md text-grey-7">
    <q-breadcrumbs-el label="Documents" icon="description" to="/documents" />
    <q-breadcrumbs-el label="Document workspace" />
  </q-breadcrumbs>

  <q-card flat bordered>
    <q-card-section :class="$q.screen.lt.sm ? 'q-pa-md' : 'q-pa-lg'">
      <div class="row items-center q-col-gutter-md">
        <div class="col-12 col-md">
          <div class="row items-center no-wrap">
            <q-avatar
              rounded
              :size="$q.screen.lt.sm ? '54px' : '68px'"
              :color="$q.dark.isActive ? 'grey-9' : fileAppearance.softColor"
              :text-color="fileAppearance.color"
              :icon="fileAppearance.icon"
            />

            <div class="col q-ml-md">
              <div class="row items-center q-gutter-sm">
                <div
                  :class="$q.screen.lt.sm ? 'text-h5' : 'text-h4'"
                  class="document-title text-weight-bold"
                >
                  {{ document.filename }}
                </div>
                <CommonStatusChip :status="document.status" />
              </div>

              <div class="row items-center q-gutter-sm q-mt-sm">
                <q-badge
                  outline
                  color="primary"
                  :label="document.file_type.toUpperCase()"
                />
                <span class="text-caption text-grey-7">{{ formattedSize }}</span>
                <q-icon name="fiber_manual_record" size="5px" color="grey-6" />
                <span class="text-caption text-grey-7">{{ formattedDate }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-auto">
          <div class="row q-col-gutter-sm">
            <div class="col col-sm-auto">
              <q-btn
                outline
                no-caps
                color="amber-8"
                :icon="document.is_favorite ? 'star' : 'star_outline'"
                :label="$q.screen.gt.xs ? (document.is_favorite ? 'Favorited' : 'Favorite') : undefined"
                :loading="favoriting"
                class="full-width"
                @click="toggleFavorite"
              />
            </div>

            <div class="col col-sm-auto">
              <q-btn-dropdown
                outline
                no-caps
                color="primary"
                icon="more_horiz"
                :label="$q.screen.gt.xs ? 'Actions' : undefined"
                class="full-width"
              >
                <q-list style="min-width: 220px">
                  <q-item clickable v-close-popup @click="renameDialogOpen = true">
                    <q-item-section avatar><q-icon name="edit" /></q-item-section>
                    <q-item-section>Rename</q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="reprocessDocument">
                    <q-item-section avatar>
                      <q-spinner v-if="reprocessing" color="primary" size="20px" />
                      <q-icon v-else name="refresh" />
                    </q-item-section>
                    <q-item-section>Reprocess document</q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="downloadReport">
                    <q-item-section avatar>
                      <q-spinner v-if="downloading" color="primary" size="20px" />
                      <q-icon v-else name="download" />
                    </q-item-section>
                    <q-item-section>Download report</q-item-section>
                  </q-item>

                  <q-separator />

                  <q-item clickable v-close-popup class="text-negative" @click="deleteDocument">
                    <q-item-section avatar>
                      <q-spinner v-if="deleting" color="negative" size="20px" />
                      <q-icon v-else name="delete" />
                    </q-item-section>
                    <q-item-section>Delete document</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>

  <RenameDialog
    v-model="renameDialogOpen"
    :document-id="document.id"
    :filename="document.filename"
    @renamed="emit('updated')"
  />
</template>

<style scoped>
.document-title {
  min-width: 0;
  overflow-wrap: anywhere;
}
</style>
