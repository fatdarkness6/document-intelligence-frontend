<script setup lang="ts">
import type { Document } from "~/types/document";

const props = defineProps<{
  document: Document;
}>();

const fileIcon = computed(() => {
  switch (props.document.file_type.toLowerCase()) {
    case "pdf":
      return "picture_as_pdf";

    case "docx":
      return "article";

    case "csv":
    case "xlsx":
      return "table_chart";

    case "txt":
      return "description";

    default:
      return "insert_drive_file";
  }
});

const statusColor = computed(() => {
  switch (props.document.status) {
    case "completed":
      return "positive";

    case "processing":
      return "primary";

    case "failed":
      return "negative";
  }
});
</script>

<template>
  <q-item clickable :to="`/documents/${document.id}`" class="q-py-md">
    <q-item-section avatar>
      <q-avatar color="grey-2" text-color="primary" :icon="fileIcon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-weight-medium">
        {{ document.filename }}
      </q-item-label>

      <q-item-label caption>
        {{ document.file_type.toUpperCase() }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-chip dense :color="statusColor" text-color="white">
        <q-spinner
          v-if="document.status === 'processing'"
          size="14px"
          class="q-mr-xs"
        />

        {{ document.status }}
      </q-chip>
    </q-item-section>
  </q-item>
</template>
