// import { useContext } from "react";
// import { context } from "../context/AuthContext";

import { useAuth } from "../context/AuthContext";

export function Home() {
  const {user} = useAuth();
  console.log(user);
  return <div>Home</div>;
}
