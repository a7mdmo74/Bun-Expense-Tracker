import * as z from "zod";

export const ExpenseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string(),
  amount: z.number(),
  date: z.string(),
});

export const UserSchema = z.object({
  id: z.number(),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type Expense = z.infer<typeof ExpenseSchema>;
export type User = z.infer<typeof UserSchema>;
