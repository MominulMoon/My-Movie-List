/** Top navigation bar with logo and slot for Search/NumResults */
export const NavBar = ({ children }) => {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
};
/** App logo and title */
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>My Movie List</h1>
    </div>
  );
}
