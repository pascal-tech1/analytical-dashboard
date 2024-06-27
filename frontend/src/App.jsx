import React, { useEffect, useState } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./generalPages/login";

import DashboardLayout from "./dashboard/dashboardLayout";
import useDarkMode from "./customHooks/useDarkMode";
import GeneralPageLayout from "./generalPages/generalPageLayout";
import Home from "./generalPages/home";
import Barchart from "./dashboard/barChart";
import LineChart from "./dashboard/lineChart";
import Error from "./generalPages/error";


const App = () => {
  const theme = localStorage.getItem("theme");

  const isSystemInDakMode = useDarkMode();
  console.log(isSystemInDakMode);

  useEffect(() => {
    if (!theme && isSystemInDakMode) {
      document.documentElement.classList.add("dark");
    } else if (!theme && !isSystemInDakMode) {
      document.documentElement.classList.remove("dark");
    } else if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, isSystemInDakMode]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
      }
      if (e.key === "Enter") {
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GeneralPageLayout />}>
          <Route index path="/" element={<Home />} />
          <Route path="login" element={<Login />} />

          <Route path="*" element={<Error />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route index path="barchart" element={<Barchart />} />
          <Route index path="linechart" element={<LineChart />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        draggable={true}
        className={` text-xs max-w-fit font-inter py-0 text-black dark:text-white `}
        theme={theme ? theme : isSystemInDakMode ? "dark" : "light"}
      />
    </BrowserRouter>
  );
};

export default App;
