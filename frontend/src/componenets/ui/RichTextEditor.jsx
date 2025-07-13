// RichTextEditor.jsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';

const MAX_CHAR_LIMIT = 100;

const RichTextEditor = forwardRef(({ onChange, initialContent }, ref) => {
  const [charCount, setCharCount] = useState(0);
  const editor = useEditor({
    extensions: [StarterKit.configure({ history: true }), Underline],
    content: initialContent || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const plainText = editor.getText();
      setCharCount(plainText.length); // 👈 update count
      if (plainText.length <= MAX_CHAR_LIMIT) {
        onChange(html);
      } else {
        editor.commands.undo();
      }
    },
  });

  useImperativeHandle(ref, () => ({
    toggleBold: () => editor?.chain().focus().toggleBold().run(),
    toggleItalic: () => editor?.chain().focus().toggleItalic().run(),
    toggleUnderline: () => editor?.chain().focus().toggleUnderline().run(),
    toggleStrike: () => editor?.chain().focus().toggleStrike().run(),
    undo: () => editor?.chain().focus().undo().run(),
    redo: () => editor?.chain().focus().redo().run(),
  }));

  return (
    <div>
      <EditorContent editor={editor} />
      <p className="text-xs text-right text-gray-400 mt-1">
        {charCount}/{MAX_CHAR_LIMIT}
      </p>
  </div>
  )

});

export default RichTextEditor;