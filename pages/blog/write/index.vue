<script setup lang="ts">
import { AxiosError } from "axios";
import { getFile } from "~/service/file";
import { createPost } from "~/service/post";

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
const content = ref<string>("");
const tagsList = ref<string[]>([]);
const tag = ref<string>("");
const toast = useToast();
const body = reactive({
  title: "",
  tags: [] as string[],
  content: "",
  status: "publish",
});

const removeTag = (tag: string) => {
  const tagIndex = tagsList.value.findIndex((t) => t === tag);
  body.tags.splice(tagIndex, 1);
};
const handleAddTag = () => {
  if (tag.value === "") {
    toast.add({
      title: "Tag is empty",
      description: "Please enter a tag",
      timeout: 3000,
      color: "red",
    });
  }
  if (body.tags.length === 6) {
    toast.add({
      title: "Tag limit reached",
      description: "You can only add up to 6 tags",
      timeout: 3000,
      color: "red",
    });
    return;
  }
  body.tags.push(tag.value);
};

const handleUpdateContent = (value: string) => {
  body.content = value;
};

const handleCreatePost = async () => {
  console.log("create post");
  try {
    const res = await createPost(body);
    if (res.status === 200 && res.data.code === 200) {
      toast.add({
        title: "Create post success",
        description: "You have successfully created a post",
        timeout: 3000,
      });
      // useRouter().push("/blog");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError;
      const responseData = axiosError.response?.data as { message: string };
      toast.add({
        title: "Create post failed",
        description: responseData.message,
        timeout: 3000,
        color: "red",
      });
    }
  }
};
</script>

<template>
  <div class="flex flex-col w-full gap-2 items-center">
    <div class="flex gap-2">
      <div>
        <UInput
          class="w-full"
          type="text"
          v-model="body.title"
          placeholder="title"
          :autofocus="true"
        />
      </div>
      <div>
        <USelect
          v-model="body.status"
          :options="postStatus"
          option-attribute="type"
        />
      </div>
    </div>
    <div class="w-4/12">
      <UInput
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
    </div>
  </div>
  <div class="flex w-4/12 mx-auto mt-2 gap-2">
    <div
      class="relative text-center w-24 h-7 rounded-md border-2 border-stone-100"
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
  <div class="mt-5 mb-2">
    <ATiptapEditor
      :value="content"
      :mode="'editor'"
      @update:value="handleUpdateContent"
    />
  </div>
  <div class="flex justify-end gap-2">
    <UButton @click="handleCreatePost">write</UButton>
  </div>
</template>
