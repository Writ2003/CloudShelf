import React, { useContext } from 'react';
import { discussonContext } from '../BookInfo';


const CreateDiscussionTopic = () => {
  const { handleSetCreateDiscusson } = useContext(discussonContext);

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40" onClick={handleSetCreateDiscusson} />

      {/* Modal */}
      <div className="fixed z-50 inset-0 flex items-center justify-center px-4">
        <div className="bg-gray-600 text-white rounded-md shadow-lg w-full max-w-2xl p-6 relative">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            onClick={handleSetCreateDiscusson}
          >
            &times;
          </button>

          {/* Modal Content */}
          <h2 className="text-xl font-semibold mb-4">New Topic</h2>
          <input
            type="text"
            placeholder="Subject"
            className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded mb-4"
          />

          <div className="bg-gray-800 border border-gray-700 p-3 rounded mb-4">
            {/* Simulated toolbar */}
            <div className="flex flex-wrap gap-2 text-gray-300 mb-2 mx-3 font-medium">
              <button className="hover:text-white cursor-pointer">B</button>
              <button className="hover:text-white cursor-pointer">I</button>
              <button className="hover:text-white cursor-pointer">U</button>
              <button className="hover:text-white cursor-pointer">S</button>
            </div>
            <textarea
              placeholder="Type something"
              className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded h-40 resize-none"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
              onClick={handleSetCreateDiscusson}
            >
              Cancel
            </button>
            <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white">
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateDiscussionTopic;
