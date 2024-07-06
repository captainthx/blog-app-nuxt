import type { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { refresh } from "~/service/auth";
import client from "~/service/request";
import type { ApiResponse, TokenPayload, TokenResponse } from "~/types";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<TokenResponse | null>(null);
  const payload = ref<TokenPayload | null>(null);
  const isAuthenticated = computed(
    () => token.value !== null && payload.value !== null
  );

  const isAuthLoaded = ref<boolean>(false);

  const router = useRouter();
  const setCookie = (token: TokenResponse) => {
    let cookieExpire = new Date(token.accessExpire);
    // Convert to milliseconds: 7 hours * 60 minutes * 60 seconds * 1000 milliseconds
    const offset = 7 * 60 * 60 * 1000;
    // Adjust the cookieExpire to GMT+7
    cookieExpire = new Date(cookieExpire.getTime() + offset);
    const cookie = useCookie("auth");
    cookie.value = JSON.stringify(token);
  };

  const transfer = (res: AxiosResponse<ApiResponse<TokenResponse>>) => {
    if (res.status === 200 && res.data.code === 200) {
      token.value = res.data.result;
      payload.value = JSON.parse(atob(token.value.accessToken.split(".")[1]));
      setCookie(token.value);
      if (payload.value) {
        const timeout = (payload.value.exp - Date.now() / 1000) * 1000 - 10000;
        const refresh = token.value.refreshToken;

        setTimeout(() => {
          console.log("settime out Refreshing auth");
          refreshAuth(refresh);
        }, timeout);

        router.push("/");
      }
    }
  };

  const loadAuth = () => {
    const cookie = useCookie<TokenResponse | null>("auth");
    if (isAuthLoaded.value) return;
    if (cookie.value) {
      console.log("Loading auth");
      token.value = cookie.value;
      payload.value = JSON.parse(atob(token.value.accessToken.split(".")[1]));
      if (payload.value) {
        const timout = (payload.value.exp - Date.now() / 1000) * 1000 - 10000;

        client.interceptors.request.use(
          (config) => {
            if (token.value) {
              config.headers.Authorization = `Bearer ${token.value.accessToken}`;
            }
            return config;
          },
          (error) => {
            return Promise.reject(error);
          }
        );
        if (timout < 0) {
          console.log("Token expired");
          logout();
        }
      }
    } else {
      logout();
    }
    isAuthLoaded.value = true;
  };

  const refreshAuth = async (token: string) => {
    try {
      const res = await refresh({ token });
      if (res.data.code === 200) {
        if (res.data.result) {
          transfer(res);
        }
      }
      if (res.status !== 200) {
        console.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    token.value = null;
    payload.value = null;
    const cookie = useCookie("auth");
    cookie.value = null;
    router.push("/login");
  };

  return {
    loadAuth,
    transfer,
    logout,
    isAuthenticated,
    isAuthLoaded,
    token,
    payload,
  };
});
