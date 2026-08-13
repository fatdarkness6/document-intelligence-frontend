<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-white text-dark">
      <q-toolbar class="public-toolbar">
        <!-- Left -->
        <div class="header-left">
          <NuxtLink to="/" class="brand-link"> DocIntel </NuxtLink>
        </div>

        <!-- Center -->
        <div class="header-center gt-sm">
          <q-btn flat no-caps label="Features" href="#features" />

          <q-btn flat no-caps label="How it works" href="#how-it-works" />

          <q-btn flat no-caps label="Security" href="#security" />
        </div>

        <!-- Right -->
        <div class="header-right">
          <slot name="header-actions" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <slot />
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="scss">
.public-toolbar {
  width: min(100% - 48px, 1590px);
  min-height: 82px;
  margin-inline: auto;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

.header-left {
  justify-self: start;
}

.header-center {
  justify-self: center;

  display: flex;
  align-items: center;
  gap: 20px;
}

.header-right {
  justify-self: end;
}

.brand-link {
  color: var(--app-text);
  text-decoration: none;
  font-size: 28px;
  font-weight: 700;
}

@media (max-width: 1023px) {
  .public-toolbar {
    width: calc(100% - 32px);
    grid-template-columns: 1fr auto;
  }

  .header-right {
    grid-column: 2;
  }
}
</style>
