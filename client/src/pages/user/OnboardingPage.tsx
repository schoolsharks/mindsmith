import { Box } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { pageMapper } from "../../features/onboarding/pageMapper";
import useNavigateWithSound from "../../features/sound/hooks/useNavigateWithSound";

const OnboardingPage = () => {
  const { page } = useParams();
  const navigateWithSound = useNavigateWithSound();

  useEffect(() => {
    if (!page) {
      navigateWithSound("/user/onboarding/1");
    }
  }, [page, navigateWithSound]);

  return (
    <Box
      
    >
      {pageMapper(Number(page))}
    </Box>
  );
};

export default OnboardingPage;
