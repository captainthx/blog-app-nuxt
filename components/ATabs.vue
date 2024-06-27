<script setup lang="ts">
import type { PropType } from "vue";
import type { Tabs } from "~/types";

const props = defineProps({
  data: {
    type: Array as PropType<Tabs[]>,
  },
  newTab: {
    type: Object as PropType<{
      title: string;
      content: string[];
    }>,
    requered: false,
  },
});
const tab = ref<Tabs[]>(props.data ?? []);
const activeKey = ref<number>(
  props.data && props.data.length > 0 ? props.data[0].key : 0
);
const newTabIndex = ref<number>(tab.value.length);
const emit = defineEmits(["update:tabs"]);

/**
 * ตรวจสอบการเปลี่ยนแปลงของข้อมูลและอัปเดตค่าของแท็บ
 * @param {Array} props.data - ข้อมูลที่จะตรวจสอบการเปลี่ยนแปลง
 * @param {Array} newData - ข้อมูลใหม่ที่ได้รับการอัปเดต
 */
watch(
  () => props.data,
  (newData) => {
    if (!newData || newData.length === 0) {
      tab.value = [];
      newTabIndex.value = 0;
    } else {
      tab.value = newData;
      activeKey.value = newData[0].key;
    }
  },
  { deep: true }
);

const addTab = () => {
  if (!props.newTab) return;
  const newTab = {
    title: props.newTab.title,
    content: props.newTab.content,
    key: ++newTabIndex.value,
    closable: true,
  };
  tab.value.push(newTab);
  emit("update:tabs", tab.value);
};

/**
 * ฟังก์ชัน `removeTab` ใช้สำหรับลบแท็บที่มีคีย์ตามที่ระบุ
 * @param {number} targetKey คีย์ของแท็บที่ต้องการลบ
 */
const removeTab = (targetKey: number) => {
  const targetIndex = tab.value.findIndex((pane) => pane.key === targetKey);
  if (targetIndex !== -1) {
    tab.value.splice(targetIndex, 1);
    if (activeKey.value === targetKey) {
      activeKey.value = tab.value.length > 0 ? tab.value[0].key : 0;
    }
  }
};

const selectTab = (key: number) => {
  activeKey.value = key;
};

const changeContentTab = (content: string[], key: number) => {
  const targetIndex = tab.value.findIndex((pane) => pane.key === key);
  if (targetIndex !== -1) {
    tab.value[targetIndex].content =
      tab.value[targetIndex].content.concat(content);
  }
};
</script>

<template>
  <button @click="addTab()" class="bg-blue-500 text-white px-4 py-2 rounded">
    Add Tab
  </button>
  <div class="mt-4 w-full">
    <UCard>
      <template #header>
        <div class="grid grid-cols-4 gap-2">
          <div
            v-for="pane in tab"
            :key="pane.key"
            @click="selectTab(pane.key)"
            :class="[
              ' px-4 py-2 cursor-pointer border-b-2 border-transparent',
              { 'border-green-500 font-bold': pane.key === activeKey },
            ]"
          >
            {{ pane.title }}
            <span
              v-if="pane.closable"
              @click.stop="removeTab(pane.key)"
              class="ml-2 text-red-500 cursor-pointer"
              >x</span
            >
          </div>
        </div>
      </template>

      <div v-for="pane in tab" :key="pane.key">
        <div v-if="pane.key === activeKey">
          <span v-for="(item, index) in pane.content" :key="index">
            {{ item }} <br />
          </span>
        </div>
      </div>
      <template #footer>
        <button
          @click="changeContentTab('Updated Content', activeKey)"
          class="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Change Content
        </button>
      </template>
    </UCard>
  </div>
</template>

<style scoped>
.tab {
  border-bottom-width: 2px;
  border-color: transparent;
}
.tab.active {
  border-color: #3b82f6; /* Tailwind's blue-500 */
  font-weight: bold;
}
</style>
