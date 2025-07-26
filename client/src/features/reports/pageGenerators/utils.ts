export type ScoreType = "stress" | "mental" | "brain" | "resilience";

// Helper function to determine status based on score and type
export const getStatusByScore = (score: number, type: ScoreType): string => {
  switch (type) {
    case "stress":
      if (score <= 100) return "Thriving";
      if (score <= 149) return "Balancing";
      if (score <= 249) return "Surviving";
      if (score <= 299) return "Struggling";
      return "Crisis";

    case "mental":
      if (score <= 20) return "Thriving";
      if (score <= 40) return "Balancing";
      if (score <= 60) return "Surviving";
      if (score <= 80) return "Struggling";
      return "Crisis";

    case "brain":
      if (score <= 20) return "Thriving";
      if (score <= 40) return "Balancing";
      if (score <= 60) return "Surviving";
      if (score <= 80) return "Struggling";
      return "Crisis";

    case "resilience":
      if (score <= 20) return "Thriving";
      if (score <= 40) return "Balancing";
      if (score <= 60) return "Surviving";
      if (score <= 80) return "Struggling";
      return "Crisis";

    default:
      return "Unknown";
  }
};

export const ranges = [
  {
    label: "Thriving",
    percentage: 8,
    color: "#F6DC6B80",
    percentageRange: "0-20%",
    range: "(0-100)",
  },
  {
    label: "Balancing",
    percentage: 25,
    color: "#9183FF80",
    percentageRange: "21-40%",
    range: "(101-149)",
  },
  {
    label: "Surviving",
    percentage: 25,
    color: "#FFD6ED80",
    percentageRange: "41-60%",
    range: "(150-249)",
  },
  {
    label: "Struggling",
    percentage: 32,
    color: "#A4B56E80",
    percentageRange: "61-80%",
    range: "(250-299)",
  },
  {
    label: "Crisis",
    percentage: 10,
    color: "#FF878980",
    percentageRange: "81-100%",
    range: "(300+)",
  },
];
