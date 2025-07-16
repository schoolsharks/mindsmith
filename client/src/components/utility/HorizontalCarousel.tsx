import {
  useState,
  useImperativeHandle,
  forwardRef,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import { Box, IconButton, Stack, SxProps, Theme } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

interface HorizontalCarouselProps {
  items: ReactNode[];
  cardStyle?: SxProps<Theme>;
  containerStyle?: SxProps<Theme>;
  showControls?: boolean;
  autoplay?: boolean;
  autoplaySpeed?: number;
  speed?: number;
  handleCardChange: () => void;
}

export interface HorizontalCarouselRef {
  next: () => void;
  previous: () => void;
  goToSlide: (index: number) => void;
  getCurrentIndex: () => number;
}

const HorizontalCarousel = forwardRef<
  HorizontalCarouselRef,
  HorizontalCarouselProps
>(
  (
    {
      items,
      cardStyle = {},
      containerStyle = {},
      showControls = false,
      autoplay = false,
      autoplaySpeed = 3000,
      speed = 500,
      handleCardChange,
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);
    
    // Touch/swipe state
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);

    // Get card position and properties by index
    const getCardProperties = (index: number) => {
      const isCenter = index === currentIndex;
      const isLeft = index === currentIndex - 1;
      const isRight = index === currentIndex + 1;
      
      let transform = "translateX(0px) scale(0.8)";
      let opacity = 0.6;
      let zIndex = 1;
      
      // Add drag offset if dragging
      let dragOffset = 0;
      if (isDragging && touchStart && touchEnd) {
        dragOffset = (touchEnd - touchStart) * 0.3; // Reduced sensitivity
      }
      
      if (isCenter) {
        transform = `translateX(${dragOffset}px) scale(1)`;
        opacity = 1;
        zIndex = 3;
      } else if (isLeft) {
        transform = `translateX(${-60 + dragOffset}px) scale(0.8) rotate(-5deg)`;
        opacity = 0.6;
        zIndex = 2;
      } else if (isRight) {
        transform = `translateX(${60 + dragOffset}px) scale(0.8) rotate(5deg)`;
        opacity = 0.6;
        zIndex = 2;
      } else {
        // Cards further away are hidden
        opacity = 0;
        zIndex = 0;
      }
      
      return {
        transform,
        opacity,
        zIndex,
        isCenter,
        isVisible: isCenter || isLeft || isRight,
      };
    };

    const goToNext = () => {
      if (isTransitioning || currentIndex >= items.length - 1) return;
      
      setIsTransitioning(true);
      setCurrentIndex(prev => prev + 1);
      
      setTimeout(() => {
        setIsTransitioning(false);
        handleCardChange();
      }, speed);
    };

    const goToPrevious = () => {
      if (isTransitioning || currentIndex <= 0) return;
      
      console.log("Previous button clicked - current index:", currentIndex);
      console.log("Total items:", items.length);
      
      setIsTransitioning(true);
      setCurrentIndex(prev => prev - 1);
      
      setTimeout(() => {
        setIsTransitioning(false);
        handleCardChange();
      }, speed);
    };

    const goToSlide = (index: number) => {
      if (isTransitioning || index === currentIndex || index < 0 || index >= items.length) return;
      
      console.log("Going to slide:", index);
      
      setIsTransitioning(true);
      setCurrentIndex(index);
      
      setTimeout(() => {
        setIsTransitioning(false);
        handleCardChange();
      }, speed);
    };

    // Swipe/touch handlers
    const handleTouchStart = (e: React.TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
      setStartTime(Date.now());
      setIsDragging(true);
      
      // Pause autoplay during touch
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging) return;
      setTouchEnd(e.targetTouches[0].clientX);
      // Prevent default scrolling behavior
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd || !isDragging || !startTime) {
        setIsDragging(false);
        setStartTime(null);
        // Resume autoplay
        if (autoplay && items.length > 1) {
          autoplayRef.current = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % items.length);
            handleCardChange();
          }, autoplaySpeed);
        }
        return;
      }
      
      const distance = touchStart - touchEnd;
      const timeDiff = Date.now() - startTime;
      const velocity = Math.abs(distance) / timeDiff;
      
      // Adjust thresholds based on velocity for more natural feel
      const minSwipeDistance = velocity > 0.5 ? 30 : 50;
      
      if (distance > minSwipeDistance) {
        // Swiped left - go to next
        goToNext();
      } else if (distance < -minSwipeDistance) {
        // Swiped right - go to previous
        goToPrevious();
      }
      
      setIsDragging(false);
      setTouchStart(null);
      setTouchEnd(null);
      setStartTime(null);
      
      // Resume autoplay
      if (autoplay && items.length > 1) {
        autoplayRef.current = setInterval(() => {
          setCurrentIndex(prev => (prev + 1) % items.length);
          handleCardChange();
        }, autoplaySpeed);
      }
    };

    // Mouse drag handlers (for desktop)
    const handleMouseDown = (e: React.MouseEvent) => {
      setTouchEnd(null);
      setTouchStart(e.clientX);
      setStartTime(Date.now());
      setIsDragging(true);
      
      // Pause autoplay during drag
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
      
      // Prevent default to avoid text selection
      e.preventDefault();
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;
      setTouchEnd(e.clientX);
    };

    const handleMouseUp = () => {
      if (!touchStart || !touchEnd || !isDragging || !startTime) {
        setIsDragging(false);
        setStartTime(null);
        // Resume autoplay
        if (autoplay && items.length > 1) {
          autoplayRef.current = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % items.length);
            handleCardChange();
          }, autoplaySpeed);
        }
        return;
      }
      
      const distance = touchStart - touchEnd;
      const timeDiff = Date.now() - startTime;
      const velocity = Math.abs(distance) / timeDiff;
      
      // Adjust thresholds based on velocity for more natural feel
      const minSwipeDistance = velocity > 0.5 ? 30 : 50;
      
      if (distance > minSwipeDistance) {
        // Dragged left - go to next
        goToNext();
      } else if (distance < -minSwipeDistance) {
        // Dragged right - go to previous
        goToPrevious();
      }
      
      setIsDragging(false);
      setTouchStart(null);
      setTouchEnd(null);
      setStartTime(null);
      
      // Resume autoplay
      if (autoplay && items.length > 1) {
        autoplayRef.current = setInterval(() => {
          setCurrentIndex(prev => (prev + 1) % items.length);
          handleCardChange();
        }, autoplaySpeed);
      }
    };

    // Autoplay functionality
    useEffect(() => {
      if (!autoplay || items.length <= 1) return;

      const startAutoplay = () => {
        autoplayRef.current = setInterval(() => {
          setCurrentIndex(prev => (prev + 1) % items.length);
          handleCardChange();
        }, autoplaySpeed);
      };

      startAutoplay();

      return () => {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
        }
      };
    }, [autoplay, autoplaySpeed, items.length, handleCardChange]);

    // Pause autoplay on hover
    const handleMouseEnter = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };

    const handleMouseLeave = () => {
      if (autoplay && items.length > 1) {
        autoplayRef.current = setInterval(() => {
          setCurrentIndex(prev => (prev + 1) % items.length);
          handleCardChange();
        }, autoplaySpeed);
      }
    };

    useImperativeHandle(ref, () => ({
      next: goToNext,
      previous: goToPrevious,
      goToSlide,
      getCurrentIndex: () => currentIndex,
    }));

    return (
      <Stack
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "visible",
          // display: "flex",
          flex:"1",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none", // Prevent text selection during drag
          cursor: isDragging ? "grabbing" : "grab",
          touchAction: "pan-y", // Allow vertical scrolling but handle horizontal
          ...containerStyle,
        }}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseLeave();
          // Also handle mouse up when leaving the component
          if (isDragging) {
            handleMouseUp();
          }
        }}
      >
        <Stack
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flex:1,
            alignItems: "center",
            justifyContent: "center",
            perspective: "1000px",
          }}
        >
          {items.map((item, index) => {
            const cardProps = getCardProperties(index);
            
            if (!cardProps.isVisible) return null;
            
            return (
              <Box
                key={index}
                className="carousel-card"
                sx={{
                  position: "absolute",
                  minHeight: "420px",
                  width: "100%",
                  maxWidth: "350px",
                  // height: "100%",
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  transition: isDragging ? "none" : `all ${speed}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                  display: "flex",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  transform: cardProps.transform,
                  opacity: cardProps.opacity,
                  zIndex: cardProps.zIndex,
                  cursor: isDragging ? "grabbing" : (cardProps.isCenter ? "default" : "pointer"),
                  touchAction: "none", // Prevent default touch behaviors
                  ...cardStyle,
                  "&:hover": {
                    transform: cardProps.isCenter 
                      ? `${cardProps.transform} translateY(-4px)`
                      : cardProps.transform,
                    boxShadow: cardProps.isCenter 
                      ? "0 12px 48px rgba(0,0,0,0.18)"
                      : "0 8px 32px rgba(0,0,0,0.12)",
                  },
                }}
                onClick={() => {
                  // Prevent click during dragging
                  if (isDragging) return;
                  
                  if (index !== currentIndex) {
                    goToSlide(index);
                  }
                }}
              >
                {item}
              </Box>
            );
          })}
        </Stack>

        {/* Optional Controls */}
        {showControls && (
          <>
            <IconButton
              onClick={goToPrevious}
              disabled={currentIndex === 0 || isTransitioning}
              sx={{
                position: "absolute",
                left: "10px",
                zIndex: 10,
                backgroundColor: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(4px)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,1)",
                  transform: "scale(1.1)",
                },
                "&:disabled": {
                  opacity: 0.5,
                  cursor: "not-allowed",
                },
              }}
            >
              <ChevronLeft />
            </IconButton>

            <IconButton
              onClick={goToNext}
              disabled={currentIndex === items.length - 1 || isTransitioning}
              sx={{
                position: "absolute",
                right: "10px",
                zIndex: 10,
                backgroundColor: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(4px)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,1)",
                  transform: "scale(1.1)",
                },
                "&:disabled": {
                  opacity: 0.5,
                  cursor: "not-allowed",
                },
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}
      </Stack>
    );
  }
);

export default HorizontalCarousel;
