<script setup lang="ts">
import AuthCard from "~/components/auth/AuthCard.vue";
import { loginSchema } from "~/schemas/auth.schema";
import { normalizeApiError } from "~/utils/normalizeApiError";

definePageMeta({
  layout: "auth",
  middleware: "guest",
});

const authStore = useAuthStore();
const $q = useQuasar();
const route = useRoute();

const loading = ref(false);
const accountCreated = computed(() => route.query.registered === "1");

const benefits = [
  {
    icon: "forum",
    title: "Continue your conversations",
    description: "Return to grounded answers and document insights.",
  },
  {
    icon: "folder_open",
    title: "Everything organized",
    description: "Access your documents, folders, tags, and summaries.",
  },
  {
    icon: "insights",
    title: "Insights ready when you are",
    description: "Pick up your analysis without losing context.",
  },
];

async function handleSubmit(values: { email: string; password: string }) {
  loading.value = true;

  try {
    await authStore.login(values.email, values.password);
    await authStore.fetchCurrentUser();

    await navigateTo("/dashboard");
  } catch (error) {
    const apiError = normalizeApiError(error);

    $q.notify({
      type: "negative",
      message: apiError.message,
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <AuthCard
    eyebrow="Welcome back"
    title="Sign in to your workspace"
    description="Enter your details to continue working with your documents and AI conversations."
    panel-title="Your documents are ready for the next question."
    panel-description="Sign in to keep analyzing, organizing, and turning complex files into useful answers."
    :benefits="benefits"
    switch-prompt="New to DocIntel?"
    switch-label="Create an account"
    switch-to="/register"
  >
    <q-banner
      v-if="accountCreated"
      rounded
      dense
      :class="
        $q.dark.isActive
          ? 'bg-green-10 text-green-2'
          : 'bg-green-1 text-positive'
      "
      class="q-mb-lg"
    >
      <template #avatar>
        <q-icon name="check_circle" color="positive" />
      </template>
      Your account is ready. Sign in to continue.
    </q-banner>

    <CommonFormsFormBuilder
      :schema="loginSchema"
      :on-submit="handleSubmit"
      :input-props="{
        color: 'primary',
        class: 'q-mb-sm',
        hideBottomSpace: false,
      }"
    >
      <q-btn
        type="submit"
        label="Sign in"
        icon-right="arrow_forward"
        color="primary"
        unelevated
        no-caps
        size="lg"
        class="full-width q-mt-md"
        :loading="loading"
      >
        <template #loading>
          <q-spinner-dots />
        </template>
      </q-btn>
    </CommonFormsFormBuilder>
  </AuthCard>
</template>
