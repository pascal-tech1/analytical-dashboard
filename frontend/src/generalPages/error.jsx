import React from "react";

import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div>
      <div className="flex font-inter items-center h-screen justify-center flex-col mt-16 dark:bg-dark">
        <img
          src="/undraw_page_not_found_re_e9o6.svg"
          alt="error icon"
          className=" max-w-sm"
        />
        <Link
          className=" text-center mt-10 text-white self-center bg-blue-400 px-2 py-1 rounded-lg text-lg hover:bg-blue-600 transition-all duration-75"
          to={"/"}
        >
          Home
        </Link>
      </div>
    </div>
  );
};

export default Error;
