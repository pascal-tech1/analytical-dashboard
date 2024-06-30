import  { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChartComp = () => {
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
  const [selectedXAxisVariable, setSelectedXAxisVariable] = useState("sector");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isYAxisDropdownOpen, setIsYAxisDropdownOpen] = useState(false);
  const [isXAxisDropdownOpen, setIsXAxisDropdownOpen] = useState(false);
  const filterFormRef = useRef(null);
  const yAxisFormRef = useRef(null);
  const xAxisFormRef = useRef(null);
  const filterButtonRef = useRef(null);
  const yAxisButtonRef = useRef(null);
  const xAxisButtonRef = useRef(null);

  useEffect(() => {
    fetchChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, selectedYAxisVariable, selectedXAxisVariable]);

  async function fetchChartData() {
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": getTokenFromLocalStorage(),
    };

    try {
      const response = await customFetch.post(
        "/barchart",
        {
          filters,
          selectedYAxisVariable,
          selectedXAxisVariable,
        },
        { headers }
      );
      const data = response.data;
      const chartData = processDataForChart(data);
      setChartData(chartData);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "error fetching chart";
      toast.error(errorMessage);
      if (
        errorMessage ===
        ("has expired!" || "Token is invalid!" || "Token is missing!")
      ) {
        removeTokenFromLocalStorage();
        //  navigate here to home
        navigate("/");
      }
    }
  }

  // the data gotten from the backend is passed to this function
  // the return from this function is passed to the Barchart itself
  // this function returns the actual data that is render on the chart
  const processDataForChart = (data) => {
    const labels = data.labels;
    const yAxisData = data.data;

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

  const handleXAxisButtonClick = (e) => {
    e.stopPropagation();
    setIsXAxisDropdownOpen(!isXAxisDropdownOpen);
  };

  const handleYAxisClick = (variable) => {
    setSelectedYAxisVariable(variable);
    setIsYAxisDropdownOpen(false);
  };

  const handleXAxisClick = (variable) => {
    setSelectedXAxisVariable(variable);
    setIsXAxisDropdownOpen(false);
  };

  // the function that handles the actually close of the dropdowns which
  // is passed to the useefect hadnling the listen of the outside clicks
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
    if (
      xAxisFormRef.current &&
      !xAxisFormRef.current.contains(e.target) &&
      xAxisButtonRef.current &&
      !xAxisButtonRef.current.contains(e.target)
    ) {
      setIsXAxisDropdownOpen(false);
    }
  };

  // using this Useffect to listen for for an outside dropdown click
  useEffect(() => {
    if (isFilterDropdownOpen || isYAxisDropdownOpen || isXAxisDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isFilterDropdownOpen, isYAxisDropdownOpen, isXAxisDropdownOpen]);

  // this option is from chart js , which i passed to the barchart
  // it accept like object as input
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    autoPadding: true,
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
        text: `${selectedYAxisVariable} by ${selectedXAxisVariable} Chart`,
        color: "#94bef9",
      },
    },
    tooltips: {
      enabled: true,
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (context) {
          return context.dataset.label + ": " + context.raw;
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#94bef9",
        },
        title: {
          display: true,
          text:
            selectedXAxisVariable.charAt(0).toUpperCase() +
            selectedXAxisVariable.slice(1),
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
        {/* dropdown for the filter chart  */}
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
              className="absolute top-full z-50 left-0 mt-2 px-4 md:w-[50vw] min-[1200px]:w-[80vw] py-4 rounded-lg shadow-sm dark:bg-dark bg-white"
            >
              <form className="px-4 py-4 rounded-r-lg shadow-md bg-gray-100 dark:bg-dark">
                <input
                  type="number"
                  name="end_year"
                  min="2015"
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
        {/* dropdown for the selectedYAxisVariable */}
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
        {/* dropdown for the selectedXAxisVariable */}
        <div className="relative">
          <button
            ref={xAxisButtonRef}
            onClick={handleXAxisButtonClick}
            className="btn-primary flex gap-1 items-center"
          >
            {selectedXAxisVariable}
            {isXAxisDropdownOpen ? <MdArrowDropUp /> : <MdArrowDropDown />}
          </button>
          {isXAxisDropdownOpen && (
            <div
              ref={xAxisFormRef}
              className="absolute top-full z-50 left-0 mt-2 px-4 py-4 rounded-lg shadow-sm dark:bg-dark bg-white"
            >
              <div className="px-4 py-4 rounded-r-lg shadow-md bg-gray-100 dark:bg-dark">
                {[
                  "sector",
                  "topic",
                  "region",
                  "country",
                  "pestle",
                  "source",
                ].map((variable) => (
                  <div
                    key={variable}
                    onClick={() => handleXAxisClick(variable)}
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
      {/* the bar chart itself  */}
      <div className="h-[70vh] w-[90%] relative mt-4">
        {chartData ? (
          <Bar options={options} data={chartData} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default BarChartComp;
