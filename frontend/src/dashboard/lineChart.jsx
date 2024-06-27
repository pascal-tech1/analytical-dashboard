import React from "react";

import LineChartComp from "../component/lineChartComp";

const LineChart = () => {
  return (
    <div className=" bg-white  dark:bg-lightdark p-6 rounded-md h-full flex flex-col lg:flex-row">
      <LineChartComp />
    </div>
  );
};

export default LineChart;
