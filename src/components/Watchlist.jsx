import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";


const API_BASE_URL = "https://api.themoviedb.org/3/movie";
const API_KEY = "148d7fb358e9a2f5b04a7567677ec479";
const Watchlist = () => {
    const [wishlistMovies, setWishlistMovies] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchWishlistMovies = async () => {
        const savedMovieIds = JSON.parse(localStorage.getItem("wishlist")) || [];
  
        if (savedMovieIds.length === 0) {
          setWishlistMovies([]);
          return;
        }
  
        try {
          const moviePromises = savedMovieIds.map((id) =>
            fetch(`${API_BASE_URL}/${id}?api_key=${API_KEY}&language=en-US`).then((res) => res.json())
          );
  
          const movies = await Promise.all(moviePromises);
          setWishlistMovies(movies);
        } catch (error) {
          console.error("Error fetching wishlist movies:", error);
        }
      };
  
      fetchWishlistMovies();
    }, []);
  
    return (
      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-4">My watchlist</h2>
        {wishlistMovies.length === 0 ? (
         <p className="text-red-500 text-lg font-semibold">No movies in watchlist</p>
  
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {wishlistMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={{
                  imdbID: movie.id,
                  Poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                  Title: movie.title,
                }}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  

export default Watchlist;

