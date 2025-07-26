// components/Pagination.jsx
import React from 'react';
import ReactPaginate from 'react-paginate';

const Pagination = ({ pageCount, onPageChange }) => {
  return (
    <div className="flex items-center justify-between p-4">
      <p className="text-sm text-gray-600">
        Showing {(pageCount.currentPage - 1) * 10 + 1}-
        {Math.min(pageCount.currentPage * 10, pageCount.totalItems)} of {pageCount.totalItems}
      </p>
      <ReactPaginate
        breakLabel="..."
        nextLabel="›"
        onPageChange={(e) => onPageChange(e.selected)}
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        pageCount={Math.ceil(pageCount.totalItems / 10)}
        previousLabel="‹"
        containerClassName="flex items-center space-x-1"
        pageClassName="border px-3 py-1 rounded cursor-pointer"
        activeClassName="bg-blue-500 text-white"
        previousClassName="border px-3 py-1 rounded"
        nextClassName="border px-3 py-1 rounded"
        breakClassName="px-3"
      />
    </div>
  );
};

export default Pagination;
