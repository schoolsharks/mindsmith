import BBSplashScreen from "./brainyBits/BBSplashScreen";
import FYFSplashScreen from "./feelYourFeelings/FYFSplashScreen";
import WLBLSplashScreen from "./whatLifeBeenLike/WLBLSplashScreen";
import YBBSSplashScreen from "./yourBounceBackStyle/YBBSSplashScreen";

const SplashScreen = ({ gameId }: { gameId: string }) => {
  if (gameId === "what-life-been-like") {
    return <WLBLSplashScreen />;
  } else if (gameId === "feel-your-feelings") {
    return <FYFSplashScreen />;
  } else if (gameId === "your-bounce-back-style") {
    return <YBBSSplashScreen />;
  } else if (gameId === "the-brainy-bits") {
    return <BBSplashScreen />;
  }
};

export default SplashScreen;
