import { Box, Stack, Typography } from "@mui/material";
import { games } from "../data/allGames";
import { ArrowRight } from "lucide-react";
import useNavigateWithSound from "../../sound/hooks/useNavigateWithSound";
import { RootState } from "../../../app/store";
import { useSelector } from "react-redux";

const AllGames = () => {
  const navigate = useNavigateWithSound();
  const { user } = useSelector((state: RootState) => state.auth);
  const quizProgress = user?.quizProgress;

  return (
    <Stack direction={"row"} gap={"40px"} height={"100%"}>
      <Box>
        <Box
          sx={{
            borderRight: "1px dashed black",
            marginTop: "28px",
            height: "80%",
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
                quizProgress?.currentSection === index &&
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
                opacity: quizProgress?.currentSection !== index ? 0.5 : 1,
                boxShadow:
                  quizProgress?.currentSection !== index
                    ? "none"
                    : "0px 2px 10px rgba(0, 0, 0, 0.108)",
                cursor:
                  quizProgress?.currentSection !== index
                    ? "not-allowed"
                    : "pointer",
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
      </Stack>
    </Stack>
  );
};

export default AllGames;
