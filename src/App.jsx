import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Search from './components/Search.jsx';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import MovieDetail from './components/MovieDetail.jsx';
import { useDebounce } from 'react-use';
import Skeleton from 'react-loading-skeleton';

const API_KEY = '148d7fb358e9a2f5b04a7567677ec479';
const API_BASE_URL = 'https://api.themoviedb.org/3';

const Home = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);

  const navigate = useNavigate();

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage('');

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
        setErrorMessage('Error fetching movies. Please try again later.');
        setMovieList([]);
        return;
      }

      setMovieList(data.results);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
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
        setTrendingMovies(data.results.slice(0, 10)); // Get top 10 trending movies
      }
    } catch (error) {
      setIsLoadingTrending(false);
    } finally {
      setIsLoadingTrending(false);
    }
  };
  console.log("isLoadingTrending ", isLoadingTrending);
  

  useEffect(() => {
    fetchTrendingMovies();
    fetchMovies();
  }, [debouncedSearchTerm]);  

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {isLoadingTrending ? (
         <section className="trending">
         <h2 className="text-2xl font-bold mb-4">Trending Movies</h2>
         <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
           {[...Array(5)].map((_, index) => (
             <li key={index} className="animate-pulse flex flex-col items-center space-y-2">
               <div className="w-[127px] h-[136px] bg-gray-300 rounded-lg"></div>
             </li>
           ))}
         </ul>
       </section>
        ) : (
          trendingMovies.length > 0 && !debouncedSearchTerm && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)} style={{ cursor: "pointer" }}>
                    <p className="pr-4">{index + 1}</p>
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )
        )}


        <section className="all-movies">
          <h2 className="mt-10">{debouncedSearchTerm ? "Search Results" : "All Movies"}</h2>
          {(isLoading || errorMessage) ? (
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
                    Title: movie.title
                  }}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </Router>
  );
};

export default App;