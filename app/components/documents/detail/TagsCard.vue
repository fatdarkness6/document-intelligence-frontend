<script setup lang="ts">
import type { Tag } from "~/types/tag";

const props = defineProps<{
  documentId: number;
  assignedTags: Tag[];
}>();

const emit = defineEmits<{
  updated: [];
}>();

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
  <q-card flat bordered class="full-height">
    <q-card-section>
      <div class="text-subtitle1 text-weight-medium q-mb-sm">Tags</div>

      <div v-if="assignedTags.length" class="row q-gutter-sm q-mb-md">
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

      <div v-else class="text-grey-7 q-mb-md">No tags assigned.</div>

      <div class="row q-col-gutter-sm items-center">
        <div class="col">
          <q-select
            v-model="selectedTag"
            :options="availableTags"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            outlined
            clearable
            label="Add tag"
          />
        </div>

        <div class="col-auto">
          <q-btn
            color="primary"
            icon="add"
            label="Add"
            unelevated
            :disable="selectedTag === null"
            :loading="loading"
            @click="addTag"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
