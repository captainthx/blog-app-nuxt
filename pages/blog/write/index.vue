<script setup lang="ts">
import { z } from "zod";
import { uploadFile } from "~/service/file";
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
  if (tag.value.length > 20) {
    showToastError("Tag is too long", "Tag must be less than 20 characters");
    tag.value = "";
    return;
  }
  if (body.tags.length === 4) {
    showToastError("Tag limit reached", "You can only add up to 6 tags");
    tag.value = "";
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

const maxTagDisplay = 10; // Maximum characters to display before truncating

const truncateTag = (tag: string) => {
  if (tag.length <= maxTagDisplay) return tag;
  return `${tag.slice(0, maxTagDisplay)}...`;
};
</script>

<template>
  <div class="w-full mx-auto h-[80dvh]">
    <div class="flex flex-col justify-center items-center">
      <p class="text-center font-semibold text-2xl text-pretty mt-5">
        Create post
      </p>
      <NuxtImg
        @click="inputRef?.click()"
        class="p-2 size-40 rounded-full"
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
        <div class="flex flex-row gap-2">
          <div class="flex flex-wrap gap-2 w-full">
            <div
              v-motion
              :initial="{ opacity: 0, y: 100 }"
              :enter="{
                opacity: 1,
                y: 0,
                scale: 1,
              }"
              :delay="200"
              v-for="tag in body.tags"
              :key="tag"
              variant="soft"
              class="flex flex-wrap items-center bg-primary bg-opacity-25 rounded-md text-center truncate dark:bg-opacity-50"
            >
              <span :title="tag" class="mr-1">{{ truncateTag(tag) }}</span>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark"
                size="xs"
                class="ml-1"
                @click="removeTag(tag)"
              />
            </div>
            <UInput
              v-if="body.tags.length < 4"
              v-model="tag"
              type="text"
              placeholder="Add a tag..."
              :ui="{ icon: { trailing: { pointer: '' } } }"
              :autofocus="true"
              @keydown.enter.prevent="handleAddTag()"
              class="flex-grow min-w-[150px]"
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
          </div>
          <!-- <USelect
            class=""
            v-model="body.status"
            :options="postStatus"
            option-attribute="type"
          /> -->
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
