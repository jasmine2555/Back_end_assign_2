import express from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
  urgency
} from "../controllers/ticketController";

const router = express.Router();

router.get("/tickets", getAll);
router.get("/tickets/:id", getById);
router.post("/tickets", create);
router.put("/tickets/:id", update);
router.delete("/tickets/:id", remove);
router.get("/tickets/:id/urgency", urgency);

export default router;
