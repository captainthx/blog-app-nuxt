import type { AccountResponse, ServerResponse } from "~/types";
import client from "./request";

const profile = (): ServerResponse<AccountResponse> =>
  client.get("/v1/account/profile");

export { profile };
