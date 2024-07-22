'use client';
import dynamic from 'next/dynamic';
const SplitView = dynamic(import('@/components/SplitView'), { ssr: false });
import React from 'react';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
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

  const handleFileChange = (e) => {
    e.preventDefault();
    const inputFile = e.target.files[0];
    if (!inputFile) return;
    if (inputFile.type !== 'application/pdf') {
      alert('Invalid file type. Please upload a PDF file.');
      return;
    }
    setFile(inputFile);
  };

  if (file) {
    return (
      <div className="bg-black bg-opacity-50 rounded-lg shadow-2xl p-4 border border-purple-500 glow-purple">
        <div className="fixed top-0 p-2 left-0 z-10 bg-black flex w-full h-max justify-around items-center">
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
        <div>
          <SplitView file={file} pageNum={currentPage} setTotalPages={setTotalPages} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-black bg-opacity-50 rounded-lg shadow-2xl p-8 w-full max-w-md border border-purple-500 glow-purple">
        <h1 className="text-4xl font-bold mb-6 text-center text-purple-400 glow-text-purple">アンプゼー</h1>
        <p className="text-purple-300 mb-6 text-center text-sm">Upload PDF or use sample</p>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="flex-grow">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <span className="bg-purple-500 text-black py-2 px-4 rounded cursor-pointer inline-block hover:bg-purple-400 transition duration-300 text-sm">
                Choose File
              </span>
            </label>
            <span className="ml-4 text-purple-300 truncate max-w-[150px] text-sm">
              {file ? file.name : 'no file selected'}
            </span>
          </div>
          {file && (
            <button
              onClick={handleSubmit}
              className="w-full bg-purple-500 text-black font-bold py-2 px-4 rounded transition duration-300 hover:bg-purple-400 text-sm"
            >
              Start Reading
            </button>
          )}
        </div>
      </div>
    </div>
  );
}