import type {
  FavoritePostRequest,
  Pagination,
  FavoritePostResponse,
  ServerResponse,
} from "~/types";
import client from "./request";

const faveritePost = (body: FavoritePostRequest): ServerResponse<void> =>
  client.post("/v1/favorite", body);

const getFaveritePost = (
  params: Pagination
): ServerResponse<FavoritePostResponse[]> =>
  client.get("/v1/favorite", { params });

export { faveritePost, getFaveritePost };
