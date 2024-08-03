import type {
  CommentPostRequest,
  CommentResponse,
  ServerResponse,
} from "~/types";
import client from "./request";

const commentPost = (body: CommentPostRequest): ServerResponse<void> =>
  client.post("/v1/comment", body);

const getCommentByPostId = (
  postId: number
): ServerResponse<CommentResponse[]> =>
  client.get("/v1/comment", { params: { postId } });

export { commentPost, getCommentByPostId };
