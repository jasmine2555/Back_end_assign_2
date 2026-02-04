import { Request, Response } from "express";
import {
  calculateUrgency,
  createTicket,
  deleteTicket,
  getAllTickets,
  getTicketById,
  isValidPriority,
  isValidStatus,
  updateTicket
} from "../services/ticketService";

export function healthCheck(_req: Request, res: Response) {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
}

export function getAll(_req: Request, res: Response) {
  res.status(200).json(getAllTickets());
}

export function getById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const ticket = getTicketById(id);

  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  res.status(200).json(ticket);
}

export function create(req: Request, res: Response) {
  const { title, description, priority } = req.body;

  if (!title) return res.status(400).json({ message: "Missing required field: title" });
  if (!description) return res.status(400).json({ message: "Missing required field: description" });
  if (!isValidPriority(priority)) {
    return res.status(400).json({
      message: "Invalid priority. Must be one of the critical, high, medium, low"
    });
  }

  const newTicket = createTicket(title, description, priority);
  res.status(201).json(newTicket);
}

export function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  const ticket = getTicketById(id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  const { title, description, priority, status } = req.body;

  if (priority && !isValidPriority(priority)) {
    return res.status(400).json({
      message: "Invalid priority. Must be one of the critical, high, medium or low"
    });
  }

  if (status && !isValidStatus(status)) {
    return res.status(400).json({
      message: "Invalid status. Must be one of the open, in-progress, resolved"
    });
  }

  const updated = updateTicket(id, { title, description, priority, status });
  res.status(200).json(updated);
}

export function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  const ok = deleteTicket(id);

  if (!ok) return res.status(404).json({ message: "Ticket not found" });

  res.status(200).json({ message: "Ticket deleted" });
}

export function urgency(req: Request, res: Response) {
  const id = Number(req.params.id);
  const ticket = getTicketById(id);

  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  res.status(200).json(calculateUrgency(ticket));
}
