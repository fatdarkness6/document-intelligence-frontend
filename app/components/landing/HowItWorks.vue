<script setup lang="ts">
const steps = [
  {
    number: "01",
    icon: "upload_file",
    title: "Upload",
    description: "Choose your PDF, Word, text, CSV or Excel file.",
  },
  {
    number: "02",
    icon: "memory",
    title: "AI Processes",
    description:
      "Content is extracted, cleaned, chunked and prepared for retrieval.",
  },
  {
    number: "03",
    icon: "question_answer",
    title: "Ask or Analyze",
    description:
      "Chat with documents or inspect spreadsheet statistics and insights.",
  },
  {
    number: "04",
    icon: "lightbulb",
    title: "Understand",
    description:
      "Get summaries, grounded answers, citations and downloadable reports.",
  },
];
</script>

<template>
  <section id="how-it-works" class="landing-section">
    <div class="landing-container">
      <div class="section-heading text-center">
        <q-badge outline color="primary"> Workflow </q-badge>

        <h2>From upload to insight in four steps.</h2>
      </div>

      <div class="row q-col-gutter-lg">
        <div
          v-for="step in steps"
          :key="step.number"
          class="col-12 col-sm-6 col-lg-3"
        >
          <q-card flat bordered class="step-card full-height">
            <q-card-section>
              <div class="row items-center justify-between">
                <q-avatar
                  color="primary"
                  text-color="white"
                  :icon="step.icon"
                />

                <div class="text-h5 text-grey-4 text-weight-bold">
                  {{ step.number }}
                </div>
              </div>

              <div class="text-h6 text-weight-bold q-mt-lg">
                {{ step.title }}
              </div>

              <div class="text-grey-7 q-mt-sm">
                {{ step.description }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.step-card {
  border-radius: 18px;
}
</style>
