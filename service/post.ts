import type { PostRequest, PostResponse, ServerResponse } from "~/types";
import client from "./request";

const getpostList = (params: PostRequest): ServerResponse<PostResponse[]> =>
  client.get("/v1/post", { params });

export { getpostList };
