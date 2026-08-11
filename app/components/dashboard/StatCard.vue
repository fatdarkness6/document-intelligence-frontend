<script setup lang="ts">
defineProps<{
  label: string;
  value: number;
  icon: string;
}>();
</script>

<template>
  <q-card flat bordered class="full-height">
    <q-card-section class="row items-center no-wrap">
      <q-avatar size="48px" color="primary" text-color="white" :icon="icon" />

      <div class="q-ml-md">
        <div class="text-grey-7">
          {{ label }}
        </div>

        <div class="text-h5 text-weight-bold">
          {{ value }}
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
