import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";

const WISHLIST_API_URL = "https://movies-app-jgjm.onrender.com/api/v1/getwishlist";

const WishlistPage = () => {
  const [wishlistMovies, setWishlistMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const id = parsedData?.message?._id || parsedData?.data?.message?._id; // Extract userId
        setUserId(id);
        console.log("User ID:", id);
      } catch (error) {
        console.error("Error parsing userData:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return; // Wait for userId before making API request

    const fetchWishlistMovies = async () => {
      try {
        const response = await fetch(`${WISHLIST_API_URL}/${userId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          
          // Handle specific error message related to invalid ObjectId
          if (errorData?.status === "fail" && errorData?.message.includes("Cast to ObjectId failed")) {
            setWishlistMovies([]);  // No movies available
            setError("Invalid user ID format.");
            setLoading(false);
            return;
          }
    
          throw new Error(errorData?.message || "Failed to fetch wishlist");
        }
    
        const data = await response.json();
    
        if (!data?.message || data.message.length === 0) {
          setWishlistMovies([]);
        } else {
          setWishlistMovies(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    

    fetchWishlistMovies();
  }, [userId]); // Fetch wishlist when userId is available

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>

      {loading ? (
        <p className="text-blue-500 text-lg font-semibold">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      ) : wishlistMovies.length === 0 ? (
        <p className="text-red-500 text-lg font-semibold">No movies in wishlist</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {wishlistMovies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={{
                imdbID: movie.id,
                Poster: movie.poster_path, // Already contains full URL
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

export default WishlistPage;
