<script setup lang="ts">
definePageMeta({ middleware: "auth" });

useSeoMeta({ title: "Dashboard | DocIntel" });

const $q = useQuasar();
const authStore = useAuthStore();
const documentsApi = useDocuments();

const {
  data: stats,
  pending,
  error,
  refresh,
} = await useAsyncData("dashboard-stats", () => documentsApi.getStats());

const displayName = computed(() => {
  const emailName = authStore.user?.email?.split("@")[0];
  if (!emailName) return "there";

  return emailName
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
});

const metricCards = computed(() => {
  if (!stats.value) return [];

  return [
    {
      label: "Total documents",
      value: stats.value.total_documents,
      icon: "description",
      color: "primary",
      softColor: "indigo-1",
      detail: "Files in your library",
    },
    {
      label: "PDF documents",
      value: stats.value.pdf_documents,
      icon: "picture_as_pdf",
      color: "red",
      softColor: "red-1",
      detail: "Ready for analysis",
    },
    {
      label: "Spreadsheets",
      value: stats.value.spreadsheet_documents,
      icon: "table_chart",
      color: "green",
      softColor: "green-1",
      detail: "Structured data files",
    },
    {
      label: "Questions asked",
      value: stats.value.total_questions,
      icon: "forum",
      color: "purple",
      softColor: "purple-1",
      detail: "Across your documents",
    },
  ];
});
</script>

<template>
  <q-page :class="$q.screen.lt.sm ? 'q-pa-sm' : 'q-pa-lg'">
    <div class="dashboard-container q-mx-auto">
      <DashboardHero
        :name="displayName"
        :total-documents="stats?.total_documents ?? 0"
        :total-questions="stats?.total_questions ?? 0"
        :loading="pending"
      />

      <template v-if="pending">
        <div class="row q-col-gutter-md q-mt-sm">
          <div v-for="item in 4" :key="item" class="col-12 col-sm-6 col-xl-3">
            <q-card flat bordered>
              <q-card-section>
                <div class="row items-center no-wrap">
                  <q-skeleton type="QAvatar" size="52px" />
                  <div class="col q-ml-md">
                    <q-skeleton type="text" width="55%" />
                    <q-skeleton type="text" width="32%" height="30px" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="row q-col-gutter-md q-mt-xs">
          <div class="col-12 col-lg-8">
            <q-skeleton type="rect" height="330px" />
          </div>
          <div class="col-12 col-lg-4">
            <q-skeleton type="rect" height="330px" />
          </div>
        </div>
      </template>

      <q-banner v-else-if="error" rounded class="bg-negative text-white q-mt-lg">
        <template #avatar>
          <q-icon name="cloud_off" size="28px" />
        </template>

        <div class="text-weight-bold">We couldn’t load your dashboard</div>
        <div class="text-caption">
          Check your connection and try loading the workspace again.
        </div>

        <template #action>
          <q-btn flat no-caps color="white" label="Try again" @click="refresh" />
        </template>
      </q-banner>

      <template v-else-if="stats">
        <section class="q-mt-lg" aria-labelledby="workspace-metrics-title">
          <div class="row items-end q-mb-md">
            <div>
              <div id="workspace-metrics-title" class="text-h6 text-weight-bold">
                Workspace at a glance
              </div>
              <div class="text-caption text-grey-7">
                The most important activity across your library.
              </div>
            </div>
            <q-space />
            <q-btn
              v-if="$q.screen.gt.xs"
              flat
              dense
              no-caps
              color="primary"
              icon-right="arrow_forward"
              label="View documents"
              to="/documents"
            />
          </div>

          <div class="row q-col-gutter-md">
            <div
              v-for="metric in metricCards"
              :key="metric.label"
              class="col-12 col-sm-6 col-xl-3"
            >
              <DashboardStatCard v-bind="metric" />
            </div>
          </div>
        </section>

        <DashboardWorkspaceOverview :stats="stats" class="q-mt-lg" />
      </template>
    </div>

    <q-page-sticky
      v-if="$q.screen.lt.sm"
      position="bottom-right"
      :offset="[16, 16]"
    >
      <q-btn
        fab
        color="primary"
        icon="upload_file"
        to="/documents"
        aria-label="Go to documents to upload a file"
      />
    </q-page-sticky>
  </q-page>
</template>

<style scoped>
.dashboard-container {
  width: min(100%, 1440px);
}
</style>
