import type {
  LoginRequest,
  RefreshTokenRequest,
  ServerResponse,
  TokenResponse,
} from "~/types";
import client from "./request";

const login = (body: LoginRequest): ServerResponse<TokenResponse> =>
  client.post("/v1/auth/login", body);

const refresh = (body: RefreshTokenRequest): ServerResponse<TokenResponse> =>
  client.post("/v1/auth/refresh", body);

export { login, refresh };
