import mindsmithLogo from "../../../assets/images/mindsmith-logo.webp";
import bgGraphic from "../../../assets/images/report-cover-bg-graphic.webp"
interface BrainHealthReportParams {
  reportId: string;
  assessmentDate: string;
  patientName: string;
  age: number;
  gender: string;
  referringPhysician: string;
}

export const generateCoverPage = (params: BrainHealthReportParams): string => {
  const {
    reportId,
    assessmentDate,
    patientName,
    age,
    gender,
    referringPhysician,
  } = params;

  return `
<div style="margin: 0 auto;display:flex;flex-direction:column;height:100%; background-color: white; border: 2px solid #666; box-shadow: 0 4px 8px rgba(0,0,0,0.1); font-family: Arial, sans-serif;">
    <!-- Main Content Area -->
    <div style="display: flex; min-height: 500px;flex:1; ">
        <!-- Logo Column -->
        <div style="width: 200px; display: flex; padding: 40px; background-color: #f8f9fa; border-right: 1px solid #ddd;">
            <img src="${mindsmithLogo}" alt="MindSmith Health Logo" style="width: 120px; height: 120px; border-radius: 50%;">
        </div>
        
        <!-- Content Column -->
        <div style="flex: 1; padding: 40px; display: flex; flex-direction: column; position:relative;">
            <img src="${bgGraphic}" style="position:absolute; bottom:0; left:0; width:100%;"/>
            <!-- Title Section -->
            <div style="margin-bottom: 60px;">
                <h1 style="font-size: 32px; font-weight: bold; color: #333; margin: 0 0 5px 0;">Brain Health Profile</h1>
                <h2 style="font-size: 24px; font-weight: normal; color: #666; margin: 0;">Assessment Report</h2>
            </div>
            
            <!-- Report Data Section -->
            <div style="margin-bottom: 60px;">
                <div style="display: flex; margin-bottom: 12px; font-size: 16px;">
                    <span style="font-weight: bold; color: #333; width: 180px; flex-shrink: 0;">Report ID:</span>
                    <span style="color: #333;">${reportId}</span>
                </div>
                <div style="display: flex; margin-bottom: 12px; font-size: 16px;">
                    <span style="font-weight: bold; color: #333; width: 180px; flex-shrink: 0;">Assessment Date:</span>
                    <span style="color: #333;">${assessmentDate}</span>
                </div>
                <div style="display: flex; margin-bottom: 12px; font-size: 16px;">
                    <span style="font-weight: bold; color: #333; width: 180px; flex-shrink: 0;">Patient's Name:</span>
                    <span style="color: #333;">${patientName}</span>
                </div>
               <!-- <div style="display: flex; margin-bottom: 12px; font-size: 16px;">
                    <span style="font-weight: bold; color: #333; width: 180px; flex-shrink: 0;">Age:</span>
                    <span style="color: #333;">${age}</span>
                </div>
                <div style="display: flex; margin-bottom: 12px; font-size: 16px;">
                    <span style="font-weight: bold; color: #333; width: 180px; flex-shrink: 0;">Gender:</span>
                    <span style="color: #333;">${gender}</span>
                </div>
                <div style="display: flex; margin-bottom: 12px; font-size: 16px;">
                    <span style="font-weight: bold; color: #333; width: 180px; flex-shrink: 0;">Referring Physician:</span>
                    <span style="color: #333;">${referringPhysician}</span>
                </div>
                -->
            </div>
            
            <!-- Assessment Overview Section -->
            <div style="margin-bottom: 30px;">
                <div style="font-size: 20px; font-weight: bold; color: #333; margin-bottom: 15px;">Assessment Overview</div>
                <div style="font-size: 14px; line-height: 1.6; color: #333; text-align: justify;">
                    This comprehensive neuropsychological assessment evaluates cognitive functioning, emotional well-being, and adaptive behaviours using validated screening tools integrated with the Harvard Mental Health Continuum Model. The assessment provides standardised scores across multiple domains to guide clinical decision-making and treatment planning.
                </div>
            </div>
            
            <!-- Assessment Duration Section -->
            <div>
                <span style="font-size: 20px; font-weight: bold; color: #333;">Assessment Duration</span>
                <span style="font-size: 20px; font-weight: normal; color: #333;"> – 20 to 25 minutes</span>
            </div>
        </div>
    </div>
    
    <!-- Footer -->
    <div style="padding: 20px 40px; border-top: 1px solid #ddd; background-color: #f8f9fa; font-size: 12px; color: #666; text-align: center;">
        MindSmith Health, C-79/E 1st Floor, DLF Phase 1, Sec 26, Gurgaon, Haryana<br>
        For Appointments contact: 9810968272
    </div>
</div>`;
};
