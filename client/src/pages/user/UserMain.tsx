import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import OnboardingPage from "./OnboardingPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import TermsAndConditions from "./TermsAndConditionsPage";
import { AnimatePresence } from "framer-motion";
import AnimatedPage from "../../components/layout/AnimatedPage";
import Home from "./Home";
import Games from "./Games";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import useSound from "../../features/sound/hooks/useSound";
import SoundPermissionModal from "../../components/ui/SoundPermissionModal";
import DoYouKnow from "./DoYouKnow";
import ProtectedRoute from "../../features/auth/components/ProtectedRoute";
import { fetchUser } from "../../features/auth/authSlice";
import { AppDispatch } from "../../app/store";

const UserMain = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const hasInitializedRef = useRef(false);
  const {
    stop,
    needsPermission,
    isInitialized,
    hasUserInteracted,
    handlePermissionGranted,
    handlePermissionDenied,
    startBackgroundMusic,
  } = useSound();

  // Check if we're on pages that shouldn't require sound permission
  const isOnSoundExemptPage =
    location.pathname.includes("/onboarding") ||
    location.pathname.includes("/login") ||
    location.pathname.includes("/register") ||
    location.pathname.includes("/terms-and-conditions") ||
    location.pathname === "/user";

  // Dispatch fetchUser on component mount to check if user is already authenticated
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Initialize background music when conditions are met
  useEffect(() => {
    console.log("🎵 UserMain useEffect triggered:", {
      hasInitializedRef: hasInitializedRef.current,
      isInitialized,
      isOnSoundExemptPage,
      needsPermission,
      hasUserInteracted,
    });

    if (
      !hasInitializedRef.current &&
      isInitialized &&
      !isOnSoundExemptPage &&
      !needsPermission &&
      hasUserInteracted
    ) {
      hasInitializedRef.current = true;
      console.log("Initializing background music");
      startBackgroundMusic("BGM_1", 0.5);
    }

    // Cleanup function
    return () => {
      if (hasInitializedRef.current) {
        console.log("Cleaning up audio on unmount");
        stop();
      }
    };
  }, [
    startBackgroundMusic,
    stop,
    isOnSoundExemptPage,
    needsPermission,
    hasUserInteracted,
    isInitialized,
  ]);

  // Reset initialization flag when moving to/from sound exempt pages
  useEffect(() => {
    if (isOnSoundExemptPage && hasInitializedRef.current) {
      hasInitializedRef.current = false;
      stop();
    }
  }, [isOnSoundExemptPage, stop]);

  // Show loading state until sound hook is initialized
  if (!isInitialized) {
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
            "radial-gradient(98.1% 98.1% at 97.18% 1.13%, #D2F8FF 41.83%, #FFFFFF 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // Show permission modal only if needed and not on exempt pages
  if (needsPermission && !isOnSoundExemptPage) {
    console.log("🎵 Showing permission modal");
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
          "radial-gradient(98.1% 98.1% at 97.18% 1.13%, #D2F8FF 41.83%, #FFFFFF 100%) ",
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
            path="/register"
            element={
              <AnimatedPage>
                <RegisterPage />
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
              <ProtectedRoute>
                <AnimatedPage>
                  <Home />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/:gameId/*"
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <Games />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/do-you-know"
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <DoYouKnow />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/user/onboarding/1" />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default UserMain;
