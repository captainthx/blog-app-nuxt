// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
        inject: true,
      },
    ],
    "dayjs-nuxt",
    "nuxt-tiptap-editor",
  ],
  dayjs: {
    locales: ["en", "th"],
    plugins: ["relativeTime", "utc", "timezone"],
    defaultLocale: "en",
    defaultTimezone: "Asia/Bangkok",
  },
  tiptap: {
    prefix: "Tiptap",
    lowlight: {
      theme: "github-dark",
    },
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
});
