import React, { useContext, useState, useEffect, useRef} from 'react';
import RichTextEditor from './RichTextEditor';
import { DiscussionContext } from '../BookInfo';
import { CircleLoader, ClipLoader } from 'react-spinners'

const CreateDiscussionTopic = () => {
  const editorRef = useRef(); // 👈 Ref for editor
  const {handleSetCreateDiscussion, handleDiscussionTopic, isTopicLoading} = useContext(DiscussionContext);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleEditorChange = (html) => {
    setDescription(html);
  };

  const createTopic = async(e) => {
    e.preventDefault();
    console.log('Subject:', subject);
    console.log('Description:', description);
    const sub = subject, desc = description;
    setSubject('');
    setDescription('');
    handleDiscussionTopic(sub, desc);
  };

  return (
    <>
      <div className="fixed inset-0 z-40" />

      <div className="fixed z-50 inset-0 flex items-center justify-center px-4">
        <div className="bg-gray-600 text-white rounded-md shadow-lg w-full max-w-2xl p-6 relative">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            onClick={handleSetCreateDiscussion}
            disabled={isTopicLoading}
          >
            &times;
          </button>

          <h2 className="text-xl font-semibold mb-4">New Topic</h2>
          <input
            type="text"
            placeholder="Subject"
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded mb-4"
          />

          <div className="bg-gray-800 border border-gray-700 p-3 rounded mb-4">
            <div className="flex flex-wrap items-center gap-2 text-gray-300 mb-2 mx-3 font-medium">
              <button onClick={() => editorRef.current?.toggleBold()}>B</button>
              <button onClick={() => editorRef.current?.toggleItalic()}>I</button>
              <button onClick={() => editorRef.current?.toggleUnderline()}>U</button>
              <button onClick={() => editorRef.current?.toggleStrike()}>S</button>
              <button onClick={() => editorRef.current?.undo()}>Undo</button>
              <button onClick={() => editorRef.current?.redo()}>Redo</button>
            </div>

            <RichTextEditor
              ref={editorRef}
              placeholderText="Add your reply to the topic..."
              onChange={handleEditorChange}
              maxCharLimit={100}
            />
          </div>

          <h3 className="font-medium tracking-wide">Preview:</h3>
          <div
            className="border mb-3 min-h-[40px] flex items-center px-3 overflow-auto no-scrollbar bg-slate-100 rounded-md text-black"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          <div className="flex justify-end gap-3">
            <button
              className={`${isTopicLoading? 'bg-gray-700/50' : 'bg-gray-700 hover:bg-gray-600'} px-4 py-2 rounded`}
              disabled={isTopicLoading}
              onClick={() => {
                setSubject('');
                setDescription('');
                handleSetCreateDiscussion();
              }}
            >
              Cancel
            </button>
            <button onClick={createTopic} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white">
              {isTopicLoading? <ClipLoader color='#fafaf9' speedMultiplier={1.5} size={20} /> :'Create'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateDiscussionTopic;