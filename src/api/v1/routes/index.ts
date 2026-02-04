import express, { Router } from "express";
import ticketRoutes from "./ticketRoutes";
import { healthCheck } from "../controllers/ticketController";

const router: Router = express.Router();

router.get("/health", healthCheck);
router.use("/", ticketRoutes);

export default router;
