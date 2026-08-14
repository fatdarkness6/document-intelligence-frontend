<script setup lang="ts">
const emit = defineEmits<{ signOut: [] }>();
const $q = useQuasar();
</script>

<template>
  <q-card flat bordered>
    <q-item class="q-pa-lg">
      <q-item-section avatar>
        <q-avatar
          :color="$q.dark.isActive ? 'grey-9' : 'red-1'"
          text-color="negative"
          icon="shield"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6 text-weight-bold">
          Session & security
        </q-item-label>
        <q-item-label caption>
          Manage access to DocIntel on this browser.
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator />

    <q-card-section>
      <q-banner
        rounded
        :class="
          $q.dark.isActive
            ? 'bg-red-10 text-red-2'
            : 'bg-red-1 text-red-10'
        "
      >
        <template #avatar>
          <q-icon name="logout" color="negative" size="26px" />
        </template>

        <div class="text-subtitle1 text-weight-bold">Sign out</div>
        <div class="text-body2 q-mt-xs">
          End the local session and return to the login page. Your documents
          will remain safely stored.
        </div>

        <template #action>
          <q-btn
            unelevated
            no-caps
            color="negative"
            icon="logout"
            label="Sign out"
            @click="emit('signOut')"
          />
        </template>
      </q-banner>
    </q-card-section>
  </q-card>
</template>
