import { z } from "zod";
export const Inventory = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  stock: z.number(),
  min_stock: z.number(),
  price: z.float64(),
  status: z.string(),
  supplier: z.string(),
  expiry_date: z.date(),
  temperature: z.float64(),
});

export const SystemInfo = z.object({
  id: z.number(),
  version: z.float64(),
  db_status: z.boolean(),
  last_backup: z.date(),
  storage_usage: z.number(),
});

export const ActivityLogs = z.object({
  id: z.number(),
  action: z.string(),
  user_id: z.int(),
  timestamp: z.date(),
});

export const Users = z.object({
  id: z.number(),
  name: z.string(),
});
