<script setup lang="ts">
const lowlight = TiptapcreateLowlight(Tiptapall);
const editor = useEditor({
  extensions: [
    TiptapStarterKit.configure({
      codeBlock: false,
    }),
    TiptapCodeBlockLowlight.configure({ lowlight }),
  ],
  editorProps: {
    attributes: {
      class: "bg-red-200 h-52",
    },
  },
});

onMounted(() => {
  unref(editor)?.commands.setContent("hello world");
});

onBeforeUnmount(() => {
  unref(editor)?.destroy();
});
</script>

<template>
  <div>
    <div v-if="editor">
      <UButton
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :color="editor.isActive('bold') ? 'primary' : 'gray'"
      >
        Bold
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :color="editor.isActive('italic') ? 'primary' : 'gray'"
      >
        Italic
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :color="editor.isActive('strike') ? 'primary' : 'gray'"
      >
        Strike
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleCode().run()"
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        :color="editor.isActive('code') ? 'primary' : 'gray'"
      >
        Code
      </UButton>
      <UButton @click="editor.chain().focus().unsetAllMarks().run()">
        Clear marks
      </UButton>
      <UButton @click="editor.chain().focus().clearNodes().run()">
        Clear nodes
      </UButton>
      <UButton
        @click="editor.chain().focus().setParagraph().run()"
        :color="editor.isActive('paragraph') ? 'primary' : 'gray'"
      >
        Paragraph
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :color="editor.isActive('heading', { level: 1 }) ? 'primary' : 'gray'"
      >
        H1
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :color="editor.isActive('heading', { level: 2 }) ? 'primary' : 'gray'"
      >
        H2
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :color="editor.isActive('heading', { level: 3 }) ? 'primary' : 'gray'"
      >
        H3
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :color="editor.isActive('heading', { level: 4 }) ? 'primary' : 'gray'"
      >
        H4
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
        :color="editor.isActive('heading', { level: 5 }) ? 'primary' : 'gray'"
      >
        H5
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
        :color="editor.isActive('heading', { level: 6 }) ? 'primary' : 'gray'"
      >
        H6
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleBulletList().run()"
        :color="editor.isActive('bulletList') ? 'primary' : 'gray'"
      >
        Bullet list
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleOrderedList().run()"
        :color="editor.isActive('orderedList') ? 'primary' : 'gray'"
      >
        Ordered list
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :color="editor.isActive('codeBlock') ? 'primary' : 'gray'"
      >
        Code block
      </UButton>
      <UButton
        @click="editor.chain().focus().toggleBlockquote().run()"
        :color="editor.isActive('blockquote') ? 'primary' : 'gray'"
      >
        Blockquote
      </UButton>
      <UButton @click="editor.chain().focus().setHorizontalRule().run()">
        Horizontal rule
      </UButton>
      <UButton @click="editor.chain().focus().setHardBreak().run()">
        Hard break
      </UButton>
      <UButton
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
      >
        Undo
      </UButton>
      <UButton
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()"
      >
        Redo
      </UButton>
    </div>
    <TiptapEditorContent :editor="editor" />
  </div>
</template>
