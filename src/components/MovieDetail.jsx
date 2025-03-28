import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ReviewForm from "./ReviewForm";
import { FaShare } from "react-icons/fa6";
import axios from "axios";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "148d7fb358e9a2f5b04a7567677ec479";
const API_BASE_URLs = "https://movies-app-jgjm.onrender.com/api/v1";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
    const [reviews, setReviews] = useState([]);
  
  // const movieId = searchParams.get("movieId") || movie?._id || "";
  const movieId = searchParams.get("movieId") || movie?._id || id || "";

  const handleShare = async () => {
    const movieURL = window.location.href; // Get the current page URL
    const movieTitle = movie?.original_title || "Check out this movie!";

    if (navigator.share) {
      try {
        await navigator.share({
          title: movieTitle,
          text: `Check out ${movieTitle} on our website!`,
          url: movieURL,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: Copy to Clipboard
      navigator.clipboard.writeText(movieURL);
      alert("Link copied to clipboard!");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://movies-app-jgjm.onrender.com/api/v1/movie/${id}`
        );
        console.log(response,"responseresponse");
        
        setReviews(response.data.review.reviews || []); // Ensure response structure is correct
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id]); // Runs when `id` changes



   const handleRedirect = () => {
    navigate(`/movie/${id}/review`); // Update this path as needed
  };
  useEffect(() => {
    const fetchMovieDetail = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URLs}/movie/${id}`);
        const data = await response.json();

        if (!response.ok) {
          setErrorMessage("Movie not found.");
          setIsLoading(false);
          return;
        }

        setMovie(data.message);

        const movieId = data.id;
        const videoRes = await fetch(
          `${API_BASE_URL}/movie/${data.message.movie_id}/videos?api_key=${API_KEY}`
        );
        const videoData = await videoRes.json();

        const trailer = videoData?.results?.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        if (trailer) setTrailerKey(trailer.key);
        
      } catch (error) {
        setErrorMessage("Failed to load movie details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();

  }, [id]);

  useEffect(() => {
    if (!movieId) return;

    const fetchSimilarMovies = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URLs}/movie/${movieId}?similar=true`
        );
        const data = await response.json();
        setMovies(data.similarMovies || []);
      } catch (error) {
        console.error("Failed to fetch similar movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarMovies();
  }, [movieId]);

  // **Skeleton Loader for UI**
  if (isLoading) {
    return (
      <div className="p-6 text-white min-h-screen bg-gray-900 flex flex-col items-center">
        <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg self-start mb-4">
          ← Go Back
        </button>
        <Skeleton height={50} width="80%" className="mb-4" />
        <Skeleton
          height={280}
          width="100%"
          className="rounded-lg mb-6 shadow-lg"
        />

        <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-5xl">
          <Skeleton height={400} width={280} className="rounded-lg shadow-lg" />
          <div className="w-full">
            <Skeleton height={30} width="60%" className="mb-2" />
            <Skeleton height={20} width="80%" className="mb-2" />
            <Skeleton height={20} width="50%" className="mb-2" />
            <Skeleton height={80} width="100%" className="mb-2" />
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return <p className="text-red-500 text-center">{errorMessage}</p>;
  }

  return movie ? (
    <div className="movie-detail bg-gray-900 text-white min-h-screen flex flex-col items-center p-6">
      {/* Back Button */}

      <button
        className=" bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg self-start mb-4"
        onClick={() => navigate(-1)}
      >
        ← Go Back
      </button>
    {/* //<div className="d-flex justify-content-end"> */}
  
{/* </div> */}
      
      

      <div className="relative">
      {movie.backdrop_path && (
      
        <img
          className="w-full max-w-4xl h-64 object-cover rounded-lg mb-6 shadow-lg"
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt={`${movie.title} Backdrop`}
        />
      )}
 <button
          className=" cursor-pointer absolute top-0.5 right-0.5 text-white h-10 px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={handleShare}
        >
          <FaShare />
        </button>
        </div>

      {/* Movie Details */}
      <h1 className="text-4xl font-bold mb-4">{movie.original_title}</h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Movie Poster */}
        <img
          className="w-64 md:w-80 rounded-lg shadow-lg"
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/no-movie.png"
          }
          alt={movie.title}
        />

        {/* Movie Information */}
        <div className="text-lg space-y-4">
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Genres:</strong>{" "}
            {movie.genres?.map((g) => g.name).join(", ") || "N/A"}
          </p>
          <p>
            <strong>Original Language:</strong>{" "}
            {movie.original_language.toUpperCase()}
          </p>
          <p>
            <strong>Overview:</strong> {movie.overview}
          </p>
          <p>
            <strong>Popularity:</strong> {movie.popularity}
          </p>
          <p>
            <strong>Vote Average:</strong> ⭐ {movie.vote_average} / 10
          </p>
          <p>
            <strong>Vote Count:</strong> {movie.vote_count}
          </p>
          <p>
            <strong>Adult Content:</strong> {movie.adult ? "Yes 🔞" : "No ✅"}
          </p>
          <p>
            <strong>Trailer Available:</strong>{" "}
            {trailerKey ? (
              <a
                href={`https://www.youtube.com/embed/${trailerKey}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch ▶️
              </a>
            ) : (
              "No ❌"
            )}
          </p>

          {/* IMDb Link */}
          <a
            href="https://www.imdb.com/chart/top/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit IMDb ▶️
          </a>
          <div>
            <p>Available on:</p>
            <a
              href={movie?.netflixLink || "https://www.netflix.com/"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:underline"
            >
              Netflix
            </a>
            <br />

            <a
              href={movie?.amazonLink || "https://www.primevideo.com/"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-700 hover:underline"
            >
              Amazon Prime
            </a>
            <br />
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

      {/* Movie Trailer */}
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


      <ReviewForm  reviews={reviews} />

      {/* Search Results Section */}
      <div className="w-full mt-12 p-6">
        <h2 className="text-2xl font-bold mb-4">Similar Movies</h2>

        {loading ? (
          <p className="text-yellow-500"></p>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <div
                key={movie._id}
                className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition"
                onClick={() => navigate(`/movie/${movie._id}`)}
              >
                {movie.poster_path ? (
                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className="w-full rounded-lg"
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gray-700 text-gray-400">
                    No Image Available
                  </div>
                )}
                <h3 className="mt-3">{movie.Title || movie.original_title}</h3>
                <div className="content flex mt-3 ">
                  <div className="rating flex">
                    <img src="/star.svg" alt="Star Icon" />
                    <p className="ml-1 mr-4">
                      {movie.imdbRating ? movie.imdbRating.toFixed(1) : "N/A"}
                    </p>
                  </div>
                  <span>•</span>
                  <p className="lang ml-1 mr-4">
                    {movie.Language || "Hindi/English"}
                  </p>
                  <span>•</span>
                  <p className="year ml-1 mr-1">{movie.Year || "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No similar movies found.</p>
        )}
      </div>
    </div>
  ) : null;
};

export default MovieDetail;
