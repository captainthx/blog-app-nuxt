import type { CommentPostRequest, ServerResponse } from "~/types";
import client from "./request";

const commentPost = (body: CommentPostRequest): ServerResponse<void> =>
  client.post("/v1/comment", body);

export { commentPost };
