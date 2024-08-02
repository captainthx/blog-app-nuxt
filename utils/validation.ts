import type { FormError } from "@nuxt/ui/dist/runtime/types";
import { ZodError, type AnyZodObject, type z } from "zod";

const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
export const validateEmail = (email: string): boolean => {
  return regex.test(email);
};

export const validateLoginForm = (body: any): FormError[] => {
  const errors = [];
  if (!body.username)
    errors.push({ path: "username", message: "Please input username" });
  if (!body.password)
    errors.push({ path: "password", message: "Please input password" });
  return errors;
};

export const validateRegisterForm = (body: any): FormError[] => {
  const errors = [];
  if (!body.name) errors.push({ path: "name", message: "Please input name" });
  if (!body.password)
    errors.push({ path: "password", message: "Please input password" });
  if (!body.username)
    errors.push({ path: "username", message: "Please input username" });
  if (!body.mobile)
    errors.push({
      path: "mobile",
      message: "Please input mobile min 10 digits",
    });
  return errors;
};
