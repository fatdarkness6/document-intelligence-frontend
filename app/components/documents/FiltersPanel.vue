<script setup lang="ts">
import type { Folder } from "~/types/folder";
import type { Tag } from "~/types/tag";

const props = defineProps<{
  folders: Folder[];
  tags: Tag[];
  activeSearch: string;
  hasActiveFilters: boolean;
}>();

const emit = defineEmits<{ clear: []; clearSearch: [] }>();
const search = defineModel<string>("search", { required: true });
const folder = defineModel<number | null>("folder", { required: true });
const tag = defineModel<number | null>("tag", { required: true });
const favorite = defineModel<boolean>("favorite", { required: true });

const $q = useQuasar();
const filtersExpanded = ref(true);

const selectedFolderName = computed(
  () => props.folders.find((item) => item.id === folder.value)?.name,
);
const selectedTagName = computed(
  () => props.tags.find((item) => item.id === tag.value)?.name,
);
</script>

<template>
  <q-card flat bordered>
    <q-card-section class="row items-center q-pb-sm">
      <q-avatar
        :color="$q.dark.isActive ? 'grey-9' : 'indigo-1'"
        text-color="primary"
        icon="filter_alt"
        size="42px"
      />
      <div class="q-ml-md">
        <div class="text-subtitle1 text-weight-bold">Find a document</div>
        <div v-if="$q.screen.gt.xs" class="text-caption text-grey-7">
          Search by name or narrow the library with your collections.
        </div>
      </div>
      <q-space />
      <q-btn
        v-if="hasActiveFilters"
        flat
        dense
        no-caps
        color="primary"
        icon="filter_alt_off"
        :label="$q.screen.gt.xs ? 'Clear filters' : undefined"
        aria-label="Clear filters"
        @click="emit('clear')"
      />
      <q-btn
        v-if="$q.screen.lt.md"
        flat
        round
        dense
        :icon="filtersExpanded ? 'expand_less' : 'expand_more'"
        aria-label="Toggle filters"
        @click="filtersExpanded = !filtersExpanded"
      />
    </q-card-section>

    <q-slide-transition>
      <div v-show="$q.screen.gt.sm || filtersExpanded">
        <q-card-section>
          <div class="row q-col-gutter-md items-center">
            <div class="col-12 col-md-6 col-lg-5">
              <q-input
                v-model="search"
                outlined
                clearable
                hide-bottom-space
                placeholder="Search documents..."
              >
                <template #prepend><q-icon name="search" /></template>
              </q-input>
            </div>

            <div class="col-12 col-sm-6 col-md-3 col-lg-2">
              <q-select
                v-model="folder"
                :options="folders"
                option-label="name"
                option-value="id"
                emit-value
                map-options
                clearable
                outlined
                hide-bottom-space
                label="Folder"
              >
                <template #prepend><q-icon name="folder_open" /></template>
              </q-select>
            </div>

            <div class="col-12 col-sm-6 col-md-3 col-lg-2">
              <q-select
                v-model="tag"
                :options="tags"
                option-label="name"
                option-value="id"
                emit-value
                map-options
                clearable
                outlined
                hide-bottom-space
                label="Tag"
              >
                <template #prepend><q-icon name="sell" /></template>
              </q-select>
            </div>

            <div class="col-12 col-lg-3">
              <q-item
                tag="label"
                clickable
                dense
                class="rounded-borders q-py-sm"
                :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
              >
                <q-item-section avatar>
                  <q-icon
                    :name="favorite ? 'star' : 'star_outline'"
                    color="amber"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Favorites only</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="favorite" color="amber" />
                </q-item-section>
              </q-item>
            </div>
          </div>
        </q-card-section>

        <template v-if="hasActiveFilters">
          <q-separator />
          <q-card-section class="row items-center q-gutter-sm q-py-sm">
            <span class="text-caption text-weight-bold text-grey-7">ACTIVE</span>
            <q-chip
              v-if="activeSearch"
              removable
              icon="search"
              color="primary"
              text-color="white"
              @remove="emit('clearSearch')"
            >
              {{ activeSearch }}
            </q-chip>
            <q-chip v-if="selectedFolderName" removable icon="folder" @remove="folder = null">
              {{ selectedFolderName }}
            </q-chip>
            <q-chip v-if="selectedTagName" removable icon="sell" @remove="tag = null">
              {{ selectedTagName }}
            </q-chip>
            <q-chip v-if="favorite" removable icon="star" @remove="favorite = false">
              Favorites
            </q-chip>
          </q-card-section>
        </template>
      </div>
    </q-slide-transition>
  </q-card>
</template>
