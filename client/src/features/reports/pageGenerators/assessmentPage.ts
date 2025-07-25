import { generateDonutChart } from "../chartGenerators/generateDonutChart";
import { generateLinearChart } from "../chartGenerators/generateLinearChart";

// Section themes configuration
const sectionThemes = {
  "Life Stress Assessment": {
    headerBg: "#F6DC6B8C",
    primaryBg: "#fffbeb",
    accentColor: "#d1fae5",
    textColor: "#065f46",
  },
  "Mental Health Screening": {
    headerBg: "#e0e7ff",
    primaryBg: "#f0f4ff",
    accentColor: "#ddd6fe",
    textColor: "#4c1d95",
  },
  "Comprehensive Brain Health Biomarkers": {
    headerBg: "#fce7f3",
    primaryBg: "#fdf2f8",
    accentColor: "#f3e8ff",
    textColor: "#86198f",
  },
  "Resilience & Coping Mechanisms": {
    headerBg: "#d1fae5",
    primaryBg: "#ecfdf5",
    accentColor: "#bbf7d0",
    textColor: "#14532d",
  },
};

// Types
interface ReportItem {
  section: string;
  title: string;
  totalScore: number;
}


type ScoreType = "stress" | "mental" | "brain" | "resilience";

// Utility function to order report data
export const orderReportData = (reportData: ReportItem[]): ReportItem[] => {
  const sectionOrder = [
    "Life Stress Assessment",
    "Mental Health Screening",
    "Comprehensive Brain Health Biomarkers",
    "Resilience & Coping Mechanisms",
  ];

  return reportData.sort((a: ReportItem, b: ReportItem) => {
    const aIndex = sectionOrder.indexOf(a.section);
    const bIndex = sectionOrder.indexOf(b.section);

    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }

    // If same section, maintain original order (subsections)
    return 0;
  });
};



// Life Stress Assessment Page Generator
export const generateLifeStressAssessmentPage = ({
  pageNumber = 1,
  currentScore = 268,
  totalScore = 685,
  status = "Struggling",
}) => {
  // const theme = sectionThemes["Life Stress Assessment"];
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
    <div style="background-color:#F6DC6B8C; padding: 20px 32px; margin-bottom: 32px; border-radius: 12px;">
      <h1 style="font-size: 1.75rem; font-weight: bold; color: #1f2937; margin: 0;">
        ${pageNumber}. Life Event Stress Scale Analysis
      </h1>
    </div>

    <!-- Assessment Overview -->
    <div style="margin-bottom: 40px;padding: 24px; background-color:#F6DC6B26">
      <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Assessment Overview
      </h3>
      <p style="font-size: 0.875rem; line-height: 1.6; color: #374151; margin: 0;">
        The Holmes-Rahe Social Readjustment Rating Scale evaluates cumulative stress exposure over the past 12 months. This modified version includes contemporary digital age stressors and provides risk stratification for stress-related health complications.
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
          sections
        )}
      </div>
      
      <div style="flex: 1; padding-top: 20px;">
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
    <div style="background-color: #A4B56E26; padding: 24px; border-radius: 8px; margin-bottom: 32px;">
      <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Clinical Interpretation
      </h3>
      <p style="font-size: 0.875rem; line-height: 1.7; color: #374151; margin: 0;">
        The Life Event Stress Scale quantifies exposure to psychosocial stressors that may precipitate or exacerbate mental health conditions. Scores above 150 indicate clinically significant stress exposure requiring intervention. The assessment incorporates traditional life events (death, divorce, job loss) with modern digital stressors (techno-overload, AI displacement anxiety, social media comparison stress).
      </p>
    </div>

    <!-- Two columns: Clinical Significance and Recommended Interventions -->
    <div style="display: flex; gap: 40px;">
      <div style="flex: 1; background-color:#FEFAE9; padding: 20px; border-radius: 8px;">
        <h4 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1rem;">
          Clinical Significance:
        </h4>
        <div style="font-size: 0.875rem; line-height: 1.6; color: #374151;">
          <div style="margin-bottom: 12px;"><strong>Scores 0 - 149</strong> : Routine stress management interventions sufficient</div>
          <div style="margin-bottom: 12px;"><strong>Scores 150 - 249</strong> : Structured stress reduction therapy recommended</div>
          <div style="margin-bottom: 12px;"><strong>Scores 300+</strong> : Immediate stress management intervention with medical monitoring</div>
        </div>
      </div>

      <div style="flex: 1; background-color: #FEFAE9; padding: 20px; border-radius: 8px;">
        <h4 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1rem;">
          Recommended Interventions:
        </h4>
        <div style="font-size: 0.875rem; line-height: 1.6; color: #374151;">
          <div style="margin-bottom: 12px;"><strong>Low Risk</strong> : Preventive stress management education</div>
          <div style="margin-bottom: 12px;"><strong>Moderate Risk</strong> : Cognitive-behavioral stress management therapy</div>
          <div style="margin-bottom: 12px;"><strong>High Risk</strong> : Intensive stress reduction program with medical evaluation</div>
        </div>
      </div>
    </div>
  `;
};

// Mental Health Screening Page Generator
export const generateMentalHealthScreeningPage = ({
  pageNumber = 2,
  title = "Anxiety Disorders",
  currentScore = 9,
  totalScore = 25,
  percentageScore = 36,
  status = "Balancing",
}) => {
  const theme = { 
    headerBg: "#dbeafe", 
    primaryBg: "#f3f4f6" 
  };
  
  const sections = [
    { label: "Thriving", percentage: 20, color: "#fef3c7", range: "0-20%" },
    { label: "Balancing", percentage: 20, color: "#e0e7ff", range: "21-40%" },
    { label: "Surviving", percentage: 20, color: "#fed7aa", range: "41-60%" },
    { label: "Struggling", percentage: 20, color: "#fecaca", range: "61-80%" },
    { label: "Crisis", percentage: 20, color: "#fca5a5", range: "81-100%" },
  ];

  return `
    <!-- Header -->
    <div style="background-color: ${theme.headerBg}; padding: 20px 32px; margin-bottom: 32px; border-radius: 12px;">
      <h1 style="font-size: 1.75rem; font-weight: bold; color: #1f2937; margin: 0;">
        ${pageNumber}. ${title}
      </h1>
    </div>

    <!-- Assessment Overview -->
    <div style="margin-bottom: 40px;">
      <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Assessment Overview
      </h3>
      <p style="font-size: 0.875rem; line-height: 1.6; color: #374151; margin: 0;">
        Five-item screening tool evaluating generalized anxiety symptoms, panic responses, avoidance behaviors, and functional impairment consistent with DSM-5 anxiety disorder criteria.
      </p>
    </div>

    <!-- Scoring Results -->
    <div style="margin-bottom: 40px;">
      <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Scoring Results
      </h3>
      ${generateLinearChart(currentScore, totalScore, percentageScore, status, sections)}
    </div>

    <!-- Clinical Interpretation -->
    <div style="background-color: #fef7ed; padding: 24px; border-radius: 8px; margin-bottom: 32px;">
      <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Clinical Interpretation
      </h3>
      <p style="font-size: 0.875rem; line-height: 1.7; color: #374151; margin: 0;">
        This screening assesses core anxiety symptoms including excessive worry, physical symptoms, avoidance behaviours, and functional impairment. Scores above 50% suggest clinically significant anxiety requiring professional intervention. The assessment evaluates both psychological and somatic manifestations of anxiety disorders.
      </p>
    </div>

    <!-- Two columns: Clinical Significance and Recommended Interventions -->
    <div style="display: flex; gap: 40px;">
      <div style="flex: 1; background-color: ${theme.primaryBg}; padding: 20px; border-radius: 8px;">
        <h4 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1rem;">
          Clinical Significance:
        </h4>
        <div style="font-size: 0.875rem; line-height: 1.6; color: #374151;">
          <div style="margin-bottom: 12px;"><strong>• Generalized Anxiety Disorder (GAD)</strong></div>
          <div style="margin-bottom: 12px;"><strong>• Panic Disorder</strong></div>
          <div style="margin-bottom: 12px;"><strong>• Social Anxiety Disorder</strong></div>
          <div style="margin-bottom: 12px;"><strong>• Specific Phobias</strong></div>
        </div>
      </div>
      
      <div style="flex: 1; background-color: ${theme.primaryBg}; padding: 20px; border-radius: 8px;">
        <h4 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1rem;">
          Recommended Interventions:
        </h4>
        <div style="font-size: 0.875rem; line-height: 1.6; color: #374151;">
          <div style="margin-bottom: 12px;"><strong>• 0-25%:</strong> Psychoeducation and wellness interventions.</div>
          <div style="margin-bottom: 12px;"><strong>• 26-50%:</strong> Cognitive-behavioral therapy (CBT) or mindfulness-based interventions.</div>
          <div style="margin-bottom: 12px;"><strong>• 51-75%:</strong> Structured psychotherapy with possible medication evaluation.</div>
          <div style="margin-bottom: 12px;"><strong>• 76-100%:</strong> Immediate psychiatric evaluation for medication management.</div>
        </div>
      </div>
    </div>
  `;
};

// Comprehensive Brain Health Biomarkers Page Generator
export const generateBrainHealthBiomarkersPage = ({
  pageNumber = 3,
  title = "",
  currentScore = 75,
  totalScore = 120,
  status = "Good",
}) => {
  const theme = sectionThemes["Comprehensive Brain Health Biomarkers"];
  const sections = [
    { label: "Excellent", percentage: 15, color: "#dcfce7", range: "(90-120)" },
    { label: "Good", percentage: 35, color: "#fef3c7", range: "(70-89)" },
    { label: "Fair", percentage: 30, color: "#fed7aa", range: "(50-69)" },
    { label: "Poor", percentage: 20, color: "#fecaca", range: "(0-49)" },
  ];

  const statusColor =
    sections.find(
      (section) => section.label.toLowerCase() === status.toLowerCase()
    )?.color || "#000";

  return `
    <!-- Header -->
    <div style="background-color: ${
      theme.headerBg
    }; padding: 20px 32px; margin-bottom: 32px; border-radius: 12px;">
      <h1 style="font-size: 1.75rem; font-weight: bold; color: #1f2937; margin: 0;">
        ${pageNumber}. ${title}
      </h1>
    </div>

    <!-- Assessment Overview -->
    <div style="margin-bottom: 40px;">
      <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Assessment Overview
      </h3>
      <p style="font-size: 0.875rem; line-height: 1.6; color: #374151; margin: 0;">
        Comprehensive evaluation of brain health indicators including cognitive function, neurological markers, lifestyle factors, and biochemical indicators that influence overall brain health and cognitive performance.
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
          sections
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
                <span style="font-size: 0.875rem; color: #6b7280; font-weight: 500;">${section.range}</span>
              </div>
        `
          )
          .join("")}
      </div>
    </div>

    <!-- Clinical Interpretation -->
    <div style="background-color: #f3f4f6; padding: 24px; border-radius: 8px; margin-bottom: 32px;">
      <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Clinical Interpretation
      </h3>
      <p style="font-size: 0.875rem; line-height: 1.7; color: #374151; margin: 0;">
        Brain health biomarkers provide insights into cognitive function, neural efficiency, and brain aging processes. These metrics help identify areas for optimization and potential risks for cognitive decline.
      </p>
    </div>

    <!-- Two columns: Clinical Significance and Recommended Interventions -->
    <div style="display: flex; gap: 40px;">
      <div style="flex: 1; background-color: ${
        theme.primaryBg
      }; padding: 20px; border-radius: 8px;">
        <h4 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1rem;">
          Clinical Significance:
        </h4>
        <div style="font-size: 0.875rem; line-height: 1.6; color: #374151;">
          <div style="margin-bottom: 12px;"><strong>Excellent (90-120)</strong> : Optimal brain health indicators</div>
          <div style="margin-bottom: 12px;"><strong>Good (70-89)</strong> : Healthy brain function with room for improvement</div>
          <div style="margin-bottom: 12px;"><strong>Fair-Poor (0-69)</strong> : Areas requiring attention and intervention</div>
        </div>
      </div>
      
      <div style="flex: 1; background-color: ${
        theme.primaryBg
      }; padding: 20px; border-radius: 8px;">
        <h4 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1rem;">
          Optimization Strategies:
        </h4>
        <div style="font-size: 0.875rem; line-height: 1.6; color: #374151;">
          <div style="margin-bottom: 12px;"><strong>Lifestyle</strong> : Exercise, nutrition, and sleep optimization</div>
          <div style="margin-bottom: 12px;"><strong>Cognitive</strong> : Brain training and mental stimulation</div>
          <div style="margin-bottom: 12px;"><strong>Medical</strong> : Targeted interventions and monitoring</div>
        </div>
      </div>
    </div>
  `;
};

// Resilience & Coping Mechanisms Page Generator
export const generateResilienceCopingPage = ({
  pageNumber = 4,
  title = "",
  currentScore = 85,
  totalScore = 100,
  status = "Strong",
}) => {
  const theme = sectionThemes["Resilience & Coping Mechanisms"];
  const sections = [
    { label: "Strong", percentage: 25, color: "#dcfce7", range: "(80-100)" },
    { label: "Moderate", percentage: 35, color: "#fef3c7", range: "(60-79)" },
    { label: "Developing", percentage: 25, color: "#fed7aa", range: "(40-59)" },
    { label: "Limited", percentage: 15, color: "#fecaca", range: "(0-39)" },
  ];
  const statusColor =
    sections.find(
      (section) => section.label.toLowerCase() === status.toLowerCase()
    )?.color || "#000";

  return `
    <!-- Header -->
    <div style="background-color: ${
      theme.headerBg
    }; padding: 20px 32px; margin-bottom: 32px; border-radius: 12px;">
      <h1 style="font-size: 1.75rem; font-weight: bold; color: #1f2937; margin: 0;">
        ${pageNumber}. ${title}
      </h1>
    </div>

    <!-- Assessment Overview -->
    <div style="margin-bottom: 40px;">
      <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Assessment Overview
      </h3>
      <p style="font-size: 0.875rem; line-height: 1.6; color: #374151; margin: 0;">
        Evaluation of psychological resilience, stress management capabilities, adaptive coping strategies, and emotional regulation skills. This assessment measures your ability to bounce back from challenges and maintain mental well-being.
      </p>
    </div>

    <!-- Chart and Reference Ranges -->
    <div style="display: flex; align-items: flex-start; margin-bottom: 40px; gap: 60px;">
      <div style="flex: 1;">
        ${generateDonutChart(currentScore, totalScore, status,statusColor, sections, )}
      </div>
      
      <div style="flex: 1; padding-top: 20px;">
        <div style="text-align: right; margin-bottom: 20px;">
          <span style="font-size: 0.875rem; font-weight: 600; color: #1f2937;">Resilience Levels</span>
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
    <div style="background-color: #f3f4f6; padding: 24px; border-radius: 8px; margin-bottom: 32px;">
      <h3 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1.125rem;">
        Clinical Interpretation
      </h3>
      <p style="font-size: 0.875rem; line-height: 1.7; color: #374151; margin: 0;">
        Resilience assessment measures your capacity to adapt to adversity, trauma, tragedy, threats, or significant stress. Higher scores indicate better emotional regulation, problem-solving skills, and stress management capabilities.
      </p>
    </div>

    <!-- Two columns: Clinical Significance and Recommended Interventions -->
    <div style="display: flex; gap: 40px;">
      <div style="flex: 1; background-color: ${
        theme.primaryBg
      }; padding: 20px; border-radius: 8px;">
        <h4 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1rem;">
          Clinical Significance:
        </h4>
        <div style="font-size: 0.875rem; line-height: 1.6; color: #374151;">
          <div style="margin-bottom: 12px;"><strong>Strong (80-100)</strong> : Excellent adaptive capacity and coping skills</div>
          <div style="margin-bottom: 12px;"><strong>Moderate (60-79)</strong> : Good resilience with areas for growth</div>
          <div style="margin-bottom: 12px;"><strong>Developing-Limited (0-59)</strong> : Resilience building recommended</div>
        </div>
      </div>
      
      <div style="flex: 1; background-color: ${
        theme.primaryBg
      }; padding: 20px; border-radius: 8px;">
        <h4 style="font-weight: bold; margin-bottom: 16px; color: #1f2937; font-size: 1rem;">
          Enhancement Strategies:
        </h4>
        <div style="font-size: 0.875rem; line-height: 1.6; color: #374151;">
          <div style="margin-bottom: 12px;"><strong>Emotional</strong> : Mindfulness and emotional regulation training</div>
          <div style="margin-bottom: 12px;"><strong>Cognitive</strong> : Problem-solving and reframing techniques</div>
          <div style="margin-bottom: 12px;"><strong>Social</strong> : Support network building and communication skills</div>
        </div>
      </div>
    </div>
  `;
};

// Main function to generate appropriate page based on section
export const generateAssessmentPageBySection = (
  reportItem: ReportItem,
  pageNumber: number
): string => {
  const { section, title, totalScore } = reportItem;

  switch (section) {
    case "Life Stress Assessment":
      return generateLifeStressAssessmentPage({
        pageNumber,
        currentScore: totalScore,
        totalScore: 685, // You can adjust this based on your needs
        status: getStatusByScore(totalScore, "stress"), // Helper function to determine status
      });

    case "Mental Health Screening":
      return generateMentalHealthScreeningPage({
        pageNumber,
        title,
        currentScore: totalScore,
        totalScore: 100,
        status: getStatusByScore(totalScore, "mental"),
      });

    case "Comprehensive Brain Health Biomarkers":
      return generateBrainHealthBiomarkersPage({
        pageNumber,
        title,
        currentScore: totalScore,
        totalScore: 120,
        status: getStatusByScore(totalScore, "brain"),
      });

    case "Resilience & Coping Mechanisms":
      return generateResilienceCopingPage({
        pageNumber,
        title,
        currentScore: totalScore,
        totalScore: 100,
        status: getStatusByScore(totalScore, "resilience"),
      });

    default:
      // Fallback to Life Stress Assessment format
      return generateLifeStressAssessmentPage({
        pageNumber,
        currentScore: totalScore,
        totalScore: 685,
        status: "Unknown",
      });
  }
};

// Helper function to determine status based on score and type
const getStatusByScore = (score: number, type: ScoreType): string => {
  switch (type) {
    case "stress":
      if (score <= 100) return "Thriving";
      if (score <= 149) return "Balancing";
      if (score <= 249) return "Surviving";
      if (score <= 299) return "Struggling";
      return "Crisis";

    case "mental":
      if (score <= 25) return "No Risk";
      if (score <= 50) return "Low Risk";
      if (score <= 75) return "Moderate Risk";
      return "High Risk";

    case "brain":
      if (score >= 90) return "Excellent";
      if (score >= 70) return "Good";
      if (score >= 50) return "Fair";
      return "Poor";

    case "resilience":
      if (score >= 80) return "Strong";
      if (score >= 60) return "Moderate";
      if (score >= 40) return "Developing";
      return "Limited";

    default:
      return "Unknown";
  }
};
