<script setup lang="ts">
const props = defineProps<{
  status: "processing" | "completed" | "failed";
}>();

const color = computed(() => {
  if (props.status === "completed") return "positive";
  if (props.status === "failed") return "negative";

  return "primary";
});
</script>

<template>
  <q-chip dense :color="color" text-color="white">
    <q-spinner v-if="status === 'processing'" size="14px" class="q-mr-xs" />

    {{ status }}
  </q-chip>
</template>
