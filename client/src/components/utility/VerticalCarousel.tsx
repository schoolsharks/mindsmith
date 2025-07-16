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
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);
    const dragStateRef = useRef({
      isDragging: false,
      startY: 0,
      totalDeltaY: 0,
      dragStarted: false,
    });

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
      if (autoplay) {
        autoplayRef.current = setInterval(() => {
          goToNext();
        }, autoplaySpeed);
      }

      return () => {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
        }
      };
    }, [autoplay, autoplaySpeed, currentIndex]);

    const pauseAutoplay = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };

    const resumeAutoplay = () => {
      if (autoplay) {
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

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const DRAG_THRESHOLD = 30; // Minimum distance to trigger a slide change
      const DRAG_COOLDOWN = 100; // Cooldown period between drags in ms

      let lastDragTime = 0;
      const container = containerRef.current;

      if (!container) return;

      // Get Y coordinate from either mouse or touch event
      const getYCoordinate = (event: MouseEvent | TouchEvent): number => {
        if (event.type.startsWith("touch")) {
          const touchEvent = event as TouchEvent;
          return (
            touchEvent.touches[0]?.clientY ||
            touchEvent.changedTouches[0]?.clientY ||
            0
          );
        } else {
          return (event as MouseEvent).clientY;
        }
      };

      // Mouse and Touch start handlers
      const handleStart = (event: MouseEvent | TouchEvent) => {
        // Check if the event target is an interactive element (button, input, etc.)
        const target = event.target as HTMLElement;
        if (target.closest('button') || target.closest('input') || target.closest('a') || target.closest('[role="button"]')) {
          return; // Don't start drag on interactive elements
        }

        dragStateRef.current.isDragging = true;
        dragStateRef.current.startY = getYCoordinate(event);
        dragStateRef.current.totalDeltaY = 0;
        dragStateRef.current.dragStarted = true;

        // Prevent text selection while dragging
        document.body.style.userSelect = "none";

        // Prevent default touch behavior (like scrolling)
        if (event.type.startsWith("touch")) {
          event.preventDefault();
        }
      };

      // Mouse and Touch move handlers
      const handleMove = (event: MouseEvent | TouchEvent) => {
        if (
          !dragStateRef.current.isDragging ||
          !dragStateRef.current.dragStarted
        )
          return;

        const currentY = getYCoordinate(event);
        const deltaY = currentY - dragStateRef.current.startY;
        dragStateRef.current.totalDeltaY = deltaY;

        // Only prevent default for touch events during active drag
        if (event.type.startsWith("touch") && dragStateRef.current.isDragging) {
          event.preventDefault();
        }
      };

      // Mouse and Touch end handlers
      const handleEnd = () => {
        if (
          !dragStateRef.current.isDragging ||
          !dragStateRef.current.dragStarted
        )
          return;

        const now = Date.now();
        const timeSinceLastDrag = now - lastDragTime;

        // Only process drag if enough time has passed since last drag and threshold is met
        if (
          timeSinceLastDrag >= DRAG_COOLDOWN &&
          Math.abs(dragStateRef.current.totalDeltaY) >= DRAG_THRESHOLD
        ) {
          if (dragStateRef.current.totalDeltaY < -DRAG_THRESHOLD) {
            // Dragged up - go to next
            goToNext();
            lastDragTime = now;
          } else if (dragStateRef.current.totalDeltaY > DRAG_THRESHOLD) {
            // Dragged down - go to previous
            goToPrevious();
            lastDragTime = now;
          }
        }

        // Reset drag state
        dragStateRef.current.isDragging = false;
        dragStateRef.current.startY = 0;
        dragStateRef.current.totalDeltaY = 0;
        dragStateRef.current.dragStarted = false;

        // Restore text selection
        document.body.style.userSelect = "";
      };

      // Add both mouse and touch event listeners to the container only
      container.addEventListener("mousedown", handleStart);
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);

      // Touch events for mobile
      container.addEventListener("touchstart", handleStart, { passive: false });
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("touchend", handleEnd);

      return () => {
        // Remove all event listeners
        container.removeEventListener("mousedown", handleStart);
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        container.removeEventListener("touchstart", handleStart);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);

        // Cleanup on unmount
        document.body.style.userSelect = "";
      };
    }, []);
    const cardHeight = 430;

    return (
      <Box
        ref={containerRef}
        sx={{
          position: "relative",
          width: "100%",
          height: cardHeight + 50,
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          ...containerStyle,
        }}
        onMouseEnter={pauseAutoplay}
        onMouseLeave={resumeAutoplay}
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
                  transition: `all ${speed}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                  transform: position.transform,
                  opacity: position.opacity,
                  zIndex: position.zIndex,
                  cursor: isClickable ? "pointer" : "default",
                }}
                onClick={() => {
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
