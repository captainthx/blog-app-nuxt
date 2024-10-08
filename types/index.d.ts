import type { AxiosResponse } from "axios";
import type { DefaultPagination } from "./enum";

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
  pagination: PaginationResponse;
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

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  name: string;
  mobile: string;
}
export interface RefreshTokenRequest {
  token: string;
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
export interface PostResponse {
  id: number;
  cdt: number;
  title: string;
  content: string;
  status: string;
  likeCount: number;
  postImage: string;
  comments: CommentResponse[];
  tags: string[];
  author: AccountResponse;
  postLikes: AccountResponse[];
  favoritesPosts: AccountResponse[];
}

export interface AccountResponse {
  id: number;
  username: string;
  name: string;
  mobile: string;
  avatar: string;
}

export interface CommentResponse {
  account: AccountResponse;
  comment: string;
  cdt: number;
}

export interface Pagination {
  sort?: string;
  page?: number;
  size?: number;
}
export interface PostRequest extends Pagination {
  title?: string;
  content?: string;
}

export interface FavoritePostRequest {
  postId: number;
}

export interface CommentPostRequest {
  postId: number;
  comment: string;
}

export interface ForgotPasswordRequest {
  username: string;
  email: string;
}

export interface ResetPasswordRequest {
  username: string;
  password: string;
  code: string;
}

export interface CreatePostRequest {
  postImage: string;
  title: string;
  content: string;
  status: string;
  tags: string[];
}

export interface UploadFileRequest {
  file: FormData;
  compress: boolean;
}

export interface UploadFileResponse {
  urlPath: string;
  imageName: name;
}
export interface UpdateAccountRequest {
  mobile?: string;
  name?: string;
  avatar?: string;
}

export interface FavoritePostResponse {
  id: number;
  post: PostFavoriteResponse;
}
export interface PostFavoriteResponse {
  id: number;
  title: string;
  content: string;
  postImage: string;
}

export interface SearchPostRequest {
  search: string;
}
export interface SearchPostResponse {
  id: number;
  cdt: Date;
  title: string;
}
