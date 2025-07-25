import { useState } from "react";
import { generateReportHTML } from "../reportGenerator";
import { reportsApi } from "../../../services/api/reportsApi";
import ContainedButton from "../../../components/ui/ContainedTextInput";

const DownloadButton = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadDataAndDownload = async () => {
    setIsLoading(true);

    try {
      const data = await reportsApi.getReport();

      setIsGenerating(true);

      const printWindow = window.open("", "_blank");
      const htmlContent = generateReportHTML(data.data);

      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
      } else {
        throw new Error("Failed to open a new window for printing.");
      }

      setTimeout(() => {
        printWindow.focus();
        printWindow.print();

        setTimeout(() => {
          printWindow.close();
        }, 1000);
      }, 500);
    } catch (error: any) {
      console.error("Error generating report:", error);
      alert(`Error generating report: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  return (
    <ContainedButton
      onClick={handleLoadDataAndDownload}
      disabled={isLoading || isGenerating}
      sx={{py:1}}
    >
      {isLoading
        ? "Loading Data..."
        : isGenerating
        ? "Opening Print Dialog..."
        : "Download Report"}
    </ContainedButton>
  );
};

export default DownloadButton;
