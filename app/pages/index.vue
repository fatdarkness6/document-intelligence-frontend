<script setup lang="ts">
import LandingFooter from "~/components/landing/LandingFooter.vue";

definePageMeta({
  layout: "public",
});
</script>

<template>
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
</template>

<style scoped>
.landing-page {
  background: var(--app-background);
}
</style>
