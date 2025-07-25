import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import needleIcon from "../../assets/icons/needle.webp";

interface LinearMeterChartProps {
  labels?: string[];
  width?: number;
  height?: number;
  lineWidth?: number;
  lineGap?: number;
  selectedIndex?: number; // Can be undefined when nothing is selected
  onChange?: (index: number) => void;
}

const LinearMeterChart: React.FC<LinearMeterChartProps> = ({
  labels = ["Rarely", "Sometimes", "Often"],
  width = 260,
  height = 120,
  lineWidth = 6,
  lineGap = 2,
  selectedIndex, // No default value - undefined means no selection
  onChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number | undefined>(selectedIndex);
  const [totalLines, setTotalLines] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = ["#ff4444", "#ff8800", "#ffcc00", "#88cc00", "#44aa44"];

  const getColorForIndex = (index: number, total: number) => {
    if (total <= colors.length) {
      return colors[index] || colors[colors.length - 1];
    }

    const colorIndex = Math.floor((index / (total - 1)) * (colors.length - 1));
    return colors[colorIndex] || colors[colors.length - 1];
  };

  const getIndexFromPosition = (clientX: number) => {
    if (!containerRef.current) return currentIndex ?? 0;
    
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const containerWidth = rect.width;
    
    // Calculate percentage of position (0 to 1)
    const percentage = Math.max(0, Math.min(1, relativeX / containerWidth));
    
    // Map percentage to label index
    const exactIndex = percentage * (labels.length - 1);
    const newIndex = Math.round(exactIndex);
    
    return Math.max(0, Math.min(newIndex, labels.length - 1));
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newIndex = getIndexFromPosition(clientX);
    setCurrentIndex(newIndex);
    if (onChange) {
      onChange(newIndex);
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newIndex = getIndexFromPosition(clientX);
    setCurrentIndex(newIndex);
    if (onChange) {
      onChange(newIndex);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const availableWidth = width - 32;
    // Calculate lines per section to ensure equal distribution
    const linesPerSection = Math.floor(availableWidth / (labels.length * (lineWidth + lineGap)));
    const totalLinesCount = linesPerSection * labels.length;
    setTotalLines(totalLinesCount);
  }, [width, lineWidth, lineGap, labels.length]);

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

  const getNeedlePosition = () => {
    if (!containerRef.current || currentIndex === undefined) return 16;
    
    const containerWidth = containerRef.current.offsetWidth;
    const sectionWidth = containerWidth / labels.length;
    const sectionCenter = sectionWidth / 2;
    
    // Position needle at center of current section
    const needlePosition = 3 + (currentIndex * sectionWidth) + sectionCenter;
    
    return needlePosition;
  };

  const handleLineClick = (lineIndex: number) => {
    if (!containerRef.current) return;
    
    const linesPerSection = totalLines / labels.length;
    const sectionIndex = Math.floor(lineIndex / linesPerSection);
    const clampedIndex = Math.min(sectionIndex, labels.length - 1);
    
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
    <Box sx={{ width, height, position: "relative", }}>
      {/* Needle - only show when something is selected */}
      {currentIndex !== undefined && (
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
      )}

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
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        {Array.from({ length: totalLines }, (_, index) => {
          const linesPerSection = totalLines / labels.length;
          const sectionIndex = Math.floor(index / linesPerSection);
          const color = getColorForIndex(sectionIndex, labels.length);

          return (
            <Box
              key={index}
              sx={{
                flex:"1",
                minWidth: `${lineWidth}px`,
                height: "40px",
                bgcolor: color,
                borderRadius: "4px",
                marginRight: index < totalLines - 1 ? `${lineGap}px` : 0,
                cursor: "pointer",
                transition: "opacity 0.2s ease",
                opacity: 1,
                pointerEvents: isDragging ? "none" : "auto",
              }}
              onClick={() => !isDragging && handleLineClick(index)}
              onTouchStart={() => !isDragging && handleLineClick(index)}
              onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                if (!isDragging) {
                  (e.target as HTMLDivElement).style.opacity = "0.8";
                }
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                if (!isDragging) {
                  (e.target as HTMLDivElement).style.opacity = "1";
                }
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
            width: "fit-content",
            margin: "60px auto 0",
          }}
        >
          <Typography>{labels[currentIndex]}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default LinearMeterChart;
