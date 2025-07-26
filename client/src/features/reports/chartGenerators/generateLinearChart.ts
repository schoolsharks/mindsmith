interface ChartSection {
  color: string;
  percentage: number;
  range: string;
  label: string;
}

export const generateLinearChart = (
  currentScore: number,
  totalScore: number,
  percentageScore: number,
  status: string,
  sections: ChartSection[],
  statusColor: string
): string => {
  const chartWidth: number = 600;
  const chartHeight = 40;

  // Gradient construction - create smooth color transitions
  // const gradientStops = sections.map((s, i) => {
  //   const position = sections.slice(0, i + 1).reduce((acc, val) => acc + val.percentage, 0);
  //   return `${s.color} ${position}%`;
  // }).join(', ');

  const gradientStops = sections.map((s) => s.color).join(", ");

  const indicatorPosition = (percentageScore / 100) * chartWidth;

  return `
    <div style="margin: 0 0 24px; width: 100%; font-family: sans-serif;">
      <!-- Score Summary -->

      <div style="display:flex; justify-content:space-between;align-items: center; margin-bottom: 16px;">
        <div>
          <div style="font-size: 18px; font-weight: 500;">Raw score - ${currentScore}/${totalScore} points</div>
          <div style="font-size: 18px;">Percentage score - ${percentageScore}%</div>
        </div>
        <div style="text-align: center; margin-bottom: 16px;">
        <span style="display: inline-block; font-size:25px;font-weight:600; background-color: ${statusColor}; padding: 6px 40px; border-radius: 5px;">${status}</span>
      </div>
      </div>
      
      <!-- Chart Area -->
      <div style="position: relative; width: ${chartWidth}px; margin: 0 auto;">
        <!-- Gradient Bar -->
        <div style="
          height: ${chartHeight}px;
          width: 100%;
          background: linear-gradient(to right, ${gradientStops});
          position: relative;
        "></div>

        <!-- Indicator Line -->
        <div style="
          position: absolute;
          top: -6px;
          left: ${indicatorPosition}px;
          width: 3px;
          height: ${chartHeight + 12}px;
          background-color: black;
          transform: translateX(-50%);
        "></div>

        <!-- Range Markers Above -->
        <div style="
          position: relative;
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 6px;
          height: 16px;
        ">
          ${sections
            .map((section, index) => {
              const left = sections
                .slice(0, index)
                .reduce((sum, s) => sum + s.percentage, 0);
              const width = section.percentage;
              return `
              <div style="
                position: absolute;
                left: ${(left / 100) * chartWidth}px;
                width: ${(width / 100) * chartWidth}px;
                text-align: center;
              ">
                ${section.range}
              </div>
            `;
            })
            .join("")}
        </div>

        <!-- Labels Below -->
        <div style="
          position: relative;
          font-size: 0.75rem;
          color: #374151;
          margin-top: 20px;
          height: 16px;
        ">
          ${sections
            .map((section, index) => {
              const left = sections
                .slice(0, index)
                .reduce((sum, s) => sum + s.percentage, 0);
              const width = section.percentage;
              return `
              <div style="
                position: absolute;
                left: ${(left / 100) * chartWidth}px;
                width: ${(width / 100) * chartWidth}px;
                text-align: center;
                font-weight: 500;
              ">
                ${section.label}
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    </div>
  `;
};
