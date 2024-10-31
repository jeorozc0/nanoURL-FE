// redirect.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function Redirect() {
  const [error, setError] = useState<string>("");
  const { id } = useParams();
  const navigate = useNavigate();

  // Using React Query for better caching and error handling
  const { isLoading } = useQuery({
    queryKey: ["redirect", id],
    queryFn: async () => {
      console.log("Fetching URL for ID:", id);
      console.log("API URL:", import.meta.env.VITE_API_URL);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch URL (${response.status})`);
        }

        const data = await response.json();
        console.log("Redirect data:", data);

        if (
          typeof data === "string" &&
          (data.startsWith("http://") || data.startsWith("https://"))
        ) {
          window.location.replace(data);
        } else {
          throw new Error("Invalid URL format received");
        }

        return data;
      } catch (err) {
        console.error("Redirect error:", err);
        setError(err instanceof Error ? err.message : "Failed to redirect");
        return null;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handleGoToHomepage = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        {error ? (
          <>
            <AlertTriangle className="mx-auto text-yellow-500 w-16 h-16 mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Redirect Error
            </h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              className="w-full h-12 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              onClick={handleGoToHomepage}
            >
              Go to Homepage
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-2xl font-bold text-gray-800">
              {isLoading ? "Redirecting..." : "Processing..."}
            </p>
            {/* Optional loading spinner */}
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        )}
      </div>
    </div>
  );
}
