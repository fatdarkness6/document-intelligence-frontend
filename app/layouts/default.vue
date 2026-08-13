<script setup lang="ts">
const $q = useQuasar();
const route = useRoute();

const drawerOpen = ref(true);

const authStore = useAuthStore();
const { compactNavigation } = useAppPreferences();

const navItems = [
  { label: "Dashboard", icon: "dashboard", to: "/dashboard" },
  { label: "Documents", icon: "description", to: "/documents" },
  { label: "Settings", icon: "settings", to: "/settings" },
];

async function handleLogout() {
  await authStore.logout();
}

watch(
  () => route.fullPath,
  () => {
    if ($q.screen.lt.md) {
      drawerOpen.value = false;
    }
  },
);
</script>

<template>
  <q-layout view="hHh Lpr lFf">
    <q-header bordered class="app-shell-surface app-shell-text">
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          class="lt-md"
          @click="drawerOpen = !drawerOpen"
        />

        <q-toolbar-title> Document Intelligence </q-toolbar-title>

        <q-btn flat round>
          <q-avatar size="36px">
            <q-icon name="person" />
          </q-avatar>

          <q-menu>
            <q-list style="min-width: 180px">
              <q-item>
                <q-item-section>
                  <div class="text-weight-medium">
                    {{ authStore.user?.email }}
                  </div>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable to="/settings" v-close-popup>
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>

                <q-item-section> Settings </q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>

                <q-item-section> Logout </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerOpen"
      show-if-above
      bordered
      :width="260"
      :mini="compactNavigation && $q.screen.gt.sm"
      :mini-width="80"
      :breakpoint="1024"
      class="app-shell-surface app-shell-text"
    >
      <div
        class="q-pa-lg text-h6 text-weight-bold"
        :class="{ 'text-center q-px-sm': compactNavigation && $q.screen.gt.sm }"
      >
        {{ compactNavigation && $q.screen.gt.sm ? "DI" : "DocIntel" }}
      </div>

      <q-list padding>
        <q-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          clickable
          exact
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>

          <q-item-section>
            {{ item.label }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <slot />
    </q-page-container>
  </q-layout>
</template>
