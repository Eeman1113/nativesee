'use client';
// imports
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Page, Document, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

// render two pages side by side
export default function SplitView({ file, pageNum, setTotalPages }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);
      window.addEventListener('resize', () => setWidth(window.innerWidth));
    }
    return () => window.removeEventListener('resize', () => setWidth(window.innerWidth));
  }, []);

  return (
    <div className="flex flex-col md:flex-row w-full h-max min-h-screen items-center justify-center gap-4 bg-black bg-opacity-50 p-4 mt-10 border border-purple-500 rounded-lg shadow-2xl">
      <div className='flex w-1/2 h-max p-2 justify-center items-center'>
        <SinglePage url={file} width={width * 0.45} pageNum={pageNum} setTotalPages={setTotalPages} />
      </div>
      <div className='flex w-1/2 h-max p-2 justify-center items-center'>
        <SinglePage url={file} width={width * 0.45} pageNum={pageNum + 1} setTotalPages={setTotalPages} />
      </div>
    </div>
  );
}

// render single page
const SinglePage = ({ url, width, pageNum, setTotalPages }) => {
  return (
    <Document file={url} onLoadSuccess={({ numPages }) => setTotalPages(numPages)}>
      <Page
        pageNumber={pageNum}
        renderAnnotationLayer={false}
        renderTextLayer={false}
        renderInteractiveForms={false}
        width={width}
      />
    </Document>
  )
};