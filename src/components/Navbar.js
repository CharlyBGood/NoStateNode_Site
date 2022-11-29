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
        <Link to={!user ? "/" : "/Home"}>
          <h1 className="text-orange-300">NoStateNode</h1>
        </Link>
        <img
          className="logo-img"
          src={require("../img/horsecoin.png")}
          alt="nostatenode horse logo"
        />
        {!user ? <LoginButton /> : <LogoutButton />}
      </nav>
      {/* {!user ? <LoginButton /> : <LogoutButton />} */}
    </div>
  );
}
