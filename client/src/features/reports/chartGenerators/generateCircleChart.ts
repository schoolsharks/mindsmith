
interface CircleChartProps {
  status: string;
  statusColor: string;
}

export const generateCircleChart = ({
  status,
  statusColor,
}: CircleChartProps) => {
  const staticCircles = [
    {
      label: "Thriving",
      range: "0-21%",
      color: "#F6DC6B80",
      position: { top: "47%", left: "0%" },
    },
    {
      label: "Crisis",
      range: "81-100%",
      color: "#FF878980",
      position: { top: "47%", right: "0%" },
    },
    {
      label: "Balancing",
      range: "21-40%",
      color: "#9183FF80",
      position: { bottom: "2%", left: "13%" },
    },
    {
      label: "Struggling",
      range: "61-80%",
      color: "#A4B56E80",
      position: { bottom: "2%", right: "13%" },
    },
    {
      label: "Surviving",
      range: "41-60%",
      color: "#FFD6ED80",
      position: { bottom: "-7%", left: "50%", transform: "translateX(-50%)" },
    },
  ];

  const convertPositionToCSS = (position: any) => {
    return Object.entries(position)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  };

  return `
    <div style="display: flex; justify-content: center; align-items: center; font-family: Arial, sans-serif;">
      <div style="position: relative; width: 400px; height: 350px;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 200px; border-radius: 50%; background-color: ${statusColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          <span style="font-size: 1.75rem; font-weight: bold; color: #2D3748; text-align: center;">
            ${status}
          </span>
        </div>

        ${staticCircles.map(
          (circle) =>
            `<div style="position: absolute; width: 90px; height: 90px; border-radius: 50%; background-color: ${circle.color}; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);  ${convertPositionToCSS(circle.position)}">
              <div style="font-size: 0.75rem; font-weight: 600; color: #2D3748; text-align: center; line-height: 1.1; margin-bottom: 2px;">
                ${circle.label}
              </div>
              <div style="font-size: 0.65rem; color: #4A5568; text-align: center; font-weight: 500;">
                ${circle.range}
              </div>
            </div>`
        ).join("")}
      </div>
    </div>
  `;
};
