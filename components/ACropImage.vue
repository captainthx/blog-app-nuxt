<script setup lang="ts">
import VuePictureCropper, { cropper } from "vue-picture-cropper";

const props = defineProps({
  urlImage: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["closeModal", "result"]);
const result = reactive({
  dataURL: "",
  blobURL: "",
  file: null as File | null,
});
const ready = () => {
  if (props.urlImage) {
    console.log("Cropper is ready.");
  }
};
const cancel = () => {
  console.log("Cancel");
  emit("closeModal", false);
};

const clear = () => {
  if (!cropper) return;
  cropper.clear();
};
const reset = () => {
  if (!cropper) return;
  cropper.reset();
};

const getResult = async () => {
  if (!cropper) return;
  const base64 = cropper.getDataURL();
  const blob: Blob | null = await cropper.getBlob();
  if (!blob) return;

  const file = await cropper.getFile({
    fileName: "cropped.jpg",
  });
  console.log({ base64, blob, file });
  result.dataURL = base64;
  result.blobURL = URL.createObjectURL(blob);
  result.file = file;
  console.log("Cropped image is ready.", result, file);
  emit("closeModal", false);
  emit("result", result);
};
</script>

<template>
  <div>
    <div class="flex flex-col gap-5 mx-auto w-full">
      <div class="flex justify-center gap-5 pt-2 mt-2 items-center">
        <p>Picture Cropping</p>
        <UButton @click="cancel" color="gray" variant="ghost">Cancel</UButton>
        <UButton @click="clear" color="gray" variant="ghost">Clear</UButton>
        <UButton @click="reset" color="gray" variant="ghost">Reset</UButton>
        <UButton @click="getResult">Crop</UButton>
      </div>
      <div class="flex justify-center">
        <VuePictureCropper
          :img="urlImage"
          :options="{
            viewMode: 1,
            dragMode: 'crop',
            aspectRatio: 16 / 9,
          }"
          @ready="ready"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
