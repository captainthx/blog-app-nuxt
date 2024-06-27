<script setup lang="ts">
import type { FormError } from "#ui/types";
import { useAuthStore } from "~/store/authStore";
import type { ApiResponse, TokenResponse } from "~/types";

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
  const { data, error } = await myFetch<ApiResponse<TokenResponse>>(
    "/v1/auth/login",
    {
      method: "POST",
      body: body,
    }
  );
  if (data.value) {
    if (data.value.code === 200) {
      state.submit = false;
      authStore.transfer(data.value);
      toast.add({
        title: "Login success",
        description: "You have successfully logged in",
        timeout: 3000,
      });
    }
  }
  if (error.value) {
    if (error.value.data.code != 200) {
      state.submit = false;
      toast.add({
        title: "Login failed",
        description: error.value.data.message,
        timeout: 3000,
        color: "red",
      });
    }
  }
};
</script>

<template>
  <div class="flex justify-center h-full items-center">
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
              color="blue"
              variant="soft"
              :disable="state.submit"
              type="submit"
            >
              Login
            </UButton>
          </div>
        </UForm>
        <h1>Or sign Up using</h1>
        <div class="flex flex-row gap-2 justify-center">
          <UButton color="blue" variant="ghost">Facebook</UButton>
          <UButton color="green" variant="ghost">Google</UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
