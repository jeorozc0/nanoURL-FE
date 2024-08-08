import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export function Redirect() {
  const [error, setError] = useState<string>("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: string = await response.json();
        console.log(data);

        if (data) {
          // Use window.location for external URLs
          if (data.startsWith("http://") || data.startsWith("https://")) {
            window.location.replace(data);
          } else {
            navigate(data);
          }
        } else {
          throw new Error("No redirect URL found in the response");
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchData();
  }, [id, navigate]);

  return (
    <div className="min-h-screen w-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        {error ? (
          <>
            <AlertTriangle className="mx-auto text-yellow-500 w-16 h-16 mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              There was an error
            </h1>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or might have been
              moved.
            </p>
          </>
        ) : (
          <p className="text-4xl font-bold text-gray-800 mb-2">
            Redirecting...
          </p>
        )}
      </div>
    </div>
  );
}
