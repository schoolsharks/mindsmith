import { Box, Stack, Typography } from "@mui/material";
import Page from "../../../components/layout/Page";
import BgDiamonds from "../../../components/ui/BgDiamonds/BgDiamonds";
import { positions1 } from "../../../components/ui/BgDiamonds/diamondsPositions";
import cloudGraphic1 from "../../../assets/images/cloud-graphic-1.webp";
import BottomElement from "../../../components/ui/BottomElement";
import OutlinedButton from "../../../components/ui/OutlinedButton";

interface WhatsIncludedProps {
  handleNextPage: () => void;
}

const points = [
  "4 guided check-ins (Stress, Mood, Resilience, Brain Function)",
  "Personalized lab-style report",
  "Expert-backed insights",
];
const WhatsIncluded: React.FC<WhatsIncludedProps> = ({ handleNextPage }) => {
  return (
    <Page sx={{ padding: "40px" }}>
      <BgDiamonds positions={positions1} />
      <Box
        component="img"
        src={cloudGraphic1}
        width={"143px"}
        marginTop={"40px"}
        position={"relative"}
      />
      <Box mt={"20px"}>
        <Typography fontSize={"30px"} fontWeight={"700"}>
          What’s Included:
        </Typography>
        {points.map((point, index) => (
          <Stack direction={"row"} marginTop={"12px"} gap={"8px"}>
            <Box
              marginTop={"10px"}
              width={"6px"}
              height={"6px"}
              bgcolor={"#000"}
              borderRadius={"50%"}
              sx={{ aspectRatio: 1 }}
            />
            <Typography key={index} fontSize={"16px"} fontWeight={"500"}>
              {point}
            </Typography>
          </Stack>
        ))}
        <Typography fontSize={"18px"} fontWeight={"700"} marginTop={"25px"}>
          Built by Experts.
          <br />
          Backed by Brain Science.
          <br /> Published by UGC.
        </Typography>
      </Box>
      <BottomElement>
        <Stack alignItems={"flex-start"} gap={"8px"}>
          <OutlinedButton onClick={handleNextPage}>Early Bird Price ₹2500</OutlinedButton>
          <OutlinedButton onClick={handleNextPage} disabled={true}>From 2nd November ₹5500</OutlinedButton>
        </Stack>
      </BottomElement>
    </Page>
  );
};

export default WhatsIncluded;
