// Title to score mapping based on the actual number of questions for different sections
export const titleToScoreMapping: Record<string, number> = {
  'Substance-Related and Addictive Disorders': 25,
  'Executive Function & Decision Making': 25,
  'Emotional & Mental Health Biomarkers': 25,
  'Memory & Attention': 25,
  'Sleep-Wake Disorders': 25,
  'Lifestyle Biomarkers': 50,
  'Gender Dysphoria': 25,
  'Mood Disorders': 25,
  'Neurodevelopmental Disorders': 25,
  'Feeding and Eating Disorders': 25,
  'Neurocognitive Disorders': 25,
  'Stress Management & Adaptation': 25,
  'Medical & Laboratory Biomarkers': 50,
  'Sexual Dysfunctions': 25,
  'Schizophrenia Spectrum and Other Psychotic Disorders': 25,
  'Obsessive-Compulsive and Related Disorders': 25,
  'Trauma- and Stressor-Related Disorders': 25,
  'Anxiety Disorders': 25,
  'Cognitive Biomarkers': 50,
  'Dissociative Disorders': 25,
  'Functional Biomarkers': 15,
  'Somatic Symptom and Related Disorders': 25,
  'Physical & Neurological Biomarkers': 50,
  'Disruptive, Impulse-Control, and Conduct Disorders': 25,
};

// Helper function to get total score by title
export const getTotalScoreByTitle = (title: string): number => {
  return titleToScoreMapping[title] || 25; // Default to 25 if not found
};

// Helper function to calculate total score for a section by summing individual title scores
export const calculateSectionTotalScore = (section: string, reportData: any[]): number => {
  switch (section) {
    case "Life Stress Assessment":
      return 1813; // This remains the same as specified

    case "Mental Health Screening":
      // Sum scores for all Mental Health Screening titles
      const mentalHealthTitles = reportData
        .filter(item => item.section === "Mental Health Screening")
        .map(item => item.title);
      return getTotalScoreByTitle(mentalHealthTitles[0]);

    case "Comprehensive Brain Health Biomarkers":
      // Sum scores for all Brain Health Biomarkers titles
      const brainHealthTitles = reportData
        .filter(item => item.section === "Comprehensive Brain Health Biomarkers")
        .map(item => item.title);
        return getTotalScoreByTitle(brainHealthTitles[0]);

    case "Resilience & Coping Mechanisms":
      // Sum scores for all Resilience & Coping titles
      const resilienceTitles = reportData
        .filter(item => item.section === "Resilience & Coping Mechanisms")
        .map(item => item.title);
      return getTotalScoreByTitle(resilienceTitles[0]);

    default:
      return 100; // Default fallback
  }
};
