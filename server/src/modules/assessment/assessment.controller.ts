import { Request, Response } from "express";
import { Section } from "./models/section.model";
import { Subsection } from "./models/subsection.model";
import { Question } from "./models/question.model";
import { Response as UserResponse } from "./models/response.model";
import { calculateScores } from "./assessment.service";

export const getAssessmentStructure = async (req: Request, res: Response) => {
  try {
    const sections = await Section.find().sort("order");
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assessment structure" });
  }
};

// assessment.controller.ts
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;

    // Option 1: Find by section name instead of ID
    const section = await Section.findOne({ name: sectionId });
    if (!section) {
      res.status(404).json({ message: "Section not found" });
      return;
    }

    const subsections = await Subsection.find({ section: section._id })
      .sort("order")
      .select("_id");

    const questions = await Question.find({
      subsection: { $in: subsections.map((s) => s._id) },
    })
      .sort("order")
      .lean();

    res.json(questions);

    // Option 2: Or if you prefer to keep using IDs in the URL:
    // Make sure to pass the actual ObjectId (like "507f1f77bcf86cd799439011")
    // const subsections = await Subsection.find({ section: sectionId })...
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions" });
  }
};

export const submitResponse = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    const { userId, questionId, optionIndex } = req.body;

    // Get the question to calculate the score
    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    const score = question.options[optionIndex]?.score;
    if (score === undefined) {
      res.status(400).json({ message: "Invalid option index" });
      return;
    }

    // Check if response already exists for this user and section
    let userResponse = await UserResponse.findOne({
      user: userId,
      section: sectionId,
    });

    if (userResponse) {
      // Update existing response
      const answerIndex = userResponse.answers.findIndex(
        (answer) => answer.question.toString() === questionId
      );

      if (answerIndex > -1) {
        // Update existing answer
        userResponse.answers[answerIndex].optionIndex = optionIndex;
        userResponse.answers[answerIndex].score = score;
      } else {
        // Add new answer
        userResponse.answers.push({
          question: questionId,
          optionIndex,
          score,
        });
      }

      // Recalculate total score
      userResponse.totalScore = userResponse.answers.reduce(
        (sum, answer) => sum + answer.score,
        0
      );
      userResponse.completedAt = new Date();

      await userResponse.save();
    } else {
      // Create new response
      userResponse = await UserResponse.create({
        user: userId,
        section: sectionId,
        answers: [
          {
            question: questionId,
            optionIndex,
            score,
          },
        ],
        totalScore: score,
        completedAt: new Date(),
      });
    }

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error submitting response:", error);
    res.status(500).json({ message: "Error submitting response" });
  }
};

export const getResults = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const results = await calculateScores(userId);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error generating results" });
  }
};

export const getUserProgress = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    const { userId } = req.body;

    const userResponse = await UserResponse.findOne({
      user: userId,
      section: sectionId,
    }).populate("answers.question");

    if (!userResponse) {
      res.json({
        exists: false,
        answeredQuestions: [],
        totalScore: 0,
      });
      return;
    }

    res.json({
      exists: true,
      answeredQuestions: userResponse.answers.map((answer) => ({
        questionId: answer.question,
        optionIndex: answer.optionIndex,
        score: answer.score,
      })),
      totalScore: userResponse.totalScore,
      completedAt: userResponse.completedAt,
    });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ message: "Error fetching user progress" });
  }
};
