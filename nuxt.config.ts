// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Blog",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { key: "description", name: "description", content: "" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  routeRules: {
    "/": { prerender: true },
    "/profile/**": { ssr: false },
    "/forgot-password": { ssr: false },
    "/reset-password": { ssr: false },
  },
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
    "@vueuse/motion/nuxt",
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
  },
  colorMode: {
    preference: "light",
  },
});
