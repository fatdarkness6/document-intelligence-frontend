<script setup lang="ts">
import { registerSchema } from "~/schemas/auth.schema";
import { normalizeApiError } from "~/utils/normalizeApiError";

definePageMeta({
  layout: "auth",
  middleware: "guest",
});

const authStore = useAuthStore();
const $q = useQuasar();

const loading = ref(false);

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

    $q.notify({
      type: "positive",
      message: "Account created successfully",
    });

    await navigateTo("/login");
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
      <div class="text-h5 text-weight-bold">Create account</div>

      <div class="text-grey-7 q-mt-xs">Start using Document Intelligence</div>
    </q-card-section>

    <q-card-section>
      <CommonFormsFormBuilder
        :schema="registerSchema"
        :on-submit="handleSubmit"
        :input-props="{
          color: 'primary',
          class: 'q-mb-sm',
        }"
      >
        <q-btn
          type="submit"
          label="Create account"
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
