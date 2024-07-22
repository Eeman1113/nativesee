'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

export default function Viewer() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-purple-400 glow-text-purple">アンプゼー</h1>
        <Suspense fallback={<p>Loading ⏳</p>}>
          <PdfViewer />
        </Suspense>
      </div>
    </div>
  );
}

const PdfViewer = () => {

  // get requested file
  const searchParams = useSearchParams();
  const file = searchParams.get('file');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // handle DOM events
  const handlePreviousPage = () => {
    if (currentPage > 1)
      setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages)
      setCurrentPage(currentPage + 1);
  };
  const handlePdfLoad = (e) => {
    if (e.target.contentDocument)
      setTotalPages(e.target.contentDocument.documentElement.getElementsByTagName('page').length);
  };

  if (!file) {
    return (
      <div className="bg-black bg-opacity-50 rounded-lg shadow-2xl p-4 border border-purple-500 glow-purple">
        <p className="text-purple-300 text-sm">File not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-black bg-opacity-50 rounded-lg shadow-2xl p-4 border border-purple-500 glow-purple">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-purple-500 text-black py-2 px-4 rounded transition duration-300 hover:bg-purple-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous Page
        </button>
        <span className="text-purple-300 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-purple-500 text-black py-2 px-4 rounded transition duration-300 hover:bg-purple-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Page
        </button>
      </div>
      <object
        data={`/uploads/${file}#page=${currentPage}`}
        type="application/pdf"
        width="100%"
        height="800px"
        className="rounded"
        onLoad={handlePdfLoad}
      >
        <p className="text-purple-300 text-sm">
          It appears you don't have a PDF plugin for this browser. You can{' '}
          <a href={`/uploads/${file}`} className="text-purple-400 hover:text-purple-300 hover:underline transition duration-300">
            click here to download the PDF file.
          </a>
        </p>
      </object>
    </div>
  )
};