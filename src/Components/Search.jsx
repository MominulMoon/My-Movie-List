/**
 * Search input with Enter-key focus shortcut.
 * Enter focuses the input and clears query when not already focused.
 */
import { useEffect, useRef } from "react";
export const Search = ({ query, setQuery }) => {
  const inputEl = useRef(null);
  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) {
          return;
        }
        if (e.code === "Enter") {
          inputEl.current.focus();
          setQuery("");
        }
      }

      return document.addEventListener("keydown", callback);
    },
    [setQuery],
  );
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
};
