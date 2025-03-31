import { useEffect, useState } from "react";
import Search from "../components/Search.jsx";
import MovieCard from "../components/MovieCard.jsx";
import { useDebounce } from "react-use";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import Signupgoggle from "./Signupwithgoggle.jsx";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
const API_BASE_URLs = "https://movies-app-jgjm.onrender.com/api/v1";

const Home = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  const navigate = useNavigate();

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasLoggedIn = localStorage.getItem("hasLoggedIn");
      setShowPopup(hasLoggedIn !== "true");
    }
  }, []);
  useEffect(() => {
    fetchTrendingMovies();
    fetchUpcomingMovies();
    fetchPopularMovies();
  }, []);
  useEffect(() => {
    fetchMovies();
  }, [debouncedSearchTerm, sortOption, currentPage]);

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      let endpoint = `${API_BASE_URLs}/movies`;

      const queryParams = new URLSearchParams();
      queryParams.append("limit", 20); // Ensure limit is always 20
      queryParams.append("page", currentPage);
      if (debouncedSearchTerm)
        queryParams.append("search", debouncedSearchTerm);
      if (sortOption) queryParams.append("sort", sortOption);

      if (queryParams.toString()) endpoint += `?${queryParams.toString()}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      if (!data || !data.message) {
        setErrorMessage("Error fetching movies. Please try again later.");
        setMovieList([]);
        return;
      }

      setMovieList(data.message);
      setTotalPages(data.totalPages);
    } catch (error) {
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchTrendingMovies = async () => {
    setIsLoadingTrending(true);
    try {
      const response = await fetch(`${API_BASE_URLs}/trendingmovies`);
      const data = await response.json();

      if (data.message) {
        setTrendingMovies(data.message.slice(0, 10));
        setIsLoadingTrending(false);
      }
    } catch (error) {
      setIsLoadingTrending(false);
    }
  };

  const handleRedirect = (path) => {
    window.location.href = path;
  };

  const handleLogout = () => {
    localStorage.removeItem("hasLoggedIn");
    setShowPopup(true);
    navigate("/");
  };

  const fetchUpcomingMovies = async () => {
    setIsLoadingUpcoming(true);

    try {
      const response = await fetch(`${API_BASE_URLs}/upcomingmovies`);
      const data = await response.json();

      if (data.message) {
        setUpcomingMovies(data.message.slice(0, 10));
        setIsLoadingUpcoming(false);
      }
    } catch (error) {
      setIsLoadingUpcoming(false);
    }
  };

  const fetchPopularMovies = async () => {
    setIsLoadingPopular(true);

    try {
      const response = await fetch(`${API_BASE_URLs}/popularmovies`);
      const data = await response.json();

      if (data.message) {
        setPopularMovies(data.message.slice(0, 10));
        setIsLoadingPopular(false);
      }
    } catch (error) {
      setIsLoadingPopular(false);
    }
  };

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <nav className="flex justify-end">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/wishlist");
            }}
            className="wishlist-page-btn text-white text-lg mt-4 px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition"
          >
            📜 Go to Wishlist
          </button>
        </header>

        {isLoadingTrending ? (
          <section className="trending">
            <h2 className="text-2xl font-bold mb-4">Trending Movies</h2>
            <ul className="grid mt-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-7">
              {[...Array(7)].map((_, index) => (
                <li
                  key={index}
                  className="animate-pulse flex flex-col items-center "
                >
                  <div className="w-[127px] h-[136px] bg-gray-300 rounded-lg"></div>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          trendingMovies.length > 0 &&
          !debouncedSearchTerm && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li
                    key={movie.id}
                    onClick={() => navigate(`/movie/${movie._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <p className="pr-4">{index + 1}</p>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )
        )}

        {isLoadingUpcoming ? (
          <section className="upcoming">
            <h2 className="text-2xl font-bold mb-4">Upcoming Movies</h2>
            <ul className="grid mt-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-7">
              {[...Array(7)].map((_, index) => (
                <li
                  key={index}
                  className="animate-pulse flex flex-col items-center "
                >
                  <div className="w-[127px] h-[136px] bg-gray-300 rounded-lg"></div>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          upcomingMovies.length > 0 &&
          !debouncedSearchTerm && (
            <section className="trending">
              <h2>Upcoming Movies</h2>
              <ul>
                {upcomingMovies.map((movie, index) => (
                  <li
                    key={movie.id}
                    onClick={() => navigate(`/movie/${movie._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <p className="pr-4">{index + 1}</p>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )
        )}

        {isLoadingPopular ? (
          <section className="trending">
            <h2 className="text-2xl font-bold mb-4">Popular Movies</h2>
            <ul className="grid mt-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-7">
              {[...Array(7)].map((_, index) => (
                <li
                  key={index}
                  className="animate-pulse flex flex-col items-center "
                >
                  <div className="w-[127px] h-[136px] bg-gray-300 rounded-lg"></div>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          popularMovies.length > 0 &&
          !debouncedSearchTerm && (
            <section className="trending">
              <h2>Popular Movies</h2>
              <ul>
                {popularMovies.map((movie, index) => (
                  <li
                    key={movie.id}
                    onClick={() => navigate(`/movie/${movie._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <p className="pr-4">{index + 1}</p>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )
        )}

        <main>
          <div className="wrapper">
            <section className="all-movies">
              <div className="flex justify-between">
                <h2 className="mt-10 flex">
                  {debouncedSearchTerm ? "Search Results" : "All Movies"}
                </h2>
                <header>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="  border p-2 bg-dark-100 text-gray-100  "
                  >
                    <option value="">Filter Movies </option>
                    <option value="vote_count">Vote Count</option>
                    <option value="vote_average">Vote Average</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </header>
              </div>

              {isLoading || errorMessage ? (
                <ul className="movie-list">
                  {[...Array(8)].map((_, index) => (
                    <li key={index} className="movie-card h-[479px]">
                      <div className="movie-card-skeleton">
                        <Skeleton height={300} width="100%" />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul>
                  {movieList.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie_id={movie._id}
                      movie={{
                        imdbID: movie._id,
                        Poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                        Title: movie.title,
                      }}
                      onClick={() => navigate(`/movie/${movie.id}`)}
                    />
                  ))}
                </ul>
              )}
              <div className="flex justify-center mt-4">
                <button
                  className="mx-2 p-2 bg-gray-700 text-white rounded"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <AiOutlineArrowLeft />
                </button>
                <span className="p-2 text-white">
                  Page {currentPage} next {totalPages}
                </span>
                <button
                  className="mx-2 p-2 bg-gray-700 text-white rounded"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  <AiOutlineArrowRight />
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
      {showPopup && (
        <div className="z-50 fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="bg-neutral-800 p-12  w-96 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl  font-bold">Welcome back again</h2>
            <p className=" text-white p-2  text-lg ">
              Log in or sign up to get smarter responses, upload files, and
              more.
            </p>
            <div className=" p-2 mt-4">
              <button
                onClick={() => handleRedirect("/signup")}
                className="cursor-pointer  w-full px-4 py-2 bg-transparent text-white border border-white rounded-full hover:bg-gray-600"
              >
                Sign up with Otp less
              </button>
              <Signupgoggle />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
