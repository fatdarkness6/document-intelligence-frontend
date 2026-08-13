<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <section class="hero-section">
    <div class="landing-container">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-lg-6">
          <q-badge outline color="primary" class="q-mb-md q-pa-sm">
            AI Document Intelligence
          </q-badge>

          <h1 class="hero-title q-my-none">
            Understand your documents.
            <span class="text-primary"> Ask AI anything. </span>
          </h1>

          <p class="hero-description q-mt-lg">
            Upload documents, generate concise summaries, ask grounded
            questions, analyze spreadsheets, and turn complex files into useful
            insights.
          </p>

          <div class="row q-gutter-sm q-mt-xl">
            <q-btn
              v-if="authStore.isAuthenticated"
              color="primary"
              unelevated
              no-caps
              size="lg"
              icon-right="arrow_forward"
              label="Open Dashboard"
              to="/dashboard"
            />

            <template v-else>
              <q-btn
                color="primary"
                unelevated
                no-caps
                size="lg"
                icon-right="arrow_forward"
                label="Get Started"
                to="/register"
              />

              <q-btn
                outline
                color="primary"
                no-caps
                size="lg"
                label="Sign in"
                to="/login"
              />
            </template>
          </div>

          <div class="row q-gutter-lg q-mt-xl text-grey-7">
            <div class="row items-center q-gutter-xs">
              <q-icon name="check_circle" color="positive" />
              PDF & DOCX
            </div>

            <div class="row items-center q-gutter-xs">
              <q-icon name="check_circle" color="positive" />
              CSV & Excel
            </div>

            <div class="row items-center q-gutter-xs">
              <q-icon name="check_circle" color="positive" />
              Grounded AI answers
            </div>
          </div>
        </div>

        <!-- Product preview -->
        <div class="col-12 col-lg-6">
          <q-card flat bordered class="product-preview">
            <q-card-section class="row items-center">
              <q-avatar
                color="red-1"
                text-color="negative"
                icon="picture_as_pdf"
              />

              <div class="q-ml-md">
                <div class="text-weight-medium">technical-report.pdf</div>

                <div class="text-caption text-grey-7">20 pages</div>
              </div>

              <q-space />

              <CommonStatusChip status="completed" />
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="row items-center q-gutter-sm q-mb-sm">
                <q-icon name="auto_awesome" color="primary" />

                <div class="text-weight-bold">AI Summary</div>
              </div>

              <p class="text-grey-8 q-mb-none">
                This technical report explains modern backend architecture,
                databases, deployment, security and AI-powered retrieval
                systems.
              </p>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <q-chat-message
                sent
                name="You"
                :text="['Which database index should I use?']"
                bg-color="primary"
                text-color="white"
              />

              <q-chat-message
                name="AI"
                :text="[
                  'A composite B-tree index is typically effective for this query shape.',
                ]"
                bg-color="grey-2"
              />

              <div class="row q-gutter-xs">
                <q-chip dense icon="menu_book"> Page 9 </q-chip>

                <q-chip dense icon="menu_book"> Page 19 </q-chip>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero-section {
  padding: 96px 0 80px;
}

.hero-title {
  font-size: clamp(44px, 6vw, 76px);
  line-height: 1.04;
  letter-spacing: -0.045em;
  font-weight: 750;
}

.hero-description {
  max-width: 680px;
  font-size: 19px;
  line-height: 1.8;
  color: var(--app-text-secondary);
}

.product-preview {
  border-radius: 24px;
  background: var(--app-surface);
  box-shadow: 0 30px 80px rgba(16, 24, 40, 0.08);
}
</style>
