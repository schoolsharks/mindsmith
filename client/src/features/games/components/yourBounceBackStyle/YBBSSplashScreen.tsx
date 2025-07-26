import { Box, Typography } from "@mui/material";
import Page from "../../../../components/layout/Page";
import mainAnimation from "../../../../assets/images/gameIntroScreenGraphics/yourBounceBackStyle/main_animation.webm";
// import mainGraphic from "../../../../assets/images/gameIntroScreenGraphics/yourBounceBackStyle/main-graphic.webp";
import { useEffect } from "react";
import useNavigateWithSound from "../../../sound/hooks/useNavigateWithSound";

const YBBSSplashScreen = () => {
  const navigate = useNavigateWithSound();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/user/games/your-bounce-back-style/game");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <Page sx={{ padding: "40px", overflow: "hidden" }}>
      <Typography
        fontSize={"30px"}
        fontWeight={"600"}
        lineHeight={"35px"}
        marginTop={"20px"}
        position={"relative"}
        zIndex={3}
      >
        Release expectations.
      </Typography>
      <Typography
        fontSize={"20px"}
        fontWeight={"500"}
        marginTop={"8px"}
        position={"relative"}
        zIndex={3}
      >
        Let your heart be light by being present with each moment.
      </Typography>
      <Box
        component={"video"}
        src={mainAnimation}
        autoPlay
        muted
        width={"100%"}
        height={"100%"}
        sx={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
        }}
      />
    </Page>
  );
};

export default YBBSSplashScreen;
