const didYouKnows = [
  "Your brain generates enough electricity to power a light bulb — even when you're asleep.",
  "Naming your emotions (like “I'm feeling overwhelmed”) reduces their intensity. It's called affect labeling — and it works like magic for self-regulation.",
  "Mental exhaustion uses the same brain pathways as physical fatigue. That’s why decision-making feels harder when you're burnt out.",
  "The brain is the only organ that named itself. Meta, right?",
  "Just 8 seconds of deep breathing can shift your brain out of a stress state and into focus mode.",
  "Overthinking activates the same brain regions as pain. That’s why it can literally “hurt” to ruminate.",
  "You can “catch” stress from people just by being around them. Your brain has mirror neurons that sync emotionally with others.",
  "Music activates every region of your brain. It’s the only stimulus that lights up all areas — motor, emotional, auditory, even memory.",
  "Your brain processes emotional pain in the same area as physical injury. That heartbreak you feel? It's neurologically real.",
  "90% of your serotonin — the “feel-good” neurotransmitter — is produced in your gut, not your brain. Hello, gut-brain connection!",
  "When you're sleep-deprived, your brain actually shuts down decision-making zones and amplifies fear centers.",
  "Your subconscious mind processes about 11 million bits of information per second — while your conscious mind handles just 40.",
  "Your brain starts shrinking in volume as early as your late 20s — but learning new skills keeps it young.",
  "Laughter doesn’t just feel good — it lowers cortisol, boosts immunity, and increases blood flow to the brain.",
  "Psychological safety — the feeling of being accepted without judgment — is the #1 predictor of team performance in workplaces."
];

const sectionNumberOfCards = {
    "what-life-been-like": 5,
    "feel-your-feelings": 5,
    "your-best-bouncing-self": 2,
    "the-brainy-bits": 2,
} as const;

type GameId = keyof typeof sectionNumberOfCards;

// Get the did you know facts for a specific game section
export const getDidYouKnowsForSection = (gameId: string): string[] => {
  const numCards = sectionNumberOfCards[gameId as GameId];
  if (!numCards) return [];
  
  // Simple approach: each section gets its allotted number of facts in order
  const gameOrder = ["what-life-been-like", "feel-your-feelings", "your-best-bouncing-self", "the-brainy-bits"];
  const gameIndex = gameOrder.indexOf(gameId);
  
  if (gameIndex === -1) return [];
  
  // Calculate starting index based on previous sections
  let startIndex = 0;
  for (let i = 0; i < gameIndex; i++) {
    const prevGameId = gameOrder[i] as GameId;
    startIndex += sectionNumberOfCards[prevGameId];
  }
  
  return didYouKnows.slice(startIndex, startIndex + numCards);
};

// Calculate which questions should trigger "Did You Know" overlays
export const getDidYouKnowTriggerPoints = (gameId: string, totalQuestions: number): number[] => {
  const numCards = sectionNumberOfCards[gameId as GameId];
  if (!numCards || totalQuestions === 0) return [];
  
  const triggerPoints: number[] = [];
  const interval = Math.floor(totalQuestions / numCards);
  
  for (let i = 1; i <= numCards; i++) {
    const triggerPoint = i * interval - 1; // 0-indexed
    if (triggerPoint < totalQuestions) {
      triggerPoints.push(triggerPoint);
    }
  }
  
  return triggerPoints;
};

// Get a specific "Did You Know" fact for a trigger point
export const getDidYouKnowForTriggerPoint = (gameId: string, triggerIndex: number): string => {
  const facts = getDidYouKnowsForSection(gameId);
  return facts[triggerIndex] || didYouKnows[0];
};

export { didYouKnows, sectionNumberOfCards };






