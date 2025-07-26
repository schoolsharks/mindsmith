// assessment.ts
import axios from "axios";
import { store } from "../../app/store";
import { updateQuizProgress } from "../../features/auth/authSlice";

export const fetchSectionQuestions = async (sectionId: string) => {
  try {
    const response = await axios.get(
      `/api/v1/assessment/${sectionId}/questions`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const submitQuestionResponse = async (
  sectionId: string,
  data: {
    questionId: string;
    optionIndex: number;
  }
) => {
  try {
    const response = await axios.post(
      `/api/v1/assessment/${sectionId}/responses`,
      data,
      { withCredentials: true }
    );
    
    // Check if the response includes progress updates
    if (response.data.progressUpdated) {
      store.dispatch(updateQuizProgress({
        currentSection: response.data.nextSection,
        completed: response.data.quizCompleted
      }));
    }
    
    return response.data;
  } catch (error) {
    console.error("Error submitting response:", error);
    throw error;
  }
};

export const getUserProgress = async (sectionId: string) => {
  try {
    const response = await axios.post(
      `/api/v1/assessment/${sectionId}/progress`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    throw error;
  }
};

// Legacy function - keeping for compatibility
// export const submitAnswer = async (
//   sectionId: string,
//   answerData: {
//     questionId: string;
//     optionIndex: number;
//     score: number;
//   }
// ) => {
//   const response = await axios.post(
//     `/api/v1/assessment/${sectionId}/responses`,
//     answerData,
//     { withCredentials: true }
//   );
//   return response.data;
// };
