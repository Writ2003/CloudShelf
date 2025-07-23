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

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-t from-amber-100 to-amber-400 shadow-2xl rounded-2xl p-8 mt-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
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
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="mt-1 block w-full bg-slate-200 text-black rounded-lg ring outline-none ring-amber-500 shadow-sm focus:ring-amber-700 focus:border-amber-700 p-2"
              placeholder="Author name"
              required
            />
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
            <label className="block text-sm font-semibold">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm cursor-pointer "
              required
            />
            {imagePreview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-56 object-fill rounded-lg shadow-lg border"
                />
              </div>
            )}
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
