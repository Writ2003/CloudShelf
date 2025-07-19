// RichTextEditor.jsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Mention from '@tiptap/extension-mention';
import { forwardRef, useImperativeHandle, useState } from 'react';

const RichTextEditor = forwardRef(({ onChange, initialContent, placeholderText = 'Type something...', maxCharLimit, className}, ref) => {
  const [charCount, setCharCount] = useState(0);
  const editor = useEditor({
    extensions: [StarterKit.configure({ history: true }), Underline, Placeholder.configure({
      placeholder: placeholderText,
    }),
     Mention.configure({
      HTMLAttributes: {
        class: '.mention',
      },
      suggestion: { /* optional dropdown handler */ },
    }),
  ],
    content: initialContent || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const plainText = editor.getText();
      setCharCount(plainText.length); // 👈 update count
      if (plainText.length <= maxCharLimit || plainText.length <= 500) {
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
    clear: () => editor?.commands.clearContent(),
    getHTML: () => editor?.getHTML(),
  }));

  return (
    <div>
      <EditorContent ref={ref} editor={editor} className={`ProseMirror border border-gray-300 bg-gray-50 text-black rounded-md p-3 ${!maxCharLimit ?'min-h-[150px]': className}`}/>
      <p className="text-xs text-right text-gray-400 mt-1">
        {maxCharLimit ? `${charCount}/${maxCharLimit}` :'' }
      </p>
    </div>
  )

});

export default RichTextEditor;