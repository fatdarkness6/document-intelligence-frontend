<template>
  <q-layout class="auth-layout">
    <q-page-container>
      <div class="auth-layout__content">
        <slot />
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="scss">
.auth-layout {
  background: var(--app-background);
}

.auth-layout__content {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
</style>
