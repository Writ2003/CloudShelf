import React, { useState } from 'react';
import axios from 'axios';

const RemoveBook =  () => {
  const [query, setQuery] = useState('');
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/books/search?q=${query}`);
      setBook(res.data);
    } catch (error) {
      console.error(error);
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!book) return;
    try {
      await axios.delete(`/api/books/${book._id}`);
      alert('Book removed successfully!');
      setBook(null);
      setQuery('');
    } catch (error) {
      console.error(error);
      alert('Error removing book.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Remove Book</h2>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Book ID or Name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 rounded">
          Search
        </button>
      </div>
      {loading && <p className="mt-4">Searching...</p>}
      {book && (
        <div className="mt-6 p-4 border rounded shadow bg-white">
          <h3 className="font-bold text-lg">{book.title}</h3>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Publisher:</strong> {book.publisher}</p>
          <p><strong>ID:</strong> {book._id}</p>
          <button onClick={handleRemove} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

export default RemoveBook;