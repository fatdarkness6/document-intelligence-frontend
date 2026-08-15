import { QSpinnerOrbit } from "quasar";

const NAVIGATION_LOADING_GROUP = "page-navigation";

export default defineNuxtPlugin((nuxtApp) => {
  const $q = useQuasar();
  const router = useRouter();

  function loadingMessage() {
    const path = router.currentRoute.value.path;

    if (/^\/documents\/[^/]+$/.test(path)) return "Opening document workspace…";
    if (path.startsWith("/documents")) return "Loading document library…";
    if (path === "/dashboard") return "Loading dashboard…";
    if (path === "/settings") return "Loading settings…";

    return "Loading page…";
  }

  function showNavigationLoading() {
    $q.loading.show({
      group: NAVIGATION_LOADING_GROUP,
      delay: 120,
      message: loadingMessage(),
      spinner: QSpinnerOrbit,
      spinnerColor: "primary",
      spinnerSize: 52,
      customClass: "app-navigation-loading",
      boxClass: "app-navigation-loading__box",
    });
  }

  function hideNavigationLoading() {
    $q.loading.hide(NAVIGATION_LOADING_GROUP);
  }

  nuxtApp.hook("page:start", showNavigationLoading);
  nuxtApp.hook("page:finish", hideNavigationLoading);
  nuxtApp.hook("app:error", hideNavigationLoading);
  router.onError(hideNavigationLoading);
});
