export default defineNuxtConfig({
  modules: ["nuxt-quasar-ui", "@pinia/nuxt"],

  runtimeConfig: {
    public: {
      apiBase: "",
    },
  },

  css: [
    "@fontsource-variable/inter",
    "@fontsource-variable/vazirmatn",
    "~/assets/styles/app.scss",
  ],

  quasar: {
    plugins: ["Dialog", "Notify", "Loading"],

    iconSet: "material-icons",

    extras: {
      fontIcons: ["material-icons"],
    },

    config: {
      notify: {
        position: "top-right",
        timeout: 3000,
      },

      loading: {
        delay: 250,
      },
    },
  },
});
