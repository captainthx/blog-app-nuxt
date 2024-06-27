import type { AxiosResponse } from "axios";

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export type ServerResponse<T> = Promise<AxiosResponse<ApiResponse<T>>>;

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  accessExpire: number;
  refreshExpire: number;
}

export interface PaginationResponse {
  current: number;
  limit: number;
  records: number;
  pages: number;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface TokenPayload {
  sub: string;
  auth: number;
  iss: string;
  exp: number;
  iat: number;
  jti: string;
}

export interface Tabs {
  title: string;
  content: string[];
  key: number;
  closable: boolean;
}
export interface AccountResponse {
  id: number;
  username: string;
  name: string;
  mobile: string;
  cdt: number;
  udt: number;
}
