import { Box, IconButton, Stack, Typography } from "@mui/material";
import { X } from "lucide-react";
import brainGraphic from "../../../assets/images/brain-graphic-2.webp";

interface DidYouKnowProps {
  onClose: () => void;
  fact?: string;
}

const DidYouKnow = ({ onClose, fact }: DidYouKnowProps) => {
  const defaultFact = "Your brain generates enough electricity to power a light bulb even when you're asleep?";
  
  return (
    <>
      <Box
        border={"3px solid #18C4E7"}
        borderRadius={"10px"}
        padding={"20px"}
        marginTop={"130px"}
      >
        <Stack direction={"row"} justifyContent={"flex-end"}>
          <IconButton onClick={onClose}>
            <X />
          </IconButton>
        </Stack>
        <Typography fontSize={"25px"} fontWeight={"700"}>
          Did You Know...
        </Typography>
        <Typography fontSize={"20px"} fontWeight={"400"} marginTop={"10px"}>
          {fact || defaultFact}
        </Typography>
      </Box>
      <Box
        component={"img"}
        src={brainGraphic}
        width={"140px"}
        marginLeft={"auto"}
        marginTop={"10px"}
      />
    </>
  );
};

export default DidYouKnow;
