import mongoose from "mongoose";
import { Section } from "../models/section.model";
import { Subsection } from "../models/subsection.model";
import { Question } from "../models/question.model";
import dotenv from "dotenv";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      Section.deleteMany({}),
      Subsection.deleteMany({}),
      Question.deleteMany({}),
    ]);
    console.log("Cleared existing data.");

    // ===== SECTION A: LIFE STRESS ASSESSMENT =====
    const sectionA = await Section.create({
      name: "Life Stress Assessment",
      description: "Holmes-Rahe Modified Stress Scale",
      duration: "20-25 minutes",
      order: 1,
    });

    // Subsection A1: Family and Relationship Events
    const subsectionA1 = await Subsection.create({
      section: sectionA._id,
      title: "Family and Relationship Events",
      description: "Stressful life events related to family and relationships",
      order: 1,
    });

    await Question.insertMany([
      {
        subsection: subsectionA1._id,
        text: "Death of spouse",
        options: [
          { text: "Experienced", score: 100 },
          { text: "Not experienced", score: 0 },
        ],
        order: 1,
      },
      {
        subsection: subsectionA1._id,
        text: "Divorce",
        options: [
          { text: "Experienced", score: 73 },
          { text: "Not experienced", score: 0 },
        ],
        order: 2,
      },
      {
        subsection: subsectionA1._id,
        text: "Marital separation",
        options: [
          { text: "Experienced", score: 65 },
          { text: "Not experienced", score: 0 },
        ],
        order: 3,
      },
      {
        subsection: subsectionA1._id,
        text: "Marital reconciliation",
        options: [
          { text: "Experienced", score: 45 },
          { text: "Not experienced", score: 0 },
        ],
        order: 4,
      },
      {
        subsection: subsectionA1._id,
        text: "Marriage",
        options: [
          { text: "Experienced", score: 50 },
          { text: "Not experienced", score: 0 },
        ],
        order: 5,
      },
    ]);

    // Subsection A2: Loss and Grief
    const subsectionA2 = await Subsection.create({
      section: sectionA._id,
      title: "Loss and Grief",
      order: 2,
    });

    await Question.insertMany([
      {
        subsection: subsectionA2._id,
        text: "Death of close family member",
        options: [
          { text: "Experienced", score: 63 },
          { text: "Not experienced", score: 0 },
        ],
        order: 1,
      },
      {
        subsection: subsectionA2._id,
        text: "Death of close friend",
        options: [
          { text: "Experienced", score: 37 },
          { text: "Not experienced", score: 0 },
        ],
        order: 2,
      },
      {
        subsection: subsectionA2._id,
        text: "Personal injury or illness",
        options: [
          { text: "Experienced", score: 53 },
          { text: "Not experienced", score: 0 },
        ],
        order: 3,
      },
      {
        subsection: subsectionA2._id,
        text: "Change in health of family member",
        options: [
          { text: "Experienced", score: 44 },
          { text: "Not experienced", score: 0 },
        ],
        order: 4,
      },
    ]);

    // Subsection A3: Legal and Institutional
    const subsectionA3 = await Subsection.create({
      section: sectionA._id,
      title: "Legal and Institutional",
      order: 3,
    });

    await Question.insertMany([
      {
        subsection: subsectionA3._id,
        text: "Jail term",
        options: [
          { text: "Experienced", score: 63 },
          { text: "Not experienced", score: 0 },
        ],
        order: 1,
      },
      {
        subsection: subsectionA3._id,
        text: "Minor violations of the law",
        options: [
          { text: "Experienced", score: 11 },
          { text: "Not experienced", score: 0 },
        ],
        order: 2,
      },
      {
        subsection: subsectionA3._id,
        text: "Foreclosure of mortgage or loan",
        options: [
          { text: "Experienced", score: 30 },
          { text: "Not experienced", score: 0 },
        ],
        order: 3,
      },
      {
        subsection: subsectionA3._id,
        text: "Mortgage or loan for major purchase",
        options: [
          { text: "Experienced", score: 31 },
          { text: "Not experienced", score: 0 },
        ],
        order: 4,
      },
    ]);

    // Subsection A4: Work and Career
    const subsectionA4 = await Subsection.create({
      section: sectionA._id,
      title: "Work and Career",
      order: 4,
    });

    await Question.insertMany([
      {
        subsection: subsectionA4._id,
        text: "Fired at work",
        options: [
          { text: "Experienced", score: 47 },
          { text: "Not experienced", score: 0 },
        ],
        order: 1,
      },
      {
        subsection: subsectionA4._id,
        text: "Retirement",
        options: [
          { text: "Experienced", score: 45 },
          { text: "Not experienced", score: 0 },
        ],
        order: 2,
      },
      {
        subsection: subsectionA4._id,
        text: "Business readjustment",
        options: [
          { text: "Experienced", score: 39 },
          { text: "Not experienced", score: 0 },
        ],
        order: 3,
      },
      {
        subsection: subsectionA4._id,
        text: "Change to different line of work",
        options: [
          { text: "Experienced", score: 36 },
          { text: "Not experienced", score: 0 },
        ],
        order: 4,
      },
      {
        subsection: subsectionA4._id,
        text: "Change in responsibilities at work",
        options: [
          { text: "Experienced", score: 29 },
          { text: "Not experienced", score: 0 },
        ],
        order: 5,
      },
    ]);

    // Subsection A5: Workplace Dynamics
    const subsectionA5 = await Subsection.create({
      section: sectionA._id,
      title: "Workplace Dynamics",
      order: 5,
    });

    await Question.insertMany([
      {
        subsection: subsectionA5._id,
        text: "Trouble with boss",
        options: [
          { text: "Experienced", score: 23 },
          { text: "Not experienced", score: 0 },
        ],
        order: 1,
      },
      {
        subsection: subsectionA5._id,
        text: "Change in work hours or conditions",
        options: [
          { text: "Experienced", score: 20 },
          { text: "Not experienced", score: 0 },
        ],
        order: 2,
      },
      {
        subsection: subsectionA5._id,
        text: "Outstanding personal achievement",
        options: [
          { text: "Experienced", score: 28 },
          { text: "Not experienced", score: 0 },
        ],
        order: 3,
      },
      {
        subsection: subsectionA5._id,
        text: "Spouse begins/stops work outside home",
        options: [
          { text: "Experienced", score: 26 },
          { text: "Not experienced", score: 0 },
        ],
        order: 4,
      },
    ]);

    // Subsection A6: Financial Changes
    const subsectionA6 = await Subsection.create({
      section: sectionA._id,
      title: "Financial Changes",
      order: 6,
    });

    await Question.insertMany([
      {
        subsection: subsectionA6._id,
        text: "Change in financial state",
        options: [
          { text: "Experienced", score: 38 },
          { text: "Not experienced", score: 0 },
        ],
        order: 1,
      },
      {
        subsection: subsectionA6._id,
        text: "Mortgage or loan less than $10,000",
        options: [
          { text: "Experienced", score: 17 },
          { text: "Not experienced", score: 0 },
        ],
        order: 2,
      },
      {
        subsection: subsectionA6._id,
        text: "Change in living conditions",
        options: [
          { text: "Experienced", score: 25 },
          { text: "Not experienced", score: 0 },
        ],
        order: 3,
      },
      {
        subsection: subsectionA6._id,
        text: "Change in residence",
        options: [
          { text: "Experienced", score: 20 },
          { text: "Not experienced", score: 0 },
        ],
        order: 4,
      },
    ]);

    // Subsection A7: Family Dynamics
    const subsectionA7 = await Subsection.create({
      section: sectionA._id,
      title: "Family Dynamics",
      order: 7,
    });

    await Question.insertMany([
      {
        subsection: subsectionA7._id,
        text: "Pregnancy",
        options: [
          { text: "Experienced", score: 40 },
          { text: "Not experienced", score: 0 },
        ],
        order: 1,
      },
      {
        subsection: subsectionA7._id,
        text: "Gain of new family member",
        options: [
          { text: "Experienced", score: 39 },
          { text: "Not experienced", score: 0 },
        ],
        order: 2,
      },
      {
        subsection: subsectionA7._id,
        text: "Son or daughter leaving home",
        options: [
          { text: "Experienced", score: 29 },
          { text: "Not experienced", score: 0 },
        ],
        order: 3,
      },
      {
        subsection: subsectionA7._id,
        text: "Trouble with in-laws or children",
        options: [
          { text: "Experienced", score: 29 },
          { text: "Not experienced", score: 0 },
        ],
        order: 4,
      },
    ]);

    // Subsection A8: Personal Life Changes
    const subsectionA8 = await Subsection.create({
      section: sectionA._id,
      title: "Personal Life Changes",
      order: 8,
    });

    await Question.insertMany([
      {
        subsection: subsectionA8._id,
        text: "Sex difficulties",
        options: [
          { text: "Experienced", score: 39 },
          { text: "Not experienced", score: 0 },
        ],
        order: 1,
      },
      {
        subsection: subsectionA8._id,
        text: "Begin or end school",
        options: [
          { text: "Experienced", score: 26 },
          { text: "Not experienced", score: 0 },
        ],
        order: 2,
      },
      {
        subsection: subsectionA8._id,
        text: "Change in schools",
        options: [
          { text: "Experienced", score: 20 },
          { text: "Not experienced", score: 0 },
        ],
        order: 3,
      },
      {
        subsection: subsectionA8._id,
        text: "Change in number of arguments with spouse",
        options: [
          { text: "Experienced", score: 35 },
          { text: "Not experienced", score: 0 },
        ],
        order: 4,
      },
    ]);

    // Subsection A9: Lifestyle and Habits
    const subsectionA9 = await Subsection.create({
      section: sectionA._id,
      title: "Lifestyle and Habits",
      order: 9,
    });

    await Question.insertMany([
      {
        subsection: subsectionA9._id,
        text: "Revision of personal habits",
        options: [
          { text: "Experienced", score: 24 },
          { text: "Not experienced", score: 0 },
        ],
        order: 1,
      },
      {
        subsection: subsectionA9._id,
        text: "Change in recreation",
        options: [
          { text: "Experienced", score: 19 },
          { text: "Not experienced", score: 0 },
        ],
        order: 2,
      },
      {
        subsection: subsectionA9._id,
        text: "Change in church activities",
        options: [
          { text: "Experienced", score: 19 },
          { text: "Not experienced", score: 0 },
        ],
        order: 3,
      },
      {
        subsection: subsectionA9._id,
        text: "Change in social activities",
        options: [
          { text: "Experienced", score: 18 },
          { text: "Not experienced", score: 0 },
        ],
        order: 4,
      },
    ]);

    // Subsection A10: Daily Routine Changes
    const subsectionA10 = await Subsection.create({
      section: sectionA._id,
      title: "Daily Routine Changes",
      order: 10,
    });

    await Question.insertMany([
      {
        subsection: subsectionA10._id,
        text: "Change in sleeping habits",
        options: [
          { text: "Experienced", score: 16 },
          { text: "Not experienced", score: 0 },
        ],
        order: 1,
      },
      {
        subsection: subsectionA10._id,
        text: "Change in eating habits",
        options: [
          { text: "Experienced", score: 15 },
          { text: "Not experienced", score: 0 },
        ],
        order: 2,
      },
      {
        subsection: subsectionA10._id,
        text: "Change in number of family get-togethers",
        options: [
          { text: "Experienced", score: 15 },
          { text: "Not experienced", score: 0 },
        ],
        order: 3,
      },
      {
        subsection: subsectionA10._id,
        text: "Vacation",
        options: [
          { text: "Experienced", score: 13 },
          { text: "Not experienced", score: 0 },
        ],
        order: 4,
      },
      {
        subsection: subsectionA10._id,
        text: "Christmas/Major holidays",
        options: [
          { text: "Experienced", score: 12 },
          { text: "Not experienced", score: 0 },
        ],
        order: 5,
      },
    ]);

    // Subsection A11: Modern Digital Age Stressors
    const subsectionA11 = await Subsection.create({
      section: sectionA._id,
      title: "Modern Digital Age Stressors",
      order: 11,
    });

    await Question.insertMany([
      {
        subsection: subsectionA11._id,
        text: "Techno-overload (forced to work faster/harder due to AI/ML)",
        options: [
          { text: "Experienced", score: 45 },
          { text: "Not experienced", score: 0 },
        ],
        order: 1,
      },
      {
        subsection: subsectionA11._id,
        text: "Techno-invasion (constant connectivity blurring work-life boundaries)",
        options: [
          { text: "Experienced", score: 42 },
          { text: "Not experienced", score: 0 },
        ],
        order: 2,
      },
      {
        subsection: subsectionA11._id,
        text: "Information overload (inability to process excessive digital information)",
        options: [
          { text: "Experienced", score: 38 },
          { text: "Not experienced", score: 0 },
        ],
        order: 3,
      },
      {
        subsection: subsectionA11._id,
        text: "Social media comparison stress",
        options: [
          { text: "Experienced", score: 36 },
          { text: "Not experienced", score: 0 },
        ],
        order: 4,
      },
      {
        subsection: subsectionA11._id,
        text: "AI/ML job displacement or fear of replacement",
        options: [
          { text: "Experienced", score: 47 },
          { text: "Not experienced", score: 0 },
        ],
        order: 5,
      },
    ]);

    // Subsection A12: AI and Technology Anxiety
    const subsectionA12 = await Subsection.create({
      section: sectionA._id,
      title: "AI and Technology Anxiety",
      order: 12,
    });

    await Question.insertMany([
      {
        subsection: subsectionA12._id,
        text: "Digital identity theft or major privacy breach",
        options: [
          { text: "Experienced", score: 40 },
          { text: "Not experienced", score: 0 },
        ],
        order: 1,
      },
      {
        subsection: subsectionA12._id,
        text: "Technology addiction (excessive screen time)",
        options: [
          { text: "Experienced", score: 35 },
          { text: "Not experienced", score: 0 },
        ],
        order: 2,
      },
      {
        subsection: subsectionA12._id,
        text: "AI-generated misinformation affecting personal/professional life",
        options: [
          { text: "Experienced", score: 33 },
          { text: "Not experienced", score: 0 },
        ],
        order: 3,
      },
      {
        subsection: subsectionA12._id,
        text: "Adapting to rapid technological changes in workplace",
        options: [
          { text: "Experienced", score: 31 },
          { text: "Not experienced", score: 0 },
        ],
        order: 4,
      },
    ]);

    // ===== SECTION B: MENTAL HEALTH SCREENING =====
    const sectionB = await Section.create({
      name: "Mental Health Screening",
      description: "Comprehensive mental health condition screening",
      duration: "30-35 minutes",
      order: 2,
    });

    // Subsection B1: Anxiety Disorders
    const subsectionB1 = await Subsection.create({
      section: sectionB._id,
      title: "Anxiety Disorders",
      order: 1,
    });

    await Question.insertMany([
      {
        subsection: subsectionB1._id,
        text: "Over the past two weeks, how often have you felt nervous, anxious, or on edge?",
        options: [
          { text: "Not at all or rarely", score: 1 },
          { text: "Several days (less than half the time)", score: 3 },
          { text: "More than half the days or nearly every day", score: 5 },
        ],
        order: 1,
      },
      {
        subsection: subsectionB1._id,
        text: "When you feel anxious, how difficult is it for you to stop or control worrying?",
        options: [
          { text: "I can usually manage my worrying", score: 1 },
          { text: "Sometimes I struggle to control it", score: 3 },
          {
            text: "I find it very difficult or impossible to stop worrying",
            score: 5,
          },
        ],
        order: 2,
      },
      {
        subsection: subsectionB1._id,
        text: "How often do you avoid situations because they make you feel anxious or panicked?",
        options: [
          { text: "Rarely or never", score: 1 },
          { text: "Sometimes, but I can usually push through", score: 3 },
          {
            text: "Often or almost always - it significantly limits my activities",
            score: 5,
          },
        ],
        order: 3,
      },
      {
        subsection: subsectionB1._id,
        text: "During anxious moments, do you experience physical symptoms like rapid heartbeat, sweating, or difficulty breathing?",
        options: [
          { text: "Rarely or mild symptoms", score: 1 },
          { text: "Moderate symptoms that are noticeable", score: 3 },
          {
            text: "Severe symptoms that feel overwhelming or frightening",
            score: 5,
          },
        ],
        order: 4,
      },
      {
        subsection: subsectionB1._id,
        text: "How much do anxiety symptoms interfere with your work, relationships, or daily activities?",
        options: [
          { text: "Little to no interference", score: 1 },
          { text: "Some interference but manageable", score: 3 },
          {
            text: "Significant interference - major impact on functioning",
            score: 5,
          },
        ],
        order: 5,
      },
    ]);

    // Subsection B2: Mood Disorders
    const subsectionB2 = await Subsection.create({
      section: sectionB._id,
      title: "Mood Disorders",
      order: 2,
    });

    await Question.insertMany([
      {
        subsection: subsectionB2._id,
        text: "Over the past two weeks, how often have you felt down, depressed, or hopeless?",
        options: [
          { text: "Not at all or rarely", score: 1 },
          { text: "Several days", score: 3 },
          { text: "More than half the days or nearly every day", score: 5 },
        ],
        order: 1,
      },
      {
        subsection: subsectionB2._id,
        text: 'Have you experienced periods where you felt unusually energetic, euphoric, or "high" for several days?',
        options: [
          { text: "No, this doesn't describe me", score: 1 },
          { text: "Occasionally, but brief periods", score: 3 },
          {
            text: "Yes, distinct periods lasting days where others noticed changes",
            score: 5,
          },
        ],
        order: 2,
      },
      {
        subsection: subsectionB2._id,
        text: "How has your interest or pleasure in activities you usually enjoy changed recently?",
        options: [
          { text: "Little to no change", score: 1 },
          { text: "Somewhat decreased interest", score: 3 },
          {
            text: "Markedly decreased or no interest in most activities",
            score: 5,
          },
        ],
        order: 3,
      },
      {
        subsection: subsectionB2._id,
        text: "During low periods, how do you view your self-worth and future prospects?",
        options: [
          { text: "Generally positive or realistic", score: 1 },
          { text: "Sometimes negative or pessimistic", score: 3 },
          { text: "Predominantly negative, worthless, or hopeless", score: 5 },
        ],
        order: 4,
      },
      {
        subsection: subsectionB2._id,
        text: "Have mood changes significantly impacted your sleep, appetite, or energy levels?",
        options: [
          { text: "Minimal impact", score: 1 },
          { text: "Moderate changes that I notice", score: 3 },
          { text: "Severe changes affecting daily functioning", score: 5 },
        ],
        order: 5,
      },
    ]);

    // Subsection B3: Neurodevelopmental Disorders
    const subsectionB3 = await Subsection.create({
      section: sectionB._id,
      title: "Neurodevelopmental Disorders",
      order: 3,
    });

    await Question.insertMany([
      {
        subsection: subsectionB3._id,
        text: "How would you describe your ability to pay attention and stay focused on tasks?",
        options: [
          { text: "Generally good attention span", score: 1 },
          {
            text: "Some difficulty concentrating, especially on boring tasks",
            score: 3,
          },
          {
            text: "Significant problems focusing - easily distracted or can't complete tasks",
            score: 5,
          },
        ],
        order: 1,
      },
      {
        subsection: subsectionB3._id,
        text: "In social situations, how comfortable are you with understanding social cues and interactions?",
        options: [
          { text: "Generally comfortable and intuitive", score: 1 },
          { text: "Sometimes uncertain but manageable", score: 3 },
          {
            text: "Often confused or overwhelmed by social expectations",
            score: 5,
          },
        ],
        order: 2,
      },
      {
        subsection: subsectionB3._id,
        text: "How do you typically respond to changes in routine or unexpected situations?",
        options: [
          { text: "Adaptable and flexible", score: 1 },
          { text: "Some discomfort but can adjust", score: 3 },
          {
            text: "Very distressed by changes - prefer strict routines",
            score: 5,
          },
        ],
        order: 3,
      },
      {
        subsection: subsectionB3._id,
        text: "Do you have specific interests or activities that you focus on intensely?",
        options: [
          { text: "Normal range of interests", score: 1 },
          { text: "Some strong interests but balanced", score: 3 },
          {
            text: "Highly focused interests that dominate time and attention",
            score: 5,
          },
        ],
        order: 4,
      },
      {
        subsection: subsectionB3._id,
        text: "How would others describe your communication style and social interactions?",
        options: [
          { text: "Typical and age-appropriate", score: 1 },
          { text: "Sometimes different but functional", score: 3 },
          {
            text: "Notably different - challenges with communication or social connection",
            score: 5,
          },
        ],
        order: 5,
      },
    ]);

    // Subsection B4: Schizophrenia Spectrum and Other Psychotic Disorders
    const subsectionB4 = await Subsection.create({
      section: sectionB._id,
      title: "Schizophrenia Spectrum and Other Psychotic Disorders",
      order: 4,
    });

    await Question.insertMany([
      {
        subsection: subsectionB4._id,
        text: "Have you ever experienced thoughts or beliefs that others told you were unusual or not based in reality?",
        options: [
          { text: "No, my thoughts seem normal to others", score: 1 },
          { text: "Occasionally others question my interpretations", score: 3 },
          {
            text: "Yes, others often say my beliefs are strange or paranoid",
            score: 5,
          },
        ],
        order: 1,
      },
      {
        subsection: subsectionB4._id,
        text: "Do you ever hear voices, see things, or have sensory experiences that others don't seem to notice?",
        options: [
          { text: "No, never", score: 1 },
          { text: "Very rarely or only when extremely stressed", score: 3 },
          { text: "Yes, this happens regularly or is distressing", score: 5 },
        ],
        order: 2,
      },
      {
        subsection: subsectionB4._id,
        text: "How organized and logical do others find your speech and thoughts?",
        options: [
          { text: "Generally clear and organized", score: 1 },
          { text: "Sometimes unclear but understandable", score: 3 },
          {
            text: "Others often have difficulty following my thoughts or speech",
            score: 5,
          },
        ],
        order: 3,
      },
      {
        subsection: subsectionB4._id,
        text: "Have you had periods where you felt like people were plotting against you or watching you?",
        options: [
          { text: "No, I don't feel this way", score: 1 },
          {
            text: "Occasionally suspicious but recognize it might be unfounded",
            score: 3,
          },
          {
            text: "Yes, I often feel people are against me or monitoring me",
            score: 5,
          },
        ],
        order: 4,
      },
      {
        subsection: subsectionB4._id,
        text: "How has your ability to function at work, school, or in relationships been affected by unusual thoughts or experiences?",
        options: [
          { text: "No significant impact", score: 1 },
          { text: "Some impact during stressful periods", score: 3 },
          {
            text: "Major impact - difficulty maintaining responsibilities",
            score: 5,
          },
        ],
        order: 5,
      },
    ]);

    // Subsection B5: Obsessive-Compulsive and Related Disorders
    const subsectionB5 = await Subsection.create({
      section: sectionB._id,
      title: "Obsessive-Compulsive and Related Disorders",
      order: 5,
    });

    await Question.insertMany([
      {
        subsection: subsectionB5._id,
        text: "Do you experience recurring, unwanted thoughts or images that cause distress?",
        options: [
          { text: "Rarely or never", score: 1 },
          { text: "Occasionally, but I can dismiss them", score: 3 },
          {
            text: "Frequently - these thoughts are very distressing and hard to control",
            score: 5,
          },
        ],
        order: 1,
      },
      {
        subsection: subsectionB5._id,
        text: "How much time do you spend each day on repetitive behaviors or mental acts?",
        options: [
          { text: "Little to no time", score: 1 },
          { text: "Some time, but less than an hour daily", score: 3 },
          {
            text: "Significant time (1+ hours) or interferes with daily activities",
            score: 5,
          },
        ],
        order: 2,
      },
      {
        subsection: subsectionB5._id,
        text: "When you try to resist performing repetitive behaviors, how do you feel?",
        options: [
          { text: "No particular distress", score: 1 },
          { text: "Some anxiety but manageable", score: 3 },
          {
            text: "Severe anxiety or distress until I complete the behavior",
            score: 5,
          },
        ],
        order: 3,
      },
      {
        subsection: subsectionB5._id,
        text: "Do you feel compelled to check things repeatedly, wash excessively, or arrange items in specific ways?",
        options: [
          { text: "Normal checking or cleaning habits", score: 1 },
          { text: "Sometimes more than necessary", score: 3 },
          {
            text: "Excessive behaviors that others notice or comment on",
            score: 5,
          },
        ],
        order: 4,
      },
      {
        subsection: subsectionB5._id,
        text: "How much do these repetitive thoughts or behaviors interfere with your daily life?",
        options: [
          { text: "Little to no interference", score: 1 },
          { text: "Some interference but manageable", score: 3 },
          {
            text: "Significant interference with work, relationships, or activities",
            score: 5,
          },
        ],
        order: 5,
      },
    ]);

    // Subsection B6: Trauma- and Stressor-Related Disorders
    const subsectionB6 = await Subsection.create({
      section: sectionB._id,
      title: "Trauma- and Stressor-Related Disorders",
      order: 6,
    });

    await Question.insertMany([
      {
        subsection: subsectionB6._id,
        text: "Have you experienced or witnessed an event involving actual or threatened death, serious injury, or violence?",
        options: [
          { text: "No such experiences", score: 1 },
          { text: "Minor traumatic experiences", score: 3 },
          {
            text: "Major traumatic experiences that deeply affected me",
            score: 5,
          },
        ],
        order: 1,
      },
      {
        subsection: subsectionB6._id,
        text: "How often do you re-experience traumatic events through nightmares, flashbacks, or intrusive memories?",
        options: [
          { text: "Rarely or never", score: 1 },
          { text: "Occasionally", score: 3 },
          {
            text: "Frequently - these experiences are vivid and distressing",
            score: 5,
          },
        ],
        order: 2,
      },
      {
        subsection: subsectionB6._id,
        text: "Do you avoid places, people, or activities that remind you of traumatic experiences?",
        options: [
          { text: "No significant avoidance", score: 1 },
          { text: "Some avoidance but can function normally", score: 3 },
          {
            text: "Extensive avoidance that limits my life significantly",
            score: 5,
          },
        ],
        order: 3,
      },
      {
        subsection: subsectionB6._id,
        text: "How has your mood, sleep, or concentration changed since traumatic experiences?",
        options: [
          { text: "Little to no change", score: 1 },
          { text: "Some changes but manageable", score: 3 },
          {
            text: "Significant negative changes affecting daily functioning",
            score: 5,
          },
        ],
        order: 4,
      },
      {
        subsection: subsectionB6._id,
        text: "Do you feel constantly on guard, easily startled, or hypervigilant about potential threats?",
        options: [
          { text: "Normal alertness levels", score: 1 },
          { text: "Somewhat more vigilant than before", score: 3 },
          { text: "Constantly on edge - exhausting hypervigilance", score: 5 },
        ],
        order: 5,
      },
    ]);

    // Subsection B7: Dissociative Disorders
    const subsectionB7 = await Subsection.create({
      section: sectionB._id,
      title: "Dissociative Disorders",
      order: 7,
    });

    await Question.insertMany([
      {
        subsection: subsectionB7._id,
        text: "Do you ever feel disconnected from yourself, as if you're watching yourself from outside your body?",
        options: [
          { text: "Rarely or never", score: 1 },
          { text: "Occasionally during stress", score: 3 },
          {
            text: "Frequently - it's distressing or interferes with functioning",
            score: 5,
          },
        ],
        order: 1,
      },
      {
        subsection: subsectionB7._id,
        text: "How often do you lose time or have gaps in memory that you can't explain?",
        options: [
          { text: "Normal forgetfulness only", score: 1 },
          { text: "Occasional unexplained memory gaps", score: 3 },
          { text: "Frequent memory gaps that concern me or others", score: 5 },
        ],
        order: 2,
      },
      {
        subsection: subsectionB7._id,
        text: "Do you sometimes feel like the world around you is unreal, dreamlike, or distorted?",
        options: [
          { text: "Rarely or never", score: 1 },
          { text: "Occasionally during high stress", score: 3 },
          {
            text: "Frequently - the world feels consistently unreal",
            score: 5,
          },
        ],
        order: 3,
      },
      {
        subsection: subsectionB7._id,
        text: "Have others told you that you act like a completely different person at times?",
        options: [
          { text: "No, I'm consistent in personality", score: 1 },
          { text: "Minor personality variations", score: 3 },
          {
            text: "Others say I'm like different people with different memories",
            score: 5,
          },
        ],
        order: 4,
      },
      {
        subsection: subsectionB7._id,
        text: "How much do these experiences of disconnection affect your daily functioning?",
        options: [
          { text: "Little to no impact", score: 1 },
          { text: "Some impact but manageable", score: 3 },
          {
            text: "Significant impact on work, relationships, or safety",
            score: 5,
          },
        ],
        order: 5,
      },
    ]);

    // Subsection B8: Somatic Symptom and Related Disorders
    const subsectionB8 = await Subsection.create({
      section: sectionB._id,
      title: "Somatic Symptom and Related Disorders",
      order: 8,
    });

    await Question.insertMany([
      {
        subsection: subsectionB8._id,
        text: "How often do you experience physical symptoms that cause significant distress?",
        options: [
          { text: "Rarely - normal aches and pains", score: 1 },
          { text: "Sometimes bothersome symptoms", score: 3 },
          { text: "Frequently distressing physical symptoms", score: 5 },
        ],
        order: 1,
      },
      {
        subsection: subsectionB8._id,
        text: "How much time do you spend thinking about or worrying about your health?",
        options: [
          { text: "Normal health awareness", score: 1 },
          { text: "Some concern but not excessive", score: 3 },
          { text: "Excessive worry - thoughts dominate daily life", score: 5 },
        ],
        order: 2,
      },
      {
        subsection: subsectionB8._id,
        text: "How many different doctors or specialists have you seen for physical symptoms?",
        options: [
          { text: "Typical medical care", score: 1 },
          { text: "A few specialists for ongoing concerns", score: 3 },
          { text: "Many doctors - extensive medical seeking", score: 5 },
        ],
        order: 3,
      },
      {
        subsection: subsectionB8._id,
        text: "When medical tests come back normal, how do you typically respond?",
        options: [
          { text: "Reassured by normal results", score: 1 },
          { text: "Somewhat relieved but still concerned", score: 3 },
          {
            text: "Convinced tests missed something or doctors are wrong",
            score: 5,
          },
        ],
        order: 4,
      },
      {
        subsection: subsectionB8._id,
        text: "How much do physical symptoms interfere with your work, relationships, or daily activities?",
        options: [
          { text: "Minimal interference", score: 1 },
          { text: "Some interference but manageable", score: 3 },
          { text: "Significant interference - major life impact", score: 5 },
        ],
        order: 5,
      },
    ]);

    // Subsection B9: Feeding and Eating Disorders
    const subsectionB9 = await Subsection.create({
      section: sectionB._id,
      title: "Feeding and Eating Disorders",
      order: 9,
    });

    await Question.insertMany([
      {
        subsection: subsectionB9._id,
        text: "How would you describe your relationship with food and eating?",
        options: [
          { text: "Generally healthy and balanced", score: 1 },
          { text: "Sometimes complicated but manageable", score: 3 },
          {
            text: "Very distressing - food causes significant anxiety",
            score: 5,
          },
        ],
        order: 1,
      },
      {
        subsection: subsectionB9._id,
        text: "How often do you restrict your food intake or follow rigid eating rules?",
        options: [
          { text: "Normal eating patterns", score: 1 },
          {
            text: "Some dietary preferences or occasional restrictions",
            score: 3,
          },
          {
            text: "Severe restrictions - others worry about my eating",
            score: 5,
          },
        ],
        order: 2,
      },
      {
        subsection: subsectionB9._id,
        text: "Do you ever eat large amounts of food in short periods while feeling out of control?",
        options: [
          { text: "Normal eating amounts", score: 1 },
          { text: "Occasional overeating", score: 3 },
          { text: "Regular episodes of uncontrolled eating", score: 5 },
        ],
        order: 3,
      },
      {
        subsection: subsectionB9._id,
        text: "How much does your weight and body shape influence how you feel about yourself?",
        options: [
          { text: "Normal body awareness", score: 1 },
          { text: "Some concern but balanced perspective", score: 3 },
          {
            text: "Weight/shape dominates self-worth and daily thoughts",
            score: 5,
          },
        ],
        order: 4,
      },
      {
        subsection: subsectionB9._id,
        text: "How has your eating affected your physical health, energy, or social life?",
        options: [
          { text: "No significant impact", score: 1 },
          { text: "Some impact but manageable", score: 3 },
          {
            text: "Serious impact on health, relationships, or functioning",
            score: 5,
          },
        ],
        order: 5,
      },
    ]);

    // Subsection B10: Sleep-Wake Disorders
    const subsectionB10 = await Subsection.create({
      section: sectionB._id,
      title: "Sleep-Wake Disorders",
      order: 10,
    });

    await Question.insertMany([
      {
        subsection: subsectionB10._id,
        text: "How would you rate the quality of your sleep over the past month?",
        options: [
          { text: "Generally good, restful sleep", score: 1 },
          { text: "Fair sleep with some difficulties", score: 3 },
          { text: "Poor sleep - rarely feel rested", score: 5 },
        ],
        order: 1,
      },
      {
        subsection: subsectionB10._id,
        text: "How long does it typically take you to fall asleep after getting into bed?",
        options: [
          { text: "30 minutes or less", score: 1 },
          { text: "30-60 minutes", score: 3 },
          { text: "More than 60 minutes regularly", score: 5 },
        ],
        order: 2,
      },
      {
        subsection: subsectionB10._id,
        text: "Do you snore loudly, gasp for air, or stop breathing during sleep?",
        options: [
          { text: "No, normal breathing during sleep", score: 1 },
          { text: "Occasional light snoring", score: 3 },
          { text: "Regular loud snoring or breathing interruptions", score: 5 },
        ],
        order: 3,
      },
      {
        subsection: subsectionB10._id,
        text: "How often do you feel excessively sleepy during the day despite adequate time in bed?",
        options: [
          { text: "Rarely feel inappropriately sleepy", score: 1 },
          { text: "Occasionally drowsy during boring activities", score: 3 },
          {
            text: "Frequently sleepy - interferes with daily activities",
            score: 5,
          },
        ],
        order: 4,
      },
      {
        subsection: subsectionB10._id,
        text: "How much do sleep problems affect your mood, concentration, or daily functioning?",
        options: [
          { text: "Little to no impact", score: 1 },
          { text: "Some impact but manageable", score: 3 },
          {
            text: "Significant impact on work, relationships, or safety",
            score: 5,
          },
        ],
        order: 5,
      },
    ]);

    // Subsection B11: Sexual Dysfunctions
    const subsectionB11 = await Subsection.create({
      section: sectionB._id,
      title: "Sexual Dysfunctions",
      order: 11,
    });

    await Question.insertMany([
      {
        subsection: subsectionB11._id,
        text: "How would you rate your level of sexual desire or interest over the past few months?",
        options: [
          { text: "Normal or satisfactory level", score: 1 },
          { text: "Somewhat lower than usual but not distressing", score: 3 },
          { text: "Very low or absent - causes personal distress", score: 5 },
        ],
        order: 1,
      },
      {
        subsection: subsectionB11._id,
        text: "How satisfied are you with your sexual arousal and response during intimate activities?",
        options: [
          { text: "Generally satisfied", score: 1 },
          { text: "Sometimes dissatisfied but manageable", score: 3 },
          {
            text: "Frequently dissatisfied - significant problems with arousal",
            score: 5,
          },
        ],
        order: 2,
      },
      {
        subsection: subsectionB11._id,
        text: "Do you experience physical discomfort or pain during sexual activities?",
        options: [
          { text: "Rarely or never", score: 1 },
          { text: "Occasionally but manageable", score: 3 },
          { text: "Frequently - causes distress or avoidance", score: 5 },
        ],
        order: 3,
      },
      {
        subsection: subsectionB11._id,
        text: "How much do sexual concerns affect your relationships or self-esteem?",
        options: [
          { text: "Little to no impact", score: 1 },
          { text: "Some impact but manageable", score: 3 },
          {
            text: "Significant impact on relationships or self-worth",
            score: 5,
          },
        ],
        order: 4,
      },
      {
        subsection: subsectionB11._id,
        text: "How long have you been experiencing sexual difficulties?",
        options: [
          { text: "No significant difficulties", score: 1 },
          { text: "Recent or intermittent problems", score: 3 },
          {
            text: "Persistent problems for months affecting quality of life",
            score: 5,
          },
        ],
        order: 5,
      },
    ]);

    // Subsection B12: Gender Dysphoria
    const subsectionB12 = await Subsection.create({
      section: sectionB._id,
      title: "Gender Dysphoria",
      order: 12,
    });

    await Question.insertMany([
      {
        subsection: subsectionB12._id,
        text: "How comfortable do you feel with the gender you were assigned at birth?",
        options: [
          { text: "Very comfortable - no concerns", score: 1 },
          { text: "Sometimes question but generally accepting", score: 3 },
          {
            text: "Significant discomfort - doesn't match how I feel inside",
            score: 5,
          },
        ],
        order: 1,
      },
      {
        subsection: subsectionB12._id,
        text: "How often do you think about or wish you were a different gender?",
        options: [
          { text: "Rarely or never", score: 1 },
          { text: "Occasionally but not distressing", score: 3 },
          {
            text: "Frequently - these thoughts are persistent and distressing",
            score: 5,
          },
        ],
        order: 2,
      },
      {
        subsection: subsectionB12._id,
        text: "How do you feel about your body's physical characteristics related to gender?",
        options: [
          { text: "Generally comfortable and accepting", score: 1 },
          { text: "Some discomfort but manageable", score: 3 },
          {
            text: "Significant distress about physical characteristics",
            score: 5,
          },
        ],
        order: 3,
      },
      {
        subsection: subsectionB12._id,
        text: "Do you prefer to dress, act, or be treated as a gender different from your birth assignment?",
        options: [
          { text: "No, comfortable with birth gender expression", score: 1 },
          { text: "Sometimes prefer different expression", score: 3 },
          {
            text: "Strong preference for different gender expression",
            score: 5,
          },
        ],
        order: 4,
      },
      {
        subsection: subsectionB12._id,
        text: "How much distress do gender-related concerns cause in your daily life?",
        options: [
          { text: "No distress", score: 1 },
          { text: "Some distress but manageable", score: 3 },
          {
            text: "Significant distress affecting relationships, work, or functioning",
            score: 5,
          },
        ],
        order: 5,
      },
    ]);

    // Subsection B13: Disruptive, Impulse-Control, and Conduct Disorders
    const subsectionB13 = await Subsection.create({
      section: sectionB._id,
      title: "Disruptive, Impulse-Control, and Conduct Disorders",
      order: 13,
    });

    await Question.insertMany([
      {
        subsection: subsectionB13._id,
        text: "How well can you control your temper when frustrated or angry?",
        options: [
          { text: "Generally good control", score: 1 },
          { text: "Sometimes lose control but manageable", score: 3 },
          {
            text: "Frequently lose control - explosive anger episodes",
            score: 5,
          },
        ],
        order: 1,
      },
      {
        subsection: subsectionB13._id,
        text: "Do you ever act impulsively in ways that could be harmful to yourself or others?",
        options: [
          { text: "Rarely impulsive decisions", score: 1 },
          { text: "Occasionally impulsive but minor consequences", score: 3 },
          { text: "Frequently impulsive - serious consequences", score: 5 },
        ],
        order: 2,
      },
      {
        subsection: subsectionB13._id,
        text: "How do you typically respond to rules, authority figures, or social expectations?",
        options: [
          { text: "Generally respectful and compliant", score: 1 },
          { text: "Sometimes resistant but manageable", score: 3 },
          {
            text: "Frequently defiant or in conflict with authority",
            score: 5,
          },
        ],
        order: 3,
      },
      {
        subsection: subsectionB13._id,
        text: "Have you engaged in behaviors that violate others' rights or social norms?",
        options: [
          { text: "No, I respect others' rights", score: 1 },
          { text: "Minor violations but learned from them", score: 3 },
          {
            text: "Pattern of violating others' rights or social rules",
            score: 5,
          },
        ],
        order: 4,
      },
      {
        subsection: subsectionB13._id,
        text: "How much do impulse control issues affect your relationships, work, or legal standing?",
        options: [
          { text: "Little to no impact", score: 1 },
          { text: "Some impact but manageable", score: 3 },
          {
            text: "Significant problems with relationships, employment, or legal issues",
            score: 5,
          },
        ],
        order: 5,
      },
    ]);

    // Subsection B14: Substance-Related and Addictive Disorders
    const subsectionB14 = await Subsection.create({
      section: sectionB._id,
      title: "Substance-Related and Addictive Disorders",
      order: 14,
    });

    await Question.insertMany([
      {
        subsection: subsectionB14._id,
        text: "How often do you use alcohol, drugs, or other substances to cope with stress or emotions?",
        options: [
          { text: "Rarely or never", score: 1 },
          { text: "Occasionally but in control", score: 3 },
          { text: "Frequently - primary coping mechanism", score: 5 },
        ],
        order: 1,
      },
      {
        subsection: subsectionB14._id,
        text: "Have you ever felt that you should cut down on your substance use?",
        options: [
          { text: "No concerns about my use", score: 1 },
          { text: "Occasionally wondered if I should cut back", score: 3 },
          { text: "Frequently think I need to reduce or stop", score: 5 },
        ],
        order: 2,
      },
      {
        subsection: subsectionB14._id,
        text: "How much time do you spend thinking about, obtaining, or using substances?",
        options: [
          { text: "Minimal time - not a focus", score: 1 },
          { text: "Some time but balanced with other activities", score: 3 },
          {
            text: "Significant time - interferes with other responsibilities",
            score: 5,
          },
        ],
        order: 3,
      },
      {
        subsection: subsectionB14._id,
        text: "What happens when you try to stop or reduce your substance use?",
        options: [
          { text: "No difficulty stopping when I choose", score: 1 },
          { text: "Some discomfort but manageable", score: 3 },
          { text: "Significant physical or emotional distress", score: 5 },
        ],
        order: 4,
      },
      {
        subsection: subsectionB14._id,
        text: "How has substance use affected your work, relationships, or health?",
        options: [
          { text: "No negative impact", score: 1 },
          { text: "Minor impact but manageable", score: 3 },
          { text: "Serious impact on multiple life areas", score: 5 },
        ],
        order: 5,
      },
    ]);

    // Subsection B15: Neurocognitive Disorders
    const subsectionB15 = await Subsection.create({
      section: sectionB._id,
      title: "Neurocognitive Disorders",
      order: 15,
    });

    await Question.insertMany([
      {
        subsection: subsectionB15._id,
        text: "How would you rate your memory compared to how it was a few years ago?",
        options: [
          { text: "About the same or normal age-related changes", score: 1 },
          { text: "Somewhat worse but manageable", score: 3 },
          {
            text: "Significantly worse - interferes with daily activities",
            score: 5,
          },
        ],
        order: 1,
      },
      {
        subsection: subsectionB15._id,
        text: "Do you have difficulty finding words, following conversations, or understanding complex information?",
        options: [
          { text: "No significant difficulties", score: 1 },
          { text: "Occasional problems but minor", score: 3 },
          { text: "Frequent problems that others notice", score: 5 },
        ],
        order: 2,
      },
      {
        subsection: subsectionB15._id,
        text: "How well can you handle tasks that require planning, organizing, or problem-solving?",
        options: [
          { text: "Handle complex tasks well", score: 1 },
          { text: "Some difficulty but can complete tasks", score: 3 },
          {
            text: "Significant difficulty - need help with complex tasks",
            score: 5,
          },
        ],
        order: 3,
      },
      {
        subsection: subsectionB15._id,
        text: "Have others expressed concerns about changes in your thinking, judgment, or behavior?",
        options: [
          { text: "No concerns from others", score: 1 },
          { text: "Minor concerns but dismissed", score: 3 },
          { text: "Multiple people have expressed serious concerns", score: 5 },
        ],
        order: 4,
      },
      {
        subsection: subsectionB15._id,
        text: "How much do thinking or memory problems interfere with your independence and daily functioning?",
        options: [
          { text: "No interference - fully independent", score: 1 },
          { text: "Some interference but mostly independent", score: 3 },
          {
            text: "Significant interference - need assistance with daily activities",
            score: 5,
          },
        ],
        order: 5,
      },
    ]);

    // ===== SECTION C: RESILIENCE & COPING MECHANISMS =====
    const sectionC = await Section.create({
      name: "Resilience & Coping Mechanisms",
      description: "Assessment of coping strategies and resilience factors",
      duration: "15-20 minutes",
      order: 3,
    });

    // Subsection C1: Memory & Attention
    const subsectionC1 = await Subsection.create({
      section: sectionC._id,
      title: "Memory & Attention",
      order: 1,
    });

    await Question.insertMany([
      {
        subsection: subsectionC1._id,
        text: "How would you rate your ability to remember conversations from yesterday?",
        options: [
          { text: "Excellent", score: 1 },
          { text: "Good", score: 3 },
          { text: "Fair or Poor", score: 5 },
        ],
        order: 1,
      },
      {
        subsection: subsectionC1._id,
        text: "When given a list of 5 items, how many can you recall after 10 minutes?",
        options: [
          { text: "All 5", score: 1 },
          { text: "3-4", score: 3 },
          { text: "2 or fewer", score: 5 },
        ],
        order: 2,
      },
      {
        subsection: subsectionC1._id,
        text: "How long can you focus on a single task without distraction?",
        options: [
          { text: "Over 1 hour", score: 1 },
          { text: "30-60 minutes", score: 3 },
          { text: "Less than 30 minutes", score: 5 },
        ],
        order: 3,
      },
      {
        subsection: subsectionC1._id,
        text: "When reading, how often does your mind wander?",
        options: [
          { text: "Rarely", score: 1 },
          { text: "Occasionally", score: 3 },
          { text: "Frequently", score: 5 },
        ],
        order: 4,
      },
      {
        subsection: subsectionC1._id,
        text: "In meetings, how often do you miss information due to attention drift?",
        options: [
          { text: "Never or rarely", score: 1 },
          { text: "Sometimes", score: 3 },
          { text: "Often or almost always", score: 5 },
        ],
        order: 5,
      },
    ]);

    // Subsection C2: Executive Function & Decision Making
    const subsectionC2 = await Subsection.create({
      section: sectionC._id,
      title: "Executive Function & Decision Making",
      order: 2,
    });

    await Question.insertMany([
      {
        subsection: subsectionC2._id,
        text: "When faced with complex multi-step tasks, how do you approach them?",
        options: [
          { text: "Systematically and efficiently", score: 1 },
          { text: "Plan but get sidetracked", score: 3 },
          { text: "Feel overwhelmed or start without planning", score: 5 },
        ],
        order: 1,
      },
      {
        subsection: subsectionC2._id,
        text: "How well do you control impulses (interrupting, hasty decisions)?",
        options: [
          { text: "Very well", score: 1 },
          { text: "Moderately well", score: 3 },
          { text: "Poorly", score: 5 },
        ],
        order: 2,
      },
      {
        subsection: subsectionC2._id,
        text: "When learning new information, how quickly do you grasp concepts?",
        options: [
          { text: "Very quickly", score: 1 },
          { text: "Moderately quickly", score: 3 },
          { text: "Slowly", score: 5 },
        ],
        order: 3,
      },
      {
        subsection: subsectionC2._id,
        text: "How do you feel about your mental speed compared to others your age?",
        options: [
          { text: "Faster", score: 1 },
          { text: "About the same", score: 3 },
          { text: "Somewhat slower or much slower", score: 5 },
        ],
        order: 4,
      },
      {
        subsection: subsectionC2._id,
        text: "How well do you manage daily activities (cooking, cleaning, finances)?",
        options: [
          { text: "Very well", score: 1 },
          { text: "Adequately", score: 3 },
          { text: "Poorly", score: 5 },
        ],
        order: 5,
      },
    ]);

    // Subsection C3: Stress Management & Adaptation
    const subsectionC3 = await Subsection.create({
      section: sectionC._id,
      title: "Stress Management & Adaptation",
      order: 3,
    });

    await Question.insertMany([
      {
        subsection: subsectionC3._id,
        text: "When faced with setbacks, how do you typically respond?",
        options: [
          { text: "Bounce back quickly", score: 1 },
          { text: "Take some time but overcome", score: 3 },
          { text: "Struggle or feel overwhelmed", score: 5 },
        ],
        order: 1,
      },
      {
        subsection: subsectionC3._id,
        text: "How confident are you in handling life's challenges?",
        options: [
          { text: "Very confident", score: 1 },
          { text: "Somewhat confident", score: 3 },
          { text: "Not confident", score: 5 },
        ],
        order: 2,
      },
      {
        subsection: subsectionC3._id,
        text: "How many close friends/family can you confide in?",
        options: [
          { text: "3 or more", score: 1 },
          { text: "1-2", score: 3 },
          { text: "None", score: 5 },
        ],
        order: 3,
      },
      {
        subsection: subsectionC3._id,
        text: "How often do you engage in meaningful social activities?",
        options: [
          { text: "Several times a week or more", score: 1 },
          { text: "Once a week", score: 3 },
          { text: "Rarely or never", score: 5 },
        ],
        order: 4,
      },
      {
        subsection: subsectionC3._id,
        text: "How would you rate your current stress level?",
        options: [
          { text: "Low, manageable", score: 1 },
          { text: "Moderate", score: 3 },
          { text: "High or extremely high", score: 5 },
        ],
        order: 5,
      },
    ]);

    // ===== SECTION D: COMPREHENSIVE BRAIN HEALTH BIOMARKERS =====
    const sectionD = await Section.create({
      name: "Comprehensive Brain Health Biomarkers",
      description: "Assessment of physical and cognitive biomarkers",
      duration: "20-25 minutes",
      order: 4,
    });

    // Subsection D1: Cognitive Biomarkers
    const subsectionD1 = await Subsection.create({
      section: sectionD._id,
      title: "Cognitive Biomarkers",
      order: 1,
    });

    await Question.insertMany([
      {
        subsection: subsectionD1._id,
        text: "Memory: How often do you forget recent conversations or appointments?",
        options: [
          { text: "Rarely", score: 1 },
          { text: "Sometimes", score: 3 },
          { text: "Often", score: 5 },
        ],
        order: 1,
      },
      {
        subsection: subsectionD1._id,
        text: "Attention: How easily do you get distracted when working or reading?",
        options: [
          { text: "Not easily", score: 1 },
          { text: "Occasionally", score: 3 },
          { text: "Very easily", score: 5 },
        ],
        order: 2,
      },
      {
        subsection: subsectionD1._id,
        text: "Processing Speed: How quickly can you complete mental tasks compared to your peers?",
        options: [
          { text: "Faster", score: 1 },
          { text: "About the same", score: 3 },
          { text: "Slower", score: 5 },
        ],
        order: 3,
      },
      {
        subsection: subsectionD1._id,
        text: "Executive Function (Planning): How well do you organize and plan daily activities?",
        options: [
          { text: "Very well", score: 1 },
          { text: "Adequately", score: 3 },
          { text: "Poorly", score: 5 },
        ],
        order: 4,
      },
      {
        subsection: subsectionD1._id,
        text: "Executive Function (Decision-Making): How confident are you in making important decisions?",
        options: [
          { text: "Very confident", score: 1 },
          { text: "Sometimes unsure", score: 3 },
          { text: "Often struggle", score: 5 },
        ],
        order: 5,
      },
      {
        subsection: subsectionD1._id,
        text: "Impulse Control: How often do you act without thinking?",
        options: [
          { text: "Rarely", score: 1 },
          { text: "Sometimes", score: 3 },
          { text: "Often", score: 5 },
        ],
        order: 6,
      },
      {
        subsection: subsectionD1._id,
        text: "Language (Naming): How easily can you name common objects?",
        options: [
          { text: "Very easily", score: 1 },
          { text: "Sometimes hesitate", score: 3 },
          { text: "Often struggle", score: 5 },
        ],
        order: 7,
      },
      {
        subsection: subsectionD1._id,
        text: "Language (Comprehension): How well do you understand complex instructions?",
        options: [
          { text: "Very well", score: 1 },
          { text: "Sometimes need clarification", score: 3 },
          { text: "Often confused", score: 5 },
        ],
        order: 8,
      },
      {
        subsection: subsectionD1._id,
        text: "Visuospatial Skills: How well can you navigate new places?",
        options: [
          { text: "Very well", score: 1 },
          { text: "Sometimes get lost", score: 3 },
          { text: "Often get lost", score: 5 },
        ],
        order: 9,
      },
      {
        subsection: subsectionD1._id,
        text: "Working Memory: How well do you remember information just given to you?",
        options: [
          { text: "Very well", score: 1 },
          { text: "Sometimes forget", score: 3 },
          { text: "Often forget", score: 5 },
        ],
        order: 10,
      },
    ]);

    // Subsection D2: Physical & Neurological Biomarkers
    const subsectionD2 = await Subsection.create({
      section: sectionD._id,
      title: "Physical & Neurological Biomarkers",
      order: 2,
    });

    await Question.insertMany([
      {
        subsection: subsectionD2._id,
        text: "Balance: How steady do you feel when walking or standing?",
        options: [
          { text: "Always steady", score: 1 },
          { text: "Occasionally unsteady", score: 3 },
          { text: "Often unsteady", score: 5 },
        ],
        order: 1,
      },
      {
        subsection: subsectionD2._id,
        text: "Coordination: How easily can you perform tasks requiring hand-eye coordination?",
        options: [
          { text: "Easily", score: 1 },
          { text: "Sometimes struggle", score: 3 },
          { text: "Often struggle", score: 5 },
        ],
        order: 2,
      },
      {
        subsection: subsectionD2._id,
        text: "Fine Motor Skills: How well can you handle small objects (e.g., buttons, coins)?",
        options: [
          { text: "Very well", score: 1 },
          { text: "Some difficulty", score: 3 },
          { text: "Significant difficulty", score: 5 },
        ],
        order: 3,
      },
      {
        subsection: subsectionD2._id,
        text: "Reflexes: Do you notice any changes in your reflexes or reaction time?",
        options: [
          { text: "No changes", score: 1 },
          { text: "Some slowing", score: 3 },
          { text: "Much slower", score: 5 },
        ],
        order: 4,
      },
      {
        subsection: subsectionD2._id,
        text: "Muscle Strength: How would you rate your muscle strength for your age?",
        options: [
          { text: "Above average", score: 1 },
          { text: "Average", score: 3 },
          { text: "Below average", score: 5 },
        ],
        order: 5,
      },
      {
        subsection: subsectionD2._id,
        text: "Sensory Function: Have you noticed changes in your sense of touch, pain, or temperature?",
        options: [
          { text: "No changes", score: 1 },
          { text: "Mild changes", score: 3 },
          { text: "Significant changes", score: 5 },
        ],
        order: 6,
      },
      {
        subsection: subsectionD2._id,
        text: "Vision: How is your vision (with glasses/contacts if needed)?",
        options: [
          { text: "Clear", score: 1 },
          { text: "Occasionally blurry", score: 3 },
          { text: "Frequently blurry", score: 5 },
        ],
        order: 7,
      },
      {
        subsection: subsectionD2._id,
        text: "Hearing: How well do you hear conversations in a quiet room?",
        options: [
          { text: "Very well", score: 1 },
          { text: "Some difficulty", score: 3 },
          { text: "Great difficulty", score: 5 },
        ],
        order: 8,
      },
      {
        subsection: subsectionD2._id,
        text: "Gait: How would you describe your walking?",
        options: [
          { text: "Smooth and steady", score: 1 },
          { text: "Sometimes unsteady", score: 3 },
          { text: "Often unsteady or shuffling", score: 5 },
        ],
        order: 9,
      },
      {
        subsection: subsectionD2._id,
        text: "Tremors: Do you experience shaking or tremors in your hands?",
        options: [
          { text: "Never", score: 1 },
          { text: "Occasionally", score: 3 },
          { text: "Frequently", score: 5 },
        ],
        order: 10,
      },
    ]);

    // Subsection D3: Medical & Laboratory Biomarkers
    const subsectionD3 = await Subsection.create({
      section: sectionD._id,
      title: "Medical & Laboratory Biomarkers",
      order: 3,
    });

    await Question.insertMany([
      {
        subsection: subsectionD3._id,
        text: "Blood Pressure: How is your blood pressure?",
        options: [
          { text: "Normal", score: 1 },
          { text: "Occasionally high/low", score: 3 },
          { text: "Frequently high/low", score: 5 },
        ],
        order: 1,
      },
      {
        subsection: subsectionD3._id,
        text: "Blood Sugar (HbA1c): Have you been told your blood sugar is:",
        options: [
          { text: "Normal", score: 1 },
          { text: "Borderline", score: 3 },
          { text: "High", score: 5 },
        ],
        order: 2,
      },
      {
        subsection: subsectionD3._id,
        text: "Cholesterol: How is your cholesterol?",
        options: [
          { text: "Normal", score: 1 },
          { text: "Borderline", score: 3 },
          { text: "High", score: 5 },
        ],
        order: 3,
      },
      {
        subsection: subsectionD3._id,
        text: "Thyroid Function: Have you ever had thyroid problems?",
        options: [
          { text: "Never", score: 1 },
          { text: "Mild/treated", score: 3 },
          { text: "Ongoing/untreated", score: 5 },
        ],
        order: 4,
      },
      {
        subsection: subsectionD3._id,
        text: "Vitamin B12: Have you had low B12 levels?",
        options: [
          { text: "Never", score: 1 },
          { text: "Once", score: 3 },
          { text: "Multiple times", score: 5 },
        ],
        order: 5,
      },
      {
        subsection: subsectionD3._id,
        text: "Vitamin D: How often are you in the sun or take vitamin D supplements?",
        options: [
          { text: "Daily", score: 1 },
          { text: "Occasionally", score: 3 },
          { text: "Rarely/Never", score: 5 },
        ],
        order: 6,
      },
      {
        subsection: subsectionD3._id,
        text: "Inflammation (CRP): Have you been told you have high inflammation markers?",
        options: [
          { text: "Never", score: 1 },
          { text: "Once", score: 3 },
          { text: "Multiple times", score: 5 },
        ],
        order: 7,
      },
      {
        subsection: subsectionD3._id,
        text: "Liver Function: Any history of liver problems?",
        options: [
          { text: "Never", score: 1 },
          { text: "Mild/treated", score: 3 },
          { text: "Ongoing/untreated", score: 5 },
        ],
        order: 8,
      },
      {
        subsection: subsectionD3._id,
        text: "Kidney Function: Any history of kidney problems?",
        options: [
          { text: "Never", score: 1 },
          { text: "Mild/treated", score: 3 },
          { text: "Ongoing/untreated", score: 5 },
        ],
        order: 9,
      },
      {
        subsection: subsectionD3._id,
        text: "Genetic Risk (Family History): Any family history of dementia, stroke, or neurodegenerative disease?",
        options: [
          { text: "No", score: 1 },
          { text: "Distant relative", score: 3 },
          { text: "Close Relative", score: 5 },
        ],
        order: 10,
      },
    ]);

    // Subsection D4: Lifestyle Biomarkers
    const subsectionD4 = await Subsection.create({
      section: sectionD._id,
      title: "Lifestyle Biomarkers",
      order: 4,
    });

    await Question.insertMany([
      {
        subsection: subsectionD4._id,
        text: "Physical Activity: How often do you exercise?",
        options: [
          { text: "5+ times/week", score: 1 },
          { text: "2-4 times/week", score: 3 },
          { text: "Rarely/never", score: 5 },
        ],
        order: 1,
      },
      {
        subsection: subsectionD4._id,
        text: "Diet: How would you rate your diet?",
        options: [
          { text: "Balanced and healthy", score: 1 },
          { text: "Moderately healthy", score: 3 },
          { text: "Poor", score: 5 },
        ],
        order: 2,
      },
      {
        subsection: subsectionD4._id,
        text: "Sleep Duration: How many hours do you sleep per night?",
        options: [
          { text: "7-8 hours", score: 1 },
          { text: "5-6 or 9+ hours", score: 3 },
          { text: "Less than 5 hours", score: 5 },
        ],
        order: 3,
      },
      {
        subsection: subsectionD4._id,
        text: "Sleep Quality:",
        options: [
          { text: "Very restful", score: 1 },
          { text: "Sometimes restless", score: 3 },
          { text: "Frequently restless", score: 5 },
        ],
        order: 4,
      },
      {
        subsection: subsectionD4._id,
        text: "How often do you drink alcohol?",
        options: [
          { text: "Rarely/never", score: 1 },
          { text: "Occasionally", score: 3 },
          { text: "Frequently", score: 5 },
        ],
        order: 5,
      },
      {
        subsection: subsectionD4._id,
        text: "Do you smoke?",
        options: [
          { text: "Never", score: 1 },
          { text: "Used to", score: 3 },
          { text: "Currently", score: 5 },
        ],
        order: 6,
      },
      {
        subsection: subsectionD4._id,
        text: "Do you use recreational drugs?",
        options: [
          { text: "Never", score: 1 },
          { text: "Occasionally", score: 3 },
          { text: "Frequently", score: 5 },
        ],
        order: 7,
      },
      {
        subsection: subsectionD4._id,
        text: "How often do you interact with friends/family?",
        options: [
          { text: "Daily/weekly", score: 1 },
          { text: "Monthly", score: 3 },
          { text: "Rarely/never", score: 5 },
        ],
        order: 8,
      },
      {
        subsection: subsectionD4._id,
        text: "How often do you engage in mentally stimulating activities (reading, puzzles)?",
        options: [
          { text: "Daily", score: 1 },
          { text: "Weekly", score: 3 },
          { text: "Rarely/never", score: 5 },
        ],
        order: 9,
      },
      {
        subsection: subsectionD4._id,
        text: "How well do you manage stress?",
        options: [
          { text: "Very well", score: 1 },
          { text: "Moderately", score: 3 },
          { text: "Poorly", score: 5 },
        ],
        order: 10,
      },
    ]);

    // Subsection D5: Emotional & Mental Health Biomarkers
    const subsectionD5 = await Subsection.create({
      section: sectionD._id,
      title: "Emotional & Mental Health Biomarkers",
      order: 5,
    });

    await Question.insertMany([
      {
        subsection: subsectionD5._id,
        text: "How often do you feel sad or down?",
        options: [
          { text: "Rarely", score: 1 },
          { text: "Sometimes", score: 3 },
          { text: "Often", score: 5 },
        ],
        order: 1,
      },
      {
        subsection: subsectionD5._id,
        text: "How often do you feel anxious or worried?",
        options: [
          { text: "Rarely", score: 1 },
          { text: "Sometimes", score: 3 },
          { text: "Often", score: 5 },
        ],
        order: 2,
      },
      {
        subsection: subsectionD5._id,
        text: "How is your energy during the day?",
        options: [
          { text: "High", score: 1 },
          { text: "Moderate", score: 3 },
          { text: "Low", score: 5 },
        ],
        order: 3,
      },
      {
        subsection: subsectionD5._id,
        text: "How motivated do you feel to do daily tasks?",
        options: [
          { text: "Very motivated", score: 1 },
          { text: "Sometimes unmotivated", score: 3 },
          { text: "Often unmotivated", score: 5 },
        ],
        order: 4,
      },
      {
        subsection: subsectionD5._id,
        text: "How satisfied are you with your life overall?",
        options: [
          { text: "Very satisfied", score: 1 },
          { text: "Somewhat satisfied", score: 3 },
          { text: "Dissatisfied", score: 5 },
        ],
        order: 5,
      },
    ]);

    // Subsection D6: Functional Biomarkers
    const subsectionD6 = await Subsection.create({
      section: sectionD._id,
      title: "Functional Biomarkers",
      order: 6,
    });

    await Question.insertMany([
      {
        subsection: subsectionD6._id,
        text: "Daily Living Skills (ADLs): How well do you manage personal care (bathing, dressing)?",
        options: [
          { text: "Independently", score: 1 },
          { text: "Some assistance", score: 3 },
          { text: "Need help", score: 5 },
        ],
        order: 1,
      },
      {
        subsection: subsectionD6._id,
        text: "Instrumental Activities (IADLs): How well do you manage finances, shopping, and medications?",
        options: [
          { text: "Independently", score: 1 },
          { text: "Some assistance", score: 3 },
          { text: "Need help", score: 5 },
        ],
        order: 2,
      },
      {
        subsection: subsectionD6._id,
        text: "Independence: How independent are you in your daily life?",
        options: [
          { text: "Fully independent", score: 1 },
          { text: "Some support needed", score: 3 },
          { text: "Dependent on others", score: 5 },
        ],
        order: 3,
      },
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seedDatabase();
