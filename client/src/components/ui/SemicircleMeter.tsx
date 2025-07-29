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
  labels = ["Low", "Medium", "High"],
  outerRadius = 120,
  innerRadius = 90,
  selectedIndex, // No default value - undefined means no selection
  onChange,
}: SemicircleMeterChartProps) => {
  const [currentIndex, setCurrentIndex] = useState<number | undefined>(selectedIndex);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

const colors = [
  "#69e287",  // Green with 59% opacity (96 in hex = 150/255 ≈ 59%)
  "#fedf7f",  // Yellow with 60% opacity (99 in hex = 153/255 ≈ 60%)
  "#f96666"   // Red with 60% opacity (99 in hex = 153/255 ≈ 60%)
]; //  Green, Yellow, Red

  const handleClick = (index: number) => {
    setCurrentIndex(index);
    onChange?.(index);
  };

  const getIndexFromAngle = (clientX: number, clientY: number) => {
    if (!containerRef.current) return currentIndex ?? 0;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.8; // Semicircle center is at 80% height
    
    // Calculate angle from center
    const deltaX = clientX - centerX;
    const deltaY = centerY - clientY; // Invert Y axis
    
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Normalize angle to 0-180 range (semicircle)
    if (angle < 0) angle += 360;
    if (angle > 180) angle = angle > 270 ? 0 : 180;
    
    // Reverse the angle mapping so left-to-right movement works correctly
    // Invert the angle: 180 degrees becomes 0, 0 degrees becomes 180
    const reversedAngle = 180 - angle;
    
    // Map angle to section index
    const sectionAngle = 180 / labels.length;
    const adjustedAngle = reversedAngle + sectionAngle / 2; // Offset to center sections
    const index = Math.floor(adjustedAngle / sectionAngle);
    
    return Math.max(0, Math.min(index, labels.length - 1));
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const newIndex = getIndexFromAngle(clientX, clientY);
    setCurrentIndex(newIndex);
    onChange?.(newIndex);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const newIndex = getIndexFromAngle(clientX, clientY);
    setCurrentIndex(newIndex);
    onChange?.(newIndex);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

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

  useEffect(() => {
    setCurrentIndex(selectedIndex);
  }, [selectedIndex]);

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
                onClick={() => !isDragging && handleClick(index)}
                style={{ 
                  cursor: "pointer",
                  outline: "none", // Removes focus outline
                  pointerEvents: isDragging ? "none" : "auto",
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