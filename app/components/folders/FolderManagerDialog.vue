<script setup lang="ts">
import type { Folder } from "~/types/folder";

const model = defineModel<boolean>();

const emit = defineEmits<{
  changed: [];
}>();

const foldersApi = useFolders();
const feedback = useAppFeedback();

const folders = ref<Folder[]>([]);
const loading = ref(false);
const newFolderName = ref("");
const editingId = ref<number | null>(null);
const editingName = ref("");

async function loadFolders() {
  loading.value = true;

  try {
    folders.value = await foldersApi.getFolders();
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  } finally {
    loading.value = false;
  }
}

async function handleCreate() {
  const name = newFolderName.value.trim();

  if (!name) return;

  try {
    await foldersApi.createFolder(name);

    newFolderName.value = "";

    await loadFolders();
    emit("changed");

    feedback.success("Folder created");
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  }
}

function startRename(folder: Folder) {
  editingId.value = folder.id;
  editingName.value = folder.name;
}

async function handleRename(folderId: number) {
  const name = editingName.value.trim();

  if (!name) return;

  try {
    await foldersApi.renameFolder(folderId, name);

    editingId.value = null;
    editingName.value = "";

    await loadFolders();
    emit("changed");

    feedback.success("Folder renamed");
  } catch (error) {
    feedback.error(normalizeApiError(error).message);
  }
}

async function handleDelete(folder: Folder) {
  feedback
    .confirm({
      title: "Delete folder?",
      message: `Delete "${folder.name}"? Documents inside it will not be deleted.`,
    })
    .onOk(async () => {
      try {
        await foldersApi.deleteFolder(folder.id);

        await loadFolders();
        emit("changed");

        feedback.success("Folder deleted");
      } catch (error) {
        feedback.error(normalizeApiError(error).message);
      }
    });
}

watch(model, (open) => {
  if (open) {
    loadFolders();
  }
});
</script>

<template>
  <q-dialog v-model="model">
    <q-card style="width: 560px; max-width: 92vw">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">Manage folders</div>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-card-section>

      <q-separator />

      <!-- Create -->
      <q-card-section>
        <div class="row q-col-gutter-sm items-center">
          <div class="col">
            <q-input
              v-model="newFolderName"
              outlined
              label="New folder"
              @keyup.enter="handleCreate"
            />
          </div>

          <div class="col-auto">
            <q-btn
              color="primary"
              icon="create_new_folder"
              label="Create"
              unelevated
              :disable="!newFolderName.trim()"
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
        v-else-if="!folders.length"
        class="text-center text-grey-7 q-py-xl"
      >
        No folders yet.
      </q-card-section>

      <!-- Folder list -->
      <q-list v-else separator>
        <q-item v-for="folder in folders" :key="folder.id">
          <q-item-section avatar>
            <q-icon name="folder" color="primary" />
          </q-item-section>

          <q-item-section>
            <q-input
              v-if="editingId === folder.id"
              v-model="editingName"
              dense
              outlined
              autofocus
              @keyup.enter="handleRename(folder.id)"
            />

            <q-item-label v-else>
              {{ folder.name }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row q-gutter-xs">
              <template v-if="editingId === folder.id">
                <q-btn
                  flat
                  round
                  dense
                  icon="check"
                  color="positive"
                  @click="handleRename(folder.id)"
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
                <q-btn
                  flat
                  round
                  dense
                  icon="edit"
                  @click="startRename(folder)"
                />

                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  @click="handleDelete(folder)"
                />
              </template>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>
</template>
