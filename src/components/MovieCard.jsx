import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie, Poster }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsWishlisted(storedWishlist.includes(movie.imdbID));
  }, [movie.imdbID]);

  const handleClick = () => {
    navigate(`/movie/${movie.imdbID}`);
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();

    let storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (isWishlisted) {
      storedWishlist = storedWishlist.filter((id) => id !== movie.imdbID);
    } else {
      storedWishlist.push(movie.imdbID);
    }

    localStorage.setItem("wishlist", JSON.stringify(storedWishlist));
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      className="movie-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <img
        src={
          Poster !== "N/A"
            ? movie.Poster
            : movie.poster_path
            ? movie.poster_path
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
          {isWishlisted ? "❤️ " : "🤍"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
