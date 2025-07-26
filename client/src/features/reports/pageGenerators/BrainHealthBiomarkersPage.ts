import { generateDonutChart } from "../chartGenerators/generateDonutChart";
import { ranges } from "./utils";

interface BrainHealthBiomarkersPageProps {
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

export const generateBrainHealthBiomarkersPage = ({
  pageNumber = 3,
  title = "",
  currentScore = 75,
  totalScore = 120,
  status = "Good",
  assessmentOverview = "",
  clinicalInterpretation = "",
  considerations = [] as string[],
  recommendations = [] as string[],
}: BrainHealthBiomarkersPageProps) => {
  const sections = ranges;
  const statusColor =
    sections.find(
      (section) => section.label.toLowerCase() === status.toLowerCase()
    )?.color || "#000";

  console.log("Brain Health Biomarkers Page Data:", sections);
  console.log("status :", status);

  return `
    <!-- Header -->
    <div style="background-color: #FFA1A280; padding: 20px 32px; margin-bottom: 16px; border-radius: 12px;">
      <h1 style="font-size: 1.75rem; font-weight: bold; color: #1f2937; margin: 0;">
        ${pageNumber}. ${title}
      </h1>
    </div>

    <!-- Assessment Overview -->
    <div style="margin-bottom: 16px; background-color: #FFA1A226; padding: 24px; border-radius: 8px;">
      <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Assessment Overview
      </h3>
      <p style="font-size: 0.875rem; line-height: 1.6; color: #374151; margin: 0;">
        ${
          assessmentOverview ||
          "Comprehensive evaluation of brain health indicators including cognitive function, neurological markers, lifestyle factors, and biochemical indicators that influence overall brain health and cognitive performance."
        }
      </p>
    </div>

    <!-- Chart and Reference Ranges -->
    <div style="display: flex; align-items: flex-start; margin-bottom: 40px; gap: 60px;">
      <div style="flex: 1;">
        ${generateDonutChart(
          currentScore,
          totalScore,
          status,
          statusColor,
          sections,
          "percentage"
        )}
      </div>
      
      <div style="flex: 1; padding-top: 20px;">
        <div style="text-align: right; margin-bottom: 20px;">
          <span style="font-size: 0.875rem; font-weight: 600; color: #1f2937;">Health Categories</span>
        </div>
        
        ${sections
          .map(
            (section) => `
              <div style="display:flex; justify-content:space-between; margin-top:12px;background-color: ${section.color}; border-radius: 12px; border: 1px solid #e5e7eb; padding: 4px 8px; margin-right: 12px;">
                <span style="font-size: 0.875rem; font-weight: 500; color: #1f2937;">${section.label}</span>
                <span style="font-size: 0.875rem; color: #6b7280; font-weight: 500;">${section.percentageRange}</span>
              </div>
        `
          )
          .join("")}
      </div>
    </div>

    <!-- Clinical Interpretation -->
    <div style="background-color:#8DD1FF26; padding: 24px; border-radius: 8px; margin-bottom: 16px;">
      <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Clinical Interpretation
      </h3>
      <p style="font-size: 0.875rem; line-height: 1.7; color: #374151; margin: 0;">
        ${clinicalInterpretation}
      </p>
    </div>

    <!-- Two columns: Clinical Significance and Recommended Interventions -->
    <div style="display: flex; gap: 16px;">
      <div style="flex: 1; background-color: #FFA1A226; padding: 20px; border-radius: 8px;">
        <h4 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1rem;">
          Clinical Significance:
        </h4>
        <div style="font-size: 0.875rem; line-height: 1.6; color: #374151;">
          ${considerations
            .map((item) => `<div style="margin-bottom: 12px;">- ${item}</div>`)
            .join("")}
        </div>
      </div>
      
      <div style="flex: 1; background-color: #FFA1A226; padding: 20px; border-radius: 8px;">
        <h4 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1rem;">
          Optimization Strategies:
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
