import type { ServerResponse, UploadFileResponse } from "~/types";
import { create } from "./request";

const client = create();
const uploadFile = (formData: FormData): ServerResponse<UploadFileResponse> =>
  client.post("/v1/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

const getFile = (filename: string) =>
  client.get(`/v1/upload/files/${filename}`, { responseType: "blob" });

export { uploadFile, getFile };
