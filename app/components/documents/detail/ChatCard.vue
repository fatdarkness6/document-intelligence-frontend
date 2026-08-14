<script setup lang="ts">
import type {
  DocumentSource,
  DocumentStatus,
} from "~/types/document";

interface ChatEntry {
  id: number | string;
  question: string;
  answer: string | null;
  sources: DocumentSource[];
  pending: boolean;
  failed: boolean;
  errorMessage?: string;
}

interface ScrollAreaRef {
  getScrollTarget: () => HTMLElement;
  setScrollPosition: (
    axis: "vertical" | "horizontal",
    offset: number,
    duration?: number,
  ) => void;
}

interface InputRef {
  focus: () => void;
}

const props = defineProps<{
  documentId: number;
  status: DocumentStatus;
}>();

const $q = useQuasar();
const documentChat = useDocumentChat();
const feedback = useAppFeedback();

const question = ref("");
const messages = ref<ChatEntry[]>([]);
const scrollArea = ref<ScrollAreaRef | null>(null);
const questionInput = ref<InputRef | null>(null);

const suggestions = [
  "What is this document about?",
  "What are the key points?",
  "What actions are recommended?",
];

const {
  data: questions,
  pending,
  error,
  refresh,
} = await useAsyncData(
  `document-${props.documentId}-questions`,
  () => documentChat.getQuestions(props.documentId),
);

const asking = computed(() => messages.value.some((message) => message.pending));

const scrollThumbStyle = computed(() => ({
  right: "3px",
  borderRadius: "6px",
  backgroundColor: $q.dark.isActive ? "#818cf8" : "#6366f1",
  width: "6px",
  opacity: "0.78",
}));

const scrollBarStyle = computed(() => ({
  right: "2px",
  borderRadius: "8px",
  backgroundColor: $q.dark.isActive ? "#252d43" : "#e7e9f2",
  width: "8px",
  opacity: "0.45",
}));

watch(
  questions,
  (history) => {
    if (messages.value.some((message) => message.pending)) return;

    messages.value = (history ?? []).map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
      sources: item.sources ?? [],
      pending: false,
      failed: false,
    }));

    scrollToBottom(0);
  },
  { immediate: true },
);

async function scrollToBottom(duration = 280) {
  await nextTick();
  if (!import.meta.client) return;

  requestAnimationFrame(() => {
    const area = scrollArea.value;
    const target = area?.getScrollTarget();

    if (area && target) {
      area.setScrollPosition("vertical", target.scrollHeight, duration);
    }
  });
}

function selectSuggestion(suggestion: string) {
  question.value = suggestion;
  nextTick(() => questionInput.value?.focus());
}

async function requestAnswer(message: ChatEntry) {
  message.pending = true;
  message.failed = false;
  message.errorMessage = undefined;
  await scrollToBottom();

  try {
    const response = await documentChat.askQuestion(
      props.documentId,
      message.question,
    );

    message.answer = response.answer;
    message.sources = response.sources ?? [];
    message.pending = false;
    await scrollToBottom(360);
  } catch (requestError) {
    const apiError = normalizeApiError(requestError);
    message.pending = false;
    message.failed = true;
    message.errorMessage = apiError.message;
    feedback.error(apiError.message);
    await scrollToBottom();
  }
}

async function askQuestion() {
  const askedQuestion = question.value.trim();

  if (!askedQuestion || asking.value || props.status !== "completed") return;

  const message = reactive<ChatEntry>({
    id: `pending-${Date.now()}`,
    question: askedQuestion,
    answer: null,
    sources: [],
    pending: true,
    failed: false,
  });

  question.value = "";
  messages.value.push(message);
  await scrollToBottom(220);
  await requestAnswer(message);
}
</script>

<template>
  <q-card flat bordered>
    <q-item class="q-pa-lg">
      <q-item-section avatar>
        <q-avatar
          :color="$q.dark.isActive ? 'grey-9' : 'indigo-1'"
          text-color="primary"
          icon="smart_toy"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-h6 text-weight-bold">Ask DocIntel</q-item-label>
        <q-item-label caption>
          Ask questions and get answers grounded in this document.
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-chip
          v-if="asking"
          dense
          color="primary"
          text-color="white"
          icon="auto_awesome"
          label="Thinking"
        />
        <q-badge
          v-else-if="messages.length"
          color="primary"
          :label="messages.length"
          rounded
        />
      </q-item-section>
    </q-item>

    <q-separator />

    <q-scroll-area
      ref="scrollArea"
      class="conversation-area"
      tabindex="0"
      visible
      :thumb-style="scrollThumbStyle"
      :bar-style="scrollBarStyle"
      @wheel.stop
    >
      <div :class="$q.screen.lt.sm ? 'q-pa-md' : 'q-pa-lg'">
        <CommonLoadingState v-if="pending" :rows="3" height="48px" />

        <q-banner
          v-else-if="error"
          rounded
          :class="
            $q.dark.isActive
              ? 'bg-red-10 text-red-2'
              : 'bg-red-1 text-negative'
          "
        >
          Failed to load conversation history.
          <template #action>
            <q-btn
              flat
              no-caps
              label="Retry"
              color="negative"
              @click="refresh"
            />
          </template>
        </q-banner>

        <div
          v-else-if="!messages.length"
          class="column items-center text-center q-pa-lg"
        >
          <q-avatar
            size="72px"
            :color="$q.dark.isActive ? 'grey-9' : 'indigo-1'"
            text-color="primary"
            icon="forum"
          />
          <div class="text-h6 text-weight-bold q-mt-md">Start a conversation</div>
          <div class="text-body2 text-grey-7 q-mt-xs">
            Choose a suggestion or write your own question below.
          </div>

          <div class="row justify-center q-gutter-sm q-mt-lg">
            <q-chip
              v-for="suggestion in suggestions"
              :key="suggestion"
              clickable
              outline
              color="primary"
              :disable="status !== 'completed'"
              @click="selectSuggestion(suggestion)"
            >
              {{ suggestion }}
            </q-chip>
          </div>
        </div>

        <div v-else class="column">
          <template v-for="message in messages" :key="message.id">
            <q-chat-message
              name="You"
              sent
              bg-color="primary"
              text-color="white"
            >
              <div class="message-copy">{{ message.question }}</div>
            </q-chat-message>

            <q-chat-message
              name="DocIntel"
              :bg-color="
                message.failed
                  ? $q.dark.isActive
                    ? 'red-10'
                    : 'red-1'
                  : $q.dark.isActive
                    ? 'grey-9'
                    : 'grey-2'
              "
              :text-color="
                message.failed
                  ? $q.dark.isActive
                    ? 'red-2'
                    : 'negative'
                  : $q.dark.isActive
                    ? 'white'
                    : 'dark'
              "
            >
              <div v-if="message.pending" class="row items-center q-gutter-sm">
                <q-spinner-dots size="25px" color="primary" />
                <span class="text-caption">Reading the document…</span>
              </div>

              <div v-else-if="message.failed">
                <div class="row items-center q-gutter-xs text-weight-medium">
                  <q-icon name="error_outline" />
                  <span>Response failed</span>
                </div>
                <div class="text-caption q-mt-xs">
                  {{ message.errorMessage || "Please try again." }}
                </div>
                <q-btn
                  flat
                  dense
                  no-caps
                  color="negative"
                  icon="refresh"
                  label="Retry"
                  class="q-mt-sm"
                  @click="requestAnswer(message)"
                />
              </div>

              <div v-else class="message-copy ai-response">
                {{ message.answer }}
              </div>
            </q-chat-message>

            <q-expansion-item
              v-if="message.sources.length && !message.pending"
              dense
              expand-separator
              icon="menu_book"
              :label="`View ${message.sources.length} source${message.sources.length === 1 ? '' : 's'}`"
              class="q-mb-md"
            >
              <q-list bordered separator class="rounded-borders">
                <q-item
                  v-for="source in message.sources"
                  :key="source.chunk_id"
                >
                  <q-item-section avatar top>
                    <q-avatar
                      size="34px"
                      color="primary"
                      text-color="white"
                      icon="article"
                    />
                  </q-item-section>
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
        </div>
      </div>
    </q-scroll-area>

    <q-separator />

    <q-card-section>
      <q-banner
        v-if="status !== 'completed'"
        dense
        rounded
        :class="
          $q.dark.isActive
            ? 'bg-grey-9 text-grey-4'
            : 'bg-grey-2 text-grey-8'
        "
        class="q-mb-md"
      >
        <template #avatar><q-icon name="hourglass_top" /></template>
        Chat becomes available when processing is complete.
      </q-banner>

      <q-input
        ref="questionInput"
        v-model="question"
        outlined
        type="textarea"
        autogrow
        hide-bottom-space
        placeholder="Message DocIntel..."
        :disable="status !== 'completed'"
        @keydown.enter.exact.prevent="askQuestion"
      >
        <template #append>
          <q-btn
            round
            unelevated
            icon="send"
            color="primary"
            :loading="asking"
            :disable="!question.trim() || asking || status !== 'completed'"
            aria-label="Send question"
            @click="askQuestion"
          />
        </template>
      </q-input>

      <div v-if="$q.screen.gt.xs" class="row items-center q-mt-xs">
        <span class="text-caption text-grey-7">
          Enter to send · Shift + Enter for a new line
        </span>
        <q-space />
        <span v-if="asking" class="text-caption text-primary">
          You can prepare your next question while DocIntel responds.
        </span>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.conversation-area {
  height: clamp(400px, 58vh, 660px);
  overscroll-behavior: contain;
}

.message-copy {
  max-width: 72ch;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.ai-response {
  line-height: 1.65;
}
</style>
