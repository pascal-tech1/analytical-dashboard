import React from "react";
import Navbar from "../component/navbar";
import { Outlet } from "react-router-dom";

const GeneralPageLayout = () => {
  return (
    <section className=" font-inter dashboardLayout  ">
      <div class="relative h-full w-full bg-slate-950"><div class="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div><div class="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div></div>
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
