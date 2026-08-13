<template>
  <section class="spreadsheet-section">
    <div class="landing-container">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-lg-5">
          <q-badge color="blue-2" text-color="primary">
            Spreadsheet Intelligence
          </q-badge>

          <h2 class="section-title text-white">
            Your spreadsheets can explain themselves.
          </h2>

          <p class="spreadsheet-description">
            Upload CSV or Excel files and automatically inspect dimensions,
            column types, missing values, statistics and AI-generated
            observations.
          </p>

          <q-list class="text-white">
            <q-item>
              <q-item-section avatar>
                <q-icon name="check_circle" />
              </q-item-section>

              <q-item-section> Pandas-powered analysis </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="check_circle" />
              </q-item-section>

              <q-item-section> Missing-value detection </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="check_circle" />
              </q-item-section>

              <q-item-section> Numeric statistics </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="check_circle" />
              </q-item-section>

              <q-item-section> AI-generated insights </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="col-12 col-lg-7">
          <q-card class="analysis-preview">
            <q-card-section>
              <div class="text-h6 text-weight-bold">sales-data.xlsx</div>
            </q-card-section>

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <q-card flat bordered class="q-pa-md">
                    <div class="text-grey-7">Rows</div>
                    <div class="text-h4 text-weight-bold">46</div>
                  </q-card>
                </div>

                <div class="col-6">
                  <q-card flat bordered class="q-pa-md">
                    <div class="text-grey-7">Columns</div>
                    <div class="text-h4 text-weight-bold">14</div>
                  </q-card>
                </div>
              </div>
            </q-card-section>

            <q-markup-table flat>
              <thead>
                <tr>
                  <th class="text-left">Column</th>
                  <th class="text-left">Type</th>
                  <th class="text-right">Missing</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Period</td>
                  <td>float64</td>
                  <td class="text-right">0</td>
                </tr>

                <tr>
                  <td>Data_value</td>
                  <td>float64</td>
                  <td class="text-right">0</td>
                </tr>

                <tr>
                  <td>Suppressed</td>
                  <td>float64</td>
                  <td class="text-right text-negative">46</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.spreadsheet-section {
  padding: 96px 0;
  background: #101828;
}

.spreadsheet-description {
  color: #d0d5dd;
  font-size: 17px;
  line-height: 1.8;
}

.analysis-preview {
  border-radius: 20px;
  overflow: hidden;
}
</style>
