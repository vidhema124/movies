import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.imdbID}`);
  };

  return (
    <div className="movie-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "/no-movie.png"}
        alt={movie.Title}
      />
      <div className="mt-4">
        <h3>{movie.Title}</h3>
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
      </div>
    </div>
  );
};

export default MovieCard;

