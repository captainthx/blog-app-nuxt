/**
 * Global middleware for authentication.
 * This middleware checks if the user is authenticated before navigating to certain routes.
 *
 * @param {Route} to - The target route being navigated to.
 * @param {Route} from - The current route being navigated from.
 * @returns {void | Promise<void>} - Returns void or a promise that resolves to void.
 */

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
