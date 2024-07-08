import { useAuthStore } from "@/store/authStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const pathList = ["/login", "/register"];
  const authStore = useAuthStore();

  console.log("Global middleware");

  if (!pathList.includes(to.path)) {
    authStore.loadAuth();
    if (authStore.isAuthenticated === false) {
      console.log("to login page");
      return navigateTo("/login");
    }
  }
});
