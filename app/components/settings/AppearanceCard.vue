<script setup lang="ts">
const compactNavigation = defineModel<boolean>("compactNavigation", {
  required: true,
});
const darkMode = defineModel<boolean>("darkMode", { required: true });
const $q = useQuasar();
</script>

<template>
  <q-card flat bordered>
    <q-item class="q-pa-lg">
      <q-item-section avatar>
        <q-avatar
          :color="$q.dark.isActive ? 'grey-9' : 'indigo-1'"
          text-color="primary"
          icon="palette"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6 text-weight-bold">
          Workspace appearance
        </q-item-label>
        <q-item-label caption>
          Choose how the application looks and fits your screen.
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator />

    <q-list separator>
      <q-item tag="label" clickable class="q-py-lg">
        <q-item-section avatar>
          <q-avatar
            :color="$q.dark.isActive ? 'grey-9' : 'indigo-1'"
            text-color="primary"
            icon="view_sidebar"
          />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-subtitle1 text-weight-medium">
            Compact navigation
          </q-item-label>
          <q-item-label caption>
            Collapse the desktop sidebar to icons and leave more room for your
            documents.
          </q-item-label>
          <div class="q-mt-sm">
            <q-badge color="primary" label="Desktop" />
          </div>
        </q-item-section>

        <q-item-section side>
          <q-toggle
            v-model="compactNavigation"
            color="primary"
            size="lg"
            aria-label="Compact navigation"
          />
        </q-item-section>
      </q-item>

      <q-item tag="label" clickable class="q-py-lg">
        <q-item-section avatar>
          <q-avatar
            :color="$q.dark.isActive ? 'grey-9' : 'purple-1'"
            text-color="secondary"
            :icon="darkMode ? 'dark_mode' : 'light_mode'"
          />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-subtitle1 text-weight-medium">
            Dark mode
          </q-item-label>
          <q-item-label caption>
            Use a low-light Quasar color palette throughout the workspace.
          </q-item-label>
          <div class="q-mt-sm">
            <q-badge color="secondary" label="Theme" />
          </div>
        </q-item-section>

        <q-item-section side>
          <q-toggle
            v-model="darkMode"
            color="secondary"
            size="lg"
            aria-label="Dark mode"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <q-separator />

    <q-card-section class="row q-gutter-sm">
      <q-chip
        square
        :icon="darkMode ? 'dark_mode' : 'light_mode'"
        :label="darkMode ? 'Dark theme' : 'Light theme'"
        color="primary"
        text-color="white"
      />
      <q-chip
        square
        :icon="compactNavigation ? 'view_sidebar' : 'web'"
        :label="compactNavigation ? 'Compact sidebar' : 'Full sidebar'"
      />
    </q-card-section>
  </q-card>
</template>
