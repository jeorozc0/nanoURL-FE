import { FormEvent, useState } from "react";

export default function App() {
  const [longURL, setLongURL] = useState("");
  const [shortURL, setShortURL] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longURL }),
      });
      if (!response.ok) throw new Error("Failed to shorten URL");
      const data = await response.json();
      setShortURL(data.shortURL);
    } catch (error) {
      console.error("Error shortening URL:", error);
      // You might want to set an error state here and display it to the user
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          URL Shortener
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="longURL"
              className="block text-sm font-medium text-gray-700"
            >
              Enter a URL to shorten
            </label>
            <input
              type="url"
              id="longURL"
              value={longURL}
              onChange={(e) => setLongURL(e.target.value)}
              required
              className="mt-1 block w-full rounded-md text-black bg-white border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              placeholder="https://example.com"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Shorten URL
          </button>
        </form>
        {shortURL && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Shortened URL:
            </h2>
            <a
              href={shortURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800"
            >
              {shortURL}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
