import { defineStore } from "pinia";
import type { ApiResponse, TokenPayload, TokenResponse } from "~/types";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<TokenResponse | null>(null);
  const payload = ref<TokenPayload | null>(null);
  const isAuthenticated = computed(
    () => token.value !== null && payload.value !== null
  );

  const setCookie = (token: TokenResponse) => {
    let cookieExpire = new Date(token.accessExpire);
    // Convert to milliseconds: 7 hours * 60 minutes * 60 seconds * 1000 milliseconds
    const offset = 7 * 60 * 60 * 1000;
    // Adjust the cookieExpire to GMT+7
    cookieExpire = new Date(cookieExpire.getTime() + offset);
    const cookie = useCookie("auth");
    cookie.value = JSON.stringify(token);
  };

  const transfer = (res: ApiResponse<TokenResponse>) => {
    const router = useRouter();
    if (res.code === 200 && res.result) {
      token.value = res.result;
      payload.value = JSON.parse(atob(token.value.accessToken.split(".")[1]));
      setCookie(token.value);
      if (payload.value) {
        const timeout = (payload.value.exp - Date.now() / 1000) * 1000 - 10000;
        const refresh = token.value.refreshToken;

        setTimeout(async () => {
          await refreshAuth(refresh);
        }, timeout);

        router.push("/");
      }
    }
  };

  const loadAuth = () => {
    const cookie = useCookie<TokenResponse | null>("auth");
    if (cookie.value) {
      console.log("Loading auth");
      token.value = cookie.value;
      payload.value = JSON.parse(atob(token.value.accessToken.split(".")[1]));
      if (payload.value) {
        const timout = (payload.value.exp - Date.now() / 1000) * 1000 - 10000;
        if (timout < 60) {
          console.log("Refreshing auth");
          refreshAuth(token.value.refreshToken);
        }
        if (timout < 0) {
          console.log("Token expired");
          logout();
        }
      }
    } else {
      logout();
    }
  };

  const refreshAuth = async (token: string) => {
    const { data, error } = await myFetch<ApiResponse<TokenResponse>>(
      "/v1/auth/refresh",
      {
        method: "POST",
        body: {
          token: token,
        },
      }
    );
    if (data) {
      if (data.value?.code === 200) {
        transfer(data.value);
      }
    }
    if (error) {
      console.error(error);
    }
  };

  const logout = () => {
    token.value = null;
    payload.value = null;
    const cookie = useCookie("auth");
    cookie.value = null;
  };

  return { loadAuth, transfer, logout, isAuthenticated, token, payload };
});
