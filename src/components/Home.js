import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TaskList from "../formPages/TaskList";

export function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <h1>Loading....</h1>;
  }

  if (!user) {
    navigate("/");
  }

  return (
      
      <div className="bg-neutral w-full max-w-md rounded m-auto">
        {/* <div className="bg-black py-4 px-2 w-full max-w-xs m-auto text-slate-300">
        <h1>¡Hola {user.displayName || user.email}!</h1>
      </div> */}
        
          <h1 className="text-orange-300 text-center text-sm font-fold py-3">¡Hola {user.displayName || user.email}!</h1>
          <TaskList />
        
      </div>
    
  );
}
