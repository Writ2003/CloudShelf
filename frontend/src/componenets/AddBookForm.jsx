import React, { useState } from "react";
import axios from 'axios';

const AddBookForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    noOfPages: "",
    publicationDate: "",
    genres: [""],
    coverImage: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [showAuthorCard, setShowAuthorCard] = useState(false);
  const [newAuthor, setNewAuthor] = useState({ name: "", id: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (index, value) => {
    const updatedGenres = [...formData.genres];
    updatedGenres[index] = value;
    setFormData((prev) => ({ ...prev, genres: updatedGenres }));
  };

  const addGenreField = () => {
    setFormData((prev) => ({
      ...prev,
      genres: [...prev.genres, ""],
    }));
  };

  const removeGenreField = (index) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "genres") {
        value.forEach((g) => data.append("genre[]", g));
      } else {
        data.append(key, value);
      }
    });

    console.log("Submitting:", Object.fromEntries(data));
    // Post this formData to your backend

    try {
      const response = await axios.post(`http://localhost:5000/api/book/addNewBook`,formData,{withCredentials: true});
    } catch (error) {
      console.error('Error while adding a new book, error: ',error?.response?.data?.message || error?.message)
    }
  };

  const handleNewAuthorSubmit = async (e) => {
    e.preventDefault();
    // Simulate API call
    console.log("Adding new author:", newAuthor);
    // Here you can POST to your backend:
    // await axios.post("/api/authors", newAuthor);
    // Auto-fill the author field after successful add
    //setFormData((prev) => ({ ...prev, author: newAuthor.name }));
    // Reset and close card
    setNewAuthor({ name: "", id: "" });
    setShowAuthorCard(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-t from-amber-100 to-amber-400 shadow-2xl rounded-2xl p-8 mt-10">
      <h2 className="text-3xl font-bold mb-8 text-white text-center">
         Add a New Book
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold ">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full bg-slate-200 text-black rounded-lg ring outline-none ring-amber-500 shadow-sm focus:ring-amber-700 focus:border-amber-700 p-2"
              placeholder="Enter book title"
              required
            />
          </div>

          {/* Author */}
          <div>
          <label className="block text-sm font-semibold">Author</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg bg-slate-200 text-black ring outline-none ring-amber-500 shadow-sm focus:ring-amber-700 focus:border-amber-700 p-2"
              placeholder="Select or add author"
              required
            />
            <button
              type="button"
              onClick={() => setShowAuthorCard((prev) => !prev)}
              className="mt-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              + Add
            </button>
          </div>

          {/* Add New Author Card */}
          {showAuthorCard && (
          <div className="mt-3 bg-gray-50 border rounded-lg p-4 shadow-md">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Add New Author</h4>
              <form onSubmit={handleNewAuthorSubmit} className="space-y-2 ">
                <input
                  type="text"
                  value={newAuthor.name}
                  onChange={(e) => setNewAuthor((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Author Name"
                  className="block w-full rounded-lg placeholder:text-slate-400 border ring text-gray-600 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                  required
                />
                <input
                  type="text"
                  value={newAuthor.id}
                  onChange={(e) => setNewAuthor((prev) => ({ ...prev, id: e.target.value }))}
                  placeholder="Author ID"
                  className="block w-full rounded-lg placeholder:text-slate-400 text-gray-600 border ring border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                  required
                />
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                     Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAuthorCard(false)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    ✕ Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

          {/* Publisher */}
          <div>
            <label className="block text-sm font-semibold ">Publisher</label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              className="mt-1 block w-full bg-slate-200 text-black rounded-lg ring outline-none ring-amber-500 shadow-sm focus:ring-amber-700 focus:border-amber-700 p-2"
              placeholder="Publisher name"
              required
            />
          </div>

          {/* No of Pages */}
          <div>
            <label className="block text-sm font-semibold ">No. of Pages</label>
            <input
              type="number"
              name="noOfPages"
              value={formData.noOfPages}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full bg-slate-200 text-black rounded-lg ring outline-none ring-amber-500 shadow-sm focus:ring-amber-700 focus:border-amber-700 p-2"
              placeholder="Total pages"
              required
            />
          </div>

          {/* Publication Date */}
          <div>
            <label className="block text-sm font-semibold ">Publication Date</label>
            <input
              type="date"
              name="publicationDate"
              value={formData.publicationDate}
              onChange={handleChange}
              className="mt-1 block w-full bg-slate-200 text-black rounded-lg ring outline-none ring-amber-500 shadow-sm focus:ring-amber-700 focus:border-amber-700 p-2"
              required
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Genres (Dynamic Fields) */}
          <div>
            <label className="block text-sm font-semibold ">Genres</label>
            {formData.genres.map((genre, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => handleGenreChange(index, e.target.value)}
                  className="block w-full bg-slate-200 text-black rounded-lg ring outline-none ring-amber-500 shadow-sm focus:ring-amber-700 focus:border-amber-700 p-2"
                  placeholder="Enter genre"
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeGenreField(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addGenreField}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              + Add Genre
            </button>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
                    
            {/* If Image is Selected */}
            {imagePreview ? (
              <div className="relative group w-56 h-56 mx-auto">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full object-fill rounded-lg shadow-lg border"
                />
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("coverImageInput").click();
                  }}
                  className="absolute bottom-2 left-1/2 transform -translate-x-1/2 
                             px-3 py-1 text-sm bg-black bg-opacity-60 text-white 
                             rounded-lg opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  Change Image
                </button>
              </div>
            ) : (
              /* If No Image is Selected */
              <button
                type="button"
                onClick={() => document.getElementById("coverImageInput").click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg 
                           p-6 text-center text-gray-500 hover:border-blue-400 
                           hover:text-blue-500 transition cursor-pointer"
              >
                📤 Click to Upload Cover Image
              </button>
            )}
          
            {/* Hidden Native File Input */}
            <input
              type="file"
              id="coverImageInput"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              required
            />
          </div>
        </div>

        {/* Submit Button (Full Width) */}
        <div className="md:col-span-2 pt-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-green-600 hover:to-green-700 text-white text-lg font-semibold py-3 px-4 rounded-xl shadow-lg"
          >
             Submit Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookForm;
