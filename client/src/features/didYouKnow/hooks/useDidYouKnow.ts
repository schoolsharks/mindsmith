import { useState, useEffect, useCallback } from 'react';
import { getDidYouKnowTriggerPoints, getDidYouKnowForTriggerPoint } from '../data';

export const useDidYouKnow = (gameId: string, totalQuestions: number, currentIndex: number) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [currentFact, setCurrentFact] = useState('');
  const [shownTriggerPoints, setShownTriggerPoints] = useState<Set<number>>(new Set());
  const [triggerPoints, setTriggerPoints] = useState<number[]>([]);
  const [pendingTrigger, setPendingTrigger] = useState<number | null>(null);

  // Calculate trigger points when questions are loaded
  useEffect(() => {
    if (totalQuestions > 0) {
      const points = getDidYouKnowTriggerPoints(gameId, totalQuestions);
      setTriggerPoints(points);
      console.log(`Did You Know trigger points for ${gameId}:`, points);
    }
  }, [gameId, totalQuestions]);

  // Check if we should show overlay when moving to next question
  const checkForTrigger = useCallback((questionIndex: number) => {
    if (triggerPoints.length > 0 && questionIndex >= 0) {
      const shouldShowOverlay = triggerPoints.includes(questionIndex) && 
                               !shownTriggerPoints.has(questionIndex);
      
      if (shouldShowOverlay) {
        const triggerIndex = triggerPoints.indexOf(questionIndex);
        const fact = getDidYouKnowForTriggerPoint(gameId, triggerIndex);
        setCurrentFact(fact);
        setPendingTrigger(questionIndex);
        
        // Show overlay after a small delay to ensure UI is ready
        setTimeout(() => {
          setIsOverlayOpen(true);
          setShownTriggerPoints(prev => new Set([...prev, questionIndex]));
        }, 100);
      }
    }
  }, [triggerPoints, gameId, shownTriggerPoints]);

  // Watch for index changes that might trigger overlay
  useEffect(() => {
    if (currentIndex >= 0 && pendingTrigger === null) {
      checkForTrigger(currentIndex);
    }
  }, [currentIndex, checkForTrigger, pendingTrigger]);

  const closeOverlay = useCallback(() => {
    setIsOverlayOpen(false);
    setPendingTrigger(null);
  }, []);

  // Manual trigger function for when questions are answered
  const triggerIfNeeded = useCallback((questionIndex: number) => {
    checkForTrigger(questionIndex);
  }, [checkForTrigger]);

  return {
    isOverlayOpen,
    currentFact,
    closeOverlay,
    triggerPoints,
    triggerIfNeeded
  };
};
