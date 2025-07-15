import FYFGameLayout from "./feelYourFeelings/FYFGameLayout";
import WLBLGameLayout from "./whatLifeBeenLike/WLBLGameLayout";

const GameLayout = ({ gameId }: { gameId: string }) => {
  if (gameId === "what-life-been-like") {
    return <WLBLGameLayout />;
  } else if (gameId === "feel-your-feelings") {
    return <FYFGameLayout />;
  }
};

export default GameLayout;
