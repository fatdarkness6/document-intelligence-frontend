<script setup lang="ts">
const props = defineProps<{ documentId: number }>();
const $q = useQuasar();
const analysisApi = useDocumentAnalysis();

const {
  data: analysis,
  pending,
  error,
  refresh,
} = await useAsyncData(
  `document-${props.documentId}-analysis`,
  () => analysisApi.getAnalysis(props.documentId),
);

function formatNumber(value: number | null) {
  if (value === null) return "—";
  return Number(value.toFixed(2)).toLocaleString();
}
</script>

<template>
  <q-card flat bordered>
    <q-item class="q-pa-lg">
      <q-item-section avatar>
        <q-avatar
          :color="$q.dark.isActive ? 'grey-9' : 'green-1'"
          text-color="green"
          icon="analytics"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6 text-weight-bold">
          Spreadsheet analysis
        </q-item-label>
        <q-item-label caption>Structure, columns, and numeric statistics</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator />

    <CommonLoadingState v-if="pending" :rows="3" height="90px" />

    <q-card-section v-else-if="error">
      <q-banner
        rounded
        :class="$q.dark.isActive ? 'bg-red-10 text-red-2' : 'bg-red-1 text-negative'"
      >
        Failed to load spreadsheet analysis.
        <template #action>
          <q-btn flat no-caps color="negative" label="Retry" @click="refresh" />
        </template>
      </q-banner>
    </q-card-section>

    <template v-else-if="analysis">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <q-card
              flat
              :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-green-1'"
            >
              <q-item :dense="$q.screen.xs" class="q-py-md">
                <q-item-section avatar>
                  <q-avatar color="green" text-color="white" icon="view_stream" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h5 text-weight-bold">
                    {{ analysis.rows.toLocaleString() }}
                  </q-item-label>
                  <q-item-label caption>Rows</q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
          </div>

          <div class="col-6">
            <q-card
              flat
              :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-blue-1'"
            >
              <q-item :dense="$q.screen.xs" class="q-py-md">
                <q-item-section avatar>
                  <q-avatar color="blue" text-color="white" icon="view_column" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h5 text-weight-bold">
                    {{ analysis.columns.toLocaleString() }}
                  </q-item-label>
                  <q-item-label caption>Columns</q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-list separator>
        <q-expansion-item
          default-opened
          expand-separator
          icon="view_column"
          :label="`Columns (${analysis.column_info.length})`"
          caption="Names, detected types, and missing values"
          header-class="text-weight-medium q-py-md"
        >
          <q-card-section class="q-pt-none">
            <q-markup-table flat bordered wrap-cells separator="horizontal">
              <thead>
                <tr>
                  <th class="text-left">Column</th>
                  <th class="text-left">Type</th>
                  <th class="text-right">Missing</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="column in analysis.column_info" :key="column.name">
                  <td class="text-left text-weight-medium">{{ column.name }}</td>
                  <td class="text-left"><q-chip dense>{{ column.type }}</q-chip></td>
                  <td class="text-right">
                    <q-badge
                      :color="column.missing_values > 0 ? 'negative' : 'positive'"
                      :label="column.missing_values"
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="functions"
          :label="`Numeric statistics (${Object.keys(analysis.numeric_summary).length})`"
          caption="Distribution details for numeric columns"
          header-class="text-weight-medium q-py-md"
        >
          <q-card-section class="q-pt-none">
            <q-markup-table flat bordered wrap-cells separator="horizontal">
              <thead>
                <tr>
                  <th class="text-left">Column</th>
                  <th class="text-right">Count</th>
                  <th class="text-right">Mean</th>
                  <th class="text-right">Std</th>
                  <th class="text-right">Min</th>
                  <th class="text-right">25%</th>
                  <th class="text-right">50%</th>
                  <th class="text-right">75%</th>
                  <th class="text-right">Max</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(statistics, name) in analysis.numeric_summary"
                  :key="name"
                >
                  <td class="text-left text-weight-medium">{{ name }}</td>
                  <td class="text-right">{{ statistics.count }}</td>
                  <td class="text-right">{{ formatNumber(statistics.mean) }}</td>
                  <td class="text-right">{{ formatNumber(statistics.std) }}</td>
                  <td class="text-right">{{ formatNumber(statistics.min) }}</td>
                  <td class="text-right">{{ formatNumber(statistics["25%"]) }}</td>
                  <td class="text-right">{{ formatNumber(statistics["50%"]) }}</td>
                  <td class="text-right">{{ formatNumber(statistics["75%"]) }}</td>
                  <td class="text-right">{{ formatNumber(statistics.max) }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-expansion-item>
      </q-list>
    </template>
  </q-card>
</template>
