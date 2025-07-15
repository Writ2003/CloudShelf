import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-2 mt-6 text-sm font-medium">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
      >
        <ChevronsLeft size={16} />
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
      >
        <ChevronLeft size={16} />
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
      >
        <ChevronRight size={16} />
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
      >
        <ChevronsRight size={16} />
      </button>
    </div>
  );
};

// Helper to limit number of visible pages (e.g. 5 max)
function getVisiblePages(currentPage, totalPages, max = 5) {
  const half = Math.floor(max / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);

  if (end - start + 1 < max) {
    if (start === 1) {
      end = Math.min(totalPages, start + max - 1);
    } else if (end === totalPages) {
      start = Math.max(1, end - max + 1);
    }
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default Pagination;
