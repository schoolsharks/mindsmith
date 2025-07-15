import { IconButton } from "@mui/material";
import { Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";
import useSound from "../hooks/useSound";
import { SOUND_ENABLED_KEY } from "../utils/localstorageKey";


const SoundToggleButton = ({size}:{size?:number}) => {
  const { playInLoop, stop, isPlaying } = useSound();
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SOUND_ENABLED_KEY);
      const enabled = stored !== null ? stored === 'true' : true; 
      setIsSoundEnabled(enabled);
      
      if (enabled && !isPlaying) {
        playInLoop("BGM_1", 0.5);
      } else if (!enabled && isPlaying) {
        stop();
      }
    } catch (error) {
      console.log("Cannot access localStorage:", error);
      setIsSoundEnabled(true);
    }
  }, [playInLoop, stop, isPlaying]);

  const storeSoundPreference = (enabled: boolean) => {
    try {
      localStorage.setItem(SOUND_ENABLED_KEY, enabled.toString());
    } catch (error) {
      console.log("Cannot store in localStorage:", error);
    }
  };

  const toggleSound = () => {
    const newSoundState = !isSoundEnabled;
    setIsSoundEnabled(newSoundState);
    storeSoundPreference(newSoundState);

    if (newSoundState) {
      console.log("Enabling background music");
      playInLoop("BGM_1", 0.5);
    } else {
      console.log("Disabling background music");
      stop();
    }
  };

  return (
    <IconButton 
      onClick={toggleSound}
      sx={{
        color: 'white',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }
      }}
      aria-label={isSoundEnabled ? "Turn sound off" : "Turn sound on"}
    >
      {isSoundEnabled ? (
        <Volume2 size={size || 24} />
      ) : (
        <VolumeX size={size || 24} />
      )}
    </IconButton>
  );
};

export default SoundToggleButton;