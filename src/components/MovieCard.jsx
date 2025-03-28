import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WISHLIST_API = "https://movies-app-jgjm.onrender.com/api/v1/addtowishlist";


const MovieCard = ({ movie, Poster }) => {
  
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const id = parsedData?.message?._id; 
        setUserId(id);
        console.log("User ID:", id);
      } catch (error) {
        console.error("Error parsing userData:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId || !movie.imdbID) return;

    const fetchWishlist = async () => {
      try {
        const response = await fetch(`${WISHLIST_API}?userID=${userId}`);
        const wishlistData = await response.json();

        if (response.ok) {
          const savedMovieIds = wishlistData?.data?.map((item) => item.movieID) || [];
          setIsWishlisted(savedMovieIds.includes(movie.imdbID));
        }
        console.log("Wishlist response:", wishlistData);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [userId, movie.imdbID]);

  const handleClick = () => {
    navigate(`/movie/${movie.imdbID}`);
  };

  const toggleWishlist = async (e) => {
    e.stopPropagation();

    if (!userId) {
      console.error("User ID is missing!");
      return;
    }

    console.log("Sending request to:", WISHLIST_API);
    console.log("User ID:", userId, "Movie ID:", movie.imdbID);

    try {
      const response = await fetch(WISHLIST_API, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userId,
          movieID: movie.imdbID,
        }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setIsWishlisted(!isWishlisted);
      } else {
        console.error("Failed to update wishlist:", data);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };



  return (
    <div className="movie-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <img
        src={
          Poster !== "N/A"
            ? movie.Poster
            : movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "/no-movie.png"
        }
        alt={movie.Title}
      />
      <div className="mt-4">
        <h3>{movie.Title || movie.original_title}</h3>
        <div className="content">
          <div className="rating">
            <img src="/star.svg" alt="Star Icon" />
            <p>{movie.imdbRating ? movie.imdbRating.toFixed(1) : "N/A"}</p>
          </div>
          <span>•</span>
          <p className="lang">{movie.Language || "Hindi/English"}</p>
          <span>•</span>
          <p className="year">{movie.Year || "N/A"}</p>
        </div>

        <button onClick={toggleWishlist} className="wishlist-btn">
          {isWishlisted ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
