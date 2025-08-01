import {
  useState,
  useImperativeHandle,
  forwardRef,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import { Box, IconButton, Stack, SxProps, Theme } from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";

interface VerticalCarouselProps {
  items: ReactNode[];
  cardStyle?: SxProps<Theme>;
  containerStyle?: SxProps<Theme>;
  showControls?: boolean;
  autoplay?: boolean;
  autoplaySpeed?: number;
  speed?: number;
  handleCardChange: () => void;
  disableTouch?: boolean;
  height?: number;
}

export interface VerticalCarouselRef {
  next: () => void;
  previous: () => void;
  goToSlide: (index: number) => void;
  getCurrentIndex: () => number;
}

const VerticalCarousel = forwardRef<VerticalCarouselRef, VerticalCarouselProps>(
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
      disableTouch = false,
      height = 430, // Default height if not provided
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

    const goToNext = () => {
      if (isTransitioning) return;

      setIsTransitioning(true);
      handleCardChange();
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        // return nextIndex >= items.length ? 0 : nextIndex;
        return nextIndex ;
      });

      setTimeout(() => {
        setIsTransitioning(false);
      }, speed);
    };

    const goToPrevious = () => {
      if (isTransitioning) return;

      setIsTransitioning(true);
      handleCardChange();

      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex - 1;
        return nextIndex < 0 ? items.length - 1 : nextIndex;
      });

      setTimeout(() => {
        setIsTransitioning(false);
      }, speed);
    };

    const goToSlide = (index: number) => {
      if (isTransitioning || index === currentIndex) return;

      setIsTransitioning(true);
      setCurrentIndex(index);
      handleCardChange();

      setTimeout(() => {
        setIsTransitioning(false);
      }, speed);
    };

    useImperativeHandle(ref, () => ({
      next: goToNext,
      previous: goToPrevious,
      goToSlide,
      getCurrentIndex: () => currentIndex,
    }));

    // Autoplay functionality
    useEffect(() => {
      if (!autoplay || items.length <= 1) return;

      const startAutoplay = () => {
        autoplayRef.current = setInterval(() => {
          goToNext();
        }, autoplaySpeed);
      };

      startAutoplay();

      return () => {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
        }
      };
    }, [autoplay, autoplaySpeed, items.length]);

    // Pause autoplay on hover
    const handleMouseEnter = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };

    const handleMouseLeave = () => {
      if (autoplay && items.length > 1) {
        autoplayRef.current = setInterval(() => {
          goToNext();
        }, autoplaySpeed);
      }
    };

    const getCardPosition = (index: number) => {
      const diff = index - currentIndex;

      if (diff < 0) {
        return {
          transform: `translateY(-100%) scale(2)`,
          opacity: 0,
          zIndex: 1,
        };
      } else if (diff === 0) {
        return {
          transform: `translateY(0%)`,
          opacity: 1,
          zIndex: 3,
        };
      } else if (diff === 1) {
        return {
          transform: `translateY(8%) scale(0.95)`,
          opacity: 0.8,
          zIndex: 2,
        };
      } else if (diff === 2) {
        return {
          transform: `translateY(16%) scale(0.9)`,
          opacity: 0.6,
          zIndex: 1,
        };
      } else {
        return {
          transform: `translateY(240%)`,
          opacity: 0,
          zIndex: 0,
        };
      }
    };

    // Swipe/touch handlers
    const handleTouchStart = (e: React.TouchEvent) => {
      if (disableTouch) return;
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientY);
      setStartTime(Date.now());
      setIsDragging(true);
      
      // Pause autoplay during touch
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (disableTouch || !isDragging) return;
      setTouchEnd(e.targetTouches[0].clientY);
      // Prevent default scrolling behavior
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      if (disableTouch) return;
      if (!touchStart || !touchEnd || !isDragging || !startTime) {
        setIsDragging(false);
        setStartTime(null);
        // Resume autoplay
        if (autoplay && items.length > 1) {
          autoplayRef.current = setInterval(() => {
            goToNext();
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
        // Swiped up - go to next
        goToNext();
      } else if (distance < -minSwipeDistance) {
        // Swiped down - go to previous
        goToPrevious();
      }
      
      setIsDragging(false);
      setTouchStart(null);
      setTouchEnd(null);
      setStartTime(null);
      
      // Resume autoplay
      if (autoplay && items.length > 1) {
        autoplayRef.current = setInterval(() => {
          goToNext();
        }, autoplaySpeed);
      }
    };

    // Mouse drag handlers (for desktop)
    const handleMouseDown = (e: React.MouseEvent) => {
      if (disableTouch) return;
      setTouchEnd(null);
      setTouchStart(e.clientY);
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
      if (disableTouch || !isDragging) return;
      setTouchEnd(e.clientY);
    };

    const handleMouseUp = () => {
      if (disableTouch) return;
      if (!touchStart || !touchEnd || !isDragging || !startTime) {
        setIsDragging(false);
        setStartTime(null);
        // Resume autoplay
        if (autoplay && items.length > 1) {
          autoplayRef.current = setInterval(() => {
            goToNext();
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
        // Dragged up - go to next
        goToNext();
      } else if (distance < -minSwipeDistance) {
        // Dragged down - go to previous
        goToPrevious();
      }
      
      setIsDragging(false);
      setTouchStart(null);
      setTouchEnd(null);
      setStartTime(null);
      
      // Resume autoplay
      if (autoplay && items.length > 1) {
        autoplayRef.current = setInterval(() => {
          goToNext();
        }, autoplaySpeed);
      }
    };
    const cardHeight = height;

    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: cardHeight + 50,
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          userSelect: "none", // Prevent text selection during drag
          cursor: disableTouch ? "default" : (isDragging ? "grabbing" : "grab"),
          touchAction: disableTouch ? "auto" : "pan-x", // Allow horizontal scrolling but handle vertical
          ...containerStyle,
        }}
        onMouseEnter={handleMouseEnter}
        onTouchStart={disableTouch ? undefined : handleTouchStart}
        onTouchMove={disableTouch ? undefined : handleTouchMove}
        onTouchEnd={disableTouch ? undefined : handleTouchEnd}
        onMouseDown={disableTouch ? undefined : handleMouseDown}
        onMouseMove={disableTouch ? undefined : handleMouseMove}
        onMouseUp={disableTouch ? undefined : handleMouseUp}
        onMouseLeave={() => {
          handleMouseLeave();
          // Also handle mouse up when leaving the component
          if (isDragging && !disableTouch) {
            handleMouseUp();
          }
        }}
      >
        {/* Cards Container */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: cardHeight,
          }}
        >
          {items.map((item, index) => {
            const position = getCardPosition(index);
            const isClickable =
              index !== currentIndex &&
              (index === currentIndex + 1 || index === currentIndex + 2);

            return (
              <Stack
                key={index}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: cardHeight,
                  transition: isDragging ? "none" : `all ${speed}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                  transform: position.transform,
                  opacity: position.opacity,
                  zIndex: position.zIndex,
                  cursor: isDragging ? "grabbing" : (isClickable ? "pointer" : "default"),
                  touchAction: "none", // Prevent default touch behaviors
                }}
                onClick={(e) => {
                  // Prevent click during dragging
                  if (isDragging) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                  
                  if (isClickable) {
                    goToSlide(index);
                  }
                }}
              >
                <Stack
                  sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    ...cardStyle,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {item}
                </Stack>
              </Stack>
            );
          })}
        </Box>

        {/* Optional Controls */}
        {showControls && (
          <>
            <IconButton
              onClick={goToPrevious}
              disabled={isTransitioning}
              sx={{
                position: "absolute",
                top: "10px",
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
                },
              }}
            >
              <KeyboardArrowUp />
            </IconButton>

            <IconButton
              onClick={goToNext}
              disabled={isTransitioning}
              sx={{
                position: "absolute",
                bottom: "10px",
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
                },
              }}
            >
              <KeyboardArrowDown />
            </IconButton>
          </>
        )}
      </Box>
    );
  }
);

export default VerticalCarousel;
