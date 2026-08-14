<script setup lang="ts">
import { changePasswordSchema } from "~/schemas/security.schema";

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const $q = useQuasar();
const authSecurity = useAuthSecurity();
const feedback = useAppFeedback();
const submitting = ref(false);

async function handleSubmit(
  values: ChangePasswordForm,
  resetForm?: () => void,
) {
  if (submitting.value) return;

  submitting.value = true;

  try {
    await authSecurity.changePassword({
      current_password: values.currentPassword,
      new_password: values.newPassword,
    });

    resetForm?.();
    feedback.success("Your password was changed successfully.");
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <q-card flat bordered>
    <q-item :class="$q.screen.lt.sm ? 'q-pa-md' : 'q-pa-lg'">
      <q-item-section avatar>
        <q-avatar
          :color="$q.dark.isActive ? 'grey-9' : 'indigo-1'"
          text-color="primary"
          icon="password"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6 text-weight-bold">
          Change password
        </q-item-label>
        <q-item-label caption>
          Update the password used to access your DocIntel account.
        </q-item-label>
      </q-item-section>
      <q-item-section v-if="$q.screen.gt.xs" side>
        <q-chip dense outline color="primary" icon="shield" label="Security" />
      </q-item-section>
    </q-item>

    <q-separator />

    <q-card-section :class="$q.screen.lt.sm ? 'q-pa-md' : 'q-pa-lg'">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4">
          <q-banner
            rounded
            :class="
              $q.dark.isActive
                ? 'bg-blue-10 text-blue-2'
                : 'bg-blue-1 text-blue-9'
            "
          >
            <template #avatar>
              <q-icon name="security" color="primary" size="26px" />
            </template>
            <div class="text-subtitle2 text-weight-bold">
              Choose a secure password
            </div>
            <div class="text-caption q-mt-xs">
              Use a unique password that you do not reuse on another account.
            </div>
          </q-banner>
        </div>

        <div class="col-12 col-md-8">
          <CommonFormsFormBuilder
            :schema="changePasswordSchema"
            :on-submit="handleSubmit"
            :input-props="{
              color: 'primary',
              class: 'q-mb-sm',
            }"
          >
            <div
              class="row items-center q-gutter-sm"
              :class="$q.screen.lt.sm ? 'justify-center' : 'justify-end'"
            >
              <q-btn
                type="submit"
                unelevated
                no-caps
                color="primary"
                icon="password"
                label="Change password"
                :loading="submitting"
                :class="$q.screen.lt.sm ? 'full-width' : ''"
              >
                <template #loading>
                  <q-spinner-dots />
                </template>
              </q-btn>
            </div>
          </CommonFormsFormBuilder>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
