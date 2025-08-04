import { Box, Typography } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import needleIcon from "../../assets/icons/needle.webp";

// Throttle utility function
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

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
  // height = 120,
  lineWidth = 6,
  lineGap = 2,
  selectedIndex, // No default value - undefined means no selection
  onChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number | undefined>(
    selectedIndex
  );
  const [totalLines, setTotalLines] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [needlePosition, setNeedlePosition] = useState(16);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const colors = ["#67e285", "#feda6a", "#f96666"];

  const getColorForIndex = useCallback((index: number, total: number) => {
    if (total <= colors.length) {
      return colors[index] || colors[colors.length - 1];
    }

    const colorIndex = Math.floor((index / (total - 1)) * (colors.length - 1));
    return colors[colorIndex] || colors[colors.length - 1];
  }, []);

  const getIndexFromPosition = useCallback(
    (clientX: number) => {
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
    },
    [currentIndex, labels.length]
  );

  // Throttled function to update position and trigger onChange
  const updatePosition = useCallback(
    throttle((newIndex: number) => {
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        if (onChange) {
          onChange(newIndex);
        }
      }
    }, 16), // ~60fps throttling
    [currentIndex, onChange]
  );

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const newIndex = getIndexFromPosition(clientX);
    updatePosition(newIndex);
  };

  const handleDragMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging) return;

      e.preventDefault();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const newIndex = getIndexFromPosition(clientX);
      updatePosition(newIndex);
    },
    [isDragging, getIndexFromPosition, updatePosition]
  );

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const availableWidth = width - 32;
    // Calculate lines per section to ensure equal distribution
    const linesPerSection = Math.floor(
      availableWidth / (labels.length * (lineWidth + lineGap))
    );
    const totalLinesCount = linesPerSection * labels.length;
    setTotalLines(totalLinesCount);
  }, [width, lineWidth, lineGap, labels.length]);

  const calculateNeedlePosition = useCallback(() => {
    if (!containerRef.current || currentIndex === undefined) return 16;

    const containerWidth = containerRef.current.offsetWidth;
    const sectionWidth = containerWidth / labels.length;
    const sectionCenter = sectionWidth / 2;

    // Position needle at center of current section
    const position = 3 + currentIndex * sectionWidth + sectionCenter;

    return position;
  }, [currentIndex, labels.length]);

  // Update needle position with animation frame for smooth rendering
  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const newPosition = calculateNeedlePosition();
      if (Math.abs(newPosition - needlePosition) > 1) {
        // Only update if significant change
        setNeedlePosition(newPosition);
      }
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentIndex, calculateNeedlePosition, needlePosition]);

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
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, handleDragMove]);

  const handleLineClick = (lineIndex: number) => {
    if (!containerRef.current) return;

    const linesPerSection = totalLines / labels.length;
    const sectionIndex = Math.floor(lineIndex / linesPerSection);
    const clampedIndex = Math.min(sectionIndex, labels.length - 1);

    updatePosition(clampedIndex);
  };

  const handleLabelClick = (index: number) => {
    updatePosition(index);
  };

  // Memoize line generation to prevent unnecessary recalculations
  const lineElements = React.useMemo(() => {
    return Array.from({ length: totalLines }, (_, index) => {
      const linesPerSection = totalLines / labels.length;
      const sectionIndex = Math.floor(index / linesPerSection);
      const color = getColorForIndex(sectionIndex, labels.length);

      return (
        <Box
          key={index}
          sx={{
            flex: "1",
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
        />
      );
    });
  }, [
    totalLines,
    labels.length,
    getColorForIndex,
    lineWidth,
    lineGap,
    isDragging,
    handleLineClick,
  ]);

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {/* Needle - positioned absolutely outside the bordered box */}
      {currentIndex !== undefined && (
        <Box
          component={"img"}
          src={needleIcon}
          sx={{
            position: "absolute",
            left: `${needlePosition+20}px`,
            top: "40px",
            width: 12,
            transform: "translateX(-50%)",
            transition: "left 0.3s ease",
            zIndex: 10,
          }}
        />
      )}

      {/* Blue Border Box containing only meter and labels */}
      <Box
        sx={{
          border: "3px solid #8DD1FF",
          borderRadius: "25px",
          padding: "0px 20px 20px",
          boxSizing: "border-box",
          backgroundColor: "white",
          mt: 10, // Add margin to accommodate needle
        }}
      >
        {/* Lines Container */}
        <Box
          ref={containerRef}
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            height: "60px",
            position: "relative",
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          {lineElements}
        </Box>

        {/* Labels (Well, Some Difficult, Very Difficult) */}
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
                flex: 1,
                textAlign: "center",
                transition: "color 0.2s ease",
              }}
              onClick={() => handleLabelClick(index)}
            >
              {label}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Selected Option (appears below the blue box) */}
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
            margin: "20px auto 0",
          }}
        >
          <Typography>{labels[currentIndex]}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(LinearMeterChart);
