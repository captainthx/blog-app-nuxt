<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { AxiosError } from "axios";
import { z } from "zod";
import { getProfile, updateAccount } from "~/service/account";
import { getFile, uploadFile } from "~/service/file";
import type { AccountResponse } from "~/types";

const url = ref<string>("");
const defaultImage =
  "https://t4.ftcdn.net/jpg/01/64/16/59/360_F_164165971_ELxPPwdwHYEhg4vZ3F4Ej7OmZVzqq4Ov.jpg";
const inputRef = ref<HTMLInputElement | null>(null);
const imageFile = ref<File | null>(null);
const profile = ref<AccountResponse>({
  id: 0,
  username: "",
  name: "",
  mobile: "",
  avatar: "",
});
const isOpenModal = ref<boolean>(false);
const toast = useToast();
const schema = z.object({
  name: z.string().min(6, "name Must be at least 6 characters"),
  mobile: z
    .string()
    .min(10, "Must be at least 10 characters")
    .max(10, "Must be at most 10 characters"),
});

const handleUploadFile = async () => {
  if (imageFile.value) {
    const formData = new FormData();
    formData.append("file", imageFile.value);
    formData.append("compress", "true");
    try {
      const res = await uploadFile(formData);
      if (res.status === 200 && res.data.result) {
        profile.value.avatar = res.data.result.imageName;
        imageFile.value = null;
        handleUpadteAccout();
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const handleUpadteAccout = async () => {
  try {
    const res = await updateAccount(profile.value);
    if (res.status === 200 && res.data.result) {
      console.log(res.data.result);
      toast.add({
        title: "Success",
        description: "Update Profile success",
        color: "green",
        timeout: 3000,
      });
      await loadData();
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError;
      const responseData = axiosError.response?.data as { message: string };
      toast.add({
        title: "Update Profile failed",
        description: responseData.message,
        timeout: 3000,
        color: "red",
      });
    }
  }
};

const triggerFileInput = () => {
  if (inputRef.value) {
    inputRef.value.click();
  }
};
const changeFile = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.item(0);
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      url.value = e.target?.result as string;
      isOpenModal.value = true;
    };
    reader.readAsDataURL(file);
  }
};

const getImage = async () => {
  try {
    const res = await getFile(profile.value.avatar);
    if (res.status === 200 && res.data) {
      url.value = URL.createObjectURL(res.data);
    }
  } catch (error) {
    console.log(error);
  }
};
const handleUndoCrop = () => {
  imageFile.value = null;
  getImage();
};
const loadData = async () => {
  try {
    const res = await getProfile();
    if (res.status === 200 && res.data.result) {
      profile.value = res.data.result;
    }
  } catch (error) {
    console.log(error);
  }
};

const updateCloseModal = (value: boolean) => {
  isOpenModal.value = value;
  if (inputRef.value) {
    inputRef.value.value = "";
  }
};
const resulCropSuccess = (result: any) => {
  url.value = result.dataURL;
  imageFile.value = result.file;
};
onBeforeMount(async () => {
  await loadData();
  getImage();
});
</script>

<template>
  <div
    class="w-full h-[80dvh] flex flex-col items-center bg-gray-100 mx-auto p-5 mt-6"
  >
    <div>
      <div>
        <NuxtImg
          @click="triggerFileInput"
          class="w-40 h-36 mt-2 rounded-full"
          :src="url ? url : defaultImage"
          alt="Avatar"
        />
        <input
          hidden
          ref="inputRef"
          accept="image/*"
          type="file"
          @change="changeFile"
        />
        <div class="flex justify-center gap-5 mt-5">
          <UButton
            v-show="imageFile"
            icon="i-heroicons-arrow-uturn-left-solid"
            color="white"
            @click="handleUndoCrop"
          />
          <UButton
            v-show="imageFile"
            color="blue"
            variant="ghost"
            @click="handleUploadFile"
            >confrim</UButton
          >
        </div>
        <UModal v-model="isOpenModal" :overlay="false">
          <ACropImage
            :urlImage="url"
            @closeModal="updateCloseModal"
            @result="resulCropSuccess"
          />
        </UModal>
      </div>
    </div>
    <UForm
      class="flex flex-col gap-5"
      :schema="schema"
      :state="profile"
      @submit="handleUpadteAccout"
    >
      <UFormGroup label="username" name="username">
        <UInput
          type="text"
          disabled
          v-model="profile.username"
          placeholder="username"
        />
      </UFormGroup>
      <UFormGroup label="name" name="name">
        <UInput type="text" v-model="profile.name" placeholder="name" />
      </UFormGroup>
      <UFormGroup label="mobile" name="mobile">
        <UInput type="text" v-model="profile.mobile" placeholder="mobile" />
      </UFormGroup>
      <div class="flex justify-center gap-5 mt-5">
        <UButton color="blue" type="submit">save</UButton>
      </div>
    </UForm>
  </div>
</template>

<style scoped></style>
