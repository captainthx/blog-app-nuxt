import type { PostRequest, PostResponse, ServerResponse } from "~/types";
import client from "./request";

const getpostList = (params: PostRequest): ServerResponse<PostResponse[]> =>
  client.get("/v1/post", { params });

const getPostByid = (id: number): ServerResponse<PostResponse> =>
  client.get(`/v1/post/${id}`);

const likePost = (postId: number): ServerResponse<void> =>
  client.patch(`/v1/post/likes/${postId}`);

export { getpostList, getPostByid, likePost };
