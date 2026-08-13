<script setup lang="ts">
import type { Document } from "~/types/document";

const props = defineProps<{
  document: Document;
  folderName?: string;
}>();

const $q = useQuasar();

const fileAppearance = computed(() => {
  switch (props.document.file_type.toLowerCase()) {
    case "pdf":
      return { icon: "picture_as_pdf", color: "red" };
    case "docx":
      return { icon: "article", color: "blue" };
    case "csv":
    case "xlsx":
      return { icon: "table_chart", color: "green" };
    case "txt":
      return { icon: "description", color: "purple" };
    default:
      return { icon: "insert_drive_file", color: "indigo" };
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
</script>

<template>
  <q-card flat bordered class="document-card full-height column">
    <q-card-section class="row items-start no-wrap">
      <q-avatar
        rounded
        size="50px"
        :color="$q.dark.isActive ? 'grey-9' : `${fileAppearance.color}-1`"
        :text-color="fileAppearance.color"
        :icon="fileAppearance.icon"
      />
      <q-space />
      <CommonStatusChip :status="document.status" />
    </q-card-section>

    <q-card-section class="q-pt-none col">
      <div class="row items-center no-wrap q-gutter-xs">
        <div class="text-subtitle1 text-weight-bold ellipsis" :title="document.filename">
          {{ document.filename }}
        </div>
        <q-icon v-if="document.is_favorite" name="star" color="amber" size="20px">
          <q-tooltip>Favorite</q-tooltip>
        </q-icon>
      </div>

      <div class="row items-center q-gutter-xs text-caption text-grey-7 q-mt-xs">
        <q-badge outline color="primary" :label="document.file_type.toUpperCase()" />
        <span>{{ formattedSize }}</span>
        <q-icon name="fiber_manual_record" size="5px" />
        <span>{{ formattedDate }}</span>
      </div>

      <q-list dense class="q-mt-md">
        <q-item class="q-px-none">
          <q-item-section avatar class="document-meta-avatar">
            <q-icon name="folder_open" color="grey-7" />
          </q-item-section>
          <q-item-section>
            <q-item-label caption lines="1">{{ folderName || "No folder" }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="q-px-none">
          <q-item-section avatar class="document-meta-avatar">
            <q-icon name="sell" color="grey-7" />
          </q-item-section>
          <q-item-section>
            <div v-if="document.tags.length" class="row q-gutter-xs">
              <q-chip
                v-for="tag in document.tags.slice(0, 2)"
                :key="tag.id"
                dense
                size="sm"
                class="q-ma-none"
              >
                {{ tag.name }}
              </q-chip>
              <q-badge
                v-if="document.tags.length > 2"
                color="grey-7"
                :label="`+${document.tags.length - 2}`"
                rounded
              />
            </div>
            <q-item-label v-else caption>No tags</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-separator />
    <q-card-actions align="between" class="q-px-md q-py-sm">
      <q-btn
        flat
        no-caps
        color="primary"
        label="Open document"
        :to="`/documents/${document.id}`"
      />
      <q-btn
        flat
        round
        color="primary"
        icon="arrow_forward"
        :to="`/documents/${document.id}`"
        :aria-label="`Open ${document.filename}`"
      />
    </q-card-actions>
  </q-card>
</template>

<style scoped>
.document-card {
  min-height: 285px;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.document-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgb(16 24 40 / 10%);
}

.document-meta-avatar {
  min-width: 30px;
}
</style>
