import { Request, Response } from 'express';
import { Section } from "./models/section.model";
import { Subsection } from './models/subsection.model';
import { Question } from './models/question.model';
import { Response as UserResponse } from "./models/response.model";
import { calculateScores } from './assessment.service';

export const getAssessmentStructure = async (req: Request, res: Response) => {
  try {
    const sections = await Section.find().sort('order');
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessment structure' });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    const questions = await Question.find({ subsection: sectionId }).sort('order');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
};

export const submitResponse = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    const { userId, answers } = req.body;

    const response = await UserResponse.create({
      user: userId,
      section: sectionId,
      answers,
      completedAt: new Date()
    });

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting responses' });
  }
};

export const getResults = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const results = await calculateScores(userId);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error generating results' });
  }
};