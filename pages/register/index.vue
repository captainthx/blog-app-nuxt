<script setup lang="ts">
import { AxiosError } from "axios";
import { login, signup } from "~/service/auth";
import { useAuthStore } from "~/store/authStore";
import { useProfileStore } from "~/store/profileStore";
import { z } from "zod";

useHead({
  title: "Register",
  meta: [
    {
      name: "description",
      content: "Register page",
    },
  ],
});

const router = useRouter();
const { transfer } = useAuthStore();
const { loadProfile } = useProfileStore();

const registerForm = reactive({
  name: "",
  username: "",
  password: "",
  mobile: "",
});
const submit = ref<boolean>(false);

const handleRegister = async () => {
  submit.value = true;
  try {
    // const res = await signup(registerForm);
    // if (res.status === 200 && res.data.code === 200) {
    //   await transfer(res.data.result);
    //   await loadProfile();
    //   router.push({ name: "index" });
    //   showToastSuccess("Register success", "You have successfully tegister");
    // }
  } catch (error) {
    if (error instanceof AxiosError) {
      handleAxiosError("Register failed", error);
    }
  } finally {
    submit.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col justify-center items-center h-[80dvh] gap-5">
    <UCard>
      <p class="text-center text-2xl font-semibold">Signup</p>
      <UForm
        class="mt-5 p-2"
        :validate="validateRegisterForm"
        :state="registerForm"
        @submit="handleRegister"
      >
        <UFormGroup label="Name" name="name">
          <UInput v-model="registerForm.name" />
        </UFormGroup>
        <UFormGroup label="Username" name="username">
          <UInput v-model="registerForm.username" />
        </UFormGroup>
        <UFormGroup label="Password" name="password">
          <UInput v-model="registerForm.password" type="password" />
        </UFormGroup>
        <UFormGroup label="Mobile" name="mobile">
          <UInput v-model="registerForm.mobile" />
        </UFormGroup>
        <div class="mt-2 flex justify-center">
          <UButton
            block
            :loading="submit"
            variant="soft"
            color="green"
            :disabled="submit"
            type="submit"
          >
            register
          </UButton>
        </div>
      </UForm>
      <div class="flex flex-row items-center mt-2">
        already have an account?
        <UButton to="/login" variant="link" color="blue">Login </UButton>
      </div>
    </UCard>
  </div>
</template>
