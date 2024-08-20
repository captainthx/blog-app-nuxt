import type {
  CreatePostRequest,
  Pagination,
  PostRequest,
  PostResponse,
  SearchPostRequest,
  SearchPostResponse,
  ServerResponse,
} from "~/types";
import client from "./request";

const getPostList = (params: Pagination): ServerResponse<PostResponse[]> =>
  client.get("/v1/post", { params });

const getPostByid = (id: number): ServerResponse<PostResponse> =>
  client.get(`/v1/post/${id}`);

const likePost = (postId: number): ServerResponse<void> =>
  client.patch(`/v1/post/likes/${postId}`);

const createPost = (body: CreatePostRequest): ServerResponse<void> =>
  client.post("/v1/post", body);

const searchPost = (
  params: SearchPostRequest
): ServerResponse<SearchPostResponse[]> =>
  client.get("/v1/post/search", { params });

export { getPostList, getPostByid, likePost, createPost, searchPost };
