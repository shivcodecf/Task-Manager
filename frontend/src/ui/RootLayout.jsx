import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const RootLayout = () => {
  const { pathname } = useLocation();
  const hideNavbar = pathname === "/login" || pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
       
        {pathname === "/" && (
          <section className="text-center py-24 px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Welcome to TaskFlow
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
              Your all-in-one task management tool for users, managers, and admins.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
              >
                Sign Up
              </Link>
            </div>
          </section>
        )}

        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
