import { Route, Routes, useParams } from "react-router-dom";
import SplashScreen from "../../features/games/components/SplashScreen";
import { Box } from "@mui/material";
import { games } from "../../features/games/data/allGames";
import GameLayout from "../../features/games/components/GameLayout";

const Games = () => {
  const { gameId } = useParams();
  const bgColor =
    games.find((game) => game.id === gameId)?.theme.primary.light || "#FFFCE5";
  return (
    <Box bgcolor={bgColor}>
      <Routes>
        <Route path="/intro" element={<SplashScreen gameId={gameId ?? ""} />} />
        <Route path="/game" element={<GameLayout gameId={gameId ?? ""} />} />
      </Routes>
    </Box>
  );
};

export default Games;
