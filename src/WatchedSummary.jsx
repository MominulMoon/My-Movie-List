export const WatchedSummary = ({ watched }) => {
  const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
  const total = (arr) =>
    arr.reduce((acc, cur) => (Number.isInteger(cur) ? acc + cur : acc), 0);

  function roundTo(num, precision) {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
  }
  const avgImdbRating = roundTo(
    average(watched.map((movie) => movie.imdbRating)),
    2,
  );
  const avgUserRating = roundTo(
    average(watched.map((movie) => movie.userRating)),
    2,
  );
  const avgRuntime = roundTo(total(watched.map((movie) => movie.runtime)), 2);
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
};
