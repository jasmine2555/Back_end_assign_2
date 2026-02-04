import { calculateUrgency } from "../src/api/v1/services/ticketService";
import { Ticket } from "../src/api/v1/models/ticketModel";

function daysAgoIso(days: number) {
  const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return d.toISOString();
}

describe("ticketService.calculateUrgency", () => {
  it("should treat resolved tickets as LOW with resolved message", () => {
    const t: Ticket = {
      id: 1,
      title: "Resolved",
      description: "Resolved",
      priority: "critical",
      status: "resolved",
      createdAt: daysAgoIso(10)
    };

    const res = calculateUrgency(t);
    expect(res.urgencyLevel).toBe("LOW");
  });

  it("should increase urgency score as ticket age increases", () => {
    const newer: Ticket = {
      id: 2,
      title: "New ticket",
      description: "New",
      priority: "low",
      status: "open",
      createdAt: daysAgoIso(1)
    };

    const older: Ticket = {
      ...newer,
      createdAt: daysAgoIso(5)
    };

    const a = calculateUrgency(newer);
    const b = calculateUrgency(older);

    expect(b.urgencyScore).toBeGreaterThan(a.urgencyScore);
  });

  it("should return urgency fields", () => {
    const t: Ticket = {
      id: 3,
      title: "Fields",
      description: "Fields",
      priority: "high",
      status: "open",
      createdAt: daysAgoIso(2)
    };

    const res = calculateUrgency(t);
    expect(res.urgencyScore).toBeDefined();
    expect(res.urgencyLevel).toBeDefined();
    expect(res.ticketAgeDays).toBeDefined();
  });
});
