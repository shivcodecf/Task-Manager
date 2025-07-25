import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, setUser } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); 
    navigate("/login");
  };

  return (
    <nav className="bg-[#0796e3] p-4 text-white flex justify-between items-center">
      <div>
        <Link to="/" className="font-bold text-xl">TaskFlow</Link>
      </div>

      <div className="space-x-4">
        {!user ? (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Signup</Link>
          </>
        ) : (
          <>
            <span className="font-medium">Hi, {user.name} ({user.role})</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
