<script setup lang="ts">
import AuthCard from "~/components/auth/AuthCard.vue";
import { registerSchema } from "~/schemas/auth.schema";
import { normalizeApiError } from "~/utils/normalizeApiError";

definePageMeta({
  layout: "auth",
  middleware: "guest",
});

const authStore = useAuthStore();
const $q = useQuasar();

const loading = ref(false);

const benefits = [
  {
    icon: "upload_file",
    title: "Bring your documents",
    description: "Upload common formats and keep your knowledge together.",
  },
  {
    icon: "auto_awesome",
    title: "Ask better questions",
    description: "Receive answers grounded in the content you provide.",
  },
  {
    icon: "table_chart",
    title: "Understand structured data",
    description: "Explore spreadsheet summaries and useful insights.",
  },
];

async function handleSubmit(values: {
  email: string;
  password: string;
  confirmPassword: string;
}) {
  loading.value = true;

  try {
    await authStore.register({
      email: values.email,
      password: values.password,
    });

    await navigateTo({
      path: "/login",
      query: { registered: "1" },
    });
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
    eyebrow="Start with DocIntel"
    title="Create your account"
    description="Set up your secure workspace and turn your documents into clear, useful knowledge."
    panel-title="Move from reading documents to understanding them."
    panel-description="Build a searchable workspace where summaries, conversations, and insights stay organized."
    :benefits="benefits"
    switch-prompt="Already have an account?"
    switch-label="Sign in instead"
    switch-to="/login"
  >
    <CommonFormsFormBuilder
      :schema="registerSchema"
      :on-submit="handleSubmit"
      :input-props="{
        color: 'primary',
        class: 'q-mb-sm',
        hideBottomSpace: false,
      }"
    >
      <div class="row items-start no-wrap q-gutter-sm text-caption text-grey-7 q-mt-xs">
        <q-icon name="info_outline" color="primary" size="18px" />
        <span>Use at least 6 characters and choose a password unique to this account.</span>
      </div>

      <q-btn
        type="submit"
        label="Create account"
        icon-right="arrow_forward"
        color="primary"
        unelevated
        no-caps
        size="lg"
        class="full-width q-mt-lg"
        :loading="loading"
      >
        <template #loading>
          <q-spinner-dots />
        </template>
      </q-btn>
    </CommonFormsFormBuilder>
  </AuthCard>
</template>
