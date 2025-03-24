import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "148d7fb358e9a2f5b04a7567677ec479";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || movie?.original_title || "";


  useEffect(() => {
    const fetchMovieDetail = async () => {
      setIsLoading(true);
      try {

        const response = await fetch(`${API_BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();

        if (data.status_code === 34) {
          setErrorMessage("Movie not found.");
          return;
        }
        setMovie(data);

        const videoRes = await fetch(`${API_BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
        const videoData = await videoRes.json();
        const trailer = videoData.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );

        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (error) {
        setErrorMessage("Failed to load movie details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);



  useEffect(() => {
    if (!searchQuery) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      try {

        const response = await fetch(`${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&language=en-US&region=US`);
        const data = await response.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error("Search API failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);



  if (isLoading) return null;
  if (errorMessage) return <p className="text-red-500 text-center">{errorMessage}</p>;
  return movie ? (
    <div className="movie-detail bg-gray-900 text-white min-h-screen flex flex-col items-center p-6">

      <button
        className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg self-start mb-4"
        onClick={() => navigate(-1)}
      >
        ← Go Back
      </button>

      {/* Backdrop Image */}
      {movie.backdrop_path && (
        <img
          className="w-full max-w-4xl h-64 object-cover rounded-lg mb-6 shadow-lg"
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt={`${movie.title} Backdrop`}
        />
      )}

      {/* Movie Title */}
      <h1 className="text-4xl font-bold mb-4">{movie.original_title}</h1>

      {/* Poster & Details */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          className="w-64 md:w-80 rounded-lg shadow-lg"
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-movie.png"}
          alt={movie.title}
        />

        <div className="text-lg space-y-4">
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(", ") || "N/A"}</p>
          <p><strong>Original Language:</strong> {movie.original_language.toUpperCase()}</p>
          <p><strong>Overview:</strong> {movie.overview}</p>
          <p><strong>Popularity:</strong> {movie.popularity}</p>
          <p><strong>Vote Average:</strong> ⭐ {movie.vote_average} / 10</p>
          <p><strong>Vote Count:</strong> {movie.vote_count}</p>
          <p><strong>Adult Content:</strong> {movie.adult ? "Yes 🔞" : "No ✅"}</p>
          <p>
            <strong>Trailer Available:</strong>{" "}
            {trailerKey ? (
              <a href={`https://www.youtube.com/embed/${trailerKey}`} target="_blank" rel="noopener noreferrer">
                Watch ▶️
              </a>
            ) : (
              "No ❌"
            )}
          </p>

          <a href="https://www.imdb.com/chart/top/" target="_blank" rel="noopener noreferrer">
            Visit IMDb ▶️
          </a><br /><br />

          <div>
            <p>Available on:</p>
            <a
              href={movie?.netflixLink || "https://www.netflix.com/"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:underline"
            >
              Netflix
            </a><br />

            <a
              href={movie?.amazonLink || "https://www.primevideo.com/"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-700 hover:underline"
            >
              Amazon Prime
            </a><br />
            <a
              href={movie?.huluLink || "https://www.hulu.com/hub/tv"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:underline"
            >
              Hulu
            </a>
          </div>
        </div>
      </div>

      {/* YouTube Trailer Embed */}
      {trailerKey && (
        <div className="mt-6 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-2 text-center">Watch Trailer</h2>
          <div className="relative w-full pt-[56.25%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="YouTube Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-4">
          Search Results for "{searchQuery ? searchQuery.split(" ")[0] : ''}"
          Search Results for "{searchQuery ? searchQuery.split(" ").slice(0, 2).join(" ") : ''}"

        </h2>

        {loading ? (
          <p className="text-yellow-500">Loading...</p>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {movies.map((movie) => (
              
              <div
              
                key={movie.id}
                className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition"
                onClick={() => navigate(`/movie/${movie.id}`)} // Navigate on click
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full rounded-lg"
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gray-700 text-gray-400">
                    No Image Available
                  </div>
                )}
                <h3 className="text-lg mt-2">{movie.title}</h3>
                  
              </div>
              
            ))}
          </div>
        ) : (
          <p className="text-red-500">No results found.</p>
        )}
      </div>

    </div>
  ) : null;
};

export default MovieDetail;
