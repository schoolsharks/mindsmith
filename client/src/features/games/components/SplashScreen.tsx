import FYFSplashScreen from "./feelYourFeelings/FYFSplashScreen";
import WLBLSplashScreen from "./whatLifeBeenLike/WLBLSplashScreen";

const SplashScreen = ({ gameId }: { gameId: string }) => {
  if (gameId === "what-life-been-like") {
    return <WLBLSplashScreen />;
  } else if (gameId === "feel-your-feelings") {
    return <FYFSplashScreen />;
  }
};

export default SplashScreen;
