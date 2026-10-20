import { Ticket } from "../src/api/v1/models/ticketModel";
import { calculateUrgencyScore } from "../src/api/v1/services/ticketService";

describe("Ticket Urgency Service", (): void => {

    it("should calculate urgency for a low priority ticket", (): void => {
        // Arrange
        const createdAt: string = new Date(
            Date.now() - (3 * 24 * 60 * 60 * 1000)
        ).toISOString();

        const ticket: Ticket = {
            id: 1,
            title: "Test Low Ticket",
            description: "Low priority test",
            priority: "low",
            status: "open",
            createdAt,
        };

        // Act
        const result = calculateUrgencyScore(ticket);

        // Assert
        expect(result.ticketAge).toBe(3);
        expect(result.urgencyScore).toBe(25);
    });

    it("should calculate urgency for a medium priority ticket", (): void => {
        // Arrange
        const createdAt: string = new Date(
            Date.now() - (6 * 24 * 60 * 60 * 1000)
        ).toISOString();

        const ticket: Ticket = {
            id: 2,
            title: "Test Medium Ticket",
            description: "Medium priority test",
            priority: "medium",
            status: "open",
            createdAt,
        };

        // Act
        const result = calculateUrgencyScore(ticket);

        // Assert
        expect(result.ticketAge).toBe(6);
        expect(result.urgencyScore).toBe(50);
    });

    it("should calculate urgency for a critical priority ticket", (): void => {
        // Arrange
        const createdAt: string = new Date(
            Date.now() - (6 * 24 * 60 * 60 * 1000)
        ).toISOString();

        const ticket: Ticket = {
            id: 3,
            title: "Test Critical Ticket",
            description: "Critical priority test",
            priority: "critical",
            status: "open",
            createdAt,
        };

        // Act
        const result = calculateUrgencyScore(ticket);

        // Assert
        expect(result.ticketAge).toBe(6);
        expect(result.urgencyScore).toBe(80);
    });

    it("should return zero urgency for a resolved ticket", (): void => {
        // Arrange
        const createdAt: string = new Date(
            Date.now() - (10 * 24 * 60 * 60 * 1000)
        ).toISOString();

        const ticket: Ticket = {
            id: 7,
            title: "Dark mode toggle broken",
            description: "Dark mode doesn't persist after refresh",
            priority: "medium",
            status: "resolved",
            createdAt,
        };

        // Act
        const result = calculateUrgencyScore(ticket);

        // Assert
        expect(result.ticketAge).toBe(10);
        expect(result.urgencyScore).toBe(0);
    });

});