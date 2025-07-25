// assessment.ts
import axios from "axios";

export const fetchSectionQuestions = async (sectionId: string) => {
  try {
    const response = await axios.get(
      `/api/v1/assessment/${sectionId}/questions`,
      { 
        withCredentials: true // Include cookies with request
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

export const submitAnswer = async (
  sectionId: string,
  answerData: {
    questionId: string;
    optionIndex: number;
    score: number;
  }
) => {
  const response = await axios.post(
    `/api/v1/assessment/${sectionId}/responses`,
    answerData,
    { withCredentials: true }
  );
  return response.data;
};