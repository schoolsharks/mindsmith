import { Box, Stack, Typography } from "@mui/material";
import { games } from "../data/allGames";
import { ArrowRight } from "lucide-react";
import useNavigateWithSound from "../../sound/hooks/useNavigateWithSound";

const AllGames = () => {
  const navigate = useNavigateWithSound();
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
          <Stack
            onClick={() => navigate(`/user/games/${game.id}/intro`)}
            key={index}
            sx={{
              border: `1px solid ${game.theme.primary.main}`,
              bgcolor: game.theme.primary.light,
              borderRadius: "10px",
              padding: "10px",
              gap: "20px",
              position: "relative",
              boxSizing: "content-box",
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
            <Stack
              sx={{
                // alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                width: "28px",
                transform: "translateX(-160%)",
                bgcolor: game.theme.primary.light,
                padding: "10px",
                borderRadius: "50%",
                aspectRatio: "1",
              }}
            >
              <Box component={"img"} src={game.icon} />
            </Stack>
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
        ))}
      </Stack>
    </Stack>
  );
};

export default AllGames;
