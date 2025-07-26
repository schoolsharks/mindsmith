// import { generateCoverPage } from "./pageGenerators/coverPage.js";
import {
  orderReportData,
  generateAssessmentPageBySection,
} from "./pageGenerators/assessmentPage.js";

export interface ReportPage {
  section: string;
  title: string;
  totalScore: number;
  pageName?: string;
  assessmentOverview: string;
  clinicalInterpretation: string;
  considerations: string[];
  recommendations: string[];
  _id?: string;
}
// Main HTML generation function
export const generateReportHTML = (reportData: ReportPage[]) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Psychological Assessment Report</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        body { 
          margin: 0; 
          padding: 0; 
          font-family: Arial, sans-serif; 
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .report-page {
          width: 210mm;
          height: 297mm;
          padding: 8mm;
          margin: 0;
          background: #f8f9fa;
          box-sizing: border-box;
          break-after: page;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
        }
        
        .report-page:last-child {
          break-after: auto;
        }
        
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .report-page {
            margin: 0;
            box-shadow: none;
            break-after: page;
          }
          
          .report-page:last-child {
            break-after: auto;
          }
          
          @page {
            margin: 0;
            size: A4;
          }
        }
      </style>
    </head>
    <body>
    
      
      <!-- Assessment Pages -->
      ${orderReportData(reportData)
        .map(
          (report: ReportPage, index: number) =>
            `<div class="report-page">
            ${generateAssessmentPageBySection(report, index + 1)}
          </div>`
        )
        .join("")}
    </body>
    </html>
  `;
};
