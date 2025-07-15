import cloudGraphic1 from "../../../assets/images/cloud-graphic-1.webp";
import Page from "../../../components/layout/Page";
import { Typography, Box } from "@mui/material";
import BgDiamonds from "../../../components/ui/BgDiamonds/BgDiamonds";
import { useEffect } from "react";
import { positions1 } from "../../../components/ui/BgDiamonds/diamondsPositions";

interface SplashScreenProps {
  handleNextPage: () => void;
}
const SplashScreen: React.FC<SplashScreenProps> = ({ handleNextPage }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      handleNextPage();
    }, 3000);

    return () => clearTimeout(timer);
  }, [handleNextPage]);

  return (
    <Page>
      <BgDiamonds positions={positions1} />
      <Box margin={"auto"} textAlign={"center"} position={"relative"}>
        <img src={cloudGraphic1} alt="" style={{ width: "200px" }} />
        <Typography fontSize={"4rem"} fontWeight={"700"}>
          BHP
        </Typography>
        <Typography fontSize={"25px"} fontWeight={"600"}>
          Brain Health Profile
        </Typography>
      </Box>
    </Page>
  );
};

export default SplashScreen;
