import request, { Response } from "supertest";
import app from "../src/app";
import { HTTP_STATUS } from "../src/constants/httpConstants";

describe("Ticket GET Routes", (): void => {

    describe("GET /api/v1/tickets", (): void => {

        it("should return all tickets", async (): Promise<void> => {
            // Arrange
            const endpoint: string = "/api/v1/tickets";

            // Act
            const response: Response = await request(app).get(endpoint);

            // Assert
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(7);
        });

    });

    describe("GET /api/v1/tickets/:id", (): void => {

        it("should return a ticket by ID", async (): Promise<void> => {
            // Arrange
            const endpoint: string = "/api/v1/tickets/3";

            // Act
            const response: Response = await request(app).get(endpoint);

            // Assert
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(response.body.id).toBe(3);
            expect(response.body.title).toBe("Dashboard loading slowly");
        });

        it("should return 404 for a missing ticket", async (): Promise<void> => {
            // Arrange
            const endpoint: string = "/api/v1/tickets/999";

            // Act
            const response: Response = await request(app).get(endpoint);

            // Assert
            expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
            expect(response.body.message).toBe("Ticket not found");
        });

    });

});

describe("POST /api/v1/tickets", (): void => {

    it("should create a new ticket", async (): Promise<void> => {
        // Arrange
        const newTicket = {
            title: "Test support ticket",
            description: "Testing ticket creation",
            priority: "high",
        };

        // Act
        const response: Response = await request(app)
            .post("/api/v1/tickets")
            .send(newTicket);

        // Assert
        expect(response.status).toBe(HTTP_STATUS.CREATED);
        expect(response.body.message).toBe("Ticket created");
        expect(response.body.data.title).toBe(newTicket.title);
        expect(response.body.data.status).toBe("open");
        expect(response.body.data).toHaveProperty("createdAt");
    });

    it("should reject a ticket without a title", async (): Promise<void> => {
        // Arrange
        const invalidTicket = {
            description: "Missing title",
            priority: "medium",
        };

        // Act
        const response: Response = await request(app)
            .post("/api/v1/tickets")
            .send(invalidTicket);

        // Assert
        expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.message).toBe("Missing required field: title");
    });

});

describe("PUT /api/v1/tickets/:id", (): void => {

    it("should reject an invalid ticket status", async (): Promise<void> => {
        // Arrange
        const invalidUpdate = {
            status: "closed",
        };

        // Act
        const response: Response = await request(app)
            .put("/api/v1/tickets/3")
            .send(invalidUpdate);

        // Assert
        expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.message).toBe(
            "Invalid status. Must be one of: open, in-progress, resolved"
        );
    });

});

describe("DELETE /api/v1/tickets/:id", (): void => {

    it("should delete an existing ticket", async (): Promise<void> => {
        // Arrange
        const newTicket = {
            title: "Ticket to delete",
            description: "Testing ticket deletion",
            priority: "low",
        };

        const createdResponse: Response = await request(app)
            .post("/api/v1/tickets")
            .send(newTicket);

        const ticketId: number = createdResponse.body.data.id;

        // Act
        const response: Response = await request(app)
            .delete(`/api/v1/tickets/${ticketId}`);

        // Assert
        expect(response.status).toBe(HTTP_STATUS.OK);
        expect(response.body.message).toBe("Ticket deleted");

        const deletedTicketResponse: Response = await request(app)
            .get(`/api/v1/tickets/${ticketId}`);

        expect(deletedTicketResponse.status).toBe(HTTP_STATUS.NOT_FOUND);
    });

});