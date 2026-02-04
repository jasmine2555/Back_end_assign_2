"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ticketService_1 = require("../src/api/v1/services/ticketService");
function daysAgoIso(days) {
    const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return d.toISOString();
}
describe("ticketService.calculateUrgency", () => {
    it("should treat resolved tickets as LOW with resolved message", () => {
        const t = {
            id: 1,
            title: "Resolved",
            description: "Resolved",
            priority: "critical",
            status: "resolved",
            createdAt: daysAgoIso(10)
        };
        const res = (0, ticketService_1.calculateUrgency)(t);
        expect(res.urgencyLevel).toBe("LOW");
        expect(res.urgencyMessage.toLowerCase()).toContain("resolved");
    });
    it("should increase score as age increases", () => {
        const newer = {
            id: 2,
            title: "Age test",
            description: "Age test",
            priority: "low",
            status: "open",
            createdAt: daysAgoIso(1)
        };
        const older = { ...newer, createdAt: daysAgoIso(5) };
        const a = (0, ticketService_1.calculateUrgency)(newer);
        const b = (0, ticketService_1.calculateUrgency)(older);
        expect(b.urgencyScore).toBeGreaterThan(a.urgencyScore);
        // should increase roughly by (days difference * AGE_MULTIPLIER)
        expect(b.urgencyScore - a.urgencyScore).toBeGreaterThanOrEqual(3 * ticketService_1.AGE_MULTIPLIER);
    });
    it("should include urgency fields", () => {
        const t = {
            id: 3,
            title: "Fields test",
            description: "Fields test",
            priority: "high",
            status: "open",
            createdAt: daysAgoIso(2)
        };
        const res = (0, ticketService_1.calculateUrgency)(t);
        expect(res.ticketAgeDays).toBeDefined();
        expect(res.urgencyScore).toBeDefined();
        expect(res.urgencyLevel).toBeDefined();
        expect(res.urgencyMessage).toBeDefined();
    });
});
