import { Box, Stack, Typography } from "@mui/material";
import { games } from "../data/allGames";
import { ArrowRight } from "lucide-react";
import useNavigateWithSound from "../../sound/hooks/useNavigateWithSound";
import { RootState } from "../../../app/store";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import starIcon from "../../../assets/images/star-icon.webp";
import DownloadButton from "../../reports/components/DownloadButton";

const AllGames = () => {
  const navigate = useNavigateWithSound();
  const { user } = useSelector((state: RootState) => state.auth);
  const quizProgress = user?.quizProgress;
  const [currentSection, setCurrentSection] = useState(0);
  const [searchParams] = useSearchParams();
  const nextSectionTransition = searchParams.get("nextSectionTransition");
  const dottedLineHeights = ["0%", "25%", "45%", "70%", "90%"];

  useEffect(() => {
    if (nextSectionTransition === "true") {
      if (quizProgress?.completed === false) {
        // Start from the previous section for animation effect
        setCurrentSection(Math.max((quizProgress?.currentSection ?? 0) - 1, 0));
        setTimeout(() => {
          // Then move to the current section
          setCurrentSection(quizProgress?.currentSection ?? 0);
          // Clean up the URL parameter
          const newParams = new URLSearchParams(searchParams);
          newParams.delete("nextSectionTransition");
          navigate(`/user/home?${newParams.toString()}`, { replace: true });
        }, 1000);
      } else {
        // Quiz is completed, show all sections
        setCurrentSection(4);
        // Clean up the URL parameter even when quiz is completed
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("nextSectionTransition");
        navigate(`/user/home?${newParams.toString()}`, { replace: true });
      }
    } else {
      // No transition, directly set to current section
      if (quizProgress?.completed === true) {
        setCurrentSection(4);
      } else {
        setCurrentSection(quizProgress?.currentSection ?? 0);
      }
    }
  }, [nextSectionTransition, quizProgress?.currentSection, quizProgress?.completed, searchParams, navigate]);

  return (
    <Stack direction={"row"} gap={"40px"} height={"100%"}>
      <Box>
        <Box
          sx={{
            borderRight: "1px dashed black",
            marginTop: "28px",
            height: dottedLineHeights[currentSection || 0],
            transition: "all 1s ease",
          }}
        />
      </Box>
      <Stack gap={"20px"} flex={1}>
        {games.map((game, index) => (
          <Stack position={"relative"}>
            <Stack
              sx={{
                // alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                width: "48px",
                height: "48px",
                transform: "translateX(-130%)",
                bgcolor: game.theme.primary.light,
                padding: "10px",
                borderRadius: "50%",

                // aspectRatio: "1",
              }}
            >
              <Box component={"img"} src={game.icon} />
            </Stack>
            <Stack
              onClick={() =>
                currentSection >= index &&
                navigate(`/user/games/${game.id}/intro`)
              }
              key={index}
              sx={{
                border: `1px solid ${game.theme.primary.main}`,
                bgcolor: game.theme.primary.light,
                borderRadius: "10px",
                padding: "10px",
                gap: "20px",
                position: "relative",
                boxSizing: "content-box",
                opacity: currentSection < index ? 0.5 : 1,
                transition: "all 1s ease",
                boxShadow:
                  currentSection < index
                    ? "none"
                    : "0px 2px 10px rgba(0, 0, 0, 0.108)",
                cursor: currentSection < index ? "not-allowed" : "pointer",
              }}
            >
              <Box
                component={"img"}
                src={game.cardGraphic.image}
                sx={{
                  position: "absolute",
                  ...game.cardGraphic.position,
                  width: "40px",
                }}
              />

              <Typography
                fontSize={"18px"}
                fontWeight={"500"}
                position={"relative"}
              >
                {game.name}
              </Typography>
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Typography
                  fontWeight={"500"}
                  fontSize={"12px"}
                  color={game.theme.primary.main}
                >
                  2 min
                </Typography>
                <ArrowRight size={36} color={game.theme.primary.main} />
              </Stack>
            </Stack>
          </Stack>
        ))}
        <Stack>
          <Stack
            sx={{
              // alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              width: "48px",
              height: "48px",
              transform: "translateX(-130%)",
              bgcolor: "#B6E3FF",
              padding: "10px",
              borderRadius: "50%",

              // aspectRatio: "1",
            }}
          >
            <Box component={"img"} src={starIcon} />
          </Stack>
          <DownloadButton />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AllGames;
