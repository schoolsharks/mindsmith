import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import needleIcon from "../../assets/icons/needle.webp";

interface LinearMeterChartProps {
  labels?: string[];
  width?: number;
  height?: number;
  lineWidth?: number;
  lineGap?: number;
  selectedIndex?: number;
  onChange?: (index: number) => void;
}

const LinearMeterChart: React.FC<LinearMeterChartProps> = ({
  labels = ["Rarely", "Sometimes", "Often"],
  width = 260,
  height = 120,
  lineWidth = 6,
  lineGap = 2,
  selectedIndex = 1,
  onChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [totalLines, setTotalLines] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = ["#ff4444", "#ff8800", "#ffcc00", "#88cc00", "#44aa44"];

  const getColorForIndex = (index: number, total: number) => {
    if (total <= colors.length) {
      return colors[index] || colors[colors.length - 1];
    }

    const colorIndex = Math.floor((index / (total - 1)) * (colors.length - 1));
    return colors[colorIndex] || colors[colors.length - 1];
  };

  useEffect(() => {
    const availableWidth = width - 32;
    const linesCount = Math.floor(availableWidth / (lineWidth + lineGap));
    setTotalLines(linesCount);
  }, [width, lineWidth, lineGap]);

  useEffect(() => {
    setCurrentIndex(selectedIndex);
  }, [selectedIndex]);

  const getNeedlePosition = () => {
    if (totalLines === 0) return 16;
    const sectionSize = totalLines / labels.length;
    const sectionCenter = sectionSize / 2;
    const linePosition = currentIndex * sectionSize + sectionCenter;
    const pixelPosition =
      16 + linePosition * (lineWidth + lineGap) - lineGap / 2;
    return pixelPosition;
  };

  const handleLineClick = (lineIndex: number) => {
    const sectionSize = totalLines / labels.length;
    const newIndex = Math.floor(lineIndex / sectionSize);
    const clampedIndex = Math.min(newIndex, labels.length - 1);
    setCurrentIndex(clampedIndex);
    if (onChange) {
      onChange(clampedIndex);
    }
  };

  const handleLabelClick = (index: number) => {
    setCurrentIndex(index);
    if (onChange) {
      onChange(index);
    }
  };

  return (
    <Box sx={{ width, height, position: "relative", p: 2 }}>
      {/* Needle */}
      <Box
        component={"img"}
        src={needleIcon}
        sx={{
          position: "absolute",
          left: `${getNeedlePosition()}px`,
          top: "25px",
          width: 12,
          transform: "translateX(-50%)",
          transition: "left 0.3s ease",
          zIndex: 10,
        }}
      >
        {/* Empty needle div */}
      </Box>

      {/* Lines Container */}
      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-start",
          height: "60px",
          mt: 4,
          position: "relative",
        }}
      >
        {Array.from({ length: totalLines }, (_, index) => {
          const sectionSize = totalLines / labels.length;
          const sectionIndex = Math.floor(index / sectionSize);
          const color = getColorForIndex(sectionIndex, labels.length);

          return (
            <Box
              key={index}
              sx={{
                width: `${lineWidth}px`,
                height: "40px",
                bgcolor: color,
                borderRadius: "4px",
                marginRight: index < totalLines - 1 ? `${lineGap}px` : 0,
                cursor: "pointer",
                transition: "opacity 0.2s ease",
                opacity: 1,
              }}
              onClick={() => handleLineClick(index)}
              onTouchStart={() => handleLineClick(index)}
              onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                (e.target as HTMLDivElement).style.opacity = "0.8";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                (e.target as HTMLDivElement).style.opacity = "1";
              }}
            >
              {/* Empty line div */}
            </Box>
          );
        })}
      </Box>

      {/* Labels */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
          position: "relative",
        }}
      >
        {labels.map((label, index) => (
          <Typography
            key={index}
            sx={{
              fontSize: "10px",
              color: currentIndex === index ? "#1976d2" : "#666",
              cursor: "pointer",
              transition: "color 0.2s ease",
            }}
            onClick={() => handleLabelClick(index)}
          >
            {label}
          </Typography>
        ))}
      </Box>

      <Box
        sx={{
          backgroundColor: colors[selectedIndex],
          color: "#fff",
          fontWeight: "500",
          fontSize: "22px",
          padding: "7px 16px",
          borderRadius: "10px",
          width: "fit-content",
          margin: "60px auto 0",
        }}
      >
        <Typography>{labels[selectedIndex]}</Typography>
      </Box>
    </Box>
  );
};

export default LinearMeterChart;
