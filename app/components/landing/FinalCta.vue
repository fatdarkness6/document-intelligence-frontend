<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <section class="cta-section">
    <div class="landing-container">
      <q-card class="cta-card text-white">
        <q-card-section class="q-pa-xl text-center">
          <q-icon name="auto_awesome" size="42px" class="q-mb-md" />

          <div class="cta-title">
            Stop searching through documents manually.
          </div>

          <div class="cta-description q-mt-md">
            Let AI help you summarize, search, analyze and understand your
            files.
          </div>

          <div class="row justify-center q-gutter-sm q-mt-xl">
            <q-btn
              v-if="authStore.isAuthenticated"
              color="white"
              text-color="primary"
              unelevated
              no-caps
              size="lg"
              label="Open Dashboard"
              to="/dashboard"
            />

            <template v-else>
              <q-btn
                color="white"
                text-color="primary"
                unelevated
                no-caps
                size="lg"
                label="Create free account"
                to="/register"
              />

              <q-btn
                outline
                color="white"
                no-caps
                size="lg"
                label="Sign in"
                to="/login"
              />
            </template>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cta-section {
  padding: 96px 0;
}

.cta-card {
  border-radius: 28px;
  background:
    radial-gradient(
      circle at 15% 20%,
      rgba(255, 255, 255, 0.15),
      transparent 35%
    ),
    #1976d2;
}

.cta-title {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 750;
  line-height: 1.1;
}

.cta-description {
  max-width: 650px;
  margin-inline: auto;
  font-size: 18px;
  opacity: 0.9;
}
</style>
