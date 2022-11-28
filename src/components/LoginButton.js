import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";

export function LoginButton() {
  const { loading } = useAuth();

  if (loading) return <h1>Loading...</h1>;

  return (
    <button
      className="log-button"
      // onClick={() => alert("Create a username!!")}
    >
      <Link to="./Login">Login</Link>
    </button>
  );
}
