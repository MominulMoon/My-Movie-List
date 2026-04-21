/** Displays an error message to the user */
export const ErrorMessage = ({ message }) => {
  return (
    <p className="error">
      <span>⚠️</span>
      {message}
    </p>
  );
};
