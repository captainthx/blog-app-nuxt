<script setup lang="ts">
import { AxiosError } from "axios";
import { login, signup } from "~/service/auth";
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

const items = [
  {
    slot: "login",
    label: "Login",
  },
  {
    slot: "signup",
    label: "Signup",
  },
];
const router = useRouter();
const { transfer } = useAuthStore();
const { loadProfile } = useProfileStore();
const loginForm = reactive({
  username: "",
  password: "",
});
const registerForm = reactive({
  name: "",
  username: "",
  password: "",
  mobile: "",
});
const state = reactive({
  submit: false,
});
const handleLogin = async () => {
  state.submit = true;
  const toast = useToast();
  try {
    const res = await login(loginForm);
    if (res.status === 200 && res.data.code === 200) {
      state.submit = false;
      await transfer(res.data.result);
      await loadProfile();
      router.push({ name: "index" });
      toast.add({
        title: "Login success",
        description: "You have successfully logged in",
        timeout: 3000,
      });
    }
  } catch (error) {
    if (error instanceof AxiosError) {
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
const handleRegister = async () => {
  state.submit = true;
  const toast = useToast();
  try {
    const res = await signup(registerForm);
    if (res.status === 200 && res.data.code === 200) {
      state.submit = false;
      await transfer(res.data.result);
      await loadProfile();
      router.push({ name: "index" });
      toast.add({
        title: "Register success",
        description: "You have successfully tegister",
        timeout: 3000,
      });
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError;
      const responseData = axiosError.response?.data as { message: string };
      state.submit = false;
      toast.add({
        title: "Register failed",
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
    <UTabs :items="items">
      <template #login="{ item }">
        <UCard>
          <p class="text-center text-2xl font-semibold">{{ item.label }}</p>
          <div class="flex flex-col">
            <UForm
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
              <div class="mt-2 flex justify-center">
                <UButton
                  :loading="state.submit"
                  color="green"
                  variant="soft"
                  :disabled="state.submit"
                  type="submit"
                >
                  {{ item.label }}
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
          </div>
        </UCard>
      </template>
      <template #signup="{ item }">
        <UCard>
          <p class="text-center text-2xl font-semibold">{{ item.label }}</p>
          <div class="flex flex-col gap-2">
            <UForm
              :validate="validateRegisterForm"
              :state="registerForm"
              @submit="handleRegister"
            >
              <UFormGroup label="Name" name="name">
                <UInput v-model="registerForm.name" />
              </UFormGroup>
              <UFormGroup label="Username" name="username">
                <UInput v-model="registerForm.username" type="text" />
              </UFormGroup>
              <UFormGroup label="Password" name="password">
                <UInput v-model="registerForm.password" type="password" />
              </UFormGroup>
              <UFormGroup label="Mobile" name="mobile">
                <UInput v-model="registerForm.mobile" type="text" />
              </UFormGroup>
              <div class="mt-2 flex justify-center">
                <UButton
                  :loading="state.submit"
                  color="green"
                  variant="soft"
                  :disabled="state.submit"
                  type="submit"
                >
                  {{ item.label }}
                </UButton>
              </div>
            </UForm>
          </div>
        </UCard>
      </template>
    </UTabs>
  </div>
</template>
