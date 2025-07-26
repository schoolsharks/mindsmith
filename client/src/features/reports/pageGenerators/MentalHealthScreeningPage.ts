import { generateLinearChart } from "../chartGenerators/generateLinearChart";

interface MentalHealthScreeningPageProps {
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

export const generateMentalHealthScreeningPage = ({
  pageNumber = 2,
  title = "Anxiety Disorders",
  currentScore = 9,
  totalScore = 25,
  status = "Balancing",
  assessmentOverview = "",
  clinicalInterpretation = "",
  considerations = [] as string[],
  recommendations = [] as string[],
}: MentalHealthScreeningPageProps) => {
  // Calculate percentage if not provided
  const calculatedPercentageScore = Math.round(
    (currentScore / totalScore) * 100
  );
  const sections = [
    { label: "Thriving", percentage: 20, color: "#F6DC6B80", range: "0-20%" },
    { label: "Balancing", percentage: 20, color: "#9183FF80", range: "21-40%" },
    { label: "Surviving", percentage: 20, color: "#FFD6ED80", range: "41-60%" },
    {
      label: "Struggling",
      percentage: 20,
      color: "#A4B56E80",
      range: "61-80%",
    },
    { label: "Crisis", percentage: 20, color: "#FFA1A280", range: "81-100%" },
  ];

  const statusColor =
    sections.find(
      (section) => section.label.toLowerCase() === status.toLowerCase()
    )?.color || "#000";

  return `
    <!-- Header -->
    <div style="background-color: #E6F5FE; padding: 20px 32px; margin-bottom: 16px; border-radius: 12px;">
      <h1 style="font-size: 1.75rem; font-weight: bold; color: #1f2937; margin: 0;">
        ${pageNumber}. ${title}
      </h1>
    </div>

    <!-- Assessment Overview -->
    <div style="margin-bottom: 16px; background-color:#8DD1FF26; padding: 24px; border-radius: 8px;">
      <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Assessment Overview
      </h3>
      <p style="font-size: 0.875rem; line-height: 1.6; color: #374151; margin: 0;">
        ${assessmentOverview}
      </p>
    </div>

    <!-- Scoring Results -->
    <div style="margin-bottom: 16px;padding:24px;">
      <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Scoring Results :
      </h3>
      ${generateLinearChart(
        currentScore,
        totalScore,
        calculatedPercentageScore,
        status,
        sections,
        statusColor
      )}
    </div>

    <!-- Clinical Interpretation -->
    <div style="background-color: #FFA1A21A; padding: 24px; border-radius: 8px; margin-bottom: 16px;">
      <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Clinical Interpretation
      </h3>
      <p style="font-size: 0.875rem; line-height: 1.7; color: #374151; margin: 0;">
        ${clinicalInterpretation}
      </p>
    </div>

    <!-- Two columns: Clinical Significance and Recommended Interventions -->
    <div style="display: flex; gap: 16px;">
      <div style="flex: 1; background-color: #8DD1FF26; padding: 20px; border-radius: 8px;">
        <h4 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1rem;">
          Clinical Significance:
        </h4>
        <div style="font-size: 0.875rem; line-height: 1.6; color: #374151;">
          ${considerations
            .map((item) => `<div style="margin-bottom: 12px;">- ${item}</div>`)
            .join("")}
        </div>
      </div>

      <div style="flex: 1; background-color: #8DD1FF26; padding: 20px; border-radius: 8px;">
        <h4 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1rem;">
          Recommended Interventions:
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
