interface ChartSection {
  label: string;
  percentage: number;
  color: string;
  range: string;
}

export const generateDonutChart = (
  currentScore: number,
  totalScore: number,
  status: string,
  statusColor: string,
  sections: ChartSection[],
  mode: "score" | "percentage" = "score"
): string => {
  const radius = 110;
  const innerRadius = 70;
  let cumulativePercentage = 0;

  const generatePath = (section: ChartSection): string => {
    const startAngle = (cumulativePercentage / 100) * 360 - 90;
    const endAngle =
      ((cumulativePercentage + section.percentage) / 100) * 360 - 90;

    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const outerX1 = 120 + radius * Math.cos(startAngleRad);
    const outerY1 = 120 + radius * Math.sin(startAngleRad);
    const outerX2 = 120 + radius * Math.cos(endAngleRad);
    const outerY2 = 120 + radius * Math.sin(endAngleRad);

    const innerX1 = 120 + innerRadius * Math.cos(startAngleRad);
    const innerY1 = 120 + innerRadius * Math.sin(startAngleRad);
    const innerX2 = 120 + innerRadius * Math.cos(endAngleRad);
    const innerY2 = 120 + innerRadius * Math.sin(endAngleRad);

    const largeArcFlag = section.percentage > 50 ? 1 : 0;

    const pathData = [
      `M ${outerX1} ${outerY1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${outerX2} ${outerY2}`,
      `L ${innerX2} ${innerY2}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1}`,
      `Z`,
    ].join(" ");

    cumulativePercentage += section.percentage;

    return `<path d="${pathData}" fill="${section.color}" stroke="white" stroke-width="1"/>`;
  };

  const paths = sections.map(generatePath).join("");

  return `
    <div style="display: flex; justify-content: center; align-items: center;">
      <div style="position: relative; width: 240px; height: 240px;">
        <svg width="240" height="240" viewBox="0 0 240 240">
          ${paths}
        </svg>
        
        <!-- Center content -->
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
        ${
          mode === "score"
            ? `<div style="font-size: 28px; font-weight: bold; color: #000; line-height: 1;">${currentScore}</div>`
            : `<div style="font-size: 28px; font-weight: bold; color: #000; line-height: 1;">${(
                (currentScore * 100) /
                totalScore
              ).toFixed(1)}%</div>`
        }
        </div>
      
        
        <!-- Status badge -->
        <div style="position: absolute; bottom: -17px; left: 50%; transform: translateX(-50%); 
                    background-color: ${statusColor}; padding: 8px 16px; border-radius: 20px; 
                    border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          <span style="font-weight: 700; color: #000; font-size: 28px;">${status}</span>
        </div>
      </div>
    </div>
  `;
};
