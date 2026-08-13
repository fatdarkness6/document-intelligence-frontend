<script setup lang="ts">
definePageMeta({ middleware: "auth" });

useSeoMeta({ title: "Settings | DocIntel" });

const authStore = useAuthStore();
const feedback = useAppFeedback();
const { compactNavigation, darkMode } = useAppPreferences();

const accountInitial = computed(
  () => authStore.user?.email?.charAt(0).toUpperCase() || "U",
);

function confirmLogout() {
  feedback
    .confirm({
      title: "Sign out?",
      message: "You will need to sign in again to access your documents.",
    })
    .onOk(() => authStore.logout());
}
</script>

<template>
  <q-page class="settings-page">
    <div class="settings-shell">
      <section class="settings-hero">
        <div class="settings-hero__glow settings-hero__glow--one" />
        <div class="settings-hero__glow settings-hero__glow--two" />

        <div class="settings-hero__content">
          <q-badge class="settings-hero__badge">
            <q-icon name="tune" size="15px" class="q-mr-xs" />
            Workspace preferences
          </q-badge>

          <h1>Make DocIntel feel like yours.</h1>
          <p>
            Manage your account, shape your workspace, and control your current
            session from one place.
          </p>
        </div>

        <div class="settings-hero__mark">
          <q-icon name="auto_awesome" />
        </div>
      </section>

      <div class="settings-grid">
        <aside class="settings-profile">
          <q-card flat class="settings-card profile-card">
            <q-card-section class="text-center q-pa-xl">
              <q-avatar class="profile-avatar" size="76px">
                {{ accountInitial }}
              </q-avatar>

              <div class="text-h6 text-weight-bold q-mt-md">
                Your account
              </div>
              <div class="profile-email q-mt-xs">
                {{ authStore.user?.email ?? "Unavailable" }}
              </div>

              <q-chip
                color="green-1"
                text-color="positive"
                icon="verified_user"
                class="q-mt-md"
              >
                Active session
              </q-chip>
            </q-card-section>

            <q-separator />

            <q-list padding>
              <q-item>
                <q-item-section avatar>
                  <q-avatar color="indigo-1" text-color="primary" icon="mail" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Email</q-item-label>
                  <q-item-label class="profile-value">
                    {{ authStore.user?.email ?? "Unavailable" }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-avatar color="purple-1" text-color="secondary" icon="badge" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Account ID</q-item-label>
                  <q-item-label class="profile-value">
                    #{{ authStore.user?.id ?? "—" }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>

          <div class="account-note">
            <q-icon name="info_outline" size="19px" />
            <span>
              Profile editing and password controls will appear here when the
              account API supports them.
            </span>
          </div>
        </aside>

        <main class="settings-panels">
          <q-card flat class="settings-card preference-card">
            <q-card-section class="section-heading-row">
              <q-avatar color="indigo-1" text-color="primary" icon="palette" />
              <div>
                <div class="text-h6 text-weight-bold">Workspace appearance</div>
                <div class="text-grey-7">
                  Choose how information fits into your screen.
                </div>
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div class="preference-list">
                <label class="preference-option">
                <div class="preference-preview">
                  <div
                    class="preview-sidebar"
                    :class="{ 'preview-sidebar--compact': compactNavigation }"
                  >
                    <span v-for="item in 3" :key="item" />
                  </div>
                  <div class="preview-content">
                    <span class="preview-title" />
                    <div class="preview-cards">
                      <span v-for="item in 3" :key="item" />
                    </div>
                  </div>
                </div>

                <div class="preference-copy">
                  <div class="row items-center q-gutter-sm">
                    <span class="text-subtitle1 text-weight-bold">
                      Compact navigation
                    </span>
                    <q-badge color="primary" label="Desktop" />
                  </div>
                  <p>
                    Collapse the dashboard sidebar to icons and give documents,
                    tables, and chat more horizontal room.
                  </p>
                </div>

                  <q-toggle
                    v-model="compactNavigation"
                    color="primary"
                    size="lg"
                    aria-label="Compact navigation"
                  />
                </label>

                <label class="preference-option">
                  <div
                    class="theme-preview"
                    :class="{ 'theme-preview--dark': darkMode }"
                  >
                    <div class="theme-preview__header">
                      <span />
                      <div>
                        <span />
                        <span />
                      </div>
                    </div>
                    <div class="theme-preview__body">
                      <span v-for="item in 3" :key="item" />
                    </div>
                  </div>

                  <div class="preference-copy">
                    <div class="row items-center q-gutter-sm">
                      <span class="text-subtitle1 text-weight-bold">
                        Dark mode
                      </span>
                      <q-badge color="secondary" label="Theme" />
                    </div>
                    <p>
                      Switch the entire workspace to a low-light color palette
                      powered by Quasar dark mode.
                    </p>
                  </div>

                  <q-toggle
                    v-model="darkMode"
                    color="secondary"
                    size="lg"
                    aria-label="Dark mode"
                  />
                </label>
              </div>
            </q-card-section>

            <q-card-section class="preference-status">
              <div>
                <q-icon
                  :name="darkMode ? 'dark_mode' : 'light_mode'"
                  color="primary"
                />
                <span>{{ darkMode ? "Dark theme" : "Light theme" }}</span>
              </div>
              <div>
                <q-icon
                  :name="compactNavigation ? 'view_sidebar' : 'web'"
                  color="primary"
                />
                <span>
                  {{ compactNavigation ? "Compact sidebar" : "Full sidebar" }}
                </span>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat class="settings-card session-card">
            <q-card-section class="section-heading-row">
              <q-avatar color="red-1" text-color="negative" icon="shield" />
              <div>
                <div class="text-h6 text-weight-bold">Session & security</div>
                <div class="text-grey-7">
                  Manage access to DocIntel on this browser.
                </div>
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div class="session-action">
                <div class="session-action__icon">
                  <q-icon name="logout" size="24px" />
                </div>

                <div class="session-action__copy">
                  <div class="text-subtitle1 text-weight-bold">Sign out</div>
                  <div class="text-grey-7 q-mt-xs">
                    Remove the local session token and return to the login page.
                    Your documents will remain safely stored.
                  </div>
                </div>

                <q-btn
                  unelevated
                  color="negative"
                  icon="logout"
                  label="Sign out"
                  no-caps
                  class="session-action__button"
                  @click="confirmLogout"
                />
              </div>
            </q-card-section>
          </q-card>
        </main>
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.settings-page {
  min-height: 100%;
  background:
    radial-gradient(circle at 90% 10%, rgba(79, 70, 229, 0.07), transparent 28%),
    var(--app-background);
}

.settings-shell {
  width: min(1180px, calc(100% - 48px));
  margin-inline: auto;
  padding: 32px 0 64px;
}

.settings-hero {
  position: relative;
  min-height: 250px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 44px 48px;
  border-radius: 28px;
  color: white;
  background: linear-gradient(125deg, #312e81 0%, #4f46e5 48%, #7c3aed 100%);
  box-shadow: 0 24px 60px rgba(79, 70, 229, 0.22);
}

.settings-hero__content {
  position: relative;
  z-index: 2;
  max-width: 700px;

  h1 {
    margin: 18px 0 12px;
    font-size: clamp(34px, 5vw, 54px);
    line-height: 1.05;
    letter-spacing: -0.04em;
    font-weight: 750;
  }

  p {
    max-width: 620px;
    margin: 0;
    color: rgba(255, 255, 255, 0.78);
    font-size: 17px;
    line-height: 1.7;
  }
}

.settings-hero__badge {
  padding: 8px 11px;
  color: white;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(10px);
}

.settings-hero__mark {
  position: absolute;
  right: 68px;
  z-index: 2;
  display: grid;
  width: 116px;
  height: 116px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: rotate(8deg);

  .q-icon {
    font-size: 54px;
    transform: rotate(-8deg);
  }
}

.settings-hero__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(4px);
  background: rgba(255, 255, 255, 0.1);
}

.settings-hero__glow--one {
  top: -140px;
  right: -80px;
  width: 360px;
  height: 360px;
}

.settings-hero__glow--two {
  bottom: -160px;
  left: 38%;
  width: 300px;
  height: 300px;
}

.settings-grid {
  display: grid;
  grid-template-columns: minmax(260px, 0.75fr) minmax(0, 1.7fr);
  gap: 24px;
  align-items: start;
  margin-top: 24px;
}

.settings-panels {
  display: grid;
  gap: 24px;
}

.settings-card {
  overflow: hidden;
  border: 1px solid var(--app-border);
  border-radius: 22px;
  background: var(--app-surface);
  box-shadow: 0 12px 35px rgba(16, 24, 40, 0.055);
}

.profile-avatar {
  color: white;
  font-size: 30px;
  font-weight: 700;
  background: linear-gradient(135deg, #4f46e5, #8b5cf6);
  box-shadow: 0 12px 25px rgba(79, 70, 229, 0.25);
}

.profile-email,
.profile-value {
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-email {
  color: var(--app-text-secondary);
}

.account-note {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  padding: 14px 16px;
  border: 1px solid #dbeafe;
  border-radius: 14px;
  color: #475569;
  background: #eff6ff;
  font-size: 13px;
  line-height: 1.55;

  .q-icon {
    flex: 0 0 auto;
    color: #2563eb;
  }
}

.section-heading-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 24px;
}

.preference-option {
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr) auto;
  gap: 22px;
  align-items: center;
  padding: 18px;
  border: 1px solid #e0e7ff;
  border-radius: 18px;
  background: linear-gradient(135deg, #fafaff, #f5f3ff);
  cursor: pointer;
}

.preference-list {
  display: grid;
  gap: 14px;
}

.preference-copy p {
  margin: 8px 0 0;
  color: var(--app-text-secondary);
  line-height: 1.6;
}

.preference-preview {
  display: flex;
  height: 104px;
  overflow: hidden;
  border: 1px solid #d8dcf0;
  border-radius: 12px;
  background: white;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.08);
}

.preview-sidebar {
  width: 48px;
  padding: 14px 9px;
  background: #4f46e5;
  transition: width 0.25s ease;

  span {
    display: block;
    height: 6px;
    margin-bottom: 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.7);
  }
}

.preview-sidebar--compact {
  width: 28px;
  padding-inline: 8px;
}

.preview-content {
  flex: 1;
  padding: 16px 12px;
}

.theme-preview {
  height: 104px;
  overflow: hidden;
  border: 1px solid #d8dcf0;
  border-radius: 12px;
  background: #f8fafc;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.08);
  transition: 0.25s ease;
}

.theme-preview__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 28px;
  padding: 0 10px;
  border-bottom: 1px solid #e2e8f0;
  background: white;

  > span {
    width: 36px;
    height: 6px;
    border-radius: 999px;
    background: #4f46e5;
  }

  div {
    display: flex;
    gap: 4px;

    span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #cbd5e1;
    }
  }
}

.theme-preview__body {
  display: flex;
  gap: 7px;
  padding: 15px 10px;

  span {
    flex: 1;
    height: 44px;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    background: white;
  }
}

.theme-preview--dark {
  border-color: #334155;
  background: #0f172a;

  .theme-preview__header {
    border-color: #334155;
    background: #1e293b;
  }

  .theme-preview__body span {
    border-color: #334155;
    background: #1e293b;
  }
}

.preview-title {
  display: block;
  width: 58%;
  height: 9px;
  border-radius: 999px;
  background: #c7d2fe;
}

.preview-cards {
  display: flex;
  gap: 6px;
  margin-top: 18px;

  span {
    flex: 1;
    height: 45px;
    border-radius: 7px;
    background: #eef2ff;
  }
}

.preference-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  color: #475467;
  background: #f9fafb;
  font-size: 13px;

  > div {
    display: flex;
    align-items: center;
    gap: 7px;
  }
}

:global(.body--dark) {
  .settings-page {
    background:
      radial-gradient(circle at 90% 10%, rgba(124, 58, 237, 0.13), transparent 28%),
      var(--app-background);
  }

  .settings-card {
    border-color: var(--app-border);
    background: var(--app-surface);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
  }

  .account-note {
    border-color: #253b61;
    color: #bfdbfe;
    background: #17233a;
  }

  .preference-option {
    border-color: #373a67;
    background: linear-gradient(135deg, #191e35, #211c3a);
  }

  .preference-status {
    color: var(--app-text-secondary);
    background: var(--app-surface-alt);
  }

  .session-action {
    border-color: #542a34;
    background: #271820;
  }
}

.session-action {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 18px;
  border: 1px solid #fee2e2;
  border-radius: 18px;
  background: #fffafa;
}

.session-action__icon {
  display: grid;
  flex: 0 0 auto;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 14px;
  color: #dc2626;
  background: #fee2e2;
}

.session-action__copy {
  flex: 1;
}

@media (max-width: 1023px) {
  .settings-hero__mark {
    opacity: 0.45;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .settings-profile {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 16px;
  }

  .account-note {
    align-self: stretch;
    margin-top: 0;
  }
}

@media (max-width: 699px) {
  .settings-shell {
    width: min(100% - 28px, 1180px);
    padding-top: 18px;
  }

  .settings-hero {
    min-height: 280px;
    padding: 32px 24px;
    border-radius: 22px;
  }

  .settings-hero__mark {
    right: -24px;
    bottom: -24px;
    width: 100px;
    height: 100px;
  }

  .settings-profile {
    grid-template-columns: 1fr;
  }

  .preference-option {
    grid-template-columns: 1fr auto;
  }

  .preference-preview,
  .theme-preview {
    grid-column: 1 / -1;
    width: 100%;
  }

  .session-action {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .session-action__copy {
    min-width: calc(100% - 70px);
  }

  .session-action__button {
    width: 100%;
  }
}
</style>
