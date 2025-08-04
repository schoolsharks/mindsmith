import { useState } from "react";
import { reportsApi } from "../../../services/api/reportsApi";
import ContainedButton from "../../../components/ui/ContainedTextInput";
import { RootState } from "../../../app/store";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { ArrowRight } from "lucide-react";
import { generateAndDownloadPDF, downloadPDFWithObjectURL } from "../utils/pdfGenerator";


const DownloadButton = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const user = useSelector((state: RootState) => state.auth.user);
  const quizProgress = user?.quizProgress;

  const handleProgress = (progressValue: number) => {
    setProgress(Math.round(progressValue));
  };

  const handleLoadDataAndDownload = async () => {
    setIsLoading(true);
    setProgress(0);

    try {
      // Fetch report data
      const data = await reportsApi.getReport();

      setIsGenerating(true);
      setIsLoading(false);
      setProgress(5); // Data fetched

      // Try primary PDF generation method first
      try {
        await generateAndDownloadPDF(data.data, data.userInfo, handleProgress);
      } catch (primaryError) {
        console.warn("Primary PDF generation failed, trying fallback method:", primaryError);
        
        // Reset progress for fallback method
        setProgress(0);
        
        // Fallback to alternative download method for better mobile compatibility
        await downloadPDFWithObjectURL(data.data, data.userInfo, handleProgress);
      }

    } catch (error: any) {
      console.error("Error generating report:", error);
      
      // Show user-friendly error message
      const errorMessage = error.message || "Unknown error occurred";
      alert(`Error generating report: ${errorMessage}. Please check your internet connection and try again.`);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <Box position={"relative"}>
      <ContainedButton
        onClick={handleLoadDataAndDownload}
        disabled={isLoading || isGenerating || !quizProgress?.completed}
        sx={{
          padding: "16px 12px",
          border: "1px solid #18C4E7",
          backgroundColor: "#8DD1FF80",
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        {isLoading
          ? "Loading Data..."
          : isGenerating
          ? `Generating Report... ${progress}%`
          : "Download Report"}
      </ContainedButton>
      <ArrowRight
        size={36}
        color={"#FFEFA8"}
        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}
      />
    </Box>
  );
};

export default DownloadButton;
