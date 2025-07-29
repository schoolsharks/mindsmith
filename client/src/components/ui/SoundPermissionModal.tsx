import React from "react";
import { Typography, Stack, useTheme } from "@mui/material";
import Page from "../layout/Page";
// import FullwidthButton from "./FullwidthButton";
import { Volume2 } from "lucide-react";
import ContainedButton from "./ContainedTextInput";

interface SoundPermissionModalProps {
  needsPermission: boolean;
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
}

const SoundPermissionModal: React.FC<SoundPermissionModalProps> = ({
  // needsPermission,
  onPermissionGranted,
  onPermissionDenied,
}) => {
  const theme = useTheme();
  const handleGrantPermission = () => {
    console.log("Audio permission granted");
    onPermissionGranted();
  };

  const handleDeny = () => {
    onPermissionDenied();
  };

  return (
    <Page
      sx={{
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        maxWidth: "480px",
        margin: "0 auto",
        background:
          "radial-gradient(98.1% 98.1% at 97.18% 1.13%, #D2F8FF 41.83%, #FFFFFF 100%)",
      }}
    >
      <Stack
        padding="32px 20px"
        border={"2px solid #000"}
        width={"100%"}
        alignItems={"center"}
        color={"#000"}
        borderRadius={"10px"}
      >
        <Volume2 color={"#000"} strokeWidth={1} size={48} />
        <Typography color={"#000"} fontSize={"40px"} fontWeight={"600"}>
          Sound On
        </Typography>
        <Typography color={"#000"} fontSize={"18px"} fontWeight={"400"}>
          We use light background sounds to enhance your game experience. Would
          you like to enable sound?
        </Typography>
        <Stack
          gap={"12px"}
          padding={"0px 20px"}
          width={"100%"}
          marginTop={"35px"}
        >
          <ContainedButton
            onClick={handleGrantPermission}
            sx={{
              bgcolor: "transparent",
              color: "#000",
              border: "2px solid #000",
              opacity: 1,
              "&:hover": { bgcolor: theme.palette.primary.main, opacity: 1 },
            }}
          >
            Turn On Sound
          </ContainedButton>
          <ContainedButton
            onClick={handleDeny}
            sx={{
              backgroundColor: "transparent",
              color: "#000",
              border: "2px solid #000",
              opacity: 0.26,
              "&:hover": { backgroundColor: theme.palette.primary.main, opacity: 1 },
            }}
          >
            Play Without Sound
          </ContainedButton>
        </Stack>
      </Stack>
    </Page>
  );
};

export default SoundPermissionModal;
