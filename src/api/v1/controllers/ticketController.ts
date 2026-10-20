import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Ticket } from "../models/ticketModel";
import * as ticketService from "../services/ticketService";

/**
 * Retrieves all support tickets.
 */
export const getAllTickets = (_req: Request, res: Response): void => {
    const tickets: Ticket[] = ticketService.getAllTickets();

    res.status(HTTP_STATUS.OK).json(tickets);
};

/**
 * Retrieves a support ticket by ID.
 */
export const getTicketById = (req: Request, res: Response): void => {
    const id: number = Number(req.params.id);

    const ticket: Ticket | undefined = ticketService.getTicketById(id);

    if (!ticket) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
            message: "Ticket not found",
        });

        return;
    }

    res.status(HTTP_STATUS.OK).json(ticket);
};