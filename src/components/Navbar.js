import { Link } from "react-router-dom";
import { LoginButton } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";
import { useAuth } from "../context/AuthContext";
import "../stylesheets/Navbar.css";

export function Navbar() {
  const { user } = useAuth();

  return (
    <div className="nav-container">
      <nav className="navbar-logos">
        <Link to={!user ? "/" : "/Home"} className="no-underline">
          <h1>
            <span className="txt-title-span">N</span>o
            <span className="txt-title-span">S</span>tate
            <span className="txt-title-span">N</span>ode
          </h1>
        </Link>
        <a
          href="https://res.cloudinary.com/dr8pwzxzn/image/upload/v1738364039/MaschioLeguizamoGardel_zbwmq5.jpg"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="logo-img"
            src={require("../img/horsecoin.png")}
            alt="nostatenode horse logo"
          />
        </a>
        {!user ? <LoginButton /> : <LogoutButton />}
      </nav>
    </div>
  );
}
