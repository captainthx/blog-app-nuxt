<script setup lang="ts">
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import { StarterKit } from "@tiptap/starter-kit";

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    default: "common",
  },
});
const emit = defineEmits(["update:value"]);

const editor = useEditor({
  autofocus: "start",
  extensions: [
    StarterKit.configure({
      bulletList: false,
      blockquote: false,
      heading: false,
    }),
    TextAlign.configure({
      types: ["heading", "paragraph", "heading-wrapper"],
    }),
    BulletList.configure({
      HTMLAttributes: {
        class: "list-disc pl-8",
      },
    }),
    Blockquote.configure({
      HTMLAttributes: {
        class: "border-l-8  pl-8",
      },
    }),
    Heading.extend({
      levels: [1, 2, 3, 4, 5, 6],
      renderHTML({ node, HTMLAttributes }) {
        const level = this.options.levels.includes(node.attrs.level)
          ? node.attrs.level
          : this.options.levels[0];
        const classes: { [index: number]: string } = {
          1: "text-4xl",
          2: "text-3xl",
          3: "text-2xl",
          4: "text-xl",
          5: "text-lg",
          6: "text-base",
        };
        return [
          "div",
          { class: `heading-wrapper ${classes[level]}` },
          [`h${level}`, HTMLAttributes, 0],
        ];
      },
    }).configure({ levels: [1, 2, 3, 4, 5, 6] }),
  ],
  editorProps: {
    attributes: {
      class:
        "h-64 overflow-auto focus:outline-none border-2 rounded-md p-4 shadow-sm ",
    },
  },
  content: props.value,
  onUpdate(props) {
    emit("update:value", props.editor.getHTML());
  },
});

onBeforeUnmount(() => {
  unref(editor)?.destroy();
});

const showToolBar = computed(() => {
  return props.mode != "common";
});
</script>

<template>
  <div>
    <ClientOnly>
      <div v-if="editor">
        <div
          :class="
            showToolBar
              ? 'flex justify-around align-middle items-center border-2 rounded-md p-2'
              : 'flex justify-end'
          "
        >
          <div>
            <UButton
              @click="editor.chain().focus().toggleBold().run()"
              :disabled="!editor.can().chain().focus().toggleBold().run()"
              :color="editor.isActive('bold') ? 'primary' : 'gray'"
            >
              B
            </UButton>
            <UButton
              @click="editor.chain().focus().toggleItalic().run()"
              :disabled="!editor.can().chain().focus().toggleItalic().run()"
              :color="editor.isActive('italic') ? 'primary' : 'gray'"
            >
              /
            </UButton>

            <UButton
              v-show="showToolBar"
              @click="editor.chain().focus().toggleStrike().run()"
              :disabled="!editor.can().chain().focus().toggleStrike().run()"
              :color="editor.isActive('strike') ? 'primary' : 'gray'"
            >
              T
            </UButton>
            <UButton
              v-show="showToolBar"
              @click="editor.chain().focus().unsetAllMarks().run()"
              variant="ghost"
            >
              clear
            </UButton>
          </div>
          <div>
            <UButton
              v-show="showToolBar"
              @click="editor.chain().focus().setParagraph().run()"
              :color="editor.isActive('paragraph') ? 'primary' : 'gray'"
            >
              P
            </UButton>
            <UButton
              v-show="showToolBar"
              @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
              :color="
                editor.isActive('heading', { level: 1 }) ? 'primary' : 'gray'
              "
            >
              H1
            </UButton>
            <UButton
              v-show="showToolBar"
              @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
              :color="
                editor.isActive('heading', { level: 2 }) ? 'primary' : 'gray'
              "
            >
              H2
            </UButton>
            <UButton
              v-show="showToolBar"
              @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
              :color="
                editor.isActive('heading', { level: 3 }) ? 'primary' : 'gray'
              "
            >
              H3
            </UButton>
            <UButton
              v-show="showToolBar"
              @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
              :color="
                editor.isActive('heading', { level: 4 }) ? 'primary' : 'gray'
              "
            >
              H4
            </UButton>
            <UButton
              v-show="showToolBar"
              @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
              :color="
                editor.isActive('heading', { level: 5 }) ? 'primary' : 'gray'
              "
            >
              H5
            </UButton>
            <UButton
              v-show="showToolBar"
              @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
              :color="
                editor.isActive('heading', { level: 6 }) ? 'primary' : 'gray'
              "
            >
              H6
            </UButton>
          </div>
          <div v-show="showToolBar" class="flex flex-rows justify-center gap-1">
            <UButton
              icon="i-heroicons-list-bullet-20-solid"
              @click="editor.chain().focus().toggleBulletList().run()"
              :color="editor.isActive('bulletList') ? 'primary' : 'gray'"
            />
            <UButton
              @click="editor.chain().focus().toggleBlockquote().run()"
              :color="editor.isActive('blockquote') ? 'primary' : 'gray'"
              >Quote</UButton
            >
            <UButton
              icon="i-heroicons-bars-3-bottom-left-20-solid"
              @click="editor.chain().focus().setTextAlign('left').run()"
              :color="
                editor.isActive({ textAlign: 'left' }) ? 'primary' : 'gray'
              "
            >
            </UButton>
            <UButton
              icon="i-heroicons-bars-3-20-solid"
              @click="editor.chain().focus().setTextAlign('center').run()"
              :color="
                editor.isActive({ textAlign: 'center' }) ? 'primary' : 'gray'
              "
            />

            <UButton
              icon="i-heroicons-bars-3-bottom-right-20-solid"
              @click="editor.chain().focus().setTextAlign('right').run()"
              :color="
                editor.isActive({ textAlign: 'right' }) ? 'primary' : 'gray'
              "
            >
            </UButton>
            <UButton
              icon="i-heroicons-bars-4-20-solid"
              @click="editor.chain().focus().setTextAlign('justify').run()"
              :color="
                editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'gray'
              "
            >
            </UButton>
          </div>
          <div v-show="showToolBar">
            <UButton
              icon="i-heroicons-arrow-uturn-left-20-solid"
              @click="editor.chain().focus().undo().run()"
              :disabled="!editor.can().chain().focus().undo().run()"
              color="gray"
              variant="ghost"
            />
            <UButton
              icon="i-heroicons-arrow-uturn-right-20-solid"
              @click="editor.chain().focus().redo().run()"
              :disabled="!editor.can().chain().focus().redo().run()"
              color="gray"
              variant="ghost"
            />
          </div>
        </div>
      </div>
      <TiptapEditorContent :editor="editor" />
    </ClientOnly>
  </div>
</template>

<style scope>
.heading-wrapper {
  margin: 0;
  padding: 0;
}
</style>
