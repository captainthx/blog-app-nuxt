import { useAuthStore } from "@/store/authStore";

export default defineNuxtRouteMiddleware((to, _from) => {
  const allows = ["login", "register", "forgot-password", "index"];
  const { isAuthenticated } = useAuthStore();

  console.log("Global middleware");
  console.log("Current route:", to.name);
  console.log("Is authenticated:", isAuthenticated);
  if (isAuthenticated) {
    to.meta.layout = "authenticated";
    console.log("Authenticated layout");
  } else {
    to.meta.layout = "default";
    if (!allows.includes(to.name as string)) {
      console.log("Redirecting to login");
      return navigateTo({ name: "login" });
    }
  }
});
