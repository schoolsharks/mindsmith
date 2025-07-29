import { useState } from "react";
import { generateReportHTML } from "../reportGenerator";
import { reportsApi } from "../../../services/api/reportsApi";
import ContainedButton from "../../../components/ui/ContainedTextInput";
import { RootState } from "../../../app/store";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { ArrowRight } from "lucide-react";


const DownloadButton = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const quizProgress = user?.quizProgress;

  const handleLoadDataAndDownload = async () => {
    setIsLoading(true);

    try {
      const data = await reportsApi.getReport();

      setIsGenerating(true);

      const printWindow = window.open("", "_blank");
      const htmlContent = generateReportHTML(data.data, data.userInfo);

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
          ? "Opening Print Dialog..."
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
