import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gradient-to-br from-black to-gray-900 text-cyan-300 font-['Inter']">{children}</body>
    </html>
  );
}