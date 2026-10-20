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