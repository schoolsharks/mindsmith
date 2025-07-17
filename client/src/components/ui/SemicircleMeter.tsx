import { useState, useRef, useEffect } from "react";
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
  labels = ["Poor", "Fair", "Good", "Very Good", "Excellent"],
  outerRadius = 120,
  innerRadius = 90,
  selectedIndex = 2,
  onChange,
}: SemicircleMeterChartProps) => {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = ["#ff4444", "#ff8800", "#ffcc00", "#88cc00", "#44aa44"];

  const getIndexFromAngle = (clientX: number, clientY: number) => {
    if (!containerRef.current) return currentIndex;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.8; // 80% from top as per cy="80%"
    
    const deltaX = clientX - centerX;
    const deltaY = centerY - clientY; // Inverted Y for screen coordinates
    
    // Calculate angle in radians
    let angle = Math.atan2(deltaY, deltaX);
    
    // Convert to degrees and normalize to 0-180 range (semicircle)
    angle = (angle * 180) / Math.PI;
    if (angle < 0) angle += 360;
    
    // Map to 0-180 range for semicircle (180 degrees on left to 0 degrees on right)
    if (angle > 180) angle = 180 - (angle - 180);
    
    // Convert angle to index (0 to labels.length - 1)
    const percentage = 1 - (angle / 180); // Invert so left is 0, right is 1
    const exactIndex = percentage * (labels.length - 1);
    
    return Math.max(0, Math.min(Math.round(exactIndex), labels.length - 1));
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const newIndex = getIndexFromAngle(clientX, clientY);
    setCurrentIndex(newIndex);
    if (onChange) {
      onChange(newIndex);
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    e.stopPropagation();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const newIndex = getIndexFromAngle(clientX, clientY);
    setCurrentIndex(newIndex);
    if (onChange) {
      onChange(newIndex);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    setCurrentIndex(selectedIndex);
  }, [selectedIndex]);

  // Add global event listeners for drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleDragMove(e as any);
    };
    const handleMouseUp = () => handleDragEnd();
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleDragMove(e as any);
    };
    const handleTouchEnd = () => handleDragEnd();

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const data = labels.map((label, index) => ({
    name: label,
    value: 1,
    index,
  }));

  const handleClick = (index: number) => {
    if (!isDragging) {
      setCurrentIndex(index);
      if (onChange) {
        onChange(index);
      }
    }
  };

  const renderCustomizedLabel = () => {
    return null;
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: outerRadius * 2 + 5,
        height: 220,
        position: "relative",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
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
                stroke={currentIndex === index ? "#ffffff" : "none"}
                // strokeWidth={currentIndex === index ? 2 : 0}
                style={{ 
                  cursor: "pointer",
                  pointerEvents: isDragging ? "none" : "auto"
                }}
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
              (currentIndex / (labels.length - 1)) * 180 - 90
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
    </Box>
  );
};

export default SemicircleMeterChart;
