<script setup lang="ts">
const $q = useQuasar();
</script>

<template>
  <q-card flat class="settings-hero text-white overflow-hidden">
    <q-card-section :class="$q.screen.lt.sm ? 'q-pa-lg' : 'q-pa-xl'">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-md">
          <q-chip
            dense
            icon="tune"
            label="Workspace preferences"
            class="hero-chip q-ma-none"
          />

          <div
            :class="$q.screen.lt.sm ? 'text-h4' : 'text-h3'"
            class="text-weight-bold q-mt-md"
          >
            Make DocIntel feel like yours.
          </div>
          <div class="text-subtitle1 hero-description q-mt-sm">
            Manage your account, workspace appearance, and current session from
            one clear place.
          </div>
        </div>

        <div v-if="$q.screen.gt.sm" class="col-auto">
          <q-avatar size="112px" class="hero-mark">
            <q-icon name="auto_awesome" size="52px" />
          </q-avatar>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.settings-hero {
  background: linear-gradient(125deg, #312e81, #4f46e5 50%, #7c3aed);
  border-radius: 20px;
  box-shadow: 0 16px 42px rgb(79 70 229 / 22%);
}

.hero-chip,
.hero-mark {
  color: white;
  background: rgb(255 255 255 / 14%);
  border: 1px solid rgb(255 255 255 / 20%);
}

.hero-description {
  max-width: 650px;
  color: rgb(255 255 255 / 78%);
}
</style>
