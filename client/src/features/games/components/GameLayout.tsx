import BBGameLayout from "./brainyBits/BBGameLayout";
import FYFGameLayout from "./feelYourFeelings/FYFGameLayout";
import WLBLGameLayout from "./whatLifeBeenLike/WLBLGameLayout";
import YBBSGameLayout from "./yourBounceBackStyle/YBBSGameLayout";

const GameLayout = ({ gameId }: { gameId: string }) => {
  if (gameId === "what-life-been-like") {
    return <WLBLGameLayout />;
  } else if (gameId === "feel-your-feelings") {
    return <FYFGameLayout />;
  } else if (gameId === "your-bounce-back-style") {
    return <YBBSGameLayout />;
  } else if (gameId === "the-brainy-bits") {
    return <BBGameLayout />;
  }
};

export default GameLayout;
