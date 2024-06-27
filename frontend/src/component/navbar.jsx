import React, { useEffect, useState } from "react";
import Theme from "./Theme";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isLoginIn, setIsLogin] = useState(false);

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [token]);
  console.log(isLoginIn);
  return (
    <nav className=" dark:bg-lightdark bg-opacity-10 backdrop-filter backdrop-blur-lg border-b dark:border-b-gray-600 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link ink to="/" id="Home" aria-label="Login">
              <span className="text-xl font-bold drop-shadow-2xl">
                Blackcoffer
              </span>
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            {/* theme  */}
            <div className=" -ml-[5rem] max-[389px]:ml-0">
              <Theme />
            </div>
          </div>
          {isLoginIn ? (
            <div className="flex items-center">
              <Link
                to="/barchart"
                id="dashboard"
                aria-label="dashboard"
                className="px-4 py-1 bg-blue-600 text-white rounded-lg"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex items-center">
              <Link
                to="/login"
                id="login"
                aria-label="Login"
                className="px-4 py-1 bg-green-600 text-white rounded-lg"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
