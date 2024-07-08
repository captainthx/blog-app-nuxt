import { useAuthStore } from "@/store/authStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const pathList = ["/login", "/register"];
  const authStore = useAuthStore();

  console.log("Global middleware");

  if (!authStore.isAuthLoaded) {
    authStore.loadAuth();
  }

  if (!pathList.includes(to.path) && !authStore.isAuthenticated) {
    console.log("Redirecting to login page");
    return navigateTo("/login");
  } else {
    authStore.setInterceptors();
  }
});
