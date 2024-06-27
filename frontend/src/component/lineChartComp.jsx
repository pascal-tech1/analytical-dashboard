import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import customFetch from "../utils/axios";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import {
  getTokenFromLocalStorage,
  removeTokenFromLocalStorage,
} from "../utils/localStorage";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LineChartComp = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState(null);
  const [filters, setFilters] = useState({
    end_year: "",
    topics: "",
    sector: "",
    region: "",
    pestle: "",
    source: "",
    country: "",
  });
  const [selectedYAxisVariable, setSelectedYAxisVariable] =
    useState("intensity");
  const [selectedXAxisVariable, setSelectedXAxisVariable] =
    useState("start_year");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isYAxisDropdownOpen, setIsYAxisDropdownOpen] = useState(false);
  const filterFormRef = useRef(null);
  const yAxisFormRef = useRef(null);
  const filterButtonRef = useRef(null);
  const yAxisButtonRef = useRef(null);

  useEffect(() => {
    fetchChartData();
  }, [filters, selectedYAxisVariable, selectedXAxisVariable]);


  // this function fetches the chart data from the backend and passed the data the 
  // processDataForChart function
  // would have made this in the redux slice but to save time from moving from file to file 
  // i just did it headers
  // i also handled login out of user from the dashboard here if there is error in token so they login again
  const fetchChartData = async () => {
    try {
      const url = `http://127.0.0.1:5000/lineChart`;

      // Retrieve the token from local storage
      const token = getTokenFromLocalStorage();

      // Set up the request headers, including the authorization token
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": token,
      };

      // Make the request with the headers and data
      const response = await customFetch.post(
        url,
        {
          filters,
          selectedYAxisVariable,
          selectedXAxisVariable,
        },
        { headers }
      );
      const data = response.data;
      console.log(data);
      const chartData = processDataForChart(data);
      setChartData(chartData);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "error fetching chart";
      toast.error(errorMessage);
      if (
        errorMessage === "has expired!" ||
        "Token is invalid!" ||
        "Token is missing!"
      ) {
        removeTokenFromLocalStorage();
        //  navigate here to home
        navigate("/");
      }
    }
  };

  // this function receive the data from the fetchChartData function 
  // and produce data that willbe pass to the line chart 
  const processDataForChart = (data) => {
    const labels = data.labels.filter((label) => label); // Remove empty labels
    const yAxisData = data.data.slice(0, labels.length); // Ensure data length matches labels

    return {
      labels,
      datasets: [
        {
          label:
            selectedYAxisVariable.charAt(0).toUpperCase() +
            selectedYAxisVariable.slice(1),
          data: yAxisData,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          fill: false,
        },
      ],
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilterButtonClick = (e) => {
    e.stopPropagation();
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const handleYAxisButtonClick = (e) => {
    e.stopPropagation();
    setIsYAxisDropdownOpen(!isYAxisDropdownOpen);
  };

  const handleYAxisClick = (variable) => {
    setSelectedYAxisVariable(variable);
    setIsYAxisDropdownOpen(false);
  };


  // this handleClickOutside function closes the dropdowns in the chart if outside of 
  // the dropdowns is clicked
  const handleClickOutside = (e) => {
    if (
      filterFormRef.current &&
      !filterFormRef.current.contains(e.target) &&
      filterButtonRef.current &&
      !filterButtonRef.current.contains(e.target)
    ) {
      setIsFilterDropdownOpen(false);
    }
    if (
      yAxisFormRef.current &&
      !yAxisFormRef.current.contains(e.target) &&
      yAxisButtonRef.current &&
      !yAxisButtonRef.current.contains(e.target)
    ) {
      setIsYAxisDropdownOpen(false);
    }
  };
// listening for the click event on the page 
  useEffect(() => {
    if (isFilterDropdownOpen || isYAxisDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isFilterDropdownOpen, isYAxisDropdownOpen]);


  // this is the option for styling and passing props to chart js 
  // it is just an object that is constructed
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          boxWidth: 10,
          padding: 20,
          color: "#94bef9",
        },
      },
      title: {
        display: true,
        text: `${
          selectedYAxisVariable.charAt(0).toUpperCase() +
          selectedYAxisVariable.slice(1)
        } over time`,
        color: "#94bef9",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#94bef9",
        },
        title: {
          display: true,
          text: "Year",
          color: "#94bef9",
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: function (value) {
            return value >= 1000 ? value / 1000 + "k" : value;
          },
          color: "#94bef9",
        },
        title: {
          display: true,
          text:
            selectedYAxisVariable.charAt(0).toUpperCase() +
            selectedYAxisVariable.slice(1),
          color: "#94bef9",
        },
        grid: {
          color: "#63636427",
        },
      },
    },
  };

  return (
    <div className="flex flex-col py-2 rounded-lg font-inter">
      <div className="px-2 self-start flex gap-4">
        {/* dropdown for the filter chart /////////////////////////////////////*/}
        <div className="relative">
          <button
            ref={filterButtonRef}
            onClick={handleFilterButtonClick}
            className="btn-primary flex gap-1 items-center"
          >
            Filter chart
            {isFilterDropdownOpen ? <MdArrowDropUp /> : <MdArrowDropDown />}
          </button>
          {isFilterDropdownOpen && (
            <div
              ref={filterFormRef}
              className="absolute top-full z-50 left-0 mt-2 px-4 md:w-[70vw] min-[1200px]:w-[80vw] py-4 rounded-lg shadow-sm dark:bg-dark bg-white"
            >
              <form className="px-4 py-4 rounded-r-lg shadow-md bg-gray-100 dark:bg-dark">
                <input
                  type="number"
                  name="end_year"
                  min="2016"
                  value={filters.end_year}
                  onChange={handleInputChange}
                  placeholder="End year"
                  className="form-input w-[10rem]"
                />
                <input
                  type="text"
                  name="topics"
                  placeholder="Topics"
                  value={filters.topics}
                  className="form-input"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="sector"
                  placeholder="Sector"
                  className="form-input"
                  value={filters.sector}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="region"
                  placeholder="Region"
                  value={filters.region}
                  className="form-input"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="pestle"
                  placeholder="Pestle"
                  value={filters.pestle}
                  className="form-input"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="source"
                  placeholder="Source"
                  value={filters.source}
                  className="form-input"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  className="form-input"
                  value={filters.country}
                  onChange={handleInputChange}
                />
              </form>
            </div>
          )}
        </div>
        {/* dropdown for the selectedYAxisVariable ////////////////////////////////////////////// */}
        <div className="relative">
          <button
            ref={yAxisButtonRef}
            onClick={handleYAxisButtonClick}
            className="btn-primary flex gap-1 items-center"
          >
            {selectedYAxisVariable}
            {isYAxisDropdownOpen ? <MdArrowDropUp /> : <MdArrowDropDown />}
          </button>
          {isYAxisDropdownOpen && (
            <div
              ref={yAxisFormRef}
              className="absolute top-full z-50 left-0 mt-2 px-4 py-4 rounded-lg shadow-sm dark:bg-dark bg-white"
            >
              <div className="px-4 py-4 rounded-r-lg shadow-md bg-gray-100 dark:bg-dark">
                {["intensity", "relevance", "likelihood"].map((variable) => (
                  <div
                    key={variable}
                    onClick={() => handleYAxisClick(variable)}
                    className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {variable.charAt(0).toUpperCase() + variable.slice(1)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* the line chart itself  ///////////////////////////////////*/}
      <div className="h-[70vh] w-[90%] md:w-[80%] lg:w-[70vw] relative mt-4">
        {chartData ? (
          <Line options={options} data={chartData} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default LineChartComp;
