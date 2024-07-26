import { useAuthStore } from "~/store/authStore";
import { useProfileStore } from "~/store/profileStore";

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  const profileStore = useProfileStore();

  await authStore.loadAuth();

  if (authStore.isAuthenticated) {
    await profileStore.loadProfile();
  }
  console.log("Auth plugin initialized");
});
