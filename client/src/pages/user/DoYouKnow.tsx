import { Box, IconButton, Stack, Typography } from "@mui/material";
import Page from "../../components/layout/Page";
import BgDiamonds from "../../components/ui/BgDiamonds/BgDiamonds";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import cloudGraphic from "../../assets/images/cloud-graphic-3.webp";
import brainGraphic from "../../assets/images/brain-graphic-2.webp";


const DoYouKnow = () => {
  const navigate = useNavigate();
  return (
    <Page sx={{ padding: "30px" }}>
      <BgDiamonds positions={[]} animation />
      <Box
        bgcolor={"#8DD1FF5C"}
        border={"3px solid #18C4E7"}
        borderRadius={"10px"}
        padding={"20px"}
        marginTop={"130px"}
      >
        <Stack direction={"row"} justifyContent={"flex-end"}>
          <IconButton onClick={() => navigate("/user/home?nextSectionTransition=true")}>
            <X />
          </IconButton>
        </Stack>
        <Typography fontSize={"25px"} fontWeight={"700"}>
          Did You Know...
        </Typography>
        <Typography fontSize={"20px"} fontWeight={"400"} marginTop={"10px"}>
          Your brain generates enough electricity to power a light bulb even
          when you're asleep?
        </Typography>
      </Box>
      <Box
        component={"img"}
        src={brainGraphic}
        width={"140px"}
        marginLeft={"auto"}
        marginTop={"10px"}
      />
    </Page>
  );
};

export default DoYouKnow;
