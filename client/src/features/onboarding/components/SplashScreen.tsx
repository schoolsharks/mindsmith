import cloudGraphic1 from "../../../assets/images/cloud-graphic-1.webp";
import Page from "../../../components/layout/Page";
import { Typography, Box } from "@mui/material";
import BgDiamonds from "../../../components/ui/BgDiamonds/BgDiamonds";
import { useEffect } from "react";
import { positions1 } from "../../../components/ui/BgDiamonds/diamondsPositions";
import { motion } from "framer-motion";

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
        <motion.img 
          src={cloudGraphic1} 
          alt="" 
          style={{ width: "200px" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            duration: 0.6
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Typography fontSize={"4rem"} fontWeight={"700"}>
            BHP
          </Typography>
          <Typography fontSize={"25px"} fontWeight={"600"}>
            Brain Health Profile
          </Typography>
        </motion.div>
      </Box>
    </Page>
  );
};

export default SplashScreen;
