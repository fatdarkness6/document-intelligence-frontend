<script setup lang="ts">
defineProps<{
  email?: string;
  accountId?: number;
  initial: string;
}>();

const $q = useQuasar();
</script>

<template>
  <q-card flat bordered class="full-height">
    <q-card-section class="text-center q-pa-xl">
      <q-avatar size="76px" class="account-avatar text-white text-weight-bold">
        {{ initial }}
      </q-avatar>

      <div class="text-h6 text-weight-bold q-mt-md">Your account</div>
      <div class="text-body2 text-grey-7 ellipsis q-mt-xs" :title="email">
        {{ email ?? "Unavailable" }}
      </div>

      <q-chip
        :color="$q.dark.isActive ? 'green-10' : 'green-1'"
        :text-color="$q.dark.isActive ? 'green-2' : 'positive'"
        icon="verified_user"
        label="Active session"
        class="q-mt-md"
      />
    </q-card-section>

    <q-separator />

    <q-list separator>
      <q-item class="q-py-md">
        <q-item-section avatar>
          <q-avatar
            :color="$q.dark.isActive ? 'grey-9' : 'indigo-1'"
            text-color="primary"
            icon="mail"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label caption>Email</q-item-label>
          <q-item-label lines="1" :title="email">
            {{ email ?? "Unavailable" }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="q-py-md">
        <q-item-section avatar>
          <q-avatar
            :color="$q.dark.isActive ? 'grey-9' : 'purple-1'"
            text-color="secondary"
            icon="badge"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label caption>Account ID</q-item-label>
          <q-item-label>#{{ accountId ?? "—" }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-separator />

    <q-card-section>
      <q-banner
        dense
        rounded
        :class="
          $q.dark.isActive
            ? 'bg-blue-10 text-blue-2'
            : 'bg-blue-1 text-blue-9'
        "
      >
        <template #avatar>
          <q-icon name="info_outline" color="primary" />
        </template>
        Profile editing will appear when the account API supports it.
      </q-banner>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.account-avatar {
  font-size: 30px;
  background: linear-gradient(135deg, #4f46e5, #8b5cf6);
  box-shadow: 0 10px 24px rgb(79 70 229 / 24%);
}
</style>
