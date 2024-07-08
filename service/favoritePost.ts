import type { FavoritePostRequest, ServerResponse } from "~/types";
import client from "./request";

const faveritePost = (body: FavoritePostRequest): ServerResponse<void> =>
  client.post("/v1/favorite", body);

export { faveritePost };
