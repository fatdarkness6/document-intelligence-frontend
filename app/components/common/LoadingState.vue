<script setup lang="ts">
withDefaults(
  defineProps<{
    rows?: number;
    height?: string;
  }>(),
  {
    rows: 4,
    height: "72px",
  },
);
</script>

<template>
  <div class="q-gutter-md">
    <q-skeleton v-for="item in rows" :key="item" type="rect" :height="height" />
  </div>
</template>
