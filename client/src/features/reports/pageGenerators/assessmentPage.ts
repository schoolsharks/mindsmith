import { ReportPage } from "../reportGenerator";
import { generateLifeStressAssessmentPage } from "./LifeStressAssessmentPage";
import { generateMentalHealthScreeningPage } from "./MentalHealthScreeningPage";
import { generateBrainHealthBiomarkersPage } from "./BrainHealthBiomarkersPage";
import { generateResilienceCopingPage } from "./ResilienceCopingPage";
import { getStatusByScore } from "./utils";
import {  getTotalScoreByTitle } from "./titleScoreMapping";

export const orderReportData = (reportData: ReportPage[]): ReportPage[] => {
  const sectionOrder = [
    "Life Stress Assessment",
    "Mental Health Screening",
    "Comprehensive Brain Health Biomarkers",
    "Resilience & Coping Mechanisms",
  ];

  return reportData.sort((a: ReportPage, b: ReportPage) => {
    const aIndex = sectionOrder.indexOf(a.section);
    const bIndex = sectionOrder.indexOf(b.section);

    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }

    return 0;
  });
};

export const generateAssessmentPageBySection = (
  reportItem: ReportPage,
  pageNumber: number,
  // allReportData: ReportPage[] = []
): string => {
  const {
    section,
    title,
    totalScore,
    assessmentOverview,
    clinicalInterpretation,
    considerations,
    recommendations,
  } = reportItem;

  const contentData = {
    assessmentOverview,
    clinicalInterpretation,
    considerations,
    recommendations,
  };

  // Calculate dynamic total score for the section
  const sectionTotalScore = getTotalScoreByTitle(title);

  switch (section) {
    case "Life Stress Assessment":
      return generateLifeStressAssessmentPage({
        pageNumber,
        currentScore: totalScore,
        totalScore: 1813, // This remains fixed as specified
        status: getStatusByScore(totalScore, "stress"),
        ...contentData,
      });

    case "Mental Health Screening":
      return generateMentalHealthScreeningPage({
        pageNumber,
        title,
        currentScore: totalScore,
        totalScore: sectionTotalScore,
        status: getStatusByScore((totalScore * 100) / sectionTotalScore, "mental"),
        ...contentData,
      });

    case "Comprehensive Brain Health Biomarkers":
      return generateBrainHealthBiomarkersPage({
        pageNumber,
        title,
        currentScore: totalScore,
        totalScore: sectionTotalScore,
        status: getStatusByScore((totalScore * 100) / sectionTotalScore, "brain"),
        ...contentData,
      });

    case "Resilience & Coping Mechanisms":
      return generateResilienceCopingPage({
        pageNumber,
        title,
        currentScore: totalScore,
        totalScore: sectionTotalScore,
        status: getStatusByScore((totalScore * 100) / sectionTotalScore, "resilience"),
        ...contentData,
      });

    default:
      return generateLifeStressAssessmentPage({
        pageNumber,
        currentScore: totalScore,
        totalScore: 50,
        status: "Unknown",
        ...contentData,
      });
  }
};
