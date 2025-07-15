import { Box, Typography } from "@mui/material";
import Page from "../../../../components/layout/Page";
import mainGraphic from "../../../../assets/images/gameIntroScreenGraphics/yourBounceBackStyle/main-graphic.webp";
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
    <Page sx={{padding:"20px"}}>
      <Typography fontSize={"30px"} fontWeight={"600"} lineHeight={"35px"} marginTop={"20px"}>Release expectations.</Typography>
      <Typography fontSize={"20px"} fontWeight={"500"} marginTop={"8px"}>Let your heart be light by being present with each moment.</Typography>
      <Box
        component={"img"}
        src={mainGraphic}
        width={"55%"}
        sx={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
    </Page>
  );
};

export default YBBSSplashScreen;
