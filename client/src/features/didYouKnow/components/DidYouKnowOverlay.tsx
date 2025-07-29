import { Box, IconButton, Stack, Typography } from "@mui/material";
import { X } from "lucide-react";
import brainGraphic from "../../../assets/images/brain-graphic-2.webp";
import { motion } from "framer-motion";

interface DidYouKnowOverlayProps {
  open: boolean;
  onClose: () => void;
  fact: string;
}

const DidYouKnowOverlay = ({ open, onClose, fact }: DidYouKnowOverlayProps) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background:
          "radial-gradient(98.1% 98.1% at 97.18% 1.13%, #D2F8FF 41.83%, #FFFFFF 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 1000,
      }}
      // Close when clicking backdrop
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut"}}
        style={{
          position: "relative",
          maxWidth: "500px",
          width: "100%",
          outline: "none",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
      >
        <Box
          bgcolor={"#8DD1FF5C"}
          border={"3px solid #18C4E7"}
          borderRadius={"10px"}
          padding={"20px"}
          position="relative"
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
            {fact}
          </Typography>
        </Box>
        <Box
          component={"img"}
          src={brainGraphic}
          width={"140px"}
          marginLeft={"auto"}
          marginTop={"10px"}
          display="block"
        />
      </motion.div>
    </Box>
  );
};

export default DidYouKnowOverlay;
