import { Router } from "express";

import {
    getAllTickets,
    getTicketById,
    getTicketUrgency,
    createTicket,
    updateTicket,
    deleteTicket,
} from "../controllers/ticketController";

const router: Router = Router();

router.get("/tickets", getAllTickets);

router.get("/tickets/:id/urgency", getTicketUrgency);

router.get("/tickets/:id", getTicketById);

router.post("/tickets", createTicket);

router.put("/tickets/:id", updateTicket);

router.delete("/tickets/:id", deleteTicket);

export default router;