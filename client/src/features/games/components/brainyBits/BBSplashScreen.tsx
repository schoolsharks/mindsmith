import { Box, Typography } from "@mui/material";
import Page from "../../../../components/layout/Page";
import mainGraphic from "../../../../assets/images/gameIntroScreenGraphics/brainyBits/main-graphic.webp";
import { useEffect } from "react";
import useNavigateWithSound from "../../../sound/hooks/useNavigateWithSound";

const BBSplashScreen = () => {
  const navigate = useNavigateWithSound();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/user/games/the-brainy-bits/game");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <Page sx={{ padding: "36px" }}>
      <Typography
        fontSize={"30px"}
        fontWeight={"600"}
        lineHeight={"35px"}
        marginTop={"40px"}
      >
        Gratitude
      </Typography>
      <Box component={"img"} src={mainGraphic} width={"100%"} m={"40px auto"}/>
      <Typography fontSize={"20px"} fontWeight={"500"} marginTop={"8px"}>
        Even when it’s hard, be grateful for every moment of your life.
      </Typography>
    </Page>
  );
};

export default BBSplashScreen;
