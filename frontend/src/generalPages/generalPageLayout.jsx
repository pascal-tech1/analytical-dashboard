import React from "react";
import Navbar from "../component/navbar";
import { Outlet } from "react-router-dom";

const GeneralPageLayout = () => {
  return (
    <section className=" font-inter dashboardLayout dark:bg-lightdark dark:text-slate-400 ">
    <div className=" row-start-1 row-span-1  ">
        <Navbar />
      </div>

      <div className="row-start-2 mt-1  row-span-full overflow-y-auto custom-scrollbar w-full z-10 px-3 md:px-8 ">
        <Outlet />
      </div>
    </section>
  );
};

export default GeneralPageLayout;
