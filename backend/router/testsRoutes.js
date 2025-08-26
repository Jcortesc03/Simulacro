import express from "express";
import {saveSimulationAttemptHandler, saveSimulationHandler, saveSimulationQuestionsHandler, getTestsByUserHandler, getSimulationAttemptsHandler, getStudentTestsHandler} from "../controllers/testsController.js";
import verified from '../middlewares/verifyToken.js'
import { verifyAdmin, verifyTeacher } from "../middlewares/verifyRole.js";

const router = express.Router();

router.post('/saveSimulation', verified, verifyTeacher, saveSimulationHandler);
router.post('/saveSimulationAttempt', verified, saveSimulationAttemptHandler);
router.post('/saveSimulationQuestion', verified, verifyAdmin, saveSimulationQuestionsHandler);
router.post('/getSimulations', verified, getTestsByUserHandler);
router.get('/allSimulations', getSimulationAttemptsHandler);
router.get('/student-history', verified, getStudentTestsHandler);


export default router;
