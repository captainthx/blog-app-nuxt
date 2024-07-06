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
    "dayjs-nuxt",
  ],
  dayjs: {
    locales: ["en", "th"],
    plugins: ["relativeTime", "utc", "timezone"],
    defaultLocale: "en",
    defaultTimezone: "Asia/Bangkok",
  },
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
