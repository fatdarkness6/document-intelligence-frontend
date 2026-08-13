<script setup lang="ts">
defineProps<{
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
}>();

const emit = defineEmits<{
  action: [];
}>();
</script>

<template>
  <div class="column items-center justify-center text-center q-py-xl">
    <q-icon :name="icon || 'inbox'" size="64px" color="grey-5" />

    <div class="text-h6 q-mt-md">
      {{ title }}
    </div>

    <div v-if="description" class="text-grey-7 q-mt-xs">
      {{ description }}
    </div>

    <q-btn
      v-if="actionLabel"
      color="primary"
      unelevated
      no-caps
      class="q-mt-md"
      :label="actionLabel"
      @click="emit('action')"
    />
  </div>
</template>
