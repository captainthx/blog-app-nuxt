<script setup lang="ts">
import { z } from "zod";
import { getProfile } from "~/service/account";
import { getFile, uploadFile } from "~/service/file";
import type { AccountResponse } from "~/types";

const url = ref<string>("");
const inputRef = ref<HTMLInputElement | null>(null);
const imageFile = ref<File | null>(null);
let profile = reactive<AccountResponse>({
  username: "",
  name: "",
  mobile: "",
  id: 0,
  cdt: 0,
  udt: 0,
  avatar: "",
});
const isOpenModal = ref<boolean>(false);

const schema = z.object({
  name: z.string().min(6, "name Must be at least 6 characters"),
  mobile: z.string().min(10, "Must be at least 10 characters"),
});

type Schema = z.output<typeof schema>;
const handleUploadFile = async () => {
  if (imageFile.value) {
    const formData = new FormData();
    formData.append("file", imageFile.value);
    formData.append("compress", "true");
    try {
      const res = await uploadFile(formData);
      if (res.status === 200 && res.data.result) {
        console.log(res.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const triggerFileInput = () => {
  if (inputRef.value) {
    inputRef.value.click();
  }
};
const changeFile = (event: Event) => {
  console.log("change file");
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
const openModal = () => {
  isOpenModal.value = true;
};

const getImage = async () => {
  try {
    const res = await getFile(
      "8f1936ae-eef0-4a0c-9596-f44c4c790660_captain.png"
    );
    if (res.status === 200 && res.data) {
      url.value = URL.createObjectURL(res.data);
    }
  } catch (error) {
    console.log(error);
  }
};
const loadData = async () => {
  try {
    const res = await getProfile();
    if (res.status === 200 && res.data.result) {
      profile = res.data.result;
    }
  } catch (error) {
    console.log(error);
  }
};
const handleUndo = () => {
  imageFile.value = null;
  url.value = "";
};

const updateCloseModal = (value: boolean) => {
  console.log("emit from child", value);
  isOpenModal.value = false;
  url.value = "";
  if (inputRef.value) {
    inputRef.value.value = "";
  }
};
const resulCropSuccess = (result: any) => {
  console.log("result", result);
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
          :src="
            url
              ? url
              : 'https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg'
          "
          alt="Avatar"
        />
        <input
          hidden
          ref="inputRef"
          accept="image/*"
          type="file"
          @change="changeFile"
        />
        <UModal v-model="isOpenModal" :overlay="false">
          <ACropImage
            :urlImage="url"
            @closeModal="updateCloseModal"
            @result="resulCropSuccess"
          />
        </UModal>
      </div>
    </div>
    <UForm class="flex flex-col gap-5" :schema="schema" :state="profile">
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
    </UForm>
    <div class="flex justify-center gap-5 mt-5">
      <UButton
        icon="i-heroicons-arrow-uturn-left-solid"
        color="white"
        @click="handleUndo"
      />
      <UButton color="blue" @click="handleUploadFile">save</UButton>
    </div>
  </div>
</template>

<style scoped></style>
