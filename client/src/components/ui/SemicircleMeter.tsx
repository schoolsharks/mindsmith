import { useState, useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
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
  const [currentIndex, setCurrentIndex] = useState<number | undefined>(
    selectedIndex
  );

  const colors = [
    "#69e287", // Green
    "#fedf7f", // Yellow
    "#f96666", // Red
  ];

  const handleClick = (index: number) => {
    setCurrentIndex(index);
    onChange?.(index);
  };

  useEffect(() => {
    setCurrentIndex(selectedIndex);
  }, [selectedIndex]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // width: outerRadius * 2 + 5,
        width: "100%",
        height: 300, // Increased height to accommodate new elements
        position: "relative",
      }}
    >
      {/* The semicircle meter */}
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={labels.map((label, index) => ({
              name: label,
              value: 1,
              index,
            }))}
            cx="50%"
            cy="60%"
            startAngle={180}
            endAngle={0}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            activeIndex={undefined}
            activeShape={undefined}
          >
            {labels.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index]}
                stroke="none"
                onClick={() => handleClick(index)}
                style={{
                  cursor: "pointer",
                  outline: "none",
                }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Needle */}
      <Box sx={{ position: "relative", mt: -16, mb: 4 }}>
        <Box
          component={"img"}
          src={PinIcon}
          sx={{
            width: 24,
            transformOrigin: "bottom center",
            transform:
              currentIndex !== undefined
                ? `rotate(${currentIndex * 90 - 90}deg)`
                : `rotate(-90deg)`,
            transition: "transform 0.3s ease",
          }}
        />
      </Box>

      {/* Color indicators with labels - NEW SECTION */}
      <Stack
        direction="row"
        justifyContent="center"
        spacing={2}
        sx={{
          width: "100%",
          // mb: 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        {labels.map((label, index) => (
          <Box
            key={`indicator-${index}`}
            onClick={() => handleClick(index)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "60%",
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 16,
                borderRadius: "30%",
                backgroundColor: colors[index],
                mb: 1,
                // border: currentIndex === index ? '2px solid #000' : 'none'
              }}
            />
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                fontWeight: currentIndex === index ? "bold" : "normal",
                fontSize: "14px",
              }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Stack>

      {/* Selected option display
      {currentIndex !== undefined && (
        <Box
          sx={{
            backgroundColor: colors[currentIndex],
            color: "#fff",
            fontWeight: "500",
            fontSize: "22px",
            padding: "7px 16px",
            borderRadius: "10px",
            maxWidth: "75%",
            mt: 3
          }}
        >
          <Typography>{labels[currentIndex]}</Typography>
        </Box>
      )} */}
    </Box>
  );
};

export default SemicircleMeterChart;
