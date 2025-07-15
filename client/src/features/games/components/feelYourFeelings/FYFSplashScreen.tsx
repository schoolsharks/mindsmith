import { Box } from "@mui/material";
import Page from "../../../../components/layout/Page";
import mainGraphic from "../../../../assets/images/gameIntroScreenGraphics/feelYourFeeling/main-graphic.webp";
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
    <Page>
      <Box component={"img"} src={mainGraphic} width={"100%"} />
    </Page>
  );
};

export default FYFSplashScreen;
