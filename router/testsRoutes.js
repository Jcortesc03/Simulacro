import express from "express";
import {saveSimulationAttemptHandler, saveSimulationHandler, saveSimulationQuestionsHandler} from "../controllers/testsController.js";
import verified from '../middlewares/verifyToken.js'
import { verifyAdmin } from "../middlewares/verifyRole.js";

const router = express.Router();

router.post('/saveSimulation', verified, saveSimulationHandler);
router.post('/saveSimulationAttempt', verified, saveSimulationAttemptHandler);
router.post('/saveSimulationQuestion', verified, verifyAdmin, saveSimulationQuestionsHandler);

export default router;