import { Request, Response } from "express";
import { Section } from "./models/section.model";
import { Subsection } from "./models/subsection.model";
import { Question } from "./models/question.model";
import { Response as UserResponse } from "./models/response.model";
import mongoose from "mongoose";

interface ReportPage {
  section: string;
  title: string;
  totalScore: number;
}

export const generateReportController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const pages: ReportPage[] = [];

    // First page: Life Stress Assessment
    const lifeStressSection = await Section.findOne({ name: "Life Stress Assessment" });
    
    if (lifeStressSection) {
      const lifeStressResponse = await UserResponse.findOne({
        user: userId,
        section: lifeStressSection._id
      });

      pages.push({
        section: "Life Stress Assessment",
        title: "",
        totalScore: lifeStressResponse?.totalScore || 0
      });
    }

    // Aggregation pipeline for all other sections and subsections
    const reportData = await Section.aggregate([
      // Match all sections except Life Stress Assessment
      {
        $match: {
          name: { $ne: "Life Stress Assessment" }
        }
      },
      // Sort by order
      {
        $sort: { order: 1 }
      },
      // Lookup subsections for each section
      {
        $lookup: {
          from: "subsections",
          localField: "_id",
          foreignField: "section",
          as: "subsections",
          pipeline: [
            { $sort: { order: 1 } }
          ]
        }
      },
      // Unwind subsections to process each one
      {
        $unwind: "$subsections"
      },
      // Lookup questions for each subsection
      {
        $lookup: {
          from: "questions",
          localField: "subsections._id",
          foreignField: "subsection",
          as: "questions",
          pipeline: [
            { $sort: { order: 1 } }
          ]
        }
      },
      // Lookup user responses for this section
      {
        $lookup: {
          from: "responses",
          let: { sectionId: "$_id", userId: new mongoose.Types.ObjectId(userId) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$section", "$$sectionId"] },
                    { $eq: ["$user", "$$userId"] }
                  ]
                }
              }
            }
          ],
          as: "userResponses"
        }
      },
      // Calculate subsection score
      {
        $addFields: {
          subsectionScore: {
            $let: {
              vars: {
                questionIds: "$questions._id",
                userAnswers: { $arrayElemAt: ["$userResponses.answers", 0] }
              },
              in: {
                $reduce: {
                  input: "$$userAnswers",
                  initialValue: 0,
                  in: {
                    $cond: {
                      if: {
                        $in: ["$$this.question", "$$questionIds"]
                      },
                      then: { $add: ["$$value", "$$this.score"] },
                      else: "$$value"
                    }
                  }
                }
              }
            }
          }
        }
      },
      // Project the required fields
      {
        $project: {
          section: "$name",
          title: "$subsections.title",
          totalScore: { $ifNull: ["$subsectionScore", 0] },
          sectionOrder: "$order",
          subsectionOrder: "$subsections.order"
        }
      },
      // Sort by section order, then subsection order
      {
        $sort: {
          sectionOrder: 1,
          subsectionOrder: 1
        }
      }
    ]);

    // Add the aggregated data to pages
    pages.push(...reportData);

    res.status(200).json({
      success: true,
      data: pages
    });

  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({
      success: false,
      message: "Error generating report"
    });
  }
};
