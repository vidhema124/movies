import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import MovieDetail from "./components/MovieDetail.jsx";
import { useDebounce } from "react-use";
import Skeleton from "react-loading-skeleton";
import WishlistPage from "./components/WishlistPage.jsx";
import SubscriptionPage from "./components/SubscriptionPage.jsx";
import Signup from "./components/Signup.jsx";

const API_KEY = "148d7fb358e9a2f5b04a7567677ec479";
const API_BASE_URL = "https://api.themoviedb.org/3";

const Home = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]); // FIXED: Added state for upcoming movies
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasLoggedIn = localStorage.getItem("hasLoggedIn");
      setShowPopup(hasLoggedIn !== "true");
    }
  }, []);
  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      let endpoint;
      if (debouncedSearchTerm) {
        endpoint = `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${debouncedSearchTerm}&language=hi-IN&region=IN`;
      } else {
        endpoint = `${API_BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;
      }

      const response = await fetch(endpoint);
      const data = await response.json();
      useEffect(() => {
        const hasLoggedIn = localStorage.getItem("hasLoggedIn") === "true";
        if (hasLoggedIn) {
          setShowPopup(false);
        } else {
          setShowPopup(true);
        }
      }, []);

      if (!data.results) {
        setErrorMessage("Error fetching movies. Please try again later.");
        setMovieList([]);
        return;
      }

      setMovieList(data.results);
    } catch (error) {
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingMovies = async () => {
    setIsLoadingTrending(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
      );
      const data = await response.json();

      if (data.results) {
        setTrendingMovies(data.results.slice(0, 10));
        setIsLoadingTrending(false);
      }
    } catch (error) {
      setIsLoadingTrending(false);
    }
  };
  const handleRedirect = (path) => {
    setShowPopup(false);
    if (path === "/signup") {
      localStorage.setItem("hasLoggedIn", "true");
    }
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
      const response = await fetch(
        `${API_BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
      );
      const data = await response.json();

      if (data.results) {
        const sortedMovies = data.results
          .filter((movie) => movie.release_date)
          .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

        setUpcomingMovies(sortedMovies.slice(0, 10));
        setIsLoadingUpcoming(false);
      }
    } catch (error) {
      setIsLoadingUpcoming(false);
    }
  };

  const fetchPopularMovies = async () => {
    setIsLoadingPopular(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US`
      );
      const data = await response.json();

      if (data.results) {
        const sortedMovies = data.results
          .filter((movie) => movie.release_date)
          .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

        setPopularMovies(sortedMovies.slice(0, 10));
        setIsLoadingPopular(false);
      }
    } catch (error) {
      setIsLoadingPopular(false);
    }
  };

  useEffect(() => {
    fetchTrendingMovies();
    fetchUpcomingMovies();
    fetchPopularMovies();
    fetchMovies();
  }, [debouncedSearchTerm]);

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
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7">
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
                    onClick={() => navigate(`/movie/${movie.id}`)}
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
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7">
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
                    onClick={() => navigate(`/movie/${movie.id}`)}
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
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7">
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
                    onClick={() => navigate(`/movie/${movie.id}`)}
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

        <section className="all-movies">
          <h2 className="mt-10">
            {debouncedSearchTerm ? "Search Results" : "All Movies"}
          </h2>
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
                  movie={{
                    imdbID: movie.id,
                    Poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                    Title: movie.title,
                  }}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
      {showPopup && (
        <div className="z-50 fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="bg-neutral-800 p-12  w-96 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl  font-bold">Welcome back</h2>
            <p className=" text-white p-2  text-lg ">
              Log in or sign up to get smarter responses, upload files, and
              more.
            </p>
            <div className=" p-2 mt-4">
              <button
                onClick={() => handleRedirect("/signup")}
                className="  w-full px-4 py-2 bg-transparent text-white border border-white rounded-full hover:bg-gray-600"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/subscriptionPage" element={<SubscriptionPage />} />
      </Routes>
    </Router>
  );
};

export default App;
