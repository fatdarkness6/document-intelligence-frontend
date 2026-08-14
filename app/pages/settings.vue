<script setup lang="ts">
definePageMeta({ middleware: "auth" });

usePageSeo({
  title: "Settings",
  description:
    "Manage appearance, navigation, and account preferences for your DocIntel workspace.",
  noIndex: true,
});

const $q = useQuasar();
const authStore = useAuthStore();
const feedback = useAppFeedback();
const { compactNavigation, darkMode } = useAppPreferences();

const accountInitial = computed(
  () => authStore.user?.email?.charAt(0).toUpperCase() || "U",
);

function confirmLogout() {
  feedback
    .confirm({
      title: "Sign out?",
      message: "You will need to sign in again to access your documents.",
    })
    .onOk(() => authStore.logout());
}
</script>

<template>
  <q-page :class="$q.screen.lt.sm ? 'q-pa-sm' : 'q-pa-lg'">
    <div class="settings-container q-mx-auto">
      <SettingsHero />

      <div class="row q-col-gutter-lg q-mt-xs">
        <div class="col-12 col-lg-4">
          <SettingsAccountCard
            :email="authStore.user?.email"
            :account-id="authStore.user?.id"
            :initial="accountInitial"
          />
        </div>

        <div class="col-12 col-lg-8">
          <div class="column q-gutter-lg">
            <SettingsAppearanceCard
              v-model:compact-navigation="compactNavigation"
              v-model:dark-mode="darkMode"
            />
            <SettingsSessionCard @sign-out="confirmLogout" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.settings-container {
  width: min(100%, 1240px);
}
</style>
