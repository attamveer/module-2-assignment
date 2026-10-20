import { Router } from "express";

import {
    getAllTickets,
    getTicketById,
} from "../controllers/ticketController";

const router: Router = Router();

router.get("/tickets", getAllTickets);

router.get("/tickets/:id", getTicketById);

export default router;