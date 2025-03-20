// import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import Search from './components/Search.jsx';
// import Spinner from './components/Spinner.jsx';
// import MovieCard from './components/MovieCard.jsx';
// import MovieDetail from './components/MovieDetail.jsx';
// import { useDebounce } from 'react-use';

// const API_BASE_URL = 'https://www.omdbapi.com';
// const API_KEY = 'f888c551';

// const Home = () => {
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [movieList, setMovieList] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [trendingMovies, setTrendingMovies] = useState([]);

//   const navigate = useNavigate();

//   useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);


//   const fetchMovies = async (query = '') => {
//     setIsLoading(true);
//     setErrorMessage('');
  
//     try {
//       let movieResults = [];
  
//       if (query) {
//         const endpoint = `${API_BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
//         const response = await fetch(endpoint);
//         const data = await response.json();
  
//         if (data.Response === 'False') {
//           setErrorMessage(
//             <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'red' }}>
//              This movie is not available on the OMDB movie site..! 
//             </p>
//           );
//           setMovieList([]);
//           return;
//         }
  
//         movieResults = data.Search || [];
        
//       } else {
//         const queries = ['Avengers', 'Harry Potter', 'Squid Game'];
//         const defaultResults = await Promise.all(
//           queries.map(async (defaultQuery) => {
//             const endpoint = `${API_BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(defaultQuery)}`;
//             const response = await fetch(endpoint);
//             const data = await response.json();
//             return data.Search || [];
//           })
//         );
  
//         movieResults = defaultResults.flat();
//       }
  
//       setMovieList(movieResults);
//     } catch (error) {
//       console.error(`Error fetching movies: ${error}`);
//       setErrorMessage('Error fetching movies. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };
  

//   const fetchTrendingMovies = async () => {
//     try {
//       const trendingQueries = ['Avengers', 'Squid Game', 'Spider-Man', 'Oppenheimer', 'John Wick'];
//       const trendingResults = await Promise.all(
//         trendingQueries.map(async (query) => {
//           const endpoint = `${API_BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
//           const response = await fetch(endpoint);
//           const data = await response.json();
//           return data.Search ? data.Search[0] : null;
//         })
//       );

//       setTrendingMovies(trendingResults.filter(Boolean));
//     } catch (error) {
//       console.error('Error fetching trending movies:', error);
//     }
//   };

//   // useEffect(() => {
//   //   if (debouncedSearchTerm.trim()) {
//   //     fetchMovies(debouncedSearchTerm);
//   //   }
//   // }, [debouncedSearchTerm]);
//   useEffect(() => {
//     if (debouncedSearchTerm.trim()) {
//       fetchMovies(debouncedSearchTerm);
//     } else {
//       fetchMovies(); 
//     }
//   }, [debouncedSearchTerm]);

//   useEffect(() => {
//     (async () => {
//       await fetchTrendingMovies();
//       await fetchMovies();
//     })();
//   }, []);

//   return (
//     <main>
//       <div className="pattern" />
//       <div className="wrapper">
//         <header>
//           <img src="./hero.png" alt="Hero Banner" />
//           <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
//           <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//         </header>

//         {/* <h2 className="mt-10">Trending Movies</h2>
//         {trendingMovies.length > 0 && (
//           <section className="trending">
//             <ul>
//               {trendingMovies.map((movie) => (
                
//                 <li key={movie.imdbID} onClick={() => navigate(`/movie/${movie.imdbID}`)} style={{ cursor: 'pointer' }}>
                  
//                   <img src={movie.Poster} alt={movie.Title} />
                  
//                 </li>
//               ))}
//             </ul>
//           </section>
//         )} */}

// {trendingMovies.length > 0 && (
//           <section className="trending">
//             <h2>Trending Movies</h2>

//             <ul>
//               {trendingMovies.map((movie, index) => (
//                 <li key={movie.$id}>
//                   <p className='pr-4'>{index + 1 }</p>
//                   <li key={movie.imdbID} onClick={() => navigate(`/movie/${movie.imdbID}`)} style={{ cursor: 'pointer' }}>
//                   <img src={movie.Poster} alt={movie.Title} />
//                 </li>
//                 </li>
//               ))}
//             </ul>
//           </section>
//         )}

//         <section className="all-movies">
//           <h2 className="mt-10">{debouncedSearchTerm ? "Search Results" : "All Movies"}</h2>
//           {isLoading ? (
//             <Spinner />
//           ) : errorMessage ? (
//             <p className="text-red-500">{errorMessage}</p>
//           ) : (
//             <ul>
//               {movieList.map((movie) => (
//                 <MovieCard key={movie.imdbID} movie={movie} onClick={() => navigate(`/movie/${movie.imdbID}`)} />
//               ))}
//             </ul>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// };

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/movie/:id" element={<MovieDetail />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;





// import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import Search from './components/Search.jsx';
// import Spinner from './components/Spinner.jsx';
// import MovieCard from './components/MovieCard.jsx';
// import MovieDetail from './components/MovieDetail.jsx';
// import { useDebounce } from 'react-use';

// const API_KEY = '148d7fb358e9a2f5b04a7567677ec479';
// const API_BASE_URL = 'https://api.themoviedb.org/3';

// const Home = () => {
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [movieList, setMovieList] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [trendingMovies, setTrendingMovies] = useState([]);

//   const navigate = useNavigate();

//   useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

//   const fetchMovies = async () => {
//     setIsLoading(true);
//     setErrorMessage('');

//     try {
//       const endpoint = `${API_BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
//       const response = await fetch(endpoint);
//       const data = await response.json();

//       if (!data.results) {
//         setErrorMessage('Error fetching movies. Please try again later.');
//         setMovieList([]);
//         return;
//       }

//       setMovieList(data.results);
//     } catch (error) {
//       console.error(`Error fetching movies: ${error}`);
//       setErrorMessage('Error fetching movies. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchTrendingMovies = async () => {
//     try {
//       const endpoint = `${API_BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
//       const response = await fetch(endpoint);
//       const data = await response.json();

//       if (data.results) {
//         setTrendingMovies(data.results.slice(0, 10)); // Get top 10 trending movies
//       }
//     } catch (error) {
//       console.error('Error fetching trending movies:', error);
//     }
//   };

//   useEffect(() => {
//     fetchTrendingMovies();
//     fetchMovies();
//   }, []);

//   return (
//     <main>
//       <div className="pattern" />
//       <div className="wrapper">
//         <header>
//           <img src="./hero.png" alt="Hero Banner" />
//           <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
//           <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//         </header>

//         {trendingMovies.length > 0 && (
//           <section className="trending">
//             <h2>Trending Movies</h2>
//             <ul>
//               {trendingMovies.map((movie, index) => (
//                 <li key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)} style={{ cursor: 'pointer' }}>
//                   <p className="pr-4">{index + 1}</p>
//                   <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
//                 </li>
//               ))}
//             </ul>
//           </section>
//         )}

//         <section className="all-movies">
//           <h2 className="mt-10">{debouncedSearchTerm ? "Search Results" : "All Movies"}</h2>
//           {isLoading ? (
//             <Spinner />
//           ) : errorMessage ? (
//             <p className="text-red-500">{errorMessage}</p>
//           ) : (
//             <ul>
//               {movieList.map((movie) => (
//                 <MovieCard
//                   key={movie.id}
//                   movie={{
//                     imdbID: movie.id,
//                     Poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
//                     Title: movie.title
//                   }}
//                   onClick={() => navigate(`/movie/${movie.id}`)}
//                 />
//               ))}
//             </ul>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// };

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/movie/:id" element={<MovieDetail />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;


import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Search from './components/Search.jsx';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import MovieDetail from './components/MovieDetail.jsx';
import { useDebounce } from 'react-use';

const API_KEY = '148d7fb358e9a2f5b04a7567677ec479';
const API_BASE_URL = 'https://api.themoviedb.org/3';

const Home = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const navigate = useNavigate();

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      let endpoint;
      if (debouncedSearchTerm) {
        endpoint = `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${debouncedSearchTerm}`;
      } else {
        endpoint = `${API_BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`;
      }

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
      const endpoint = `${API_BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.results) {
        setTrendingMovies(data.results.slice(0, 10)); // Get top 10 trending movies
      }
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  };

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

        {trendingMovies.length > 0 && !debouncedSearchTerm && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)} style={{ cursor: 'pointer' }}>
                  <p className="pr-4">{index + 1}</p>
                  <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="mt-10">{debouncedSearchTerm ? "Search Results" : "All Movies"}</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
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