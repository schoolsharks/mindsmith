import { Box, Stack } from "@mui/material";
import Page from "../../components/layout/Page";
import ScrollToTop from "../../components/utility/ScrollToTop";
import BgDiamonds from "../../components/ui/BgDiamonds/BgDiamonds";
import { positions1 } from "../../components/ui/BgDiamonds/diamondsPositions";
// import cloudGraphic1 from "../../assets/images/cloud-graphic-1.webp";
import brainGraphic1 from "../../assets/images/brain-graphic-1.webp";
import LoginForm from "../../features/auth/components/LoginForm";
const LoginPage = () => {
  // const navigateWithSound = useNavigateWithSound();
  return (
    <Page sx={{ backgroundSize: "contain" }}>
      <BgDiamonds positions={positions1} />
      <ScrollToTop behavior="instant" />
      <Box
        component="img"
        src={brainGraphic1}
        width={"90px"}
        marginTop={"40px"}
        marginLeft={"40px"}
        position={"relative"}
      />
      <Stack mt={"20px"} flex={"1"}>
        <LoginForm />
      </Stack>
    </Page>
  );
};

export default LoginPage;
