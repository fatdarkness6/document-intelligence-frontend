<script setup lang="ts">
const tab = ref("summary");
</script>

<template>
  <section class="landing-section bg-white">
    <div class="landing-container">
      <div class="section-heading text-center">
        <q-badge outline color="primary"> Product </q-badge>

        <h2>One workspace. Multiple ways to understand information.</h2>
      </div>

      <q-card flat bordered class="showcase-card">
        <q-tabs
          v-model="tab"
          color="primary"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          no-caps
        >
          <q-tab name="summary" icon="summarize" label="Summarize" />

          <q-tab name="chat" icon="forum" label="Ask AI" />

          <q-tab name="data" icon="analytics" label="Analyze Data" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="summary">
            <div class="row q-col-gutter-xl items-center">
              <div class="col-12 col-md-5">
                <div class="text-h5 text-weight-bold">
                  Skip the manual reading.
                </div>

                <p class="text-grey-7">
                  DocIntel extracts document content and generates a clear AI
                  summary so you can understand the important information first.
                </p>
              </div>

              <div class="col-12 col-md-7">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-weight-bold q-mb-md">AI Summary</div>

                    <p>
                      This report covers database architecture, deployment,
                      security and retrieval-augmented AI systems.
                    </p>

                    <q-chip icon="description"> 20-page report </q-chip>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="chat">
            <div class="row q-col-gutter-xl items-center">
              <div class="col-12 col-md-5">
                <div class="text-h5 text-weight-bold">
                  Ask questions. Get grounded answers.
                </div>

                <p class="text-grey-7">
                  Relevant document chunks are retrieved before AI generates the
                  answer.
                </p>
              </div>

              <div class="col-12 col-md-7">
                <q-chat-message
                  sent
                  name="You"
                  :text="['What is the recommended index?']"
                  bg-color="primary"
                  text-color="white"
                />

                <q-chat-message
                  name="AI"
                  :text="[
                    'A composite B-tree index is typically effective for the example query.',
                  ]"
                  bg-color="grey-2"
                />

                <q-chip icon="menu_book"> Page 9 </q-chip>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="data">
            <div class="row q-col-gutter-xl items-center">
              <div class="col-12 col-md-5">
                <div class="text-h5 text-weight-bold">
                  Let your spreadsheet explain itself.
                </div>

                <p class="text-grey-7">
                  Automatically inspect dimensions, missing values, numeric
                  distributions and AI insights.
                </p>
              </div>

              <div class="col-12 col-md-7">
                <div class="row q-col-gutter-md">
                  <div class="col-6">
                    <q-card flat bordered class="q-pa-md">
                      <div class="text-grey-7">Rows</div>

                      <div class="text-h4 text-weight-bold">1,245</div>
                    </q-card>
                  </div>

                  <div class="col-6">
                    <q-card flat bordered class="q-pa-md">
                      <div class="text-grey-7">Columns</div>

                      <div class="text-h4 text-weight-bold">14</div>
                    </q-card>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </section>
</template>

<style scoped>
.showcase-card {
  border-radius: 20px;
  overflow: hidden;
}
</style>
