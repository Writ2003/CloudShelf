import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookSearchWithFilters = () => {
  const [filters, setFilters] = useState({
    title: '',
    publicationYear: '',
    ratingRange: '',
    publisher: '',
    genres: [],
    sortBy: '',
    page: 1,
  });
  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [publishers, setPublishers] = useState([]);
  const [genresList, setGenresList] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  useEffect(() => {
    // Simulated static values; fetch from API if needed
    setPublishers(['Penguin', 'HarperCollins', 'Oxford Press']);
    setGenresList(['Fiction', 'Science', 'History', 'Fantasy', 'Biography']);
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('/api/books', { params: filters });
      setResults(res.data.books);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckboxChange = (genre) => {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value, page: 1 }));
  };

  return (
    <div className="p-6 bg-white shadow rounded-xl max-w-7xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4">Search Books</h2>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Title Search */}
        <input
          type="text"
          placeholder="Search by title"
          value={filters.title}
          onChange={(e) => setFilters({ ...filters, title: e.target.value, page: 1 })}
          className="border p-2 rounded w-full"
        />

        {/* Publication Year */}
        <div>
          <label className="block font-medium">Publication Year</label>
          {[2020, 2021, 2022, 2023, 2024].map((year) => (
            <label key={year} className="block text-sm">
              <input
                type="radio"
                name="publicationYear"
                value={year}
                checked={filters.publicationYear === year.toString()}
                onChange={(e) => setFilters({ ...filters, publicationYear: e.target.value, page: 1 })}
              />
              <span className="ml-2">{year}</span>
            </label>
          ))}
        </div>

        {/* Rating Range */}
        <div>
          <label className="block font-medium">Rating</label>
          {[
            { label: 'Below 2', value: '0-2' },
            { label: '2-3', value: '2-3' },
            { label: '3-4', value: '3-4' },
            { label: 'Over 4', value: '4-10' },
          ].map((r) => (
            <label key={r.value} className="block text-sm">
              <input
                type="radio"
                name="ratingRange"
                value={r.value}
                checked={filters.ratingRange === r.value}
                onChange={(e) => setFilters({ ...filters, ratingRange: e.target.value, page: 1 })}
              />
              <span className="ml-2">{r.label}</span>
            </label>
          ))}
        </div>

        {/* Publisher */}
        <div>
          <label className="block font-medium">Publisher</label>
          <select
            className="w-full p-2 mt-1 border rounded"
            value={filters.publisher}
            onChange={(e) => setFilters({ ...filters, publisher: e.target.value, page: 1 })}
          >
            <option value="">All</option>
            {publishers.map((pub) => (
              <option key={pub} value={pub}>
                {pub}
              </option>
            ))}
          </select>
        </div>

        {/* Genre */}
        <div>
          <label className="block font-medium mb-1">Genre</label>
          <div className="flex flex-wrap gap-2">
            {genresList.map((genre) => (
              <label key={genre} className="text-sm flex items-center">
                <input
                  type="checkbox"
                  value={genre}
                  checked={filters.genres.includes(genre)}
                  onChange={() => handleCheckboxChange(genre)}
                  className="mr-1"
                />
                {genre}
              </label>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block font-medium">Sort By</label>
          <select
            className="w-full p-2 mt-1 border rounded"
            value={filters.sortBy}
            onChange={handleSortChange}
          >
            <option value="">Default</option>
            <option value="ratingDesc">Rating (High to Low)</option>
            <option value="ratingAsc">Rating (Low to High)</option>
            <option value="dateDesc">Newest First</option>
            <option value="dateAsc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Book List */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.length === 0 ? (
          <p className="text-gray-500 col-span-full">No books found.</p>
        ) : (
          results.map((book) => (
            <div key={book._id} className="p-4 border rounded-lg shadow bg-gray-50">
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600">Author: {book.author}</p>
              <p className="text-sm text-gray-600">Publisher: {book.publisher}</p>
              <p className="text-sm text-gray-600">Rating: {book.rating}</p>
              <p className="text-sm text-gray-600">Published: {new Date(book.publicationDate).getFullYear()}</p>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 gap-2">
        <button
          disabled={filters.page === 1}
          onClick={() => handlePageChange(filters.page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 border rounded ${filters.page === i + 1 ? 'bg-blue-500 text-white' : ''}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={filters.page === totalPages}
          onClick={() => handlePageChange(filters.page + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookSearchWithFilters;
