import request, { Response } from "supertest";
import app from "../src/app";
import { HTTP_STATUS } from "../src/constants/httpConstants";

describe("GET /api/v1/health", (): void => {
    it("should return server health status", async (): Promise<void> => {
        // Arrange
        const endpoint: string = "/api/v1/health";

        // Act
        const response: Response = await request(app).get(endpoint);

        // Assert
        expect(response.status).toBe(HTTP_STATUS.OK);
        expect(response.body.status).toBe("OK");
        expect(response.body).toHaveProperty("uptime");
        expect(response.body).toHaveProperty("timestamp");
        expect(response.body).toHaveProperty("version");
    });
});