<template>
  <section class="landing-section bg-white">
    <div class="landing-container">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-lg-7">
          <q-card flat bordered class="chat-preview">
            <q-card-section>
              <q-chat-message
                sent
                name="You"
                :text="[
                  'What database index would work best for this example?',
                ]"
                bg-color="primary"
                text-color="white"
              />

              <q-chat-message
                name="DocIntel AI"
                :text="[
                  'A composite B-tree index on owner_id, status and created_at would typically be effective for this query shape.',
                ]"
                bg-color="grey-2"
              />

              <div class="text-subtitle2 text-weight-bold q-mb-sm">Sources</div>

              <q-list bordered separator>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="menu_book" color="primary" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>Page 9</q-item-label>
                    <q-item-label caption>
                      Query performance and database indexes
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="menu_book" color="primary" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>Page 19</q-item-label>
                    <q-item-label caption>
                      Production document intelligence architecture
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-lg-5">
          <q-badge outline color="primary"> Grounded Answers </q-badge>

          <h2 class="section-title">Answers backed by your documents.</h2>

          <p class="text-grey-7 text-body1">
            DocIntel retrieves relevant document sections before generating an
            answer, helping responses stay connected to the uploaded content.
          </p>

          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-icon name="check_circle" color="positive" />
              </q-item-section>
              <q-item-section>Semantic retrieval</q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="check_circle" color="positive" />
              </q-item-section>
              <q-item-section>Conversation history</q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="check_circle" color="positive" />
              </q-item-section>
              <q-item-section>PDF page citations</q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.chat-preview {
  border-radius: 20px;
}
</style>
