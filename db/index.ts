import { SQL } from "bun";
import { z } from "zod";
import { ExpenseSchema } from "../schema/validations";

export const db = new SQL(process.env.DATABASE_URL!);

type Expense = z.infer<typeof ExpenseSchema>;

// Transform database row to match schema
function transformRow(row: any): Expense {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    amount: parseFloat(row.amount),
    date: row.date instanceof Date ? row.date.toISOString() : row.date,
  };
}

// CREATE
export async function createExpense(
  data: Omit<Expense, "id" | "date"> & { user_id: number }
): Promise<Expense> {
  const { title, amount, user_id } = data;
  const result = await db`
    INSERT INTO expenses (title, amount, date, user_id)
    VALUES (${title}, ${amount}, ${new Date().toISOString()}, ${user_id})
    RETURNING *
  `;
  return transformRow(result[0]);
}

// READ (all)
export async function getExpenses(): Promise<Expense[]> {
  const result = await db`SELECT * FROM expenses ORDER BY id ASC`;
  return result.map(transformRow);
}

// READ (single)
export async function getExpenseById(id: number): Promise<Expense | null> {
  const result = await db`SELECT * FROM expenses WHERE id = ${id}`;
  if (result.length === 0) return null;
  return transformRow(result[0]);
}

// UPDATE
export async function updateExpense(
  id: number,
  data: Partial<Omit<Expense, "id" | "date">>
): Promise<Expense | null> {
  const existing = await getExpenseById(id);
  if (!existing) return null;

  const { title = existing.title, amount = existing.amount } = data;

  const result = await db`
    UPDATE expenses
    SET title = ${title}, amount = ${amount}
    WHERE id = ${id}
    RETURNING *
  `;

  if (result.length === 0) return null;
  return transformRow(result[0]);
}

// DELETE
export async function deleteExpense(id: number): Promise<boolean> {
  const result = await db`DELETE FROM expenses WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}
