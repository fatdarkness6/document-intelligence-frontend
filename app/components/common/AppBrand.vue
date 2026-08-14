<script setup lang="ts">
withDefaults(
  defineProps<{
    compact?: boolean;
    size?: string;
    to?: string;
  }>(),
  {
    compact: false,
    size: "38px",
    to: "/",
  },
);
</script>

<template>
  <q-btn
    flat
    no-caps
    padding="6px"
    :to="to"
    :aria-label="compact ? 'DocIntel home' : undefined"
  >
    <q-avatar :size="size" rounded>
      <img src="/favicon.svg" alt="" width="64" height="64" />
    </q-avatar>
    <span v-if="!compact" class="text-h6 text-weight-bold q-ml-sm app-shell-text">
      DocIntel
    </span>
  </q-btn>
</template>
