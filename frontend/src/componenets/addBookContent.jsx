import React, { useState } from "react";
import axios from "axios";

const AddBookContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      // Example API Call
      const res = await axios.get(`http://localhost:5000/api/books/search?q=${searchQuery}`);
      setBooks(res.data); // expected [{_id, title}, ...]
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a valid PDF file.");
      setPdfFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook || !pdfFile) {
      alert("Please select a book and upload a PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("bookId", selectedBook);
    formData.append("pdf", pdfFile);

    try {
      await axios.post("/api/books/add-content", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("PDF successfully uploaded!");
      setPdfFile(null);
      setSelectedBook("");
      setBooks([]);
      setSearchQuery("");
    } catch (err) {
      console.error("Error uploading PDF:", err);
      alert("Failed to upload PDF.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-xl rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        📄 Add Page Content
      </h2>

      {/* Search Field */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter Book ID or Name"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Book Selection */}
      {books.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Select Book
          </label>
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Select --</option>
            {books.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title} (ID: {book._id})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* PDF Upload */}
      {selectedBook && (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload PDF
          </label>

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center 
                       text-gray-500 hover:border-green-400 hover:text-green-500 transition cursor-pointer"
            onClick={() => document.getElementById("pdfInput").click()}
          >
            {pdfFile ? (
              <p className="font-medium text-green-600">
                ✅ {pdfFile.name} (ready to upload)
              </p>
            ) : (
              "📤 Click to select PDF file"
            )}
          </div>
          <input
            type="file"
            id="pdfInput"
            accept="application/pdf"
            className="hidden"
            onChange={handlePdfChange}
          />
        </div>
      )}

      {/* Submit Button */}
      {selectedBook && pdfFile && (
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          ✅ Submit
        </button>
      )}
    </div>
  );
};

export default AddBookContent;
