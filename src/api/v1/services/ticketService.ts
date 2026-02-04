import { tickets } from "../../../data/ticketsData";
import { Priority, Status, Ticket, TicketUrgency } from "../models/ticketModel";

const VALID_PRIORITIES: Priority[] = ["critical", "high", "medium", "low"];
const VALID_STATUSES: Status[] = ["open", "in-progress", "resolved"];

export function isValidPriority(p: any): p is Priority {
  return VALID_PRIORITIES.includes(p);
}

export function isValidStatus(s: any): s is Status {
  return VALID_STATUSES.includes(s);
}

export function getAllTickets(): Ticket[] {
  return tickets;
}

export function getTicketById(id: number): Ticket | undefined {
  return tickets.find(t => t.id === id);
}

export function createTicket(title: string, description: string, priority: Priority): Ticket {
  const nextId = tickets.length ? Math.max(...tickets.map(t => t.id)) + 1 : 1;

  const newTicket: Ticket = {
    id: nextId,
    title,
    description,
    priority,
    status: "open",
    createdAt: new Date().toISOString()
  };

  tickets.push(newTicket);
  return newTicket;
}

export function updateTicket(id: number, updates: Partial<Ticket>): Ticket | undefined {
  const ticket = getTicketById(id);
  if (!ticket) return undefined;

  Object.assign(ticket, updates);
  return ticket;
}

export function deleteTicket(id: number): boolean {
  const index = tickets.findIndex(t => t.id === id);
  if (index === -1) return false;
  tickets.splice(index, 1);
  return true;
}

// ---------- URGENCY ----------
function getTicketAgeDays(createdAt: string): number {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diff = now - created;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

const BASE_SCORE: Record<Priority, number> = {
  critical: 50,
  high: 30,
  medium: 20,
  low: 10
};

const AGE_MULTIPLIER = 2 * 0.6;

export function calculateUrgency(ticket: Ticket): TicketUrgency {
  const ticketAgeDays = Math.max(0, getTicketAgeDays(ticket.createdAt));
  const urgencyScore = BASE_SCORE[ticket.priority] + ticketAgeDays * AGE_MULTIPLIER;

  if (ticket.status === "resolved") {
    return {
      ...ticket,
      ticketAgeDays,
      urgencyScore,
      urgencyLevel: "LOW",
      urgencyMessage: "Ticket is resolved. No urgency."
    };
  }

  let urgencyLevel: TicketUrgency["urgencyLevel"] = "LOW";
  let urgencyMessage = "Low urgency.";

  if (urgencyScore >= 70) {
    urgencyLevel = "CRITICAL";
    urgencyMessage = "Critical urgency! Fix immediately.";
  } else if (urgencyScore >= 50) {
    urgencyLevel = "HIGH";
    urgencyMessage = "High urgency. Prioritize it.";
  } else if (urgencyScore >= 30) {
    urgencyLevel = "MEDIUM";
    urgencyMessage = "Medium urgency. Do soon.";
  }

  return { ...ticket, ticketAgeDays, urgencyScore, urgencyLevel, urgencyMessage };
}
