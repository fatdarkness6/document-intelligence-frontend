<script setup lang="ts">
import type { DocumentStats } from "~/types/document";

const props = defineProps<{ stats: DocumentStats }>();
const $q = useQuasar();

const completedDocuments = computed(() =>
  Math.max(
    props.stats.total_documents -
      props.stats.processing_documents -
      props.stats.failed_documents,
    0,
  ),
);

const readinessRatio = computed(() => {
  if (!props.stats.total_documents) return 0;
  return completedDocuments.value / props.stats.total_documents;
});

const readinessPercent = computed(() => Math.round(readinessRatio.value * 100));

const statusItems = computed(() => [
  {
    label: "Ready to explore",
    value: completedDocuments.value,
    icon: "task_alt",
    color: "positive",
    softColor: "green-1",
  },
  {
    label: "Currently processing",
    value: props.stats.processing_documents,
    icon: "sync",
    color: "primary",
    softColor: "indigo-1",
  },
  {
    label: "Needs attention",
    value: props.stats.failed_documents,
    icon: "error_outline",
    color: "negative",
    softColor: "red-1",
  },
]);

const documentTypes = computed(() => [
  { label: "PDF", value: props.stats.pdf_documents, color: "red", icon: "picture_as_pdf" },
  { label: "Word", value: props.stats.docx_documents, color: "blue", icon: "article" },
  {
    label: "Spreadsheets",
    value: props.stats.spreadsheet_documents,
    color: "green",
    icon: "table_chart",
  },
  { label: "Text", value: props.stats.text_documents, color: "purple", icon: "notes" },
]);

function typeRatio(value: number) {
  if (!props.stats.total_documents) return 0;
  return Math.min(value / props.stats.total_documents, 1);
}
</script>

<template>
  <section aria-label="Workspace details">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-lg-7">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center">
            <q-avatar
              :color="$q.dark.isActive ? 'grey-9' : 'green-1'"
              text-color="positive"
              icon="health_and_safety"
            />
            <div class="q-ml-md">
              <div class="text-h6 text-weight-bold">Workspace health</div>
              <div class="text-caption text-grey-7">
                Processing status across your document library.
              </div>
            </div>
            <q-space />
            <q-badge
              rounded
              color="positive"
              :label="`${readinessPercent}% ready`"
              class="q-pa-sm"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-linear-progress
              rounded
              size="10px"
              :value="readinessRatio"
              color="positive"
              track-color="grey-4"
            />
          </q-card-section>

          <q-separator />

          <q-list separator>
            <q-item v-for="item in statusItems" :key="item.label" class="q-py-md">
              <q-item-section avatar>
                <q-avatar
                  :color="$q.dark.isActive ? 'grey-9' : item.softColor"
                  :text-color="item.color"
                  :icon="item.icon"
                  size="42px"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ item.label }}</q-item-label>
                <q-item-label caption>
                  {{ item.value === 1 ? "1 document" : `${item.value} documents` }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-chip dense :color="item.color" text-color="white">
                  {{ item.value }}
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn
              flat
              no-caps
              color="primary"
              icon-right="arrow_forward"
              label="Manage documents"
              to="/documents"
            />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-5">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center">
            <q-avatar
              :color="$q.dark.isActive ? 'grey-9' : 'purple-1'"
              text-color="purple"
              icon="donut_large"
            />
            <div class="q-ml-md">
              <div class="text-h6 text-weight-bold">Document mix</div>
              <div class="text-caption text-grey-7">
                File types across your workspace.
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-sm">
            <div
              v-for="type in documentTypes"
              :key="type.label"
              class="q-mb-lg last-type"
            >
              <div class="row items-center q-mb-sm">
                <q-icon :name="type.icon" :color="type.color" size="20px" />
                <span class="text-body2 text-weight-medium q-ml-sm">{{ type.label }}</span>
                <q-space />
                <span class="text-caption text-grey-7">{{ type.value }}</span>
              </div>
              <q-linear-progress
                rounded
                size="8px"
                :value="typeRatio(type.value)"
                :color="type.color"
                track-color="grey-4"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-12">
        <q-card flat bordered>
          <q-card-section class="row items-center">
            <div>
              <div class="text-h6 text-weight-bold">Quick actions</div>
              <div class="text-caption text-grey-7">
                Jump back into the most common workspace tasks.
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <div class="row quick-actions-list">
            <q-item clickable to="/documents" class="col-12 col-lg q-py-md">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="upload_file" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">Add a document</q-item-label>
                <q-item-label caption>Upload a new file for analysis</q-item-label>
              </q-item-section>
              <q-item-section side><q-icon name="chevron_right" /></q-item-section>
            </q-item>

            <q-separator :vertical="$q.screen.gt.md" />

            <q-item clickable to="/documents" class="col-12 col-lg q-py-md">
              <q-item-section avatar>
                <q-avatar color="secondary" text-color="white" icon="manage_search" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">Explore library</q-item-label>
                <q-item-label caption>Search folders, tags, and files</q-item-label>
              </q-item-section>
              <q-item-section side><q-icon name="chevron_right" /></q-item-section>
            </q-item>

            <q-separator :vertical="$q.screen.gt.md" />

            <q-item clickable to="/settings" class="col-12 col-lg q-py-md">
              <q-item-section avatar>
                <q-avatar color="grey-7" text-color="white" icon="tune" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">Personalize</q-item-label>
                <q-item-label caption>Adjust your workspace settings</q-item-label>
              </q-item-section>
              <q-item-section side><q-icon name="chevron_right" /></q-item-section>
            </q-item>
          </div>
        </q-card>
      </div>
    </div>
  </section>
</template>

<style scoped>
.last-type:last-child {
  margin-bottom: 0;
}

.quick-actions-list .q-item {
  min-width: 0;
}
</style>
