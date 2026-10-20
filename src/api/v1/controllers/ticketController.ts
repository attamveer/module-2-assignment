import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Ticket, TicketPriority, TicketStatus, } from "../models/ticketModel";
import * as ticketService from "../services/ticketService";

const isTicketPriority = (value: unknown): value is TicketPriority => {
    return (
        value === "critical" ||
        value === "high" ||
        value === "medium" ||
        value === "low"
    );
};

const isTicketStatus = (value: unknown): value is TicketStatus => {
    return (
        value === "open" ||
        value === "in-progress" ||
        value === "resolved"
    );
};

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

/**
 * Creates a new support ticket.
 */
export const createTicket = (req: Request, res: Response): void => {
    const title: unknown = req.body?.title;
    const description: unknown = req.body?.description;
    const priority: unknown = req.body?.priority;

    // Validate title
    if (typeof title !== "string" || title.trim() === "") {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Missing required field: title",
        });

        return;
    }

    // Validate description
    if (typeof description !== "string" || description.trim() === "") {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Missing required field: description",
        });

        return;
    }

    // Validate priority
    if (!isTicketPriority(priority)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Invalid priority. Must be one of: critical, high, medium, low",
        });

        return;
    }

    const newTicket: Ticket = ticketService.createTicket({
        title: title,
        description: description,
        priority: priority,
    });

    res.status(HTTP_STATUS.CREATED).json({
        message: "Ticket created",
        data: newTicket,
    });
};

/**
 * Updates an existing support ticket.
 */
export const updateTicket = (req: Request, res: Response): void => {
    const id: number = Number(req.params.id);

    const existingTicket: Ticket | undefined = ticketService.getTicketById(id);

    if (!existingTicket) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
            message: "Ticket not found",
        });

        return;
    }

    const title: unknown = req.body?.title;
    const description: unknown = req.body?.description;
    const priority: unknown = req.body?.priority;
    const status: unknown = req.body?.status;

    // Validate priority if provided
    if (priority !== undefined && !isTicketPriority(priority)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Invalid priority. Must be one of: critical, high, medium, low",
        });

        return;
    }

    // Validate status if provided
    if (status !== undefined && !isTicketStatus(status)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Invalid status. Must be one of: open, in-progress, resolved",
        });

        return;
    }

    const updates: Partial<
        Pick<Ticket, "title" | "description" | "priority" | "status">
    > = {};

    if (typeof title === "string") {
        updates.title = title;
    }

    if (typeof description === "string") {
        updates.description = description;
    }

    if (isTicketPriority(priority)) {
        updates.priority = priority;
    }

    if (isTicketStatus(status)) {
        updates.status = status;
    }

    const updatedTicket: Ticket | undefined =
        ticketService.updateTicket(id, updates);

    res.status(HTTP_STATUS.OK).json({
        message: "Ticket updated",
        data: updatedTicket,
    });
};

/**
 * Deletes an existing support ticket.
 */
export const deleteTicket = (req: Request, res: Response): void => {
    const id: number = Number(req.params.id);

    const deleted: boolean = ticketService.deleteTicket(id);

    if (!deleted) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
            message: "Ticket not found",
        });

        return;
    }

    res.status(HTTP_STATUS.OK).json({
        message: "Ticket deleted",
    });
};