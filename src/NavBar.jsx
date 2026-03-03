export const NavBar = ({ children }) => {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
};
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>My Movie List</h1>
    </div>
  );
}
