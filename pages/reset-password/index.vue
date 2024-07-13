<script setup lang="ts">
import type { FormError } from "@nuxt/ui/dist/runtime/types";
import { AxiosError } from "axios";
import { resetPassword } from "~/service/forgotPassword";

const route = useRoute();
const { code, username } = route.query;
const router = useRouter();

useHead({
  title: "Reset password",
  meta: [
    {
      name: "description",
      content: "Reset password page",
    },
  ],
});
const toast = useToast();
const body = reactive({
  username: username as string,
  password: "",
  code: code as string,
});
const state = reactive({
  submit: false,
});

const validate = (body: any): FormError[] => {
  const errors = [];
  if (!body.username)
    errors.push({ path: "username", message: "Please input username" });
  if (!body.password)
    errors.push({ path: "password", message: "Please input password" });
  return errors;
};

const handleForgotPassword = async () => {
  state.submit = true;
  try {
    const res = await resetPassword(body);
    if (res.status === 200 && res.data.code === 200) {
      console.log("response", res.data);
      state.submit = false;
      toast.add({
        title: "reset-password success",
        timeout: 3000,
      });
      clearFrom();
      router.push("/login");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError;
      const responseData = axiosError.response?.data as { message: string };
      state.submit = false;
      toast.add({
        title: "reset-password failed",
        description: responseData.message,
        timeout: 3000,
        color: "red",
      });
      body.password = "";
    }
  }
};
const clearFrom = () => {
  body.username = "";
  body.password = "";
  body.code = "";
};
</script>

<template>
  <div class="flex justify-center min-h-[80dvh] items-center">
    <UCard class="w-6/12 p-2">
      <p class="text-2xl m-5 font-semibold">Reset-password</p>
      <UForm
        class="p-2"
        :validate="validate"
        :state="body"
        @submit="handleForgotPassword"
      >
        <UFormGroup label="Username" name="username">
          <UInput
            v-model="body.username"
            color="gray"
            variant="outline"
            placeholder="username"
            disabled
          />
        </UFormGroup>
        <UFormGroup label="Code" name="code">
          <UInput
            v-model="body.code"
            color="gray"
            variant="outline"
            placeholder="code"
            disabled
          />
        </UFormGroup>
        <UFormGroup label="password" name="password">
          <UInput
            v-model="body.password"
            type="password"
            placeholder="password"
          />
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
