export default defineNuxtPlugin(() => {
  const $q = useQuasar();
  const { darkMode } = useAppPreferences();

  watch(
    darkMode,
    (enabled) => {
      $q.dark.set(enabled);
    },
    { immediate: true },
  );
});
