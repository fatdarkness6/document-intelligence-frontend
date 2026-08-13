<script setup lang="ts">
import type { DocumentStatus } from "~/types/document";

const props = defineProps<{
  documentId: number;
  status: DocumentStatus;
}>();

const documentChat = useDocumentChat();
const feedback = useAppFeedback();

const question = ref("");
const asking = ref(false);

const {
  data: questions,
  pending,
  error,
  refresh,
} = await useAsyncData(
  `document-${props.documentId}-questions`,
  () => documentChat.getQuestions(props.documentId),
);

async function askQuestion() {
  const askedQuestion = question.value.trim();

  if (!askedQuestion) return;

  asking.value = true;

  try {
    const response = await documentChat.askQuestion(
      props.documentId,
      askedQuestion,
    );

    question.value = "";
    await refresh();

    const storedQuestion = (questions.value ?? [])
      .filter((item) => item.question === askedQuestion)
      .sort((a, b) => b.id - a.id)[0];

    if (storedQuestion) {
      storedQuestion.sources = response.sources;
    }
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    asking.value = false;
  }
}
</script>

<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="text-h6">AI Chat</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <CommonLoadingState v-if="pending" :rows="3" height="48px" />

      <q-banner v-else-if="error" class="bg-red-1 text-negative" rounded>
        Failed to load conversation history.

        <template #action>
          <q-btn flat label="Retry" color="negative" @click="refresh" />
        </template>
      </q-banner>

      <CommonEmptyState
        v-else-if="!questions?.length && !asking"
        icon="forum"
        title="No questions yet"
        description="Ask something about this document to start the conversation."
      />

      <div v-else class="column">
        <template v-for="item in questions ?? []" :key="item.id">
          <q-chat-message
            name="You"
            :text="[item.question]"
            sent
            bg-color="primary"
            text-color="white"
          />

          <q-chat-message
            name="AI"
            :text="[item.answer]"
            bg-color="grey-2"
            text-color="dark"
          />

          <q-expansion-item
            v-if="item.sources?.length"
            icon="menu_book"
            :label="`Sources (${item.sources.length})`"
            dense
            class="q-mb-md"
          >
            <q-list bordered separator class="rounded-borders">
              <q-item v-for="source in item.sources" :key="source.chunk_id">
                <q-item-section>
                  <q-item-label class="text-weight-medium">
                    {{
                      source.page_number
                        ? `Page ${source.page_number}`
                        : `Chunk ${source.chunk_index + 1}`
                    }}
                  </q-item-label>

                  <q-item-label caption lines="3">
                    {{ source.preview }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </template>

        <q-chat-message
          v-if="asking"
          name="AI"
          bg-color="grey-2"
          text-color="dark"
        >
          <q-spinner-dots size="24px" color="primary" />
        </q-chat-message>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-input
        v-model="question"
        outlined
        type="textarea"
        autogrow
        placeholder="Ask something about this document..."
        :disable="status !== 'completed' || asking"
        @keyup.ctrl.enter="askQuestion"
      >
        <template #append>
          <q-btn
            round
            flat
            icon="send"
            color="primary"
            :loading="asking"
            :disable="!question.trim() || status !== 'completed'"
            aria-label="Send question"
            @click="askQuestion"
          />
        </template>
      </q-input>

      <div
        v-if="status !== 'completed'"
        class="text-grey-7 text-caption q-mt-sm"
      >
        Chat becomes available when processing is complete.
      </div>
    </q-card-section>
  </q-card>
</template>
