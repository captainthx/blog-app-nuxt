import { useAuthStore } from "@/store/authStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const pathList = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  console.log("Global middleware");
  console.log(`Navigating to: ${to.path}`);

  if (!pathList.includes(to.path)) {
    const { isAuthenticated } = useAuthStore();
    console.log("Checking if user is authenticated", isAuthenticated);
    if (!isAuthenticated) {
      console.log("Redirecting to login page");
      return navigateTo("/login");
    }
  }
  console.log("User is authenticated or on a whitelisted path");
});
