import { defineStore } from "pinia";
import type { ApiResponse, TokenPayload, TokenResponse } from "~/types";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<TokenResponse | null>(null);
  const tokenPayload = ref<TokenPayload | null>(null);
  const isAuthenticated = computed(
    () => token.value !== null && tokenPayload.value !== null
  );

  const setCookie = (token: TokenResponse) => {
    let cookieExpire = new Date(token.accessExpire);
    // Convert to milliseconds: 7 hours * 60 minutes * 60 seconds * 1000 milliseconds
    const offset = 7 * 60 * 60 * 1000;
    // Adjust the cookieExpire to GMT+7
    cookieExpire = new Date(cookieExpire.getTime() + offset);
    const cookie = useCookie("auth", { expires: cookieExpire });
    cookie.value = JSON.stringify(token);
  };

  const transfer = (res: ApiResponse<TokenResponse>) => {
    const router = useRouter();
    if (res.code === 200 && res.result) {
      token.value = res.result;
      tokenPayload.value = JSON.parse(
        atob(token.value.accessToken.split(".")[1])
      );
      setCookie(token.value);

      const timeout = new Date(token.value.accessExpire).getTime() - 60000;
      console.log("Token will expire in", timeout);
      const refresh = token.value.refreshToken;

      setTimeout(async () => {
        await refreshAuth(refresh);
      }, timeout);

      router.push("/");
    }
  };

  const loadAuth = () => {
    const cookie = useCookie<TokenResponse | null>("auth");
    if (cookie.value) {
      console.log("Loading auth");
      token.value = cookie.value;
      tokenPayload.value = JSON.parse(
        atob(token.value.accessToken.split(".")[1])
      );
      if (token.value.accessExpire - Math.floor(Date.now()) < 60) {
        console.log("Token will expire soon");
        refreshAuth(token.value.refreshToken);
      }
      if (token.value.accessExpire - Math.floor(Date.now()) < 0) {
        console.log("Token expired");
        logout();
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
    tokenPayload.value = null;
    const cookie = useCookie("auth");
    cookie.value = null;
  };

  return { loadAuth, transfer, logout, isAuthenticated, token, tokenPayload };
});
