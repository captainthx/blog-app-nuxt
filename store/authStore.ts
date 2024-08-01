import { type AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { refresh } from "~/service/auth";
import client from "~/service/request";
import type { ApiResponse, TokenPayload, TokenResponse } from "~/types";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<TokenResponse | null>(null);
  const payload = ref<TokenPayload | null>(null);
  const isAuthenticated = computed(() => !!token.value);
  const cookie = useCookie<TokenResponse | null>("auth");

  const transfer = async (data: TokenResponse) => {
    console.log("Transferring auth");
    if (data) {
      cookie.value = data;
      await loadAuth();
    }
  };

  const loadAuth = async () => {
    console.log("Loading auth");
    if (cookie.value) {
      token.value = cookie.value;
      payload.value = JSON.parse(atob(token.value.accessToken.split(".")[1]));
      if (payload.value) {
        const timeout = (payload.value.exp - Date.now() / 1000) * 1000;
        if (timeout < 0) {
          console.log("Token expired");
          if ((token.value.refreshExpire - Date.now() / 1000) * 1000 > 0) {
            console.log("Refresh token not expired");
            await refreshAuth(token.value.refreshToken);
          } else {
            console.log("Refresh token expired");
            logout();
          }
        } else if (timeout > 1) {
          const refresh = token.value.refreshToken;
          setTimeout(async () => {
            console.log("settime out Refreshing auth", new Date());
            await refreshAuth(refresh);
          }, timeout);
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
        }
      }
    } else {
      console.log("No auth cookie found");
    }
  };

  const refreshAuth = async (token: string) => {
    console.log("Refreshing auth");
    try {
      const res = await refresh({ token });
      if (res.data.code === 200) {
        if (res.data.result) {
          await transfer(res.data.result);
        }
      }
      if (res.status !== 200) {
        console.error(res.data.message);
      }
    } catch (error) {
      console.error("refreshAuth ", error);
    }
  };

  const logout = () => {
    console.log("Logging out");
    token.value = null;
    payload.value = null;
    cookie.value = null;
  };

  return {
    loadAuth,
    transfer,
    logout,
    isAuthenticated,
    token,
    payload,
  };
});
