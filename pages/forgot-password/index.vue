<script setup lang="ts">
import type { FormError } from "#ui/types";
import { AxiosError } from "axios";
import { forgotPassword } from "~/service/forgotPassword";
import { useAuthStore } from "~/store/authStore";

useHead({
  title: "Forgot password",
  meta: [
    {
      name: "description",
      content: "Forgot password page",
    },
  ],
});
const toast = useToast();
const body = reactive({
  username: "",
  email: "",
});
const state = reactive({
  submit: false,
});

const validate = (body: any): FormError[] => {
  const errors = [];
  if (!body.username)
    errors.push({ path: "username", message: "Please input username" });
  if (!body.email)
    errors.push({ path: "email", message: "Please input email" });
  return errors;
};

const handleForgotPassword = async () => {
  state.submit = true;
  try {
    const res = await forgotPassword(body);
    if (res.status === 200 && res.data.code === 200) {
      console.log("response", res.data);
      state.submit = false;
      toast.add({
        title: "request forgot-password success",
        description: "Please check your email to reset password",
        timeout: 3000,
      });
      clearFrom();
    }
  } catch (error) {
    if (typeof error === "string") {
    } else if (error instanceof AxiosError) {
      const axiosError = error as AxiosError;
      const responseData = axiosError.response?.data as { message: string };
      state.submit = false;
      toast.add({
        title: "request forgot-password failed",
        description: responseData.message,
        timeout: 3000,
        color: "red",
      });
    }
  }
};
const clearFrom = () => {
  body.username = "";
  body.email = "";
};
</script>

<template>
  <div class="flex justify-center min-h-[80dvh] items-center">
    <UCard class="w-6/12 p-2">
      <p class="text-2xl m-5 font-semibold">Forgot-password</p>
      <UForm
        class="p-2"
        :validate="validate"
        :state="body"
        @submit="handleForgotPassword"
      >
        <UFormGroup label="Username" name="username">
          <UInput v-model="body.username" placeholder="username" />
        </UFormGroup>
        <UFormGroup label="email" name="email">
          <UInput v-model="body.email" type="email" placeholder="email" />
        </UFormGroup>
        <div class="mt-2 flex justify-center">
          <UButton
            :loading="state.submit"
            color="blue"
            variant="ghost"
            :disabled="state.submit"
            type="submit"
          >
            Send
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
