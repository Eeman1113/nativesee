'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (response.ok) {
      const { filename } = await response.json();
      router.push(`/viewer?file=${encodeURIComponent(filename)}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-black bg-opacity-50 rounded-lg shadow-2xl p-8 w-full max-w-md border border-purple-500 glow-purple">
        <h1 className="text-4xl font-bold mb-6 text-center text-purple-400 glow-text-purple">アンプゼー</h1>
        <p className="text-purple-300 mb-6 text-center text-sm">Upload PDF or use sample</p>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              type="submit" 
              className="w-full bg-purple-500 text-black font-bold py-2 px-4 rounded transition duration-300 hover:bg-purple-400 text-sm"
              disabled={loading}
            >
              Upload
            </button>
          )}
        </form>
        {loading && <p className="text-purple-400 mt-6 text-center text-sm animate-pulse">Uploading to the Grid...</p>}
      </div>
    </div>
  );
}