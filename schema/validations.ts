import * as z from "zod";

export const ExpenseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string(),
  amount: z.number(),
  date: z.string(),
});

export type Expense = z.infer<typeof ExpenseSchema>;
