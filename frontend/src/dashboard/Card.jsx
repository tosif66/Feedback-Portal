import React, { useState } from "react";
import { motion } from "framer-motion";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { X } from "lucide-react";
import Chart from "react-apexcharts";
import { data } from "react-router-dom";

const Card = ({ param }) => {
  const [expanded, setExpanded] = useState(false);

  // Animation variants for Framer Motion
  const variants = {
    compact: { scale: 1, height: "14rem", width: "16rem" }, // Smaller size for compact state
    expanded: { scale: 1.05, height: "26rem", width: "20rem" }, // Slightly larger when expanded
  };

  return (
    <motion.div
      className="relative cursor-pointer mx-4 my-4" // Add margin to prevent overlap between cards
      initial="compact"
      animate={expanded ? "expanded" : "compact"}
      variants={variants}
      layout
      transition={{ duration: 0.5, type: "spring" }}
      onClick={() => setExpanded(!expanded)}
    >
      {expanded ? (
        <ExpandedCard param={param} setExpanded={setExpanded} />
      ) : (
        <CompactCard param={param} />
      )}
    </motion.div>
  );
};

function CompactCard({ param }) {
  return (
    <div
      className="relative flex flex-col items-center 
      justify-between p-4 w-full overflow-hidden
      h-full rounded-xl text-white shadow-lg"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
    >
      <div className="absolute top-4 right-4 text-2xl">
        <param.png size="24px" color="#fff" />
      </div>
      <div className="w-20 h-20 mt-4">
        <CircularProgressbar
          value={param.barValue}
          text={`${Math.round(param.barValue)}%`}
          styles={{
            path: { stroke: "#fff" },
            trail: { stroke: "transparent" },
            text: { fill: "#fff", fontSize: "14px", fontWeight: "bold" },
          }}
        />
      </div>
      <h3 className="mt-4 text-xl font-semibold">{param.title}</h3>
      <p className="text-lg font-bold mt-2">{param.value}</p>
      <p className="text-sm opacity-80">Last 24 hours</p>
    </div>
  );
}

function ExpandedCard({ param, setExpanded }) {
  const data = {
    options: {
      chart: { type: "area", height: "auto" },
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 3,
        color: "#000",
        opacity: 0.35,
      },
      fill: { colors: ["#fff"], type: "gradient" },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", colors: ["white"] },
      tooltip: { x: { format: "dd/MM/yy HH:mm" } },
      xaxis: {
        type: "datetime",
        categories: [
          "2023-01-01T00:00:00.000Z",
          "2023-01-02T00:00:00.000Z",
          "2023-01-03T00:00:00.000Z",
          "2023-01-04T00:00:00.000Z",
          "2023-01-05T00:00:00.000Z",
          "2023-01-06T00:00:00.000Z",
          "2023-01-07T00:00:00.000Z",
        ],
      },
      grid: { show: true },
    },
    series: [
      {
        name: "Example Data",
        data: [10, 20, 15, 30, 50, 45, 60], // Y-axis points
      },
    ],
  };

  return (
    <div
      className="absolute flex flex-col items-center justify-between p-4 w-60% h-full rounded-xl text-white shadow-lg"
      style={{
        background: param.color.backGround,
        boxShadow: param.color.boxShadow,
      }}
    >
      <X
        className="absolute top-4 right-4 text-xl cursor-pointer"
        onClick={(e) => {
          e.stopPropagation(); // Prevent parent onClick
          setExpanded(false);
        }}
      />
      <h3 className="text-xl font-bold mb-4">{param.title}</h3>
      <div className="w-auto mt-4">
        <Chart options={data.options} series={data.series} type="area" />
      </div>
      <p className="mt-4 text-sm opacity-90">Last 24 hours</p>
    </div>
  );
}
export default Card;