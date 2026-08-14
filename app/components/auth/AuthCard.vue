<script setup lang="ts">
interface AuthBenefit {
  icon: string;
  title: string;
  description: string;
}

defineProps<{
  eyebrow: string;
  title: string;
  description: string;
  panelTitle: string;
  panelDescription: string;
  benefits: AuthBenefit[];
  switchPrompt: string;
  switchLabel: string;
  switchTo: string;
}>();

const $q = useQuasar();
</script>

<template>
  <q-card flat bordered class="auth-card app-card full-width overflow-hidden">
    <div class="row items-stretch full-height">
      <q-card-section
        v-if="$q.screen.gt.sm"
        class="auth-showcase col-md-5 column justify-between q-pa-xl text-white"
      >
        <div>
          <q-chip
            outline
            color="white"
            text-color="white"
            icon="auto_awesome"
            :label="eyebrow"
          />

          <div class="text-h4 text-weight-bold q-mt-lg auth-showcase__title">
            {{ panelTitle }}
          </div>
          <p class="text-body1 q-mt-md auth-showcase__description">
            {{ panelDescription }}
          </p>

          <q-list class="q-mt-xl">
            <q-item
              v-for="benefit in benefits"
              :key="benefit.title"
              class="q-px-none q-py-md"
            >
              <q-item-section avatar top>
                <q-avatar
                  size="42px"
                  color="white"
                  text-color="primary"
                  :icon="benefit.icon"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">
                  {{ benefit.title }}
                </q-item-label>
                <q-item-label class="auth-showcase__description" caption>
                  {{ benefit.description }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="row items-center q-gutter-sm text-caption">
          <q-icon name="verified_user" size="20px" />
          <span>Your workspace stays private and secure.</span>
        </div>
      </q-card-section>

      <q-card-section
        class="col-12 col-md-7 column justify-center"
        :class="$q.screen.lt.sm ? 'q-pa-lg' : 'q-pa-xl'"
      >
        <div class="auth-form full-width q-mx-auto">
          <q-chip
            v-if="$q.screen.lt.md"
            dense
            color="primary"
            text-color="white"
            icon="auto_awesome"
            :label="eyebrow"
            class="q-mb-md"
          />

          <div
            :class="$q.screen.lt.sm ? 'text-h5' : 'text-h4'"
            class="text-weight-bold"
          >
            {{ title }}
          </div>
          <div class="text-body1 text-grey-7 q-mt-sm q-mb-xl">
            {{ description }}
          </div>

          <slot />

          <div class="row items-center q-my-lg">
            <q-separator class="col" />
            <span class="text-caption text-grey-7 q-px-md">or</span>
            <q-separator class="col" />
          </div>

          <div class="row items-center justify-center q-gutter-sm text-center">
            <span class="text-body2 text-grey-7">{{ switchPrompt }}</span>
            <q-btn
              flat
              dense
              no-caps
              color="primary"
              :label="switchLabel"
              :to="switchTo"
            />
          </div>

          <div
            v-if="$q.screen.lt.md"
            class="row items-center justify-center q-gutter-xs text-caption text-grey-7 q-mt-lg"
          >
            <q-icon name="verified_user" color="positive" size="18px" />
            <span>Private and secure document intelligence</span>
          </div>
        </div>
      </q-card-section>
    </div>
  </q-card>
</template>

<style scoped>
.auth-card {
  max-width: 1080px;
  min-height: 650px;
  border-radius: 24px;
  box-shadow: 0 24px 70px rgb(15 23 42 / 10%);
}

.auth-showcase {
  position: relative;
  background:
    radial-gradient(circle at 90% 10%, rgb(255 255 255 / 20%), transparent 28%),
    linear-gradient(145deg, #4338ca 0%, #6366f1 48%, #7c3aed 100%);
}

.auth-showcase__title {
  max-width: 390px;
  line-height: 1.2;
}

.auth-showcase__description {
  color: rgb(255 255 255 / 76%) !important;
  line-height: 1.7;
}

.auth-form {
  max-width: 460px;
}
</style>
