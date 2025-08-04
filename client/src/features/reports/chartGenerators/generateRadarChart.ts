interface RadarDataPoint {
  name: string;
  value: number;
}

// Mapping from long category names to short display labels
const categoryNameMapping: Record<string, string> = {
  "Anxiety Disorders": "Anxiety",
  "Trauma- and Stressor-Related Disorders": "Trauma & Stress",
  "Neurocognitive Disorders": "Neurocognitive",
  "Mood Disorders": "Mood",
  "Dissociative Disorders": "Dissociative",
  "Substance-Related and Addictive Disorders": "Addiction",
  "Neurodevelopmental Disorders": "Neurodevelopmental",
  "Somatic Symptom and Related Disorders": "Somatic",
  "Gender Dysphoria": "Gender",
  "Schizophrenia Spectrum and Other Psychotic Disorders": "Psychotic",
  "Disruptive, Impulse-Control, and Conduct Disorders": "Disruptive, compulsive & conduct",
  "Sleep-Wake Disorders": "Sleep",
  "Obsessive-Compulsive and Related Disorders": "OCD",
  "Sexual Dysfunctions": "Sexual",
  "Feeding and Eating Disorders": "Feeding & eating",
  "Functional Biomarkers": "Functional",
  "Emotional & Mental Health Biomarkers": "Emotional & Mental",
  "Lifestyle Biomarkers": "Lifestyle",
  "Medical & Laboratory Biomarkers": "Medical & Lab",
  "Physical & Neurological Biomarkers": "Physical & Neuro",
  "Cognitive Biomarkers": "Cognitive",
  "Stress Management & Adaptation": "Stress Management",
  "Executive Function & Decision Making": "Executive Function",
  "Memory & Attention": "Memory & Attention"
};

export const generateRadarChart = (data?: RadarDataPoint[]): string => {

  console.log("Radar Data",data)
  const defaultData: RadarDataPoint[] = [
    { name: "Anxiety", value: 25 },
    { name: "Neurocognitive", value: 40 },
    { name: "Addiction", value: 15 }, 
    { name: "Disruptive, compulsive & conduct", value: 30 },
    { name: "Gender", value: 20 },
    { name: "Sexual", value: 35 },
    { name: "Sleep", value: 45 },
    { name: "Feeding & eating", value: 25 },
    { name: "Somatic", value: 30 },
    { name: "Dissociative", value: 20 },
    { name: "Trauma & Stress", value: 40 },
    { name: "OCD", value: 35 },
    { name: "Psychotic", value: 15 },
    { name: "Neurodevelopmental", value: 25 },
    { name: "Mood", value: 50 },
  ];

  // Transform data to use short labels
  const transformedData = data && data.length > 0 
    ? data.map(item => ({
        ...item,
        name: categoryNameMapping[item.name] || item.name
      }))
    : defaultData;

  const chartData = transformedData;
  const colors = [
    "#A4B56E",
    "#F56200",
    "#FFA1A2",
    "#F6DC6B",
    "#FF57B5",
    "#F4A1FF",
    "#CFE098",
    "#A8FFAB",
    "#FF9494",
    "#F4C1DD",
    "#A4DBFF",
    "#AF9EFF",
    "#FFD1B2",
    "#A8FFAB",
    "#F8BBD9",
  ];

  const size = 400;
  const center = size / 2;
  const maxRadius = 180;
  const numLevels = 5;
  const numPoints = chartData.length;
  const angleStep = 360 / numPoints;

  let gridCircles = "";
  for (let i = 1; i <= numLevels; i++) {
    const radius = (maxRadius * i) / numLevels;
    gridCircles += `
      <div style="
        position: absolute;
        width: ${radius * 2}px;
        height: ${radius * 2}px;
        border: 1px solid #e0e0e0;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.5;
      "></div>
    `;
  }

  let gridLines = "";
  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleStep - 90;
    gridLines += `
      <div style="
        position: absolute;
        width: 1px;
        height: ${maxRadius}px;
        background-color: #e0e0e0;
        top: 50%;
        left: 50%;
        transform-origin: bottom center;
        transform: translate(-50%, -100%) rotate(${angle}deg);
        opacity: 0.5;
      "></div>
    `;
  }

  let dataPoints = "";
  let polygonPath = "";
  let svgPolygonPoints = "";
  
  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleStep - 90;
    const radius = (chartData[i].value / 100) * maxRadius;
    const angleRad = (angle * Math.PI) / 180;
    const x = center + radius * Math.cos(angleRad);
    const y = center + radius * Math.sin(angleRad);
    const color = colors[i % colors.length];

    const xPercent = (x / size) * 100;
    const yPercent = (y / size) * 100;

    // For CSS clip-path (legacy support)
    if (i === 0) {
      polygonPath = `${xPercent}% ${yPercent}%`;
    } else {
      polygonPath += `, ${xPercent}% ${yPercent}%`;
    }

    // For SVG polygon points
    if (i === 0) {
      svgPolygonPoints = `${x},${y}`;
    } else {
      svgPolygonPoints += ` ${x},${y}`;
    }

    dataPoints += `
      <div style="
        position: absolute;
        width: 8px;
        height: 8px;
        background-color: ${color};
        border-radius: 50%;
        top: ${yPercent}%;
        left: ${xPercent}%;
        transform: translate(-50%, -50%);
        z-index: 3;
      "></div>
    `;
  }

  let labels = "";
  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleStep - 90;
    const labelRadius = maxRadius + 35;
    const angleRad = (angle * Math.PI) / 180;
    const x = center + labelRadius * Math.cos(angleRad);
    const y = center + labelRadius * Math.sin(angleRad);
    const color = colors[i % colors.length];

    const xPercent = (x / size) * 100;
    const yPercent = (y / size) * 100;

    let textAlign = "center";
    let transform = "translate(-50%, -50%)";
    if (x > center + 10) {
      textAlign = "left";
      transform = "translate(0, -50%)";
    } else if (x < center - 10) {
      textAlign = "right";
      transform = "translate(-100%, -50%)";
    }

    labels += `
      <div style="
        position: absolute;
        top: ${yPercent}%;
        left: ${xPercent}%;
        transform: ${transform};
        color: ${color};
        font-family: Arial, sans-serif;
        font-size: 12px;
        font-weight: 500;
        text-align: ${textAlign};
        max-width:80px;
        z-index: 4;
      ">${chartData[i].name}</div>
    `;
  }

  // Generate legend chips in table format for PDF compatibility
  let legendChips = "";
  const itemsPerColumn = Math.ceil(numPoints / 3);
  
  // Create table structure
  legendChips = `
    <table style="
      width: 100%;
      max-width: 600px;
      border-collapse: collapse;
      margin: 0 auto;
    ">
      <tr>
  `;
  
  // Create 3 columns
  for (let col = 0; col < 3; col++) {
    legendChips += `
      <td style="
        vertical-align: top;
        width: 33.33%;
        padding: 0 8px;
      ">
    `;
    
    // Add items for this column
    for (let row = 0; row < itemsPerColumn; row++) {
      const index = col * itemsPerColumn + row;
      if (index < numPoints) {
        const color = colors[index % colors.length];
        const value = Math.round(chartData[index].value);
        
        legendChips += `
        <div style="width:100%">
          <div style="
            display: inline-flex;
            align-items: center;
            background-color: ${color}80;
            color:#000;
            padding: 6px 12px;
            border-radius: 20px;
            margin: 4px 0;
            font-family: Arial, sans-serif;
            font-size: 11px;
            font-weight: 500;
            white-space: nowrap;
            width: max-content;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          ">${chartData[index].name} - ${value}%</div>
          </div>
        `;
      }
    }
    
    legendChips += `</td>`;
  }
  
  legendChips += `
      </tr>
    </table>
  `;

  return `
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;  padding: 20px; box-sizing: border-box;">
      <div style="border-radius: 8px; padding: 24px;">
        <div style="
          position: relative;
          width: ${size}px;
          height: ${size}px;
          margin: 0 auto;
        ">
          <!-- Grid circles -->
          ${gridCircles}
          
          <!-- Grid lines -->
          ${gridLines}
          
          <!-- Data polygon using SVG (PDF compatible) -->
          <svg style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
          ">
            <polygon 
              points="${svgPolygonPoints}" 
              fill="#F50000"
              opacity="0.4"
            />
          </svg>
          
          <!-- Data points and lines -->
          ${dataPoints}
          
          <!-- Center point -->
          <div style="
            position: absolute;
            width: 6px;
            height: 6px;
            background-color: #333;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 3;
          "></div>
          
          <!-- Labels -->
          ${labels}
        </div>
      </div>
      
      <!-- Legend chips -->
      <div style="
        width: 100%;
        margin-top: 20px;
      ">
        ${legendChips}
      </div>
    </div>
  `;
};
