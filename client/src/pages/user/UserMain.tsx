import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import OnboardingPage from "./OnboardingPage";
import LoginPage from "./LoginPage";
import TermsAndConditions from "./TermsAndConditionsPage";
import { AnimatePresence } from "framer-motion";
import AnimatedPage from "../../components/layout/AnimatedPage";
import Home from "./Home";
import Games from "./Games";
import { useEffect, useRef } from "react";
import useSound from "../../features/sound/hooks/useSound";
import SoundPermissionModal from "../../components/ui/SoundPermissionModal";
import DoYouKnow from "./DoYouKnow";

const UserMain = () => {
  const location = useLocation();
  const hasInitializedRef = useRef(false);
  const {
    playInLoop,
    stop,
    needsPermission,
    handlePermissionGranted,
    handlePermissionDenied,
  } = useSound();

  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;

      console.log("Initializing background music");
      playInLoop("BGM_1", 0.5);
    }

    // Cleanup function
    return () => {
      console.log("Cleaning up audio on unmount");
      stop();
    };
  }, [playInLoop, stop]);

  if (needsPermission) {
    return (
      <SoundPermissionModal
        needsPermission={needsPermission}
        onPermissionGranted={handlePermissionGranted}
        onPermissionDenied={handlePermissionDenied}
      />
    );
  }
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "480px",
        margin: "0 auto",
        overflow: "hidden",
        minHeight: "100vh",
        background:
          "radial-gradient(98.1% 98.1% at 97.18% 1.13%, #FFE4E5 41.83%, #FFFCE5 100%)",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            index
            path="/onboarding/:page"
            element={
              <AnimatedPage>
                <OnboardingPage />
              </AnimatedPage>
            }
          />
          <Route
            path="/login"
            element={
              <AnimatedPage>
                <LoginPage />
              </AnimatedPage>
            }
          />
          <Route
            path="/terms-and-conditions"
            element={
              <AnimatedPage>
                <TermsAndConditions />
              </AnimatedPage>
            }
          />
          <Route
            path="/home"
            element={
              <AnimatedPage>
                <Home />
              </AnimatedPage>
            }
          />
          <Route
            path="/games/:gameId/*"
            element={
              <AnimatedPage>
                <Games />
              </AnimatedPage>
            }
          />
          <Route
            path="/do-you-know"
            element={
              <AnimatedPage>
                <DoYouKnow />
              </AnimatedPage>
            }
          />

          <Route path="*" element={<Navigate to="/user/onboarding/1" />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default UserMain;
