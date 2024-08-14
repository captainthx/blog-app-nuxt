<script setup lang="ts">
import { AxiosError } from "axios";
import { login } from "~/service/auth";
import { useAuthStore } from "~/store/authStore";
import { useProfileStore } from "~/store/profileStore";

useHead({
  title: "Login",
  meta: [
    {
      name: "description",
      content: "Login page",
    },
  ],
});

const router = useRouter();
const { transfer } = useAuthStore();
const { loadProfile } = useProfileStore();
const loginForm = reactive({
  username: "",
  password: "",
});
const submit = ref<boolean>(false);
const handleLogin = async () => {
  submit.value = true;
  try {
    const res = await login(loginForm);
    if (res.status === 200 && res.data.code === 200) {
      await transfer(res.data.result);
      await loadProfile();
      router.push({ name: "index" });
      showToastSuccess("Login success", "You have successfully logged in");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      handleAxiosError("Login failed", error);
    }
  } finally {
    submit.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col justify-center items-center h-[80dvh] gap-5">
    <UCard>
      <p class="text-center text-2xl font-semibold">Login</p>
      <UForm
        class="mt-5"
        :validate="validateLoginForm"
        :state="loginForm"
        @submit="handleLogin"
      >
        <UFormGroup label="Username" name="username">
          <UInput v-model="loginForm.username" />
        </UFormGroup>
        <UFormGroup label="Password" name="password">
          <UInput v-model="loginForm.password" type="password" />
        </UFormGroup>
        <div class="mt-2">
          <UButton to="/forgot-password" variant="link" color="black">
            forgot password</UButton
          >
        </div>
        <div class="mt-2 flex justify-center">
          <UButton
            block
            :loading="submit"
            variant="soft"
            color="blue"
            :disabled="submit"
            type="submit"
          >
            Login
          </UButton>
        </div>
      </UForm>
      <div class="flex flex-row items-center mt-2">
        Don't have account?
        <UButton to="/register" variant="link" color="green">register </UButton>
      </div>
    </UCard>
  </div>
</template>
