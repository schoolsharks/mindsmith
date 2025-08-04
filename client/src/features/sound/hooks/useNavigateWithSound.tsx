import { useNavigate } from "react-router-dom";
import useSound from "./useSound";

const useNavigateWithSound = () => {
  const navigate = useNavigate();
  const { playOnce } = useSound();

  const navigateWithSound = (to: string | Partial<Location>, options?: any) => {
    try {
      playOnce("TRANSITION_1");
    } catch (error) {
      console.error("Error playing sound:", error);
    }
    return navigate(to, options);
  };
  return navigateWithSound;
};

export default useNavigateWithSound;
