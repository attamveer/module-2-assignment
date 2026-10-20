import {
    Ticket,
    TicketUrgencyData,
} from "../models/ticketModel";
import { tickets } from "../../../data/tickets";

const AGE_MULTIPLIER: number = 5;

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

/**
 * Calculates the urgency score based on ticket priority and age.
 */
export const calculateUrgencyScore = (
    ticket: Ticket
): { ticketAge: number; urgencyScore: number } => {

    // Calculate ticket age in days
    const currentDate: Date = new Date();
    const createdDate: Date = new Date(ticket.createdAt);

    const millisecondsPerDay: number = 1000 * 60 * 60 * 24;

    const ticketAge: number = Math.floor(
        (currentDate.getTime() - createdDate.getTime()) / millisecondsPerDay
    );

    // Determine base urgency score
    let baseScore: number = 10;

    if (ticket.priority === "critical") {
        baseScore = 50;
    } else if (ticket.priority === "high") {
        baseScore = 30;
    } else if (ticket.priority === "medium") {
        baseScore = 20;
    }

    // Calculate final urgency score
    const urgencyScore: number =
        ticket.status === "resolved"
            ? 0
            : baseScore + (ticketAge * AGE_MULTIPLIER);

    return {
        ticketAge,
        urgencyScore,
    };
};

/**
 * Determines the urgency level based on score and ticket status.
 */
export const calculateUrgencyLevel = (
    urgencyScore: number,
    status: Ticket["status"]
): string => {

    if (status === "resolved") {
        return "Minimal. Ticket resolved.";
    }

    if (urgencyScore >= 80) {
        return "Critical. Immediate attention required.";
    }

    if (urgencyScore >= 55) {
        return "High urgency. Prioritize resolution.";
    }

    if (urgencyScore >= 30) {
        return "Moderate. Schedule for attention.";
    }

    return "Low urgency. Address when capacity allows.";
};

/**
 * Retrieves a ticket with its calculated urgency information.
 */
export const getTicketUrgencyById = (
    id: number
): TicketUrgencyData | undefined => {

    const ticket: Ticket | undefined = getTicketById(id);

    if (!ticket) {
        return undefined;
    }

    const urgency: {
        ticketAge: number;
        urgencyScore: number;
    } = calculateUrgencyScore(ticket);

    const urgencyLevel: string = calculateUrgencyLevel(
        urgency.urgencyScore,
        ticket.status
    );

    const result: TicketUrgencyData = {
        id: ticket.id,
        title: ticket.title,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.createdAt,
        ticketAge: urgency.ticketAge,
        urgencyScore: urgency.urgencyScore,
        urgencyLevel: urgencyLevel,
    };

    return result;
};