import { Box, IconButton, Stack, Typography } from "@mui/material";
import Page from "../../components/layout/Page";
import BgDiamonds from "../../components/ui/BgDiamonds/BgDiamonds";
import { positions1 } from "../../components/ui/BgDiamonds/diamondsPositions";
import { X } from "lucide-react";
import useNavigateWithSound from "../../features/sound/hooks/useNavigateWithSound";

const TermsAndConditions = () => {
  const navigate = useNavigateWithSound();
  return (
    <Page sx={{ backgroundSize: "contain",justifyContent:"center" }}>
      <BgDiamonds positions={positions1} />
      <Box
        padding={"24px"}
        margin={"0 20px"}
        position={"relative"}
        border={"1px solid #000000"}
        bgcolor={"#FFC5C31F"}
        borderRadius={"10px"}
      >
        <Stack direction={"row"} justifyContent={"flex-end"}>
          <IconButton onClick={() => navigate(-1)}>
            <X />
          </IconButton>
        </Stack>
        <Typography fontSize={"24px"} fontWeight={"500"} textAlign={"center"}>
          Terms & Conditions
        </Typography>
        <Typography fontSize={"15px"} fontWeight={"300"} marginTop={"12px"}>
          Welcome to MindSmith ("we," "our," or "us"). These Terms and
          Conditions ("Terms") govern your access to and use of MindSmith's
          services, website, and applications (collectively, the "Services").
          MindSmith provides premium psychological performance optimization
          services for elite performers.
          <br />
          Read the full policy.
          <br />
          (<a href="https://www.mindsmith.co.in/terms-and-conditions">https://www.mindsmith.co.in/terms-and-conditions</a>)
        </Typography>
      </Box>
    </Page>
  );
};

export default TermsAndConditions;
