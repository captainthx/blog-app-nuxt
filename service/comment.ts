import type { ServerResponse } from "~/types";
import client from "./request";

const commentPost = (body: any): ServerResponse<void> =>
  client.post("/v1/comment", body);

export { commentPost };
