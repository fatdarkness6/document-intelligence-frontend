<script setup lang="ts">
const features = [
  {
    icon: "auto_awesome",
    title: "AI Summaries",
    description:
      "Turn long documents into concise explanations without reading every page.",
  },
  {
    icon: "forum",
    title: "Chat with Documents",
    description:
      "Ask natural-language questions and receive answers grounded in your files.",
  },
  {
    icon: "manage_search",
    title: "Semantic Retrieval",
    description:
      "Find relevant information by meaning instead of relying only on exact keywords.",
  },
  {
    icon: "analytics",
    title: "Spreadsheet Intelligence",
    description:
      "Understand rows, columns, missing values, statistics and AI-generated insights.",
  },
  {
    icon: "folder_copy",
    title: "Organize Everything",
    description:
      "Use folders, tags and favorites to keep your document workspace structured.",
  },
  {
    icon: "picture_as_pdf",
    title: "Downloadable Reports",
    description:
      "Generate PDF reports containing summaries and spreadsheet insights.",
  },
];
</script>

<template>
  <section id="features" class="landing-section">
    <div class="landing-container">
      <div class="section-heading">
        <q-badge outline color="primary"> Features </q-badge>

        <h2>Everything you need to understand your files.</h2>

        <p>
          DocIntel combines document processing, AI retrieval and data analysis
          inside one workspace.
        </p>
      </div>

      <div class="row q-col-gutter-lg">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="col-12 col-md-6 col-lg-4"
        >
          <q-card flat bordered class="feature-card full-height">
            <q-card-section>
              <q-avatar
                size="52px"
                color="blue-1"
                text-color="primary"
                :icon="feature.icon"
              />

              <div class="text-h6 text-weight-bold q-mt-lg">
                {{ feature.title }}
              </div>

              <p class="text-grey-7 q-mb-none q-mt-sm">
                {{ feature.description }}
              </p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feature-card {
  border-radius: 18px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 45px rgba(16, 24, 40, 0.08);
}
</style>
