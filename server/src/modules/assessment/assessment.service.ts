import { Response as UserResponse } from './models/response.model';
import { Section } from './models/section.model';

export const calculateScores = async (userId: string) => {
  const responses = await UserResponse.find({ user: userId }).populate('section');
  
  const results = await Promise.all(responses.map(async (response) => {
    const totalScore = response.answers.reduce((sum, answer) => sum + answer.score, 0);
    
    return {
      section: (response.section as any).name,
      score: totalScore,
      interpretation: getInterpretation((response.section as any).name, totalScore),
      completedAt: response.completedAt
    };
  }));

  return results;
};

const getInterpretation = (sectionName: string, score: number) => {
  switch (sectionName) {
    case 'Life Stress Assessment':
      if (score < 150) return 'Low stress - minimal health risk';
      if (score < 300) return 'Moderate stress - 50% illness risk';
      return 'High stress - 80% illness risk';
    
    case 'Mental Health Screening':
      if (score < 20) return 'Minimal symptoms';
      if (score < 40) return 'Mild symptoms';
      if (score < 60) return 'Moderate symptoms';
      return 'Severe symptoms';
    
    case 'Resilience & Coping Mechanisms':
      if (score < 15) return 'High resilience';
      if (score < 25) return 'Moderate resilience';
      return 'Low resilience';
    
    case 'Comprehensive Brain Health Biomarkers':
      if (score < 30) return 'Excellent brain health';
      if (score < 60) return 'Good brain health';
      return 'Potential concerns - consult specialist';
    
    default:
      return 'No interpretation available';
  }
};