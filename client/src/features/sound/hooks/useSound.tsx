import { useState, useCallback, useEffect } from "react";
import { getSound, SoundKey } from "../soundMapper";
import { SOUND_ENABLED_KEY } from "../utils/localstorageKey";

interface PendingSound {
  soundKey: SoundKey;
  volume: number;
  loop: boolean;
}

class GlobalAudioManager {
  private static instance: GlobalAudioManager;
  private currentLoopAudio: HTMLAudioElement | null = null;
  private currentLoopSoundKey: SoundKey | null = null;
  private oneTimeSounds: Set<HTMLAudioElement> = new Set();

  static getInstance(): GlobalAudioManager {
    if (!GlobalAudioManager.instance) {
      GlobalAudioManager.instance = new GlobalAudioManager();
    }
    return GlobalAudioManager.instance;
  }

  stopAllLoopedSounds(): void {
    if (this.currentLoopAudio) {
      this.currentLoopAudio.pause();
      this.currentLoopAudio.currentTime = 0;
      this.currentLoopAudio = null;
      this.currentLoopSoundKey = null;
    }
  }

  setCurrentLoopAudio(audio: HTMLAudioElement, soundKey: SoundKey): void {
    // Stop any existing looped sound first
    this.stopAllLoopedSounds();
    this.currentLoopAudio = audio;
    this.currentLoopSoundKey = soundKey;
  }

  addOneTimeSound(audio: HTMLAudioElement): void {
    this.oneTimeSounds.add(audio);

    // Clean up when sound ends
    const cleanup = () => {
      this.oneTimeSounds.delete(audio);
      audio.removeEventListener("ended", cleanup);
      audio.removeEventListener("error", cleanup);
    };

    audio.addEventListener("ended", cleanup);
    audio.addEventListener("error", cleanup);
  }

  getCurrentLoopSound(): {
    audio: HTMLAudioElement | null;
    soundKey: SoundKey | null;
  } {
    return {
      audio: this.currentLoopAudio,
      soundKey: this.currentLoopSoundKey,
    };
  }

  isLoopSoundPlaying(soundKey: SoundKey): boolean | null {
    return (
      this.currentLoopSoundKey === soundKey &&
      this.currentLoopAudio &&
      !this.currentLoopAudio.paused
    );
  }

  stopAllSounds(): void {
    // Stop looped sound
    this.stopAllLoopedSounds();

    // Stop all one-time sounds
    this.oneTimeSounds.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.oneTimeSounds.clear();
  }
}

const useSound = () => {
  const globalManager = GlobalAudioManager.getInstance();
  const [needsPermission, setNeedsPermission] = useState<boolean>(true);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  const [pendingSound, setPendingSound] = useState<PendingSound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSound, setCurrentSound] = useState<SoundKey | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize permission state on mount
  useEffect(() => {
    const initializePermissions = async () => {
      console.log("🔊 Initializing sound permissions...");
      const savedPermission = localStorage.getItem(SOUND_ENABLED_KEY);
      console.log("🔊 Saved permission:", savedPermission);
      
      if (savedPermission === "false") {
        // User previously denied permission
        console.log("🔊 User previously denied permission");
        setNeedsPermission(false);
        setHasUserInteracted(true);
        setIsInitialized(true);
        return;
      }
      
      if (savedPermission === "true") {
        // User previously granted permission, check if autoplay still works
        console.log("🔊 User previously granted permission, checking autoplay...");
        const canAutoplay = await checkAutoplaySupport();
        if (canAutoplay) {
          console.log("🔊 Autoplay works, no permission needed");
          setNeedsPermission(false);
          setHasUserInteracted(true);
        } else {
          console.log("🔊 Autoplay blocked, permission needed again");
          setNeedsPermission(true);
          setHasUserInteracted(false);
        }
      } else {
        // No previous permission, check if autoplay is supported
        console.log("🔊 No previous permission, checking autoplay...");
        const canAutoplay = await checkAutoplaySupport();
        if (canAutoplay) {
          console.log("🔊 Autoplay works, no permission needed");
          setNeedsPermission(false);
          setHasUserInteracted(true);
        } else {
          console.log("🔊 Autoplay blocked, permission needed");
          setNeedsPermission(true);
          setHasUserInteracted(false);
        }
      }
      
      setIsInitialized(true);
      console.log("🔊 Sound initialization complete");
    };

    initializePermissions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const { audio, soundKey } = globalManager.getCurrentLoopSound();
      const playing = audio && !audio.paused;
      setIsPlaying(!!playing);
      setCurrentSound(soundKey);
    }, 100);

    return () => clearInterval(interval);
  }, [globalManager]);

  const checkAutoplaySupport = useCallback(async (): Promise<boolean> => {
    try {
      // Create a minimal test audio
      const testAudio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScEJHfH8N2QQAoUXrTp66hVFApGn+DyvmAeByOLzvLNfScE");
      testAudio.volume = 0.01;
      
      const playPromise = testAudio.play();
      if (playPromise !== undefined) {
        await playPromise;
        testAudio.pause();
        testAudio.currentTime = 0;
        console.log("Autoplay test: SUCCESS - autoplay is allowed");
        return true;
      }
      console.log("Autoplay test: FAILED - no play promise");
      return false;
    } catch (error: any) {
      console.log("Autoplay test: FAILED - error:", error);
      
      // Check for specific autoplay-related errors
      if (
        error.name === "NotAllowedError" ||
        error.name === "AbortError" ||
        error.message.includes("user interaction") ||
        error.message.includes("autoplay") ||
        error.message.includes("gesture")
      ) {
        return false;
      }
      
      // For other errors, assume autoplay is not supported
      return false;
    }
  }, []);

  const playSound = useCallback(
    async (soundKey: SoundKey, volume: number = 1, loop: boolean = false) => {
      console.log(
        `Attempting to play sound: ${soundKey}, volume: ${volume}, loop: ${loop}`
      );

      if (loop && globalManager.isLoopSoundPlaying(soundKey)) {
        console.log(
          `Sound ${soundKey} is already playing in loop, skipping duplicate`
        );
        return;
      }

      // Validate volume
      if (volume < 0 || volume > 1) {
        console.error("Volume must be between 0 and 1");
        return;
      }

      const sound = getSound(soundKey);

      // If this is a looped sound, stop all other looped sounds globally
      if (loop) {
        globalManager.stopAllLoopedSounds();
      }

      const audio = new Audio(sound);
      audio.loop = loop;
      audio.volume = volume;

      // Add event listeners for tracking
      audio.addEventListener("play", () => {
        console.log(`Audio started playing: ${soundKey}`);
        if (loop) {
          globalManager.setCurrentLoopAudio(audio, soundKey);
        } else {
          globalManager.addOneTimeSound(audio);
        }
      });

      audio.addEventListener("ended", () => {
        console.log(`Audio ended: ${soundKey}`);
        if (loop) {
          // This shouldn't happen for looped sounds, but just in case
          setIsPlaying(false);
          setCurrentSound(null);
        }
      });

      audio.addEventListener("pause", () => {
        console.log(`Audio paused: ${soundKey}`);
        if (loop) {
          setIsPlaying(false);
          setCurrentSound(null);
        }
      });

      audio.addEventListener("error", (e) => {
        console.error(`Audio error for ${soundKey}:`, e);
        setIsPlaying(false);
        setCurrentSound(null);
      });

      try {
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          await playPromise;
          console.log(`Successfully started playing: ${soundKey}`);

          // If we successfully played, ensure permission modal is closed
          setNeedsPermission(false);
          setHasUserInteracted(true);
          setPendingSound(null);
        }
      } catch (error: any) {
        console.error(`Error playing sound ${soundKey}:`, error);
        setIsPlaying(false);
        setCurrentSound(null);

        // Check if the error is due to user interaction requirement
        if (
          error.name === "NotAllowedError" ||
          error.name === "AbortError" ||
          error.message.includes("user interaction") ||
          error.message.includes("autoplay") ||
          error.message.includes("gesture")
        ) {
          console.log("Audio blocked by browser policy, requesting permission");
          // Store the pending sound and show permission modal
          setPendingSound({ soundKey, volume, loop });
          setNeedsPermission(true);
        }
      }
    },
    [globalManager]
  );

  const playInLoop = useCallback(
    (soundKey: SoundKey, volume: number = 1) => {
      console.log(
        `playInLoop called for: ${soundKey} - stopping all other looped sounds`
      );
      // This will automatically stop all other looped sounds via the global manager
      playSound(soundKey, volume, true);
    },
    [playSound]
  );

  const playOnce = useCallback(
    (soundKey: SoundKey, volume: number = 1) => {
      playSound(soundKey, volume, false);
    },
    [playSound]
  );

  const stop = useCallback(() => {
    console.log("Stopping all sounds via useSound hook");
    globalManager.stopAllSounds();
    setIsPlaying(false);
    setCurrentSound(null);
  }, [globalManager]);

  const handlePermissionGranted = useCallback(async () => {
    console.log("User granted audio permission");
    setHasUserInteracted(true);
    setNeedsPermission(false);
    localStorage.setItem(SOUND_ENABLED_KEY, "true");

    if (pendingSound) {
      console.log(`Playing pending sound: ${pendingSound.soundKey}`);
      // Small delay to ensure the modal is closed and DOM is updated
      setTimeout(() => {
        playSound(
          pendingSound.soundKey,
          pendingSound.volume,
          pendingSound.loop
        );
      }, 100);
      setPendingSound(null);
    }
  }, [pendingSound, playSound]);

  const handlePermissionDenied = useCallback(() => {
    console.log("User denied audio permission");
    localStorage.setItem(SOUND_ENABLED_KEY, "false");
    setNeedsPermission(false);
    setHasUserInteracted(true);
    setPendingSound(null);
    // Don't play any pending sounds when permission is denied
  }, []);

  // Function to start background music (can be called after permission is granted)
  const startBackgroundMusic = useCallback((soundKey: SoundKey = "BGM_1", volume: number = 0.5) => {
    if (hasUserInteracted && !needsPermission) {
      console.log(`Starting background music: ${soundKey}`);
      playInLoop(soundKey, volume);
    } else {
      console.log("Cannot start background music - permission not granted or user hasn't interacted");
    }
  }, [hasUserInteracted, needsPermission, playInLoop]);

  // Function to retry playing sounds manually
  const retryPendingSound = useCallback(() => {
    if (pendingSound && hasUserInteracted) {
      playSound(pendingSound.soundKey, pendingSound.volume, pendingSound.loop);
    }
  }, [pendingSound, hasUserInteracted, playSound]);

  return {
    needsPermission,
    hasUserInteracted,
    pendingSound,
    isPlaying,
    currentSound,
    isInitialized,
    playInLoop,
    playOnce,
    stop,
    handlePermissionGranted,
    handlePermissionDenied,
    retryPendingSound,
    checkAutoplaySupport,
    startBackgroundMusic,
  };
};

export default useSound;
