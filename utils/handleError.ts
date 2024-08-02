import { AxiosError } from "axios";
import { ZodError, type AnyZodObject } from "zod";

export const handleZodError = (error: unknown) => {
  const zodError = error as ZodError<AnyZodObject>;
  zodError.issues.forEach((issue) => {
    showToastError("Validation Error", issue.message);
  });
};

export const handleAxiosError = (title: string, error: unknown) => {
  const axiosError = error as AxiosError;
  if (axiosError.response) {
    const responseData = axiosError.response.data as { error: string };
    showToastError(title, responseData.error);
  }
};
