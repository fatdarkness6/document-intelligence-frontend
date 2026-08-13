<script setup lang="ts">
import LandingFooter from "~/components/landing/LandingFooter.vue";

definePageMeta({
  layout: "public",
});

const authStore = useAuthStore();
</script>

<template>
  <NuxtLayout name="public">
    <template #header-actions>
      <div class="row items-center q-gutter-sm">
        <q-btn
          v-if="authStore.isAuthenticated"
          color="primary"
          unelevated
          no-caps
          icon="dashboard"
          label="Dashboard"
          to="/dashboard"
        />

        <template v-else>
          <q-btn flat no-caps label="Sign in" to="/login" />

          <q-btn
            color="primary"
            unelevated
            no-caps
            label="Create account"
            to="/register"
          />
        </template>
      </div>
    </template>

    <q-page class="landing-page">
      <LandingHeroSection />

      <LandingSupportedFormats />

      <LandingFeaturesSection />

      <LandingProductShowcase />

      <LandingHowItWorks />

      <LandingSpreadsheetSection />

      <LandingChatCitationsSection />

      <LandingOrganizationSection />

      <LandingSecuritySection />

      <LandingFinalCta />

      <LandingFooter />
    </q-page>
  </NuxtLayout>
</template>

<style scoped>
.landing-page {
  background: var(--app-background);
}
</style>
