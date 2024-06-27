// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: { head: { script: [{ children: "var global = window" }] } },
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@nuxt/image",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Roboto: true,
          Mitr: { wght: [100, 400], ital: [100] },
        },
      },
    ],
  ],
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  runtimeConfig: {
    public: {
      baseURL: process.env.NUXT_PUBLIC_BASE_URL,
    },
  },
});
