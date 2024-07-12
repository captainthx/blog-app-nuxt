import { useAuthStore } from "~/store/authStore";

export default defineNuxtPlugin((nuxtApp) => {
  const { loadAuth } = useAuthStore();
  loadAuth();
  console.log("Auth plugin initialized");
});
