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

/**
 * Creates a new support ticket.
 */
export const createTicket = (
    ticketData: Pick<Ticket, "title" | "description" | "priority">
): Ticket => {
    const nextId: number =
        Math.max(0, ...tickets.map((ticket: Ticket): number => ticket.id)) + 1;

    const newTicket: Ticket = {
        id: nextId,
        title: ticketData.title,
        description: ticketData.description,
        priority: ticketData.priority,
        status: "open",
        createdAt: new Date().toISOString(),
    };

    tickets.push(newTicket);

    return structuredClone(newTicket);
};

/**
 * Updates an existing support ticket.
 */
export const updateTicket = (
    id: number,
    updates: Partial<Pick<Ticket, "title" | "description" | "priority" | "status">>
): Ticket | undefined => {
    const ticket: Ticket | undefined = tickets.find(
        (ticket: Ticket): boolean => ticket.id === id
    );

    if (!ticket) {
        return undefined;
    }

    Object.assign(ticket, updates);

    return structuredClone(ticket);
};

/**
 * Deletes a support ticket.
 */
export const deleteTicket = (id: number): boolean => {
    const index: number = tickets.findIndex(
        (ticket: Ticket): boolean => ticket.id === id
    );

    if (index === -1) {
        return false;
    }

    tickets.splice(index, 1);

    return true;
};