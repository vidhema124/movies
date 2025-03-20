
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "https://www.omdbapi.com";
const API_KEY = "f888c551";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/?apikey=${API_KEY}&i=${id}`);
        const data = await response.json();
        if (data.Response === "False") {
          setErrorMessage(data.Error);
          return;
        }
        setMovie(data);
      } catch (error) {
        setErrorMessage("Failed to load movie details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  if (isLoading) return <p className="text-white text-center">Loading...</p>;
  if (errorMessage) return <p className="text-red-500 text-center">{errorMessage}</p>;

  return movie ? (
    <div className="movie-detail bg-gray-900 text-white min-h-screen flex flex-col items-center p-6">
      <button 
        className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg self-start mb-4"
        onClick={() => navigate(-1)}
      >
        ← Go Back
      </button>

      <h1 className="text-4xl font-bold mb-4">{movie.Title}</h1>
      <img className="w-64 md:w-80 rounded-lg shadow-lg" src={movie.Poster} alt={movie.Title} />
      
      <div className="mt-6 text-lg">
        <p><strong>Year:</strong> {movie.Year}</p>
        <p><strong>Genre:</strong> {movie.Genre}</p>
        <p><strong>Director:</strong> {movie.Director}</p>
        <p><strong>Plot:</strong> {movie.Plot}</p>
        <p><strong>IMDb Rating:</strong> ⭐ {movie.imdbRating}</p>
      </div>
    </div>
  ) : null;
};

export default MovieDetail;
