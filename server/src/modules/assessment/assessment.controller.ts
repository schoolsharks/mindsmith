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

// assessment.controller.ts
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    
    // Option 1: Find by section name instead of ID
    const section = await Section.findOne({ name: sectionId });
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const subsections = await Subsection.find({ section: section._id })
      .sort('order')
      .select('_id');
    
    const questions = await Question.find({ 
      subsection: { $in: subsections.map(s => s._id) } 
    })
      .sort('order')
      .lean();
    
    res.json(questions);

    // Option 2: Or if you prefer to keep using IDs in the URL:
    // Make sure to pass the actual ObjectId (like "507f1f77bcf86cd799439011")
    // const subsections = await Subsection.find({ section: sectionId })...
  } catch (error) {
    console.error('Error fetching questions:', error);
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