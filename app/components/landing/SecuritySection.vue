<script setup lang="ts">
const items = [
  {
    icon: "lock",
    title: "Authenticated accounts",
    description: "Protected routes require authenticated access.",
  },
  {
    icon: "person",
    title: "User-owned documents",
    description:
      "Document requests are scoped to the authenticated user's account.",
  },
  {
    icon: "vpn_key",
    title: "JWT authentication",
    description: "Protected API requests use bearer-token authentication.",
  },
  {
    icon: "delete_forever",
    title: "Document cleanup",
    description:
      "Deleting documents also cleans related stored data and generated files.",
  },
];
</script>

<template>
  <section id="security" class="landing-section bg-white">
    <div class="landing-container">
      <div class="section-heading text-center">
        <q-badge outline color="primary"> Security </q-badge>

        <h2>Your workspace stays tied to your account.</h2>

        <p>
          The platform includes practical access controls for its current MVP
          architecture.
        </p>
      </div>

      <div class="row q-col-gutter-lg">
        <div
          v-for="item in items"
          :key="item.title"
          class="col-12 col-sm-6 col-lg-3"
        >
          <q-card flat bordered class="security-card full-height">
            <q-card-section>
              <q-avatar
                color="green-1"
                text-color="positive"
                :icon="item.icon"
              />

              <div class="text-weight-bold text-subtitle1 q-mt-md">
                {{ item.title }}
              </div>

              <div class="text-grey-7 q-mt-sm">
                {{ item.description }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.security-card {
  border-radius: 18px;
}
</style>
