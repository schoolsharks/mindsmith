import { useNavigate } from "react-router-dom";
import useSound from "./useSound";

const useNavigateWithSound = () => {
  const navigate = useNavigate();
  const { playOnce } = useSound();

  const navigateWithSound = (to: string | Partial<Location>, options?: any) => {
    playOnce("TRANSITION_1");
    return navigate(to, options);
  };
  return navigateWithSound;
};

export default useNavigateWithSound;
