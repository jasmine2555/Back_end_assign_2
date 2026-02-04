import { Ticket } from "../api/v1/models/ticketModel";

export const tickets: Ticket[] = [
  {
    id: 1,
    title: "Update footer year",
    description: "Footer still shows 2024",
    priority: "low",
    status: "open",
    // 1 day old → LOW]
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    title: "Profile image is not loading",
    description: "User profile image missing",
    priority: "medium",
    status: "open",
    // 3 days old → MEDIUM
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    title: "Login issue",
    description: "Users can't login",
    priority: "high",
    status: "open",
    // 4 days old → HIGH
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    title: "System outage",
    description: "Production server is down",
    priority: "critical",
    status: "open",
    // 5 days old → CRITICAL
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 5,
    title: "Resolved ticket example",
    description: "This ticket is already resolved",
    priority: "critical",
    status: "resolved",
    // resolved → ALWAYS LOW
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

