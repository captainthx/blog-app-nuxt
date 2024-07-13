import { useAuthStore } from "@/store/authStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const pathList = ["/login", "/register", "/forgot-password"];

  console.log("Global middleware");

  if (!pathList.includes(to.path)) {
    const { isAuthenticated } = useAuthStore();
    console.log("Checking if user is authenticated", isAuthenticated);
    if (!isAuthenticated) {
      console.log("Redirecting to login page");
      return navigateTo("/login");
    }
  }

  if (to.path === "/reset-password") {
    if (to.query.token === undefined && to.query.username === undefined) {
      return navigateTo("/forgot-password");
    }
  }
});
