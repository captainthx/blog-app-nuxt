<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { AxiosError } from "axios";
import { z } from "zod";
import { updateAccount } from "~/service/account";
import { getFile, uploadFile } from "~/service/file";
import { useProfileStore } from "~/store/profileStore";
import type { AccountResponse, UpdateAccountRequest } from "~/types";

const previewUrl = ref<string>("");
const avatarUrl = ref<string>("");
const defaultImage = import.meta.env.VITE_BASE_IMAGE;
const inputRef = ref<HTMLInputElement | null>(null);
const imageFile = ref<File | null>(null);
const { profile, updateProfile } = useProfileStore() as {
  profile: AccountResponse;
  updateProfile: (profile: AccountResponse) => void;
};
const updateAccountRequest = reactive<UpdateAccountRequest>({});
const isOpenModal = ref<boolean>(false);
const toast = useToast();
const schema = z.object({
  name: z.string().min(6, "name Must be at least 6 characters"),
  mobile: z
    .string()
    .min(10, "Must be at least 10 characters")
    .max(10, "Must be at most 10 characters"),
});
const editImage = ref<boolean>(false);

const handleUploadFile = async () => {
  if (imageFile.value) {
    const formData = new FormData();
    formData.append("file", imageFile.value);
    formData.append("compress", "true");
    try {
      const res = await uploadFile(formData);
      if (res.status === 200 && res.data.result) {
        updateAccountRequest.avatar = res.data.result.imageName;
        updateProfile({ ...profile, avatar: res.data.result.imageName });
        avatarUrl.value = URL.createObjectURL(imageFile.value);
        imageFile.value = null;
        await handleUpadteAccout();
        editImage.value = false;
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const handleUpadteAccout = async () => {
  try {
    const res = await updateAccount(updateAccountRequest);
    if (res.status === 200 && res.data.result) {
      toast.add({
        title: "Success",
        description: "Update Profile success",
        color: "green",
        timeout: 3000,
      });
      updateProfile(res.data.result);
      await getImage();
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
      previewUrl.value = e.target?.result as string;
      isOpenModal.value = true;
    };
    reader.readAsDataURL(file);
  }
};

const getImage = async () => {
  try {
    const res = await getFile(profile.avatar);
    if (res.status === 200 && res.data) {
      avatarUrl.value = URL.createObjectURL(res.data);
    }
  } catch (error) {
    console.log(error);
  }
};
const handleUndoCrop = () => {
  imageFile.value = null;
  getImage();
  editImage.value = false;
};

const updateCloseModal = (value: boolean) => {
  isOpenModal.value = value;
  if (inputRef.value) {
    inputRef.value.value = "";
  }
};
const resulCropSuccess = (result: any) => {
  avatarUrl.value = result.dataURL;
  previewUrl.value = result.dataURL;
  imageFile.value = result.file;
};

const handleShowEditImage = () => {
  editImage.value = true;
};

onBeforeMount(async () => {
  await getImage();
  if (profile) {
    updateAccountRequest.name = profile.name;
    updateAccountRequest.mobile = profile.mobile;
  }
});
</script>

<template>
  <div class="h-[80dvh] flex items-center mt-6">
    <div class="grid grid-cols-2 w-full h-full gap-5 p-2">
      <div
        class="flex flex-col justify-center items-center p-2 bg-gray-50 border-2 border-gray-100 rounded-xl dark:bg-transparent"
      >
        <NuxtImg
          v-if="editImage == false"
          class="size-48 mt-2 rounded-full border-4 border-opacity-50 border-gray-200"
          :src="avatarUrl ? avatarUrl : defaultImage"
          alt="Avatar"
        />
        <NuxtImg
          v-if="editImage == true"
          @click="triggerFileInput"
          class="size-48 mt-2 rounded-full"
          :src="previewUrl ? previewUrl : defaultImage"
          alt="Avatar"
        />
        <input
          hidden
          ref="inputRef"
          accept="image/*"
          type="file"
          @change="changeFile"
        />
        <div class="pt-10" v-show="!editImage">
          <UButton
            class="hover:animate-bounce"
            variant="ghost"
            @click="handleShowEditImage"
            >change profile</UButton
          >
        </div>
        <div class="flex justify-center gap-5 mt-5" v-show="editImage == true">
          <UButton
            icon="i-heroicons-arrow-uturn-left-solid"
            size="xs"
            color="white"
            @click="handleUndoCrop"
          />
          <UButton color="blue" variant="ghost" @click="handleUploadFile"
            >confrim</UButton
          >
        </div>
        <UModal v-model="isOpenModal">
          <ACropImage
            :urlImage="previewUrl"
            @closeModal="updateCloseModal"
            @result="resulCropSuccess"
          />
        </UModal>
      </div>
      <div
        class="flex flex-col justify-center items-center bg-gray-50 border-2 border-gray-100 dark:bg-transparent rounded-xl"
      >
        <h1 class="text-2xl font-semibold">Profile detail</h1>
        <UForm
          class="flex flex-col gap-4 w-5/6"
          :schema="schema"
          :state="updateAccountRequest"
          @submit="handleUpadteAccout"
        >
          <UFormGroup label="username" name="username">
            <UInput
              type="text"
              v-model:value="profile.username"
              disabled
              placeholder="username"
            />
          </UFormGroup>
          <UFormGroup label="name" name="name">
            <UInput
              type="text"
              v-model="updateAccountRequest.name"
              placeholder="name"
            />
          </UFormGroup>
          <UFormGroup label="mobile" name="mobile">
            <UInput
              type="text"
              v-model="updateAccountRequest.mobile"
              placeholder="mobile"
            />
          </UFormGroup>
          <div class="flex justify-center gap-5 mt-5">
            <UButton color="blue" type="submit">save</UButton>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
