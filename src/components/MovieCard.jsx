import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WISHLIST_API = "https://movies-app-jgjm.onrender.com/api/v1/addtowishlist";

const MovieCard = ({ movie, movie_id }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState();
  const [wishlist, setWishlist] = useState([])

  // Get user ID from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const id = parsedData?.message?._id || parsedData?.data?.message?._id;
    
        setUserId(id);
        console.log("User ID:", id);
      } catch (error) {
        console.error("Error parsing userData:", error);
      }
    }
  }, []);

  useEffect(function(){
    async function getUser(){
      if(userId){
      const result = await axios.get(`https://movies-app-jgjm.onrender.com/api/v1/user/${userId}`)
      setWishlist(result.data.message.wishlist)
    }
  }
    getUser()
  },[userId,isWishlisted])

  // Fetch wishlist status
  // useEffect(() => {
  //   const fetchWishlistStatus = async () => {
  //     if (!userId) return;

  //     try {
  //       const response = await fetch(`https://movies-app-jgjm.onrender.com/api/v1/getwishlist?userID=${userId}`);
  //       const data = await response.json();

  //       if (response.ok) {
  //         const isMovieWishlisted = data?.wishlist?.some(item => item.movieID === movie.imdbID);
  //         setIsWishlisted(isMovieWishlisted);
  //       } else {
  //         console.error("Failed to fetch wishlist:", data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching wishlist:", error);
  //     }
  //   };

  //   fetchWishlistStatus();
  // }, [userId, movie.imdbID]);

  // Toggle Wishlist
  const toggleWishlist = async (e) => {
    e.stopPropagation();

    if (!userId) {
      console.error("User ID is missing!");
      return;
    }

    try {
      const response = await fetch(WISHLIST_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userId,
          movieID: movie.imdbID,
          action: isWishlisted ? "remove" : "add", 
        }),
      });


      const data = await response.json();
      setWishlist(data.message)
      if (response.ok) {
        setIsWishlisted((prev) => !prev);
      } else {
        console.error("Failed to update wishlist:", data);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  return (
    <div className="movie-card" onClick={() => navigate(`/movie/${movie.imdbID}`)} style={{ cursor: "pointer" }}>
      <img
        src={
          movie.Poster !== "N/A"
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

        <button onClick={toggleWishlist} className="wishlist-btn cursor-pointer">
          { wishlist.includes(movie_id) ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
