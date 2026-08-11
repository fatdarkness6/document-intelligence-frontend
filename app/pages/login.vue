<script setup lang="ts">
import { loginSchema } from "~/schemas/auth.schema";
import { normalizeApiError } from "~/utils/normalizeApiError";

definePageMeta({
  layout: "auth",
  middleware: "guest",
});

const authStore = useAuthStore();
const $q = useQuasar();

const loading = ref(false);

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
  <q-card flat bordered class="full-width q-pa-lg" style="max-width: 420px">
    <q-card-section>
      <div class="text-h5 text-weight-bold">Welcome back</div>

      <div class="text-grey-7 q-mt-xs">Sign in to your account</div>
    </q-card-section>

    <q-card-section>
      <CommonFormsFormBuilder
        :schema="loginSchema"
        :on-submit="handleSubmit"
        :input-props="{
          color: 'primary',
          class: 'q-mb-sm',
        }"
      >
        <q-btn
          type="submit"
          label="Sign in"
          color="primary"
          unelevated
          no-caps
          class="full-width q-mt-md"
          :loading="loading"
        />
      </CommonFormsFormBuilder>
    </q-card-section>
  </q-card>
</template>
