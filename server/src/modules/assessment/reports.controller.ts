import { Request, Response } from "express";
import { Section } from "./models/section.model";
import { Subsection } from "./models/subsection.model";
import { Question } from "./models/question.model";
import { Response as UserResponse } from "./models/response.model";
import mongoose from "mongoose";
import { reportData } from "./data/reportData";
import { User } from "../user/user.model";

interface ReportPage {
  section: string;
  title: string;
  totalScore: number;
  pageName?: string;
  assessmentOverview?: string;
  clinicalInterpretation?: string;
  considerations?: string[];
  recommendations?: string[];
}

// Helper function to find report data by page name
const findReportDataByPageName = (pageName: string) => {
  if (!pageName) return null;
  
  return reportData.find(data => {
    const dataPageName = data.pageName.toLowerCase();
    const searchName = pageName.toLowerCase();
    
    // Exact match
    if (dataPageName === searchName) return true;
    
    // Check if one contains the other
    if (dataPageName.includes(searchName) || searchName.includes(dataPageName)) return true;
    
    // Special case mappings for common variations
    const mappings: { [key: string]: string } = {
      'life stress assessment': 'life event stress scale analysis',
      'life event stress scale analysis': 'life stress assessment'
    };
    
    if (mappings[searchName] && dataPageName === mappings[searchName]) return true;
    
    return false;
  });
};

// Helper function to merge report data with page
const mergeReportData = (page: ReportPage): ReportPage => {
  // For the first page (Life Stress Assessment), use section name
  const searchName = page.section === "Life Stress Assessment" ? page.section : page.title;
  
  // Find matching report data
  const matchingReportData = findReportDataByPageName(searchName);
  
  if (matchingReportData) {
    return {
      ...page,
      pageName: matchingReportData.pageName,
      assessmentOverview: matchingReportData.assessmentOverview,
      clinicalInterpretation: matchingReportData.clinicalInterpretation,
      considerations: matchingReportData.considerations,
      recommendations: matchingReportData.recommendations
    };
  }
  
  return page;
};

export const generateReportController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const pages: ReportPage[] = [];

    // Fetch user information
    const user = await User.findById(userId).select('_id name createdAt');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // First page: Life Stress Assessment
    const lifeStressSection = await Section.findOne({ name: "Life Stress Assessment" });
    
    if (lifeStressSection) {
      const lifeStressResponse = await UserResponse.findOne({
        user: userId,
        section: lifeStressSection._id
      });

      const lifeStressPage: ReportPage = {
        section: "Life Stress Assessment",
        title: "",
        totalScore: lifeStressResponse?.totalScore || 0
      };

      // Merge with report data and add to pages
      pages.push(mergeReportData(lifeStressPage));
    }

    // Aggregation pipeline for all other sections and subsections
    const aggregatedData = await Section.aggregate([
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

    // Add the aggregated data to pages with merged report data
    const enrichedAggregatedData = aggregatedData.map((page: any) => mergeReportData(page));
    pages.push(...enrichedAggregatedData);

    res.status(200).json({
      success: true,
      data: pages,
      userInfo: {
        _id: user._id,
        name: user.name,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({
      success: false,
      message: "Error generating report"
    });
  }
};
