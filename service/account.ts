import type {
  AccountResponse,
  ServerResponse,
  UpdateAccountRequest,
} from "~/types";
import client from "./request";

const getProfile = (): ServerResponse<AccountResponse> =>
  client.get("/v1/account/profile");

const updateAccount = (
  body: UpdateAccountRequest
): ServerResponse<AccountResponse> => client.patch("/v1/account", body);

export { getProfile, updateAccount };
