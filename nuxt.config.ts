export default defineNuxtConfig({
  modules: ["nuxt-quasar-ui", "@pinia/nuxt"],

  app: {
    head: {
      title: "DocIntel",
      titleTemplate: "%s | DocIntel",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        {
          name: "description",
          content:
            "Analyze documents, ask grounded questions, and organize useful insights with DocIntel.",
        },
        { name: "application-name", content: "DocIntel" },
        { name: "theme-color", content: "#4F46E5" },
        { name: "color-scheme", content: "light dark" },
        { property: "og:site_name", content: "DocIntel" },
        { property: "og:locale", content: "en_US" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.svg" },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "mask-icon", href: "/favicon.svg", color: "#4F46E5" },
      ],
    },

    pageTransition: {
      name: "page",
      mode: "out-in",
    },

    layoutTransition: {
      name: "layout",
      mode: "out-in",
    },
  },

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
