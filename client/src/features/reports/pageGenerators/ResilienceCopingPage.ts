import { generateCircleChart } from "../chartGenerators/generateCircleChart";
import { ranges } from "./utils";

interface ResilienceCopingPageProps {
  pageNumber?: number;
  title?: string;
  currentScore?: number;
  totalScore?: number;
  status?: string;
  assessmentOverview?: string;
  clinicalInterpretation?: string;
  considerations?: string[];
  recommendations?: string[];
}

export const generateResilienceCopingPage = ({
  pageNumber = 4,
  title = "",
  currentScore = 85,
  totalScore = 100,
  status = "Strong",
  assessmentOverview = "",
  clinicalInterpretation = "",
  considerations = [] as string[],
  recommendations = [] as string[],
}: ResilienceCopingPageProps) => {
  const sections = ranges;
  const statusColor =
    sections.find(
      (section) => section.label.toLowerCase() === status.toLowerCase()
    )?.color || "#000";

  return `
    <!-- Header -->
    <div style="background-color: #A4B56E80; padding: 20px 32px; margin-bottom: 16px; border-radius: 12px;">
      <h1 style="font-size: 1.75rem; font-weight: bold; color: #1f2937; margin: 0;">
        ${pageNumber}. ${title}
      </h1>
    </div>

    <!-- Assessment Overview -->
    <div style="background-color: #A4B56E14; padding: 24px; border-radius: 8px;">
      <h3 style="font-weight: bold;  color: #1f2937; font-size: 1.125rem;">
        Assessment Overview
      </h3>
      <p style="font-size: 0.875rem; line-height: 1.6; color: #374151; margin: 0;">
        ${
          assessmentOverview ||
          "Evaluation of psychological resilience, stress management capabilities, adaptive coping strategies, and emotional regulation skills. This assessment measures your ability to bounce back from challenges and maintain mental well-being."
        }
      </p>
    </div>

    <!-- Chart and Reference Ranges -->
    <div style="margin-top:-24px;display: flex; align-items: center; margin-bottom: 56px; gap: 60px;">
      <div style="flex: 1; ">
        ${generateCircleChart({ status, statusColor })}
      </div>
      <div>
          <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Scoring Results :
      </h3>
           <div style="font-size: 18px; font-weight: 500;">Raw score - ${currentScore}/${totalScore} points</div>
          <div style="font-size: 18px;">Percentage score - ${
            (currentScore / totalScore) * 100
          }%</div>
        </div>
      
      
    </div>

    <!-- Clinical Interpretation -->
    <div style="background-color: #f3f4f6; padding: 24px; border-radius: 8px; margin-bottom: 16px;">
      <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Clinical Interpretation
      </h3>
      <p style="font-size: 0.875rem; line-height: 1.7; color: #374151; margin: 0;">
        ${clinicalInterpretation}
      </p>
    </div>

    <!-- Two columns: Clinical Significance and Recommended Interventions -->
    <div style="display: flex; gap: 16px;">
      <div style="flex: 1; background-color: #F6F7F1; padding: 20px; border-radius: 8px;">
        <h4 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1rem;">
          Clinical Significance:
        </h4>
        <div style="font-size: 0.875rem; line-height: 1.6; color: #374151;">
          ${considerations
            .map((item) => `<div style="margin-bottom: 12px;">- ${item}</div>`)
            .join("")}
        </div>
      </div>
      
      <div style="flex: 1; background-color: #EDF0E280; padding: 20px; border-radius: 8px;">
        <h4 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1rem;">
          Enhancement Strategies:
        </h4>
        <div style="font-size: 0.875rem; line-height: 1.6; color: #374151;">
          ${recommendations
            .map((item) => `<div style="margin-bottom: 12px;">- ${item}</div>`)
            .join("")}
        </div>
      </div>
    </div>
  `;
};
