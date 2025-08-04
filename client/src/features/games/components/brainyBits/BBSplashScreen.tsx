import { Box, Typography } from "@mui/material";
import Page from "../../../../components/layout/Page";
// import mainGraphic from "../../../../assets/images/gameIntroScreenGraphics/brainyBits/main-graphic.webp";
// import mainAnimation from "../../../../assets/images/gameIntroScreenGraphics/brainyBits/main-animation.webm";
import mainAnimation from "../../../../assets/images/gameIntroScreenGraphics/brainyBits/main-animation.gif";
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
    <Page sx={{ padding: "36px", overflow: "hidden" }}>
      <Typography
        fontSize={"30px"}
        fontWeight={"600"}
        lineHeight={"35px"}
        marginTop={"40px"}
        position={"relative"}
        zIndex={3}
      >
        Gratitude
      </Typography>
      {/* <Box
        component={"video"}
        src={mainAnimation}
        autoPlay
        muted
        sx={{
          position: "absolute",
          left: "0",
          top: "0",
          width: "100%",
          height: "100%",
          zIndex: 2,
        }}
      /> */}
      <Box
        component={"img"}
        src={mainAnimation}
        width={"90%"}
        sx={{ position: "absolute", top: 0, left: "50%",transform: "translateX(-50%)", zIndex: 2 }}
      />
      <Typography
        fontSize={"20px"}
        fontWeight={"500"}
        // marginTop={"8px"}
        position={"relative"}
        zIndex={3}
        marginTop="430px"
      >
        Even when it’s hard, be grateful for every moment of your life.
      </Typography>
    </Page>
  );
};

export default BBSplashScreen;
