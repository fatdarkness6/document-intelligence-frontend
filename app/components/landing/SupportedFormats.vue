<script setup lang="ts">
const formats = [
  { label: "PDF", icon: "picture_as_pdf" },
  { label: "DOCX", icon: "article" },
  { label: "TXT", icon: "description" },
  { label: "CSV", icon: "table_chart" },
  { label: "XLSX", icon: "grid_on" },
];
</script>

<template>
  <section class="supported-section">
    <div class="landing-container">
      <div class="text-center q-mb-lg">
        <div class="text-h6 text-weight-bold">
          One workspace for your documents and data
        </div>

        <div class="text-grey-7 q-mt-xs">Upload files up to 20 MB.</div>
      </div>

      <div class="row justify-center q-col-gutter-md">
        <div
          v-for="format in formats"
          :key="format.label"
          class="col-6 col-sm-4 col-md-auto"
        >
          <q-card
            flat
            bordered
            class="format-card row items-center no-wrap q-pa-md"
          >
            <q-avatar color="primary" text-color="white" :icon="format.icon" />

            <div class="q-ml-md text-weight-bold">
              {{ format.label }}
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.supported-section {
  padding: 56px 0;
  background: white;
}

.format-card {
  min-width: 145px;
  border-radius: var(--app-radius-md);
}
</style>
