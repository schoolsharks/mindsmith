import { ArrowBack } from "@mui/icons-material"
import { IconButton } from "@mui/material"
// import { useNavigate } from "react-router-dom";
import useNavigateWithSound from "../../features/sound/hooks/useNavigateWithSound";

const BackButton = () => {
    // const navigate = useNavigate();
    const navigateWithSound = useNavigateWithSound();
  

  return (
    <IconButton onClick={()=>navigateWithSound(-1)}>
        <ArrowBack/>
    </IconButton>
  )
}

export default BackButton
