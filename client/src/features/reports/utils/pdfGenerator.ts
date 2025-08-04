import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { generateReportHTML, ReportPage, UserInfo } from '../reportGenerator';

export const generateAndDownloadPDF = async (
  reportData: ReportPage[],
  userInfo: UserInfo,
  onProgress?: (progress: number) => void
): Promise<void> => {
  try {
    onProgress?.(10); // Starting
    
    // Create a temporary container for the HTML content
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm';
    tempContainer.style.background = 'white';
    
    onProgress?.(20); // Container created
    
    // Generate HTML content
    const htmlContent = generateReportHTML(reportData, userInfo);
    tempContainer.innerHTML = htmlContent;
    
    // Append to body to render
    document.body.appendChild(tempContainer);
    
    onProgress?.(30); // HTML rendered
    
    // Wait a bit for fonts and styles to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find all report pages
    const reportPages = tempContainer.querySelectorAll('.report-page');
    
    if (reportPages.length === 0) {
      throw new Error('No report pages found to generate PDF');
    }
    
    onProgress?.(40); // Pages found
    
    // Create PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    onProgress?.(50); // PDF document created
    
    // Process each page
    for (let i = 0; i < reportPages.length; i++) {
      const pageElement = reportPages[i] as HTMLElement;
      
      // Calculate progress for this page (50-85%)
      const pageProgress = 50 + ((i / reportPages.length) * 35);
      onProgress?.(pageProgress);
      
      // Generate canvas from the page element
      const canvas = await html2canvas(pageElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
        onclone: (clonedDoc) => {
          // Ensure all styles are applied in the cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Add new page for subsequent pages
      if (i > 0) {
        pdf.addPage();
      }
      
      // Add image to PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }
    
    onProgress?.(85); // All pages processed
    
    // Clean up temporary container
    document.body.removeChild(tempContainer);
    
    onProgress?.(90); // Cleanup done
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `${userInfo.name.replace(/[^a-zA-Z0-9]/g, '_')}_Assessment_Report_${timestamp}.pdf`;
    
    onProgress?.(95); // Filename generated
    
    // Download the PDF
    pdf.save(filename);
    
    onProgress?.(100); // Download completed
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const generatePDFBlob = async (
  reportData: ReportPage[],
  userInfo: UserInfo,
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  try {
    onProgress?.(10); // Starting blob generation
    
    // Create a temporary container for the HTML content
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm';
    tempContainer.style.background = 'white';
    
    onProgress?.(20); // Container created
    
    // Generate HTML content
    const htmlContent = generateReportHTML(reportData, userInfo);
    tempContainer.innerHTML = htmlContent;
    
    // Append to body to render
    document.body.appendChild(tempContainer);
    
    onProgress?.(30); // HTML rendered
    
    // Wait a bit for fonts and styles to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find all report pages
    const reportPages = tempContainer.querySelectorAll('.report-page');
    
    if (reportPages.length === 0) {
      throw new Error('No report pages found to generate PDF');
    }
    
    onProgress?.(40); // Pages found
    
    // Create PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    onProgress?.(50); // PDF document created
    
    // Process each page
    for (let i = 0; i < reportPages.length; i++) {
      const pageElement = reportPages[i] as HTMLElement;
      
      // Calculate progress for this page (50-75%)
      const pageProgress = 50 + ((i / reportPages.length) * 25);
      onProgress?.(pageProgress);
      
      // Generate canvas from the page element
      const canvas = await html2canvas(pageElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Add new page for subsequent pages
      if (i > 0) {
        pdf.addPage();
      }
      
      // Add image to PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }
    
    onProgress?.(75); // All pages processed
    
    // Clean up temporary container
    document.body.removeChild(tempContainer);
    
    onProgress?.(80); // Cleanup done
    
    // Return PDF as blob
    return pdf.output('blob');
    
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    throw new Error(`Failed to generate PDF blob: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Alternative download method using URL.createObjectURL for better mobile compatibility
export const downloadPDFWithObjectURL = async (
  reportData: ReportPage[],
  userInfo: UserInfo,
  onProgress?: (progress: number) => void
): Promise<void> => {
  try {
    onProgress?.(10); // Starting fallback method
    
    const pdfBlob = await generatePDFBlob(reportData, userInfo, onProgress);
    
    onProgress?.(85); // Blob generated
    
    // Create object URL
    const url = URL.createObjectURL(pdfBlob);
    
    onProgress?.(90); // Object URL created
    
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `${userInfo.name.replace(/[^a-zA-Z0-9]/g, '_')}_Assessment_Report_${timestamp}.pdf`;
    link.download = filename;
    
    onProgress?.(95); // Link prepared
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    onProgress?.(100); // Download completed
    
  } catch (error) {
    console.error('Error downloading PDF with object URL:', error);
    throw new Error(`Failed to download PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
