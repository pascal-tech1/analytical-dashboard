import React, { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Theme from "../component/Theme";
import { removeTokenFromLocalStorage } from "../utils/localStorage";
import { CgMenuLeft, CgMenuRight } from "react-icons/cg";
import { GrLineChart } from "react-icons/gr";
import { MdOutlineBarChart } from "react-icons/md";

const DashboardLayout = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      window.innerWidth < 768
    ) {
      setIsSideBarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActiveLink = (path) => location.pathname === path;

  return (
    <div className="flex h-screen  bg-gray-100 dark:bg-lightdark dark:text-white">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`${
          isSideBarOpen ? "absolute lg:relative" : "hidden"
        } md:mt-0 bg-gray-100 dark:bg-lightdark shadow-md border-r dark:border-r-gray-800 md:border-none lg:shadow-sm z-[500] h-full md:relative w-[9rem] py-6 px-4`}
      >
        <Link to="/" className="hover:text-gray-400">
          <img
            src="../../public/blackcoffer_logo.png"
            alt="blackcoffer_logo"
            className="p-4 bg-gray-300 rounded-md mb-1"
          />
        </Link>
        <nav className="flex items-center flex-col mt-4">
          <ul>
            <li
              className={`mb-4 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md ${
                isActiveLink("/barchart")
                  ? " transition-all bg-gray-200 hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-900 "
                  : ""
              }`}
            >
              <Link
                to="/barchart"
                className={`py-2 px-3 flex items-center gap-1 whitespace-nowrap   text-blue-400`}
              >
                <MdOutlineBarChart /> bar chart
              </Link>
            </li>
            <li
              className={`mb-4 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md ${
                isActiveLink("/linechart")
                  ? "transition-all bg-gray-200 hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-900 rounded-md"
                  : ""
              }`}
            >
              <Link
                to="/linechart"
                className={`py-2 px-3 flex items-center gap-1 whitespace-nowrap   text-blue-400`}
              >
                <GrLineChart /> line chart
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="h-16 pr-6 flex justify-between items-center px-6">
          <button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
            {isSideBarOpen ? <CgMenuRight /> : <CgMenuLeft />}
          </button>
          <div className="max-[389px]:ml-0">
            <Theme />
          </div>
          <div className="flex items-center">
            <button
              onClick={() => {
                removeTokenFromLocalStorage();
                navigate("/");
              }}
              id="logout"
              aria-label="Logout"
              className="px-4 py-1 bg-green-600 text-white rounded-lg"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-200 dark:bg-dark p-6 overflow-y-scroll">
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
