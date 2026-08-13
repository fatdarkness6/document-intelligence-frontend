<script setup lang="ts">
defineProps<{
  name: string;
  totalDocuments: number;
  totalQuestions: number;
  loading: boolean;
}>();

const $q = useQuasar();
</script>

<template>
  <q-card flat class="dashboard-hero text-white overflow-hidden">
    <q-card-section :class="$q.screen.lt.sm ? 'q-pa-lg' : 'q-pa-xl'">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-md">
          <q-chip
            dense
            icon="space_dashboard"
            label="Workspace overview"
            class="hero-chip q-ma-none"
          />

          <div
            :class="$q.screen.lt.sm ? 'text-h4' : 'text-h3'"
            class="text-weight-bold q-mt-md"
          >
            Welcome back, {{ name }}.
          </div>
          <div class="text-subtitle1 hero-description q-mt-sm">
            Your documents are organized and ready for deeper exploration.
          </div>

          <div class="row q-gutter-sm q-mt-lg">
            <q-btn
              unelevated
              no-caps
              color="white"
              text-color="primary"
              icon="upload_file"
              label="Add document"
              to="/documents"
            />
            <q-btn
              outline
              no-caps
              color="white"
              icon="folder_open"
              :label="$q.screen.xs ? 'Library' : 'Browse library'"
              to="/documents"
            />
          </div>
        </div>

        <div class="col-12 col-md-5 col-lg-4">
          <q-card flat class="hero-summary">
            <q-list separator>
              <q-item class="q-py-md">
                <q-item-section avatar>
                  <q-avatar color="white" text-color="primary" icon="description" />
                </q-item-section>
                <q-item-section>
                  <q-skeleton v-if="loading" type="text" width="55px" height="32px" />
                  <q-item-label v-else class="text-h5 text-weight-bold">
                    {{ totalDocuments }}
                  </q-item-label>
                  <q-item-label caption class="hero-summary__caption">
                    Documents in your workspace
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="q-py-md">
                <q-item-section avatar>
                  <q-avatar color="white" text-color="secondary" icon="auto_awesome" />
                </q-item-section>
                <q-item-section>
                  <q-skeleton v-if="loading" type="text" width="55px" height="32px" />
                  <q-item-label v-else class="text-h5 text-weight-bold">
                    {{ totalQuestions }}
                  </q-item-label>
                  <q-item-label caption class="hero-summary__caption">
                    Questions answered with AI
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.dashboard-hero {
  background: linear-gradient(125deg, #29256d, #5142ad 55%, #7650bc);
  border-radius: 20px;
  box-shadow: 0 16px 42px rgb(67 56 152 / 22%);
}

.hero-chip,
.hero-summary {
  color: white;
  background: rgb(255 255 255 / 14%);
}

.hero-description,
.hero-summary__caption {
  color: rgb(255 255 255 / 75%) !important;
}
</style>
