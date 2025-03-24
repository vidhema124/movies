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
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      let endpoint;
      if (debouncedSearchTerm) {
        endpoint = `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${debouncedSearchTerm}&language=hi-IN&region=IN`;
      } else {
        endpoint = `${API_BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`;
      }

      // try {
      //   let endpoint;
      //   const BOLLYWOOD_GENRE_ID = 28; // Example: Use correct genre ID for Bollywood movies

      //   if (debouncedSearchTerm) {
      //     endpoint = `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${debouncedSearchTerm}&language=hi-IN&region=IN`;
      //   } else {
      //     endpoint = `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&language=hi-IN&region=IN&with_original_language=hi&sort_by=popularity.desc`;
      //   }

      const response = await fetch(endpoint);
      const data = await response.json();

      if (!data.results) {
        setErrorMessage("Error fetching movies. Please try again later.");
        setMovieList([]);
        return;
      }

      setMovieList(data.results);
      console.log(setMovieList);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingMovies = async () => {
    try {
      setIsLoadingTrending(true);

      const endpoint = `${API_BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.results) {
        setTrendingMovies(data.results.slice(0, 10));
        setIsLoadingTrending(false);
      }
    } catch (error) {
      setIsLoadingTrending(false);
    } 
  };

  useEffect(() => {
    fetchTrendingMovies();
    fetchMovies();
  }, [debouncedSearchTerm]);
  useEffect(() => {
    const hasLoggedIn = localStorage.getItem("hasLoggedIn") === "true";
    if (hasLoggedIn) {
      setShowPopup(false); // Popup hata do
    } else {
      // Agar login nahi hai toh 2 sec baad popup dikhao
      setShowPopup(true);
    }
  }, []);
  const handleRedirect = (path) => {
    setShowPopup(false);
    if (path === "/signup") {
      // localStorage.setItem("hasLoggedIn", "true");
      setShowPopup(false);
    }
    window.location.href = path;
  };
  const handleLogout = () => {
    localStorage.removeItem("hasLoggedIn"); 
    navigate("/signup");  
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
        </header>

        {isLoadingTrending ? (
          <section>
            <h2 className="text-2xl font-bold mb-4">Trending Movies</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7">
              {[...Array(7)].map((_, index) => (
                <li
                  key={index}
                  className="animate-pulse flex flex-col items-center "
                >
                  <div className="w-[127px] h-[163px] bg-gray-300 rounded-lg"></div>
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

        <section className="all-movies">
          <h2 className="mt-10">
            {debouncedSearchTerm ? "Search Results" : "All Movies"}
          </h2>
          {isLoading || errorMessage ? (
            // <Spinner />
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
            <p className=" p-2  text-lg ">
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
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
