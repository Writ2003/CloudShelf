import { useState, useRef } from 'react';
import RichTextEditor from './RichTextEditor';
import { Bold, Italic, Redo, Strikethrough, Underline, Undo } from 'lucide-react';

const QuickReplyBox = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const editorRef = useRef(); // 👈 Ref for editor
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 mt-6">
      <div className='flex'>
        <h3 className="font-semibold mb-2">Quick Reply</h3>
        <div className='ml-auto flex gap-1.5'>
          <button onClick={() => editorRef.current?.toggleBold()}><Bold size={16} className='hover:bg-slate-200 rounded-md cursor-pointer'/></button>
          <button onClick={() => editorRef.current?.toggleItalic()}><Italic size={16} className='hover:bg-slate-200 rounded-md cursor-pointer'/></button>
          <button onClick={() => editorRef.current?.toggleUnderline()}><Underline size={16} className='hover:bg-slate-200 rounded-md cursor-pointer'/></button>
          <button onClick={() => editorRef.current?.toggleStrike()}><Strikethrough size={16} className='hover:bg-slate-200 rounded-md cursor-pointer'/></button>
          <button onClick={() => editorRef.current?.toggleUndo()}><Undo size={16} className='hover:bg-slate-200 rounded-md cursor-pointer'/></button>
          <button onClick={() => editorRef.current?.toggleRedo()}><Redo size={16} className='hover:bg-slate-200 rounded-md cursor-pointer'/></button>
        </div>
      </div>
      <RichTextEditor ref={editorRef} onChange={setContent} />
      <button
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          const message = editorRef.current?.getHTML();
          onSubmit(message);
          editorRef.current?.clear();
        }}
      >
        Reply
      </button>
    </div>
  );
};

export default QuickReplyBox;