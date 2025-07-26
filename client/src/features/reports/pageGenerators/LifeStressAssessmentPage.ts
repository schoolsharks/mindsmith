import { generateDonutChart } from "../chartGenerators/generateDonutChart";

interface LifeStressAssessmentPageProps {
  pageNumber?: number;
  currentScore?: number;
  totalScore?: number;
  status?: string;
  assessmentOverview?: string;
  clinicalInterpretation?: string;
  considerations?: string[];
  recommendations?: string[];
}

export const generateLifeStressAssessmentPage = ({
  pageNumber = 1,
  currentScore = 268,
  totalScore = 1813,
  status = "Struggling",
  assessmentOverview = "",
  clinicalInterpretation = "",
  considerations = [] as string[],
  recommendations = [] as string[],
}: LifeStressAssessmentPageProps) => {
  const sections = [
    { label: "Thriving", percentage: 8, color: "#F6DC6B80", range: "(0-100)" },
    {
      label: "Balancing",
      percentage: 25,
      color: "#9183FF80",
      range: "(101-149)",
    },
    {
      label: "Surviving",
      percentage: 25,
      color: "#FFD6ED80",
      range: "(150-249)",
    },
    {
      label: "Struggling",
      percentage: 32,
      color: "#A4B56E80",
      range: "(250-299)",
    },
    { label: "Crisis", percentage: 10, color: "#FF878980", range: "(300+)" },
  ];

  const statusColor =
    sections.find(
      (section) => section.label.toLowerCase() === status.toLowerCase()
    )?.color || "#000";

  return `
    <!-- Header -->
    <div style="background-color:#F6DC6B8C; padding: 20px 32px; margin-bottom: 16px; border-radius: 12px;">
      <h1 style="font-size: 1.75rem; font-weight: bold; color: #1f2937; margin: 0;">
        ${pageNumber}. Life Event Stress Scale Analysis
      </h1>
    </div>

    <!-- Assessment Overview -->
    <div style="margin-bottom: 16px;padding: 24px; background-color:#F6DC6B26">
      <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Assessment Overview
      </h3>
      <p style="font-size: 0.875rem; line-height: 1.6; color: #374151; margin: 0;">
        ${assessmentOverview}
      </p>
    </div>

    <!-- Chart and Reference Ranges -->
    <div style="display: flex; align-items: flex-start;margin-bottom: 40px; gap: 60px;">
      <div style="flex: 1;">
        ${generateDonutChart(
          currentScore,
          totalScore,
          status,
          statusColor,
          sections
        )}
      </div>
      
      <div style="flex: 1;">
        <div style="text-align: right; margin-bottom: 20px;">
          <span style="font-size: 0.875rem; font-weight: 600; color: #1f2937;">Reference Ranges</span>
        </div>
        
        ${sections
          .map(
            (section) => `
              <div style="display:flex; justify-content:space-between; margin-top:12px;background-color: ${section.color}; border-radius: 12px; border: 1px solid #e5e7eb; padding: 4px 8px; margin-right: 12px;">
                <span style="font-size: 0.875rem; font-weight: 500; color: #1f2937;">${section.label}</span>
                <span style="font-size: 0.875rem; color: #6b7280; font-weight: 500;">${section.range}</span>
              </div>
        `
          )
          .join("")}
      </div>
    </div>

    <!-- Clinical Interpretation -->
    <div style="background-color: #A4B56E26; padding: 24px; border-radius: 8px; margin-bottom: 16px;">
      <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Clinical Interpretation
      </h3>
      <p style="font-size: 0.875rem; line-height: 1.7; color: #374151; margin: 0;">
        ${clinicalInterpretation}
      </p>
    </div>

    <!-- Two columns: Clinical Significance and Recommended Interventions -->
    <div style="display: flex; gap: 16px;">
      <div style="flex: 1; background-color:#FEFAE9; padding: 20px; border-radius: 8px;">
        <h4 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1rem;">
          Clinical Significance:
        </h4>
        <div style="font-size: 0.875rem; line-height: 1.6; color: #374151;">
          ${considerations.map(item => `<div style="margin-bottom: 12px;">- ${item}</div>`).join("")}
        </div>
      </div>

      <div style="flex: 1; background-color: #FEFAE9; padding: 20px; border-radius: 8px;">
        <h4 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1rem;">
          Recommended Interventions:
        </h4>
        <div style="font-size: 0.875rem; line-height: 1.6; color: #374151;">
          ${recommendations.map(item => `<div style="margin-bottom: 12px;">- ${item}</div>`).join("")}
        </div>
      </div>
    </div>
  `;
};
