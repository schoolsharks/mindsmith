import { Box } from "@mui/material";
import Page from "../../../../components/layout/Page";
// import mainGraphic from "../../../../assets/images/gameIntroScreenGraphics/feelYourFeeling/main-graphic.webp";
import mainAnimation from "../../../../assets/images/gameIntroScreenGraphics/feelYourFeeling/main-animation.webm";
import { useEffect } from "react";
import useNavigateWithSound from "../../../sound/hooks/useNavigateWithSound";

const FYFSplashScreen = () => {
  const navigate = useNavigateWithSound();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/user/games/feel-your-feelings/game");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <Page sx={{ overflow: "hidden", }}>
      {/* <Box component={"img"} src={mainGraphic} width={"100%"} /> */}
      <Box
        component={"video"}
        src={mainAnimation}
        autoPlay
        muted
        width={"100%"}
        sx={{position: "absolute", top: -64, left: 0}}
        // height={"100%"}
      />
    </Page>
  );
};

export default FYFSplashScreen;
