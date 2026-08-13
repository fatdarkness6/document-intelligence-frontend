<script setup lang="ts">
import type { Tag } from "~/types/tag";

const model = defineModel<boolean>();

const emit = defineEmits<{
  changed: [];
}>();

const tagsApi = useTags();
const feedback = useAppFeedback();

const tags = ref<Tag[]>([]);
const loading = ref(false);

const newTagName = ref("");
const editingId = ref<number | null>(null);
const editingName = ref("");

async function loadTags() {
  loading.value = true;

  try {
    tags.value = await tagsApi.getTags();
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    loading.value = false;
  }
}

async function handleCreate() {
  const name = newTagName.value.trim();

  if (!name) return;

  try {
    await tagsApi.createTag(name);

    newTagName.value = "";

    await loadTags();
    emit("changed");

    feedback.success("Tag created");
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  }
}

function startRename(tag: Tag) {
  editingId.value = tag.id;
  editingName.value = tag.name;
}

async function handleRename(tagId: number) {
  const name = editingName.value.trim();

  if (!name) return;

  try {
    await tagsApi.renameTag(tagId, name);

    editingId.value = null;
    editingName.value = "";

    await loadTags();
    emit("changed");

    feedback.success("Tag renamed");
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  }
}

function handleDelete(tag: Tag) {
  feedback
    .confirm({
      title: "Delete tag?",
      message: `Delete "${tag.name}"?`,
    })
    .onOk(async () => {
      try {
        await tagsApi.deleteTag(tag.id);

        await loadTags();
        emit("changed");

        feedback.success("Tag deleted");
      } catch (error) {
        feedback.error(normalizeApiError(error).message);
      }
    });
}

watch(model, (open) => {
  if (open) {
    loadTags();
  }
});
</script>

<template>
  <q-dialog v-model="model">
    <q-card style="width: 560px; max-width: 92vw">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">Manage tags</div>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-card-section>

      <q-separator />

      <!-- Create -->
      <q-card-section>
        <div class="row q-col-gutter-sm items-center">
          <div class="col">
            <q-input
              v-model="newTagName"
              outlined
              label="New tag"
              @keyup.enter="handleCreate"
            />
          </div>

          <div class="col-auto">
            <q-btn
              color="primary"
              icon="new_label"
              label="Create"
              unelevated
              :disable="!newTagName.trim()"
              @click="handleCreate"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Loading -->
      <q-card-section v-if="loading">
        <q-skeleton
          v-for="item in 4"
          :key="item"
          type="rect"
          height="52px"
          class="q-mb-sm"
        />
      </q-card-section>

      <!-- Empty -->
      <q-card-section
        v-else-if="!tags.length"
        class="text-center text-grey-7 q-py-xl"
      >
        No tags yet.
      </q-card-section>

      <!-- List -->
      <q-list v-else separator>
        <q-item v-for="tag in tags" :key="tag.id">
          <q-item-section avatar>
            <q-icon name="label" color="primary" />
          </q-item-section>

          <q-item-section>
            <q-input
              v-if="editingId === tag.id"
              v-model="editingName"
              dense
              outlined
              autofocus
              @keyup.enter="handleRename(tag.id)"
            />

            <q-item-label v-else>
              {{ tag.name }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row q-gutter-xs">
              <template v-if="editingId === tag.id">
                <q-btn
                  flat
                  round
                  dense
                  icon="check"
                  color="positive"
                  @click="handleRename(tag.id)"
                />

                <q-btn
                  flat
                  round
                  dense
                  icon="close"
                  @click="editingId = null"
                />
              </template>

              <template v-else>
                <q-btn flat round dense icon="edit" @click="startRename(tag)" />

                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  @click="handleDelete(tag)"
                />
              </template>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>
</template>
