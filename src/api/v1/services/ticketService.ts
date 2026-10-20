import { Ticket } from "../models/ticketModel";
import { tickets } from "../../../data/tickets";

/**
 * Retrieves all support tickets.
 */
export const getAllTickets = (): Ticket[] => {
    return structuredClone(tickets);
};

/**
 * Retrieves a support ticket by its ID.
 */
export const getTicketById = (id: number): Ticket | undefined => {
    const ticket: Ticket | undefined = tickets.find(
        (ticket: Ticket) => ticket.id === id
    );

    return ticket ? structuredClone(ticket) : undefined;
};