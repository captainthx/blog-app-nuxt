import { AxiosError, type AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { profile } from "~/service/account";
import { refresh } from "~/service/auth";
import client from "~/service/request";
import type {
  AccountResponse,
  ApiResponse,
  TokenPayload,
  TokenResponse,
} from "~/types";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<TokenResponse | null>(null);
  const payload = ref<TokenPayload | null>(null);
  const isAuthenticated = computed(
    () => token.value !== null && payload.value !== null
  );
  const isAuthLoaded = ref<boolean>(false);

  const userProfile = ref<AccountResponse | null>(null);
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
        setInterceptors();
        getProfile();
        const timeout =
          (payload.value.exp - Math.floor(Date.now() / 1000)) * 1000 - 10000;
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
    console.log("Loading auth");
    if (isAuthLoaded.value) return;
    const cookie = useCookie<TokenResponse | null>("auth");
    if (cookie.value) {
      token.value = cookie.value;
      payload.value = JSON.parse(atob(token.value.accessToken.split(".")[1]));
      if (payload.value) {
        const timout = (payload.value.exp - Date.now() / 1000) * 1000 - 10000;
        setInterceptors();
        getProfile();
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

  const setInterceptors = () => {
    if (token.value) {
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

  const getProfile = async () => {
    try {
      const res = await profile();
      if (res.status === 200 && res.data.result) {
        userProfile.value = res.data.result;
      }
    } catch (error) {
      if (typeof error === "string") {
        console.log(error);
      } else if (error instanceof AxiosError) {
        const axiosError = error as AxiosError;
        const responseData = axiosError.response?.data as { message: string };
        console.log("error get profile ", responseData.message);
      }
    }
  };

  const logout = () => {
    token.value = null;
    payload.value = null;
    const cookie = useCookie("auth");
    cookie.value = null;
    isAuthLoaded.value = false;
    userProfile.value = null;
    router.push("/login");
  };

  return {
    loadAuth,
    transfer,
    logout,
    setInterceptors,
    getProfile,
    userProfile,
    isAuthenticated,
    isAuthLoaded,
    token,
    payload,
  };
});
