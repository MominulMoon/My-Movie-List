/**
 * Main App component.
 * Manages global state: movies (search results), watched list, loading, errors.
 * Fetches movies from OMDb API and persists watched list via backend CSV API.
 */
import { useEffect, useState } from "react";
import { NavBar } from "./NavBar";
import { Search } from "./Search";
import { NumResults } from "./NumResults";

import { Box } from "./Box";
import { MovieList } from "./MovieList";
import { WatchedSummary } from "./WatchedSummary";
import { WatchedMovieList } from "./WatchedMovieList";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";
import { MovieDetails } from "./MovieDetails";

/** OMDb API key for movie search/details */
const KEY = "be172064";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // Load watched movies from CSV backend on mount
  useEffect(function () {
    let ignore = false;

    async function loadWatched() {
      try {
        const res = await fetch("/api/watched");
        if (!res.ok) throw new Error("Failed to load watched movies");
        const data = await res.json();
        if (!ignore) setWatched(Array.isArray(data) ? data : []);
      } catch {
        // Backend offline: keep watched empty
      }
    }

    loadWatched();
    return () => {
      ignore = true;
    };
  }, []);

  /** Toggle selected movie (show details or close) */
  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  /** Add movie to watched list and save to CSV backend */
  async function handleAddWatched(movie) {
    try {
      const res = await fetch("/api/watched", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
      });
      if (!res.ok) throw new Error("Failed to save watched movie");
      const data = await res.json();
      setWatched(Array.isArray(data) ? data : []);
    } catch {
      setWatched((watched) => [...watched, movie]);
    }
  }

  /** Remove movie from watched list and update CSV backend */
  async function handleDeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    try {
      await fetch(`/api/watched/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch {}
  }

  // Fetch movies from OMDb when search query changes
  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setError("");
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal },
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          // console.log(data);

          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") console.log(err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
          setError("");
        }
      }
      // Require at least 3 chars before searching
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query],
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList onSelectMovie={handleSelectedMovie} movies={movies} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              KEY={KEY}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

/** Layout wrapper for main content area */
function Main({ children }) {
  return <main className="main">{children}</main>;
}
