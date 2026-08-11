export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBase,

    onRequest({ options }) {
      const accessToken = useCookie<string | null>("docintel.access-token");

      if (!accessToken.value) return;

      const headers = new Headers(options.headers);

      headers.set("Authorization", `Bearer ${accessToken.value}`);

      options.headers = headers;
    },

    async onResponseError({ request, response }) {
      if (response.status !== 401) return;
      if (String(request).includes("/auth/login")) return;

      const accessToken = useCookie<string | null>("docintel.access-token");

      accessToken.value = null;

      if (import.meta.client) {
        await navigateTo("/login");
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
