import { generateRadarChart } from "../chartGenerators/generateRadarChart";
import { ReportPage } from "../reportGenerator";
import { calculateSectionTotalScore } from "./titleScoreMapping";

interface ChartDataPoint {
  name: string;
  value: number; // 0-100
}

// Helper function to calculate percentage score based on section type
const calculatePercentageScore = (reportItem: ReportPage, allReportData: ReportPage[]): number => {
  const { section, totalScore } = reportItem;

  switch (section) {
    case "Life Stress Assessment":
      // For stress, we normalize against max score of 1813 and invert (lower is better)
      return Math.max(0, 100 - (totalScore / 1813) * 100);

    case "Mental Health Screening":
      // Use dynamic total score based on individual title scores
      const mentalHealthMaxScore = calculateSectionTotalScore(section, allReportData);
      return (totalScore / mentalHealthMaxScore) * 100;

    case "Comprehensive Brain Health Biomarkers":
      // Use dynamic total score based on individual title scores
      const brainHealthMaxScore = calculateSectionTotalScore(section, allReportData);
      return (totalScore / brainHealthMaxScore) * 100;

    case "Resilience & Coping Mechanisms":
      // Use dynamic total score based on individual title scores
      const resilienceMaxScore = calculateSectionTotalScore(section, allReportData);
      return (totalScore / resilienceMaxScore) * 100;

    default:
      return 0;
  }
};

export const generateAllSectionsOverviewPage = (reportData: ReportPage[]) => {
  // Map report data to chart format
  const chartData: ChartDataPoint[] = reportData.map((report) => ({
    name: report.title || report.section,
    value: Math.min(100, Math.max(0, calculatePercentageScore(report, reportData))), // Ensure value is between 0-100
  }));

  return `
    <div style="background-color:#E6F5FE; padding: 20px 32px; margin-bottom: 16px; border-radius: 12px;">
      <h1 style="font-size: 1.75rem; font-weight: bold; color: #1f2937; margin: 0;">
        Mental Health Screening Assessment
      </h1>
    </div>

    <div style="margin-bottom: 16px; background-color: #E6F5FE; padding: 24px; border-radius: 8px;">
      <p style="font-size: 0.875rem; line-height: 1.6; color: #374151; margin: 0;">
       This comprehensive screening tool is designed to identify vulnerability and criticality across 15 major categories of mental health conditions. Each section contains 5 questions with three response options to assess the presence and severity of symptoms based on established clinical assessment tools and DSM-5 criteria.

      </p>
    </div>
    
  

    ${generateRadarChart(chartData)}
    `;
};
