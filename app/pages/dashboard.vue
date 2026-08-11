<!-- app/pages/dashboard.vue -->

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const documents = useDocuments();

const {
  data: stats,
  pending,
  error,
  refresh,
} = await useAsyncData("dashboard-stats", () => documents.getStats());
</script>

<template>
  <q-page class="q-pa-md q-pa-lg-md">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">Dashboard</div>

        <div class="text-grey-7 q-mt-xs">
          Overview of your document intelligence workspace.
        </div>
      </div>

      <q-btn
        color="primary"
        icon="upload_file"
        label="Upload document"
        unelevated
        no-caps
        to="/documents"
      />
    </div>

    <!-- Loading -->
    <div v-if="pending" class="row q-col-gutter-md">
      <div v-for="item in 4" :key="item" class="col-12 col-sm-6 col-lg-3">
        <q-skeleton type="rect" height="130px" />
      </div>
    </div>

    <!-- Error -->
    <q-banner v-else-if="error" rounded class="bg-red-1 text-negative">
      Failed to load dashboard data.

      <template #action>
        <q-btn flat color="negative" label="Retry" @click="refresh" />
      </template>
    </q-banner>

    <div v-else-if="stats" class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-lg-3">
        <DashboardStatCard
          label="Total documents"
          :value="stats.total_documents"
          icon="description"
        />
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <DashboardStatCard
          label="PDF documents"
          :value="stats.pdf_documents"
          icon="picture_as_pdf"
        />
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <DashboardStatCard
          label="Spreadsheets"
          :value="stats.spreadsheet_documents"
          icon="table_chart"
        />
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <DashboardStatCard
          label="Questions asked"
          :value="stats.total_questions"
          icon="forum"
        />
      </div>
    </div>
    <div v-if="stats" class="row q-col-gutter-md q-mt-md">
      <div class="col-12 col-md-6">
        <q-banner rounded class="bg-blue-1 text-primary">
          <template #avatar>
            <q-icon name="sync" />
          </template>

          <div class="text-weight-medium">
            {{ stats.processing_documents }} documents processing
          </div>
        </q-banner>
      </div>

      <div class="col-12 col-md-6">
        <q-banner rounded class="bg-red-1 text-negative">
          <template #avatar>
            <q-icon name="error_outline" />
          </template>

          <div class="text-weight-medium">
            {{ stats.failed_documents }} failed documents
          </div>
        </q-banner>
      </div>
    </div>
  </q-page>
</template>
