<script setup lang="ts">
import AppBrand from "~/components/common/AppBrand.vue";

const authStore = useAuthStore();
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="app-shell-surface app-shell-text">
      <q-toolbar class="public-toolbar">
        <!-- Left -->
        <div class="header-left">
          <AppBrand />
        </div>

        <!-- Center -->
        <div class="header-center gt-sm">
          <q-btn flat no-caps label="Features" href="#features" />

          <q-btn flat no-caps label="How it works" href="#how-it-works" />

          <q-btn flat no-caps label="Security" href="#security" />
        </div>

        <!-- Right -->
        <div class="header-right">
          <q-btn
            v-if="authStore.isAuthenticated"
            color="primary"
            unelevated
            no-caps
            icon="dashboard"
            label="Dashboard"
            to="/dashboard"
          />

          <div v-else class="row items-center q-gutter-sm">
            <q-btn flat no-caps label="Sign in" to="/login" />

            <q-btn
              color="primary"
              unelevated
              no-caps
              label="Create account"
              to="/register"
            />
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <slot />
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="scss">
.public-toolbar {
  width: min(100% - 48px, 1590px);
  min-height: 82px;
  margin-inline: auto;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

.header-left {
  justify-self: start;
}

.header-center {
  justify-self: center;

  display: flex;
  align-items: center;
  gap: 20px;
}

.header-right {
  justify-self: end;
}

@media (max-width: 1023px) {
  .public-toolbar {
    width: calc(100% - 32px);
    grid-template-columns: 1fr auto;
  }

  .header-right {
    grid-column: 2;
  }
}
</style>
