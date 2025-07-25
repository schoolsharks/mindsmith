import express from 'express';
import {
  getAssessmentStructure,
  getQuestions,
  submitResponse,
  getResults
} from '../assessment.controller';
import { authenticateUser } from '../../../middlewares/authMiddleware';
import { checkPaymentStatus } from '../../../middlewares/paymentStatus';

const router = express.Router();

// Public endpoints
router.get('/structure', getAssessmentStructure);

// Protected endpoints (require auth and payment)
router.get('/:sectionId/questions', authenticateUser, checkPaymentStatus, getQuestions);
router.post('/:sectionId/responses', authenticateUser, checkPaymentStatus, submitResponse);
router.get('/results', authenticateUser, checkPaymentStatus, getResults);

// No Protection API
// router.get('/:sectionId/questions', getQuestions);
// router.post('/:sectionId/responses', submitResponse);
// router.get('/results', getResults);

export default router;