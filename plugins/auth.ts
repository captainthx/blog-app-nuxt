import { useAuthStore } from "~/store/authStore";

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();
  authStore.loadAuth();
  console.log("Auth plugin initialized");
});
