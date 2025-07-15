import { Box, Typography } from "@mui/material";
import Page from "../../../components/layout/Page";
import BgDiamonds from "../../../components/ui/BgDiamonds/BgDiamonds";
import { positions1 } from "../../../components/ui/BgDiamonds/diamondsPositions";
import cloudGraphic2 from "../../../assets/images/cloud-graphic-2.webp";
import BottomElement from "../../../components/ui/BottomElement";
import OutlinedButton from "../../../components/ui/OutlinedButton";

interface WelcomeProps {
  handleNextPage: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({handleNextPage}) => {
  return (
    <Page sx={{ padding: "40px" }}>
      <BgDiamonds positions={positions1} />
      <Box
        component="img"
        src={cloudGraphic2}
        width={"110px"}
        marginTop={"40px"}
        position={"relative"}
      />
      <Box mt={"20px"}>
        <Typography fontSize={"30px"} fontWeight={"700"}>
          Welcome to BHP
        </Typography>
        <Typography fontSize={"20px"} fontWeight={"600"} marginTop={"12px"}>
          A quick, gentle check-in for your mind.
        </Typography>
        <Typography fontSize={"18px"} fontWeight={"400"} marginTop={"10px"}>
          We'll ask a few questions about how you’ve been feeling, thinking, and
          coping and turn that into a personal brain health snapshot.
        </Typography>
        <Typography fontSize={"20px"} fontWeight={"700"} marginTop={"10px"}>
          No Pressure.
          <br /> No Judgment.
          <br /> Just Clarity.
        </Typography>
      </Box>
      <BottomElement>
        <OutlinedButton onClick={handleNextPage}>Next</OutlinedButton>
      </BottomElement>
    </Page>
  );
};

export default Welcome;
