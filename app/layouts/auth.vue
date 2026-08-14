<script setup lang="ts">
const $q = useQuasar();
const { darkMode } = useAppPreferences();
</script>

<template>
  <q-layout view="hHh lpR fFf" class="auth-layout">
    <q-page-container>
      <q-page class="column no-wrap">
        <q-toolbar
          :class="$q.screen.lt.sm ? 'q-px-md' : 'q-px-xl'"
          class="q-py-md"
        >
          <q-btn
            flat
            no-caps
            padding="8px 10px"
            color="primary"
            to="/"
            aria-label="Go to home page"
          >
            <q-avatar size="36px" color="primary" text-color="white" icon="description" />
            <span class="text-h6 text-weight-bold q-ml-sm app-shell-text">
              DocIntel
            </span>
          </q-btn>

          <q-space />

          <q-btn
            flat
            round
            :icon="darkMode ? 'light_mode' : 'dark_mode'"
            :aria-label="darkMode ? 'Use light mode' : 'Use dark mode'"
            @click="darkMode = !darkMode"
          >
            <q-tooltip>
              {{ darkMode ? "Use light mode" : "Use dark mode" }}
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="$q.screen.gt.xs"
            flat
            no-caps
            icon="arrow_back"
            label="Back to home"
            to="/"
            class="q-ml-sm"
          />
        </q-toolbar>

        <div
          class="col row items-center justify-center full-width"
          :class="$q.screen.lt.sm ? 'q-pa-md' : 'q-pa-xl'"
        >
          <slot />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.auth-layout {
  background:
    radial-gradient(circle at 8% 20%, rgb(79 70 229 / 10%), transparent 24rem),
    radial-gradient(circle at 92% 80%, rgb(124 58 237 / 9%), transparent 26rem),
    var(--app-background);
}
</style>
