<script setup lang="ts">
const props = defineProps<{
  documentId: number;
}>();

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
    <q-card-section>
      <div class="text-h6">Spreadsheet Analysis</div>
    </q-card-section>

    <q-separator />

    <CommonLoadingState v-if="pending" :rows="3" height="100px" />

    <q-card-section v-else-if="error">
      <q-banner rounded class="bg-red-1 text-negative">
        Failed to load spreadsheet analysis.

        <template #action>
          <q-btn flat color="negative" label="Retry" @click="refresh" />
        </template>
      </q-banner>
    </q-card-section>

    <template v-else-if="analysis">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-card flat bordered class="q-pa-md">
              <div class="text-grey-7">Rows</div>
              <div class="text-h4 text-weight-bold">{{ analysis.rows }}</div>
            </q-card>
          </div>

          <div class="col-12 col-sm-6">
            <q-card flat bordered class="q-pa-md">
              <div class="text-grey-7">Columns</div>
              <div class="text-h4 text-weight-bold">
                {{ analysis.columns }}
              </div>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-md">Columns</div>

        <q-markup-table flat bordered wrap-cells>
          <thead>
            <tr>
              <th class="text-left">Column</th>
              <th class="text-left">Type</th>
              <th class="text-right">Missing values</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="column in analysis.column_info" :key="column.name">
              <td class="text-left text-weight-medium">{{ column.name }}</td>
              <td class="text-left">
                <q-chip dense>{{ column.type }}</q-chip>
              </td>
              <td class="text-right">
                <span
                  :class="
                    column.missing_values > 0
                      ? 'text-negative text-weight-medium'
                      : 'text-positive'
                  "
                >
                  {{ column.missing_values }}
                </span>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle1 text-weight-medium q-mb-md">
          Numeric Statistics
        </div>

        <q-markup-table flat bordered wrap-cells>
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
    </template>
  </q-card>
</template>
