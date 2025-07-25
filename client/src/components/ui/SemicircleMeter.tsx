import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import PinIcon from "../../assets/icons/pin.webp";

interface SemicircleMeterChartProps {
  labels?: string[];
  outerRadius?: number;
  innerRadius?: number;
  selectedIndex?: number;
  onChange?: (index: number) => void;
}

const SemicircleMeterChart = ({
  labels = ["Low", "Medium", "High"],
  outerRadius = 120,
  innerRadius = 90,
  selectedIndex, // No default value - undefined means no selection
  onChange,
}: SemicircleMeterChartProps) => {
  const [currentIndex, setCurrentIndex] = useState<number | undefined>(selectedIndex);

  const colors = ["#44aa44", "#ffcc00", "#ff4444"]; //  Green, Yellow, Red

  const handleClick = (index: number) => {
    setCurrentIndex(index);
    onChange?.(index);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: outerRadius * 2 + 5,
        height: 220,
        position: "relative",
      }}
    >
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={labels.map((label, index) => ({ name: label, value: 1, index }))}
            cx="50%"
            cy="80%"
            startAngle={180}
            endAngle={0}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            activeIndex={undefined} // This prevents the highlight effect
            activeShape={undefined} // This removes any special rendering for active segments
          >
            {labels.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index]}
                stroke="none"
                onClick={() => handleClick(index)}
                style={{ 
                  cursor: "pointer",
                  outline: "none", // Removes focus outline
                }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Needle */}
      <Box sx={{ position: "relative", mt: -10, mb: 4 }}>
        <Box
          component={"img"}
          src={PinIcon}
          sx={{
            width: 24,
            transformOrigin: "bottom center",
            transform: currentIndex !== undefined 
              ? `rotate(${(currentIndex * 90) - 90}deg)`
              : `rotate(-90deg)`, // Point downwards when nothing is selected
            transition: "transform 0.3s ease",
          }}
        />
      </Box>

      {/* Show selected option label only when something is selected */}
      {currentIndex !== undefined && (
        <Box
          sx={{
            backgroundColor: colors[currentIndex],
            color: "#fff",
            fontWeight: "500",
            fontSize: "22px",
            padding: "7px 16px",
            borderRadius: "10px",
          }}
        >
          <Typography>{labels[currentIndex]}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default SemicircleMeterChart;