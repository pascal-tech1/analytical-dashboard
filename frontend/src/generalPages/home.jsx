import React from "react";
import chartImage from "../../public/chartImage.jpg";

const Home = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="dark:bg-lightdark p-8 mt-16 min-h-screen flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-4">Blackcoffer Assignment</h1>
        <p className="mb-8">
          This project focuses on building a dynamic and interactive data
          visualization dashboard using Flask python framework for backend and
          React javascript framework for frontend and Tailwind CSS for styling.
          The goal is to fetch data from an API and present it in a user-friendly
          manner with various filters and options for data analysis.
        </p>
        <div className="relative p-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg">
          <img
            src={chartImage}
            alt="Chart"
            className="w-full h-auto rounded-md shadow-md"
          />
        </div>
      </div>
      <footer className="mt-8 text-center py-4  bg-opacity-10 backdrop-blur-lg rounded-lg ">
        <p className="mb-2">&copy; {currentYear} Made by Azubike Pascal</p>
        <a 
          href="https://wa.me/2349095606300" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:underline"
        >
          Contact me on WhatsApp
        </a>
        <br />
        <a 
          href="https://pascal-portfolio.onrender.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:underline"
        >
          Visit my Portfolio
        </a>
      </footer>
    </div>
  );
};

export default Home;
