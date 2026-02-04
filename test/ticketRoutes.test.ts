import request from "supertest";
import express from "express";
import v1Routes from "../src/api/v1/routes";

const app = express();
app.use(express.json());
app.use("/api/v1", v1Routes);

describe("Ticket Routes", () => {
  describe("GET /api/v1/health", () => {
    it("should return 200 and status OK", async () => {
      const res = await request(app).get("/api/v1/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("OK");
    });
  });

  describe("POST /api/v1/tickets", () => {
    it("should create a ticket with 201", async () => {
      const res = await request(app).post("/api/v1/tickets").send({
        title: "Test ticket",
        description: "Test description",
        priority: "low"
      });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe("Test ticket");
      expect(res.body.status).toBe("open");
      expect(res.body.createdAt).toBeTruthy();
    });

    it("should return 400 for missing title", async () => {
      const res = await request(app).post("/api/v1/tickets").send({
        description: "Test description",
        priority: "low"
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Missing required field: title");
    });
  });

  describe("GET /api/v1/tickets/:id", () => {
    it("should return 404 if ticket not found", async () => {
      const res = await request(app).get("/api/v1/tickets/999999");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Ticket not found");
    });
  });

  describe("PUT /api/v1/tickets/:id", () => {
    it("should return 400 for invalid priority", async () => {
      const created = await request(app).post("/api/v1/tickets").send({
        title: "Update priority test",
        description: "desc",
        priority: "low"
      });

      const id = created.body.id;

      const res = await request(app).put(`/api/v1/tickets/${id}`).send({
        priority: "urgent"
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        "Invalid priority. Must be one of: critical, high, medium, low"
      );
    });
  });

  describe("DELETE /api/v1/tickets/:id", () => {
    it("should delete ticket and return 200", async () => {
      const created = await request(app).post("/api/v1/tickets").send({
        title: "Delete me",
        description: "desc",
        priority: "medium"
      });

      const id = created.body.id;

      const res = await request(app).delete(`/api/v1/tickets/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Ticket deleted");
    });
  });

  describe("GET /api/v1/tickets/:id/urgency", () => {
    it("should return urgency fields", async () => {
      const created = await request(app).post("/api/v1/tickets").send({
        title: "Urgency test",
        description: "desc",
        priority: "high"
      });

      const id = created.body.id;

      const res = await request(app).get(`/api/v1/tickets/${id}/urgency`);
      expect(res.status).toBe(200);
      expect(res.body.urgencyScore).toBeDefined();
      expect(res.body.urgencyLevel).toBeDefined();
      expect(res.body.ticketAgeDays).toBeDefined();
    });
  });
});
