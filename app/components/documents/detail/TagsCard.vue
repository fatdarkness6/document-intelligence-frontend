<script setup lang="ts">
import type { Tag } from "~/types/tag";

const props = defineProps<{
  documentId: number;
  assignedTags: Tag[];
}>();

const emit = defineEmits<{ updated: [] }>();
const $q = useQuasar();
const documentsApi = useDocuments();
const tagsApi = useTags();
const feedback = useAppFeedback();

const selectedTag = ref<number | null>(null);
const loading = ref(false);

const { data: tags } = await useAsyncData("document-tags", () =>
  tagsApi.getTags(),
);

const availableTags = computed(() =>
  (tags.value ?? []).filter(
    (tag) => !props.assignedTags.some((assigned) => assigned.id === tag.id),
  ),
);

async function addTag() {
  if (selectedTag.value === null) return;
  loading.value = true;
  try {
    await documentsApi.addTag(props.documentId, selectedTag.value);
    selectedTag.value = null;
    emit("updated");
    feedback.success("Tag added");
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    loading.value = false;
  }
}

async function removeTag(tagId: number) {
  loading.value = true;
  try {
    await documentsApi.removeTag(props.documentId, tagId);
    emit("updated");
    feedback.success("Tag removed");
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <q-card flat bordered>
    <q-item>
      <q-item-section avatar>
        <q-avatar
          :color="$q.dark.isActive ? 'grey-9' : 'purple-1'"
          text-color="secondary"
          icon="sell"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-medium">Tags</q-item-label>
        <q-item-label caption>Label this document for faster discovery</q-item-label>
      </q-item-section>
    </q-item>

    <q-card-section class="q-pt-none">
      <div v-if="assignedTags.length" class="row q-gutter-xs q-mb-md">
        <q-chip
          v-for="tag in assignedTags"
          :key="tag.id"
          removable
          color="primary"
          text-color="white"
          :disable="loading"
          @remove="removeTag(tag.id)"
        >
          {{ tag.name }}
        </q-chip>
      </div>

      <q-banner
        v-else
        dense
        rounded
        :class="$q.dark.isActive ? 'bg-grey-9 text-grey-4' : 'bg-grey-2 text-grey-8'"
        class="q-mb-md"
      >
        No tags assigned yet.
      </q-banner>

      <div class="row q-col-gutter-sm items-center">
        <div class="col-12 col-sm">
          <q-select
            v-model="selectedTag"
            :options="availableTags"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            outlined
            clearable
            hide-bottom-space
            label="Add a tag"
          >
            <template #prepend><q-icon name="label_outline" /></template>
          </q-select>
        </div>

        <div class="col-12 col-sm-auto">
          <q-btn
            color="primary"
            icon="add"
            label="Add tag"
            no-caps
            unelevated
            :disable="selectedTag === null"
            :loading="loading"
            class="full-width"
            @click="addTag"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
