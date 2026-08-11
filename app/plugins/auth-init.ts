// app/plugins/auth-init.ts

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  if (!authStore.accessToken) return;

  try {
    await authStore.fetchCurrentUser();
  } catch {
    authStore.clearAuth();
  }
});
