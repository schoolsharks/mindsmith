import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import PinIcon from "../../assets/icons/pin.webp";

interface SemicircleMeterChartProps {
  labels?: string[];
  outerRadius?: number;
  innerRadius?: number;
}

const SemicircleMeterChart = ({
  labels = ["Poor", "Fair", "Good", "Very Good", "Excellent"],
  outerRadius = 120,
  innerRadius = 90,
}: SemicircleMeterChartProps) => {
  const [selectedIndex, setSelectedIndex] = useState(2);

  const colors = ["#ff4444", "#ff8800", "#ffcc00", "#88cc00", "#44aa44"];

  const data = labels.map((label, index) => ({
    name: label,
    value: 1,
    index,
  }));

  const handleClick = (index: number) => {
    setSelectedIndex(index);
  };

  const renderCustomizedLabel = () => {
    return null;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: outerRadius * 2 +5,
        height: 220,
        position: "relative",
        // transform: "translateX(-10px)",
      }}
    >
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="80%"
            startAngle={180}
            endAngle={0}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index] || colors[colors.length - 1]}
                stroke={selectedIndex === index ? "#ffffff" : "none"}
                // strokeWidth={selectedIndex === index ? 2 : 0}
                style={{ cursor: "pointer" }}
                onClick={() => handleClick(index)}
                onTouchStart={() => handleClick(index)}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Needle */}
      <Box
        sx={{
          position: "relative",
          mt: -10,
          mb: 4,
        }}
      >
        <Box
          component={"img"}
          src={PinIcon}
          sx={{
            width: 24,
            transformOrigin: "bottom center",
            transform: `rotate(${
              (selectedIndex / (labels.length - 1)) * 180 - 90
            }deg)`,
            transition: "transform 0.3s ease",
            borderRadius: "2px 2px 0 0",
          }}
        />
        {/* <Box
          sx={{
            width: 4,
            height: outerRadius * 0.5,
            backgroundColor: "#000",
            transformOrigin: "bottom center",
            transform: `rotate(${
              (selectedIndex / (labels.length - 1)) * 180 - 90
            }deg)`,
            transition: "transform 0.3s ease",
            borderRadius: "2px 2px 0 0",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -2,
            left: "50%",
            transform: "translateX(-50%)",
            width: 8,
            height: 8,
            backgroundColor: "#000",
            borderRadius: "50%",
          }}
        /> */}
      </Box>

      <Box
        sx={{
          backgroundColor: colors[selectedIndex],
          color: "#fff",
          fontWeight: "500",
          fontSize: "22px",
          padding: "7px 16px",
          borderRadius: "10px",
        }}
      >
        <Typography>{labels[selectedIndex]}</Typography>
      </Box>
    </Box>
  );
};

export default SemicircleMeterChart;
