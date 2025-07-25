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
  sections: ChartSection[]
): string => {
const chartWidth: number = 600;
  const chartHeight = 40;

  // Gradient construction
  const gradientStops = sections.map((s, i) => {
    const start = sections.slice(0, i).reduce((acc, val) => acc + val.percentage, 0);
    return `${s.color} ${start}%, ${s.color} ${start + s.percentage}%`;
  }).join(', ');

  const indicatorPosition = (percentageScore / 100) * chartWidth;

  return `
    <div style="margin: 24px 0; width: 100%; font-family: sans-serif;">
      <!-- Score Summary -->
      <div style="background-color: #e0e7ff; padding: 12px 20px; border-radius: 8px; text-align: center; margin-bottom: 16px;">
        <div style="font-size: 1.125rem; font-weight: 600; color: #1f2937;">Raw score - ${currentScore}/${totalScore} points</div>
        <div style="font-size: 1rem; color: #1f2937;">Percentage score - ${percentageScore}%</div>
      </div>

      <!-- Status Badge -->
      <div style="text-align: center; margin-bottom: 16px;">
        <span style="display: inline-block; background-color: #c7d2fe; padding: 6px 20px; border-radius: 9999px; font-weight: 600; color: #1f2937;">${status}</span>
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
          ${sections.map((section, index) => {
            const left = sections.slice(0, index).reduce((sum, s) => sum + s.percentage, 0);
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
          }).join('')}
        </div>

        <!-- Labels Below -->
        <div style="
          position: relative;
          font-size: 0.75rem;
          color: #374151;
          margin-top: 20px;
          height: 16px;
        ">
          ${sections.map((section, index) => {
            const left = sections.slice(0, index).reduce((sum, s) => sum + s.percentage, 0);
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
          }).join('')}
        </div>
      </div>
    </div>
  `;
};
