import {
  useState,
  useImperativeHandle,
  forwardRef,
  ReactNode,
  useRef,
} from "react";
import { Box, IconButton, Stack, SxProps, Theme } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface HorizontalCarouselProps {
  items: ReactNode[];
  cardStyle?: SxProps<Theme>;
  containerStyle?: SxProps<Theme>;
  showControls?: boolean;
  autoplay?: boolean;
  autoplaySpeed?: number;
  speed?: number;
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
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef<Slider>(null);

    const goToNext = () => {
      if (sliderRef.current) {
        console.log("Next button clicked - current index:", currentIndex);
        console.log("Total items:", items.length);
        sliderRef.current.slickNext();
      }
    };

    const goToPrevious = () => {
      if (sliderRef.current) {
        console.log("Previous button clicked - current index:", currentIndex);
        console.log("Total items:", items.length);
        sliderRef.current.slickPrev();
      }
    };

    const goToSlide = (index: number) => {
      if (sliderRef.current) {
        console.log("Going to slide:", index);
        sliderRef.current.slickGoTo(index);
      }
    };

    useImperativeHandle(ref, () => ({
      next: goToNext,
      previous: goToPrevious,
      goToSlide,
      getCurrentIndex: () => currentIndex,
    }));

    const settings = {
      dots: false,
      //   infinite: items.length > 2,
      infinite: false,
      speed: speed,
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: "5%",
      focusOnSelect: true,
      autoplay: autoplay,
      autoplaySpeed: autoplaySpeed,
      pauseOnHover: true,
      arrows: false,
      afterChange: (current: number) => {
        console.log("After change - current index:", current);
        setCurrentIndex(current);
      },
      beforeChange: (_current: number, next: number) => {
        console.log("Before change - from:", _current, "to:", next);
      },
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            centerMode: true,
            centerPadding: "5%",
          },
        },
      ],
    };

    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          //   minHeight: "900px",
          overflow: "visible",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...containerStyle,
          // Custom styles for react-slick
          "& .slick-slider": {
            width: "100%",
            height: "100%",
          },
          "& .slick-list": {
            height: "100%",
            overflow: "visible",
          },
          "& .slick-track": {
            display: "flex",
            alignItems: "center",
            height: "100%",
          },
          "& .slick-slide": {
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            "& > div": {
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              perspective: "1000px",
            },
          },
          "& .slick-slide:not(.slick-center)": {
            transform: "scale(0.8)",
            opacity: 0.6,
          },
          "& .slick-slide.slick-center": {
            transform: "scale(1)",
            opacity: 1,
            zIndex: 3,
            "& .carousel-card": {
              transform: "rotateZ(0deg)",
            },
          },
          "& .slick-slide:not(.slick-center) .carousel-card": {
            cursor: "pointer",
          },
        }}
      >
        <Slider ref={sliderRef} {...settings}>
          {items.map((item, index) => (
            <Stack key={index}>
              <Box
                className="carousel-card"
                sx={{
                  flex: 1,
                  minHeight: "420px",
                  width: "100%",
                  height: "100%",
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  ...cardStyle,
                  "&:hover": {
                    transform: "translateY(-4px) rotateZ(0deg)",
                    boxShadow: "0 12px 48px rgba(0,0,0,0.18)",
                  },
                }}
                onClick={() => {
                  if (index !== currentIndex) {
                    goToSlide(index);
                  }
                }}
              >
                {item}
              </Box>
            </Stack>
          ))}
        </Slider>

        {/* Optional Controls */}
        {showControls && (
          <>
            <IconButton
              onClick={goToPrevious}
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
              }}
            >
              <ChevronLeft />
            </IconButton>

            <IconButton
              onClick={goToNext}
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
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}
      </Box>
    );
  }
);

export default HorizontalCarousel;
