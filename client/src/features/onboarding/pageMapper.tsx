import useNavigateWithSound from "../sound/hooks/useNavigateWithSound";
import SplashScreen from "./components/SplashScreen";
import Welcome from "./components/Welcome";
import WhatsIncluded from "./components/WhatsIncluded";

export const pageMapper = (page: number) => {
  const navigateWithSound = useNavigateWithSound();

  const handleNextPage = () => {
    if (page < 3) {
      navigateWithSound(`/user/onboarding/${page + 1}`);
    } else {
      navigateWithSound("/user/register");
    }
  };


  if (page === 1) {
    return <SplashScreen handleNextPage={handleNextPage} />;
  }
  if (page === 2) {
    return <Welcome handleNextPage={handleNextPage} />;
  }
  if (page === 3) {
    return <WhatsIncluded handleNextPage={handleNextPage} />;
  }
};
