<script setup lang="ts">
import type { FormError } from "#ui/types";
import { AxiosError } from "axios";
import { login } from "~/service/auth";
import { useAuthStore } from "~/store/authStore";

useHead({
  title: "Login",
  meta: [
    {
      name: "description",
      content: "Login page",
    },
  ],
});

const authStore = useAuthStore();
const body = reactive({
  username: "",
  password: "",
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

const handleLogin = async () => {
  state.submit = true;
  const toast = useToast();
  try {
    const res = await login(body);
    if (res.status === 200 && res.data.code === 200) {
      state.submit = false;
      authStore.transfer(res);
      toast.add({
        title: "Login success",
        description: "You have successfully logged in",
        timeout: 3000,
      });
      useRouter().push("/");
    }
  } catch (error) {
    if (typeof error === "string") {
    } else if (error instanceof AxiosError) {
      const axiosError = error as AxiosError;
      const responseData = axiosError.response?.data as { message: string };
      state.submit = false;
      toast.add({
        title: "Login failed",
        description: responseData.message,
        timeout: 3000,
        color: "red",
      });
    }
  }
};
</script>

<template>
  <div class="flex justify-center min-h-[80dvh] items-center">
    <UCard>
      <div class="flex flex-col gap-2">
        <p class="text-center text-2xl font-semibold">Login</p>
        <UForm :validate="validate" :state="body" @submit="handleLogin">
          <UFormGroup label="Username" name="username">
            <UInput v-model="body.username" />
          </UFormGroup>
          <UFormGroup label="Password" name="password">
            <UInput v-model="body.password" type="password" />
          </UFormGroup>
          <div class="mt-2 flex justify-center">
            <UButton
              :loading="state.submit"
              color="green"
              variant="soft"
              :disabled="state.submit"
              type="submit"
            >
              Login
            </UButton>
          </div>
        </UForm>
        <UButton
          icon="i-heroicons-key"
          to="/forgot-password"
          variant="link"
          color="black"
        >
          Forgot password</UButton
        >
        <!-- <div class="flex flex-row gap-2 justify-center">
          <UButton color="blue" variant="ghost">Facebook</UButton>
          <UButton color="green" variant="ghost">Google</UButton>
        </div> -->
      </div>
    </UCard>
  </div>
</template>
