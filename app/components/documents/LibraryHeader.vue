<script setup lang="ts">
const props = defineProps<{
  documentCount: number;
  folderCount: number;
  favoriteCount: number;
  processingCount: number;
  filtered: boolean;
}>();

const emit = defineEmits<{
  manageFolders: [];
  manageTags: [];
  upload: [];
}>();

const $q = useQuasar();

const stats = computed(() => [
  {
    label: "Documents",
    icon: "description",
    value: props.documentCount,
    color: "primary",
  },
  {
    label: "Folders",
    icon: "folder_open",
    value: props.folderCount,
    color: "secondary",
  },
  {
    label: "Favorites here",
    icon: "star",
    value: props.favoriteCount,
    color: "amber",
  },
  {
    label: "Processing now",
    icon: props.processingCount ? "sync" : "task_alt",
    value: props.processingCount,
    color: "positive",
  },
]);
</script>

<template>
  <q-card flat class="library-hero text-white overflow-hidden">
    <q-card-section :class="$q.screen.lt.sm ? 'q-pa-lg' : 'q-pa-xl'">
      <div class="row items-end q-col-gutter-xl">
        <div class="col-12 col-md">
          <q-chip
            dense
            icon="auto_awesome"
            label="Intelligent workspace"
            class="hero-chip q-ma-none"
          />

          <div
            :class="$q.screen.lt.sm ? 'text-h4' : 'text-h3'"
            class="text-weight-bold q-mt-md"
          >
            Your document library
          </div>
          <div class="text-subtitle1 hero-description q-mt-sm">
            Search, organize, and open every document in one focused workspace.
          </div>
        </div>

        <div class="col-12 col-md-auto">
          <div class="row q-col-gutter-sm">
            <div class="col-6 col-sm-auto">
              <q-btn
                outline
                no-caps
                icon="create_new_folder"
                :label="$q.screen.xs ? 'Folders' : 'Manage folders'"
                class="full-width"
                @click="emit('manageFolders')"
              />
            </div>
            <div class="col-6 col-sm-auto">
              <q-btn
                outline
                no-caps
                icon="sell"
                :label="$q.screen.xs ? 'Tags' : 'Manage tags'"
                class="full-width"
                @click="emit('manageTags')"
              />
            </div>
            <div class="col-12 col-sm-auto">
              <q-btn
                unelevated
                no-caps
                color="white"
                text-color="primary"
                icon="upload_file"
                label="Upload document"
                class="full-width"
                @click="emit('upload')"
              />
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>

  <div class="row q-col-gutter-sm q-mt-sm">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="col-6 col-md-3"
    >
      <q-card flat bordered class="full-height">
        <q-item :dense="$q.screen.xs" class="q-py-md">
          <q-item-section avatar>
            <q-avatar
              :color="$q.dark.isActive ? 'grey-9' : `${stat.color}-1`"
              :text-color="stat.color"
              :icon="stat.icon"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6 text-weight-bold">
              {{ stat.value }}
            </q-item-label>
            <q-item-label caption lines="1">
              {{ filtered && stat.label === "Documents" ? "Matching documents" : stat.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
    </div>
  </div>
</template>

<style scoped>
.library-hero {
  background: linear-gradient(125deg, #342e88, #6150be 56%, #8557c7);
  border-radius: 20px;
  box-shadow: 0 16px 42px rgb(67 56 152 / 22%);
}

.hero-chip {
  color: white;
  background: rgb(255 255 255 / 15%);
}

.hero-description {
  max-width: 620px;
  color: rgb(255 255 255 / 78%);
}
</style>
