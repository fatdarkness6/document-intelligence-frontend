<script setup lang="ts">
defineProps<{ summary: string | null }>();
const $q = useQuasar();
</script>

<template>
  <q-card flat bordered class="full-height">
    <q-item class="q-pa-lg">
      <q-item-section avatar>
        <q-avatar
          :color="$q.dark.isActive ? 'grey-9' : 'indigo-1'"
          text-color="primary"
          icon="auto_awesome"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6 text-weight-bold">AI Summary</q-item-label>
        <q-item-label caption>A concise overview of this document</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator />

    <q-card-section v-if="summary" class="text-body1 q-pa-lg">
      {{ summary }}
    </q-card-section>

    <q-card-section v-else class="column items-center text-center q-pa-xl">
      <q-avatar
        size="64px"
        :color="$q.dark.isActive ? 'grey-9' : 'grey-2'"
        text-color="grey-6"
        icon="subject"
      />
      <div class="text-subtitle1 text-weight-medium q-mt-md">
        No summary available yet
      </div>
      <div class="text-caption text-grey-7 q-mt-xs">
        A summary will appear here after document processing is complete.
      </div>
    </q-card-section>
  </q-card>
</template>
