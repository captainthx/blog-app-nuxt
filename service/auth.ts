import type {
  LoginRequest,
  RefreshTokenRequest,
  ServerResponse,
  SignupRequest,
  TokenResponse,
} from "~/types";
import { create } from "./request";
const client = create();

const login = (body: LoginRequest): ServerResponse<TokenResponse> =>
  client.post("/v1/auth/login", body);

const signup = (body: SignupRequest): ServerResponse<TokenResponse> =>
  client.post("/v1/auth/signup", body);

const refresh = (body: RefreshTokenRequest): ServerResponse<TokenResponse> =>
  client.post("/v1/auth/refresh", body);

export { login, refresh, signup };
