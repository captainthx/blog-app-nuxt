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
  tag.value = "";
};

const handleUpdateContent = (value: string) => {
  body.content = value;
};

const handleCreatePost = async () => {
  try {
    const res = await createPost(body);
    if (res.status === 200 && res.data.code === 200) {
      toast.add({
        title: "Create post success",
        description: "You have successfully created a post",
        timeout: 3000,
      });
      useRouter().push({ name: "index" });
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
  <div class="w-full mx-auto h-[80dvh] mt-">
    <div class="flex flex-col justify-center items-center">
      <p class="text-2xl">Create post</p>
      <NuxtImg
        class="w-1/5 p-2"
        src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
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
          :value="content"
          :mode="'editor'"
          @update:value="handleUpdateContent"
        />
        <div class="flex justify-end mb-1 2xl:mb-10 2xl:mt-5">
          <UButton @click="handleCreatePost">write</UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media screen and (min-width: 2300px) {
  .custom-responsive {
    /* Add your custom styles here */
    background-color: lightblue;
    padding: 20px;
  }
}
</style>
