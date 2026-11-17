import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.2 8.8c0 5-8.2 10.1-8.2 10.1S3.8 13.8 3.8 8.8A4.3 4.3 0 0 1 12 6.7a4.3 4.3 0 0 1 8.2 2.1Z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4.5 8.5h15l-1 12h-13l-1-12Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setAuthVersion] = useState(0);
  const user = readUser();
  const query = new URLSearchParams(location.search).get("search") || "";
  const token = localStorage.getItem("token");
  const isAdmin = ["admin", "manager"].includes(user?.role);

  useEffect(() => {
    const handleStorage = () => setAuthVersion((version) => version + 1);
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleSearchChange = (event) => {
    const params = new URLSearchParams(location.search);
    if (event.target.value.trim()) {
      params.set("search", event.target.value);
    } else {
      params.delete("search");
    }
    navigate({ pathname: "/", search: params.toString() }, { replace: true });
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams(location.search);
    if (query.trim()) params.set("search", query.trim());
    navigate({ pathname: "/", search: params.toString() });
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthVersion((version) => version + 1);
    navigate("/login");
  };

  return (
    <header className="store-header">
      <div className="store-announcement">
        <p>
          Discover new favorites, made for your everyday.
          <a href="/#new-arrivals">
            Meet what&apos;s new <span aria-hidden="true">→</span>
          </a>
        </p>
      </div>

      <div className="store-header-main store-shell">
        <Link to="/" className="store-brand" aria-label="ShopSphere home">
          <span className="store-brand-mark" aria-hidden="true">
            S
          </span>
          <span className="store-brand-word">shop<span>sphere</span></span>
        </Link>

        <form className="store-search" role="search" onSubmit={submitSearch}>
          <SearchIcon />
          <input
            type="search"
            placeholder="Search products, brands and more"
            aria-label="Search products"
            value={query}
            onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </form>

        <div className="store-header-actions">
          <Link
            to={token ? "/profile" : "/login"}
            className="store-account-action"
            aria-label={token ? "Your account" : "Sign in"}
          >
            <UserIcon />
            <span className="store-account-copy">
              <span>{token ? "Hello," : "Welcome"}</span>
              <strong>{token ? user?.name || "Your account" : "Sign in"}</strong>
            </span>
          </Link>
          <Link
            to="/wishlist"
            className="store-icon-action"
            aria-label="Wishlist"
          >
            <HeartIcon />
          </Link>
          <Link to="/cart" className="store-icon-action" aria-label="Shopping cart">
            <BagIcon />
          </Link>
          {!token ? (
            <Link to="/register" className="store-join-button">
              Join us
            </Link>
          ) : (
            <button
              type="button"
              onClick={logoutHandler}
              className="store-signout-button"
            >
              Sign out
            </button>
          )}
        </div>

        <form
          className="store-search store-search-mobile"
          role="search"
          onSubmit={submitSearch}
        >
          <SearchIcon />
          <input
            type="search"
            placeholder="Search the collection"
            aria-label="Search products"
            value={query}
            onChange={handleSearchChange}
          />
          <button type="submit" aria-label="Submit search">
            <SearchIcon />
          </button>
        </form>
      </div>

      <nav className="store-nav" aria-label="Main navigation">
        <div className="store-shell store-nav-inner">
          <a href="/#categories">Shop all</a>
          <a href="/#new-arrivals">New arrivals</a>
          <a href="/#best-sellers">Best sellers</a>
          <Link to="/wishlist">Wishlist</Link>
          {token && (
            <>
              {isAdmin ? (
                <Link to="/admin">Admin panel</Link>
              ) : (
                <Link to="/dashboard">My orders</Link>
              )}
              <Link to="/profile">My account</Link>
            </>
          )}
          <span className="store-nav-note">A little more joy in every day.</span>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
