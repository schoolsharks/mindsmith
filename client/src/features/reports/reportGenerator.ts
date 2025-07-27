// import { generateCoverPage } from "./pageGenerators/coverPage.js";
import { generateAllSectionsOverviewPage } from "./pageGenerators/allSectionsOverview.js";
import {
  orderReportData,
  generateAssessmentPageBySection,
} from "./pageGenerators/assessmentPage.js";
import { generateCoverPage } from "./pageGenerators/coverPage.js";

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

export interface UserInfo {
  _id: string;
  name: string;
  createdAt: string;
}
// Main HTML generation function
export const generateReportHTML = (
  reportData: ReportPage[],
  userInfo: UserInfo
) => {
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
    
      
      <!-- Cover Page -->
      <div class="report-page">
        ${generateCoverPage({
          reportId: userInfo._id,
          assessmentDate: new Date(userInfo.createdAt).toLocaleDateString(),
          patientName: userInfo.name,
          age: 30,
          gender: "Male",
          referringPhysician: "Dr. Smith",
        })}</div>
      

      <!-- Life Stress Assessment Page-->
      <div class="report-page">
        ${generateAssessmentPageBySection(orderReportData(reportData)[0], 1)}
      </div>


      <!-- All Sections Overview Page -->
      <div class="report-page">
        ${generateAllSectionsOverviewPage(reportData.slice(1))}
      </div>


      <!-- Assessment Pages -->
      ${orderReportData(reportData)
        .slice(1)
        .map(
          (report: ReportPage, index: number) =>
            `<div class="report-page">
            ${generateAssessmentPageBySection(report, index + 2)}
          </div>`
        )
        .join("")}
    </body>
    </html>
  `;
};
