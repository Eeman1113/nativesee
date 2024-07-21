'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Viewer() {
  const searchParams = useSearchParams();
  const file = searchParams.get('file');
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    if (file) {
      setPdfUrl(`/uploads/${file}`);
    }
  }, [file]);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col">
      <h1 className="text-4xl font-bold mb-8 text-center text-lavender">アンプゼー</h1>
      {pdfUrl && (
        <div className="flex-grow">
          <object
            data={pdfUrl}
            type="application/pdf"
            width="100%"
            height="100%"
            className="min-h-[80vh]"
          >
            <p>It appears you don't have a PDF plugin for this browser. You can <a href={pdfUrl}>click here to download the PDF file.</a></p>
          </object>
        </div>
      )}
    </div>
  );
}