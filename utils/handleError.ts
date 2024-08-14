import { AxiosError } from "axios";
import { ZodError, type AnyZodObject } from "zod";

export const handleZodError = (error: unknown) => {
  const zodError = error as ZodError<AnyZodObject>;
  zodError.issues.forEach((issue) => {
    console.log(issue.message);
    showToastError("Validation Error", issue.message);
  });
};

export const handleAxiosError = (title: string, error: AxiosError) => {
  if (error.response) {
    const responseData = error.response.data as { error: string };
    showToastError(title, responseData.error);
  }
};
