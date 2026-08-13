<script setup lang="ts">
defineProps<{
  label: string;
  value: number;
  icon: string;
  color: string;
  softColor: string;
  detail: string;
}>();

const $q = useQuasar();
</script>

<template>
  <q-card flat bordered class="stat-card full-height">
    <q-card-section>
      <div class="row items-start no-wrap">
        <q-avatar
          rounded
          size="52px"
          :color="$q.dark.isActive ? 'grey-9' : softColor"
          :text-color="color"
          :icon="icon"
        />
        <q-space />
        <q-icon name="north_east" size="18px" color="grey-6" />
      </div>

      <div class="text-h4 text-weight-bold q-mt-lg">
        {{ value.toLocaleString() }}
      </div>
      <div class="text-subtitle2 text-weight-medium q-mt-xs">
        {{ label }}
      </div>
      <div class="text-caption text-grey-7 q-mt-xs">
        {{ detail }}
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.stat-card {
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgb(16 24 40 / 9%);
}
</style>
