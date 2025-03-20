
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const API_BASE_URL = "https://www.omdbapi.com";
// const API_KEY = "f888c551";

// const MovieDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [movie, setMovie] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     const fetchMovieDetail = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(`${API_BASE_URL}/?apikey=${API_KEY}&i=${id}`);
//         const data = await response.json();
//         if (data.Response === "False") {
//           setErrorMessage(data.Error);
//           return;
//         }
//         setMovie(data);
//       } catch (error) {
//         setErrorMessage("Failed to load movie details.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchMovieDetail();
//   }, [id]);

//   if (isLoading) return <p className="text-white text-center">Loading...</p>;
//   if (errorMessage) return <p className="text-red-500 text-center">{errorMessage}</p>;

//   return movie ? (
//     <div className="movie-detail bg-gray-900 text-white min-h-screen flex flex-col items-center p-6">
//       <button 
//         className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg self-start mb-4"
//         onClick={() => navigate(-1)}
//       >
//         ← Go Back
//       </button>

//       <h1 className="text-4xl font-bold mb-4">{movie.Title}</h1>
//       <img className="w-64 md:w-80 rounded-lg shadow-lg" src={movie.Poster} alt={movie.Title} />
      
//       <div className="mt-6 text-lg">
//         <p><strong>Year:</strong> {movie.Year}</p>
//         <p><strong>Genre:</strong> {movie.Genre}</p>
//         <p><strong>Director:</strong> {movie.Director}</p>
//         <p><strong>Plot:</strong> {movie.Plot}</p>
//         <p><strong>IMDb Rating:</strong> ⭐ {movie.imdbRating}</p>
//       </div>
//     </div>
//   ) : null;
// };

// export default MovieDetail;


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "https://api.themoviedb.org/3/movie";
const API_KEY = "148d7fb358e9a2f5b04a7567677ec479"; // Replace with your actual TMDB API key

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setIsLoading(true);
      try {
        // Fetch movie details
        const response = await fetch(`${API_BASE_URL}/${id}?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        if (data.status_code === 34) {
          setErrorMessage("Movie not found.");
          return;
        }
        setMovie(data);

        // Fetch trailer
        const videoRes = await fetch(`${API_BASE_URL}/${id}/videos?api_key=${API_KEY}`);
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

  // Show nothing while loading
  if (isLoading) return null;

  if (errorMessage) return <p className="text-red-500 text-center">{errorMessage}</p>;

  return movie ? (
    <div className="movie-detail bg-gray-900 text-white min-h-screen flex flex-col items-center p-6">
      {/* Back Button */}
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
        {/* Poster */}
        <img 
          className="w-64 md:w-80 rounded-lg shadow-lg" 
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-movie.png"} 
          alt={movie.title} 
        />

        {/* Movie Information */}
        <div className="text-lg space-y-4">
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(", ") || "N/A"}</p>
          <p><strong>Original Language:</strong> {movie.original_language.toUpperCase()}</p>
          <p><strong>Overview:</strong> {movie.overview}</p>
          <p><strong>Popularity:</strong> {movie.popularity}</p>
          <p><strong>Vote Average:</strong> ⭐ {movie.vote_average} / 10</p>
          <p><strong>Vote Count:</strong> {movie.vote_count}</p>
          <p><strong>Adult Content:</strong> {movie.adult ? "Yes 🔞" : "No ✅"}</p>
          <p><strong>Video Available:</strong> {movie.video ? "Yes 🎥" : "No ❌"}</p>
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
    </div>
  ) : null;
};

export default MovieDetail;
