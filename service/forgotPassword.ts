import type {
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ServerResponse,
} from "~/types";
import client from "./request";

const forgotPassword = (body: ForgotPasswordRequest): ServerResponse<void> =>
  client.post("/v1/forgot-password", body);

const resetPassword = (body: ResetPasswordRequest): ServerResponse<void> =>
  client.post("/v1/forgot-password/reset-password", body);

export { forgotPassword, resetPassword };
