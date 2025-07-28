import React, { useState } from 'react';
import axios from 'axios';

const FindBook = () => {
  const [field, setField] = useState('title');
  const [value, setValue] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/books/searchBy?${field}=${value}`);
      setBooks(res.data);
    } catch (error) {
      console.error(error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Find Book</h2>
      <div className="flex gap-2 mb-4">
        <select
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="title">Title</option>
          <option value="_id">ID</option>
          <option value="author">Author</option>
          <option value="publisher">Publisher</option>
          <option value="genre">Genre</option>
        </select>
        <input
          type="text"
          placeholder="Enter value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button onClick={handleSearch} className="bg-green-500 text-white px-4 rounded">
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && books.length > 0 && (
        <div className="space-y-4">
          {books.map((book) => (
            <div key={book._id} className="p-4 border rounded shadow bg-white">
              <h3 className="font-bold text-lg">{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Publisher:</strong> {book.publisher}</p>
              <p><strong>Genre:</strong> {book.genre.join(', ')}</p>
              <p><strong>ID:</strong> {book._id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FindBook;