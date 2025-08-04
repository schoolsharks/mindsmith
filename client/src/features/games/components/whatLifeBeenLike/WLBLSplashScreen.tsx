import { Box, Typography } from "@mui/material";
import Page from "../../../../components/layout/Page";
import mainGrphic from "../../../../assets/images/gameIntroScreenGraphics/whatLifeBeenLike/main-graphic.webp";
import bgWaves from "../../../../assets/images/gameIntroScreenGraphics/whatLifeBeenLike/bg-wave.webp";
import "./WLBLSplashScreen.css";
import BgDiamonds from "../../../../components/ui/BgDiamonds/BgDiamonds";
import { positions2 } from "../../../../components/ui/BgDiamonds/diamondsPositions";
import useNavigateWithSound from "../../../sound/hooks/useNavigateWithSound";
import { useEffect } from "react";

const WLBLSplashScreen = () => {
  const navitateWithSound = useNavigateWithSound();
  useEffect(() => {
    const timer = setTimeout(() => {
      navitateWithSound("/user/games/what-life-been-like/game");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Page sx={{ alignItems: "center" }}>
      <Box position={"relative"} marginTop={"100px"}>
        <BgDiamonds positions={positions2} animation />
        <Box
          component={"img"}
          className="expanding-effect"
          src={bgWaves}
          sx={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "230px",
            transformOrigin: "center center",
          }}
        />
        <Box
          component={"img"}
          className="expanding-effect"
          src={bgWaves}
          sx={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "230px",
            animationDelay: "1s",
            transformOrigin: "center center",
          }}
        />
        <Box
          component={"img"}
          src={mainGrphic}
          sx={{ width: "230px", position: "relative" }}
        />
      </Box>
      <Typography marginTop={"120px"} fontSize={"30px"} fontWeight={"600"}>
        Breathe in
      </Typography>
      <Typography
        color="#A4B56E"
        fontWeight={"500"}
        margin="6px 24px"
        textAlign={"center"}
      >
        Think about last 12 months and check all the boxes that apply to you to
        the best of your knowledge.
      </Typography>
    </Page>
  );
};

export default WLBLSplashScreen;
