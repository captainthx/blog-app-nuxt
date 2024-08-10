<script setup lang="ts">
import { z } from "zod";
import { getFile, uploadFile } from "~/service/file";
import { createPost } from "~/service/post";
import { showToastError, showToastSuccess } from "~/utils/notification";
import { handleAxiosError, handleZodError } from "~/utils/handleError";
import { AxiosError } from "axios";

const postStatus = [
  {
    type: "Publish",
    value: "publish",
  },
  {
    type: "Private",
    value: "private",
  },
];
const previewImage = ref<string>("");
const defaultImage = import.meta.env.VITE_BASE_IMAGE;
const inputRef = ref<HTMLInputElement | null>(null);
const tag = ref<string>("");
const imageFile = ref<File | null>(null);

const schema = z.object({
  title: z.string().min(6, "Titel Must be at least 10 characters"),
  content: z.string().min(10, "Content Must be at least 10 characters"),
  tags: z
    .array(z.string())
    .min(1, "At least one tag is required")
    .max(6, "Maximum 6 tags allowed"),
  status: z.enum(["publish", "private"]).default("publish"),
  postImage: z.string().min(1, "Post image is required"),
});
type CreatePostRequest = z.infer<typeof schema>;

const body = reactive<CreatePostRequest>({
  postImage: "",
  title: "",
  tags: [],
  content: "",
  status: "publish",
});

const removeTag = (tag: string) => {
  const tagIndex = body.tags.findIndex((t) => t === tag);
  body.tags.splice(tagIndex, 1);
};
const handleAddTag = () => {
  if (tag.value === "") {
    showToastError("Tag is empty", "Please enter a tag");
    return;
  }
  if (body.tags.length === 6) {
    showToastError("Tag limit reached", "You can only add up to 6 tags");
    return;
  }
  body.tags.push(tag.value);
  tag.value = "";
};

const handleUpdateContent = (value: string) => {
  body.content = value;
};

const handleCreatePost = async () => {
  await handleUploadFile();
  try {
    const validate = schema.parse(body);
    const postData: Omit<CreatePostRequest, "postImage"> & {
      postImage: string;
    } = {
      ...validate,
      postImage: validate.postImage,
    };
    const res = await createPost(postData);
    if (res.status === 200 && res.data.code === 200) {
      showToastSuccess(
        "Create post success",
        "You have successfully created a post"
      );
      useRouter().push({ name: "index" });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      handleZodError(error);
    } else if (error instanceof AxiosError) {
      handleAxiosError("Create post", error);
    }
  }
};

const changeFile = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.item(0);
  if (file) {
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleUploadFile = async () => {
  if (imageFile.value) {
    const formData = new FormData();
    formData.append("file", imageFile.value);
    formData.append("compress", "true");
    try {
      const res = await uploadFile(formData);
      if (res.status === 200 && res.data.result) {
        body.postImage = res.data.result.imageName;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        handleAxiosError("Upload post image", error);
      }
    }
  }
};

const handleCancel = () => {
  previewImage.value = "";
  imageFile.value = null;
};
</script>

<template>
  <div class="w-full mx-auto h-[80dvh] mt-">
    <div class="flex flex-col justify-center items-center">
      <p class="text-center font-semibold text-2xl text-pretty">Create post</p>
      <NuxtImg
        @click="inputRef?.click()"
        class="p-2 size-40"
        :src="previewImage ? previewImage : defaultImage"
      />
      <input
        hidden
        ref="inputRef"
        accept="image/*"
        type="file"
        @change="changeFile"
      />
      <div class="w-full flex flex-row justify-center items-center">
        <UInput
          class="w-2/4"
          type="text"
          v-model="body.title"
          placeholder="title"
          :autofocus="true"
        />
      </div>
      <div class="flex flex-col w-full justify-center items-center mt-2">
        <div class="flex flex-row w-full justify-center gap-2">
          <UInput
            class="w-2/5"
            v-model="tag"
            type="text"
            placeholder="tag"
            :ui="{ icon: { trailing: { pointer: '' } } }"
            :autofocus="true"
          >
            <template #trailing>
              <UButton
                color="gray"
                variant="link"
                icon="i-heroicons-plus-small-solid"
                :padded="false"
                @click="handleAddTag()"
              />
            </template>
          </UInput>
          <USelect
            class=""
            v-model="body.status"
            :options="postStatus"
            option-attribute="type"
          />
        </div>
        <div class="flex space-x-2">
          <div
            class="relative text-center w-20 h-8 p-1 mt-1 truncate rounded-md border-2 border-stone-100"
            v-for="tag in body.tags"
            :key="tag"
          >
            {{ tag }}
            <span
              class="cursor-pointer absolute -top-2 right-0"
              @click="removeTag(tag)"
              >x</span
            >
          </div>
        </div>
      </div>

      <div class="flex flex-col mt-2">
        <ATiptapEditor
          :value="body.content"
          :mode="'editor'"
          @update:value="handleUpdateContent"
        />
        <div class="flex justify-end mb-2 mt-2 gap-2">
          <UButton variant="ghost" @click="handleCancel">cancel</UButton>
          <UButton variant="ghost" @click="handleCreatePost">write</UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
