import type { Expense } from "@/schema/validations";
import { Database } from "bun:sqlite";

export const db = new Database("mydb.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL
  );
`);

// Helper to transform DB rows
function transformRow(row: any): Expense {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    amount: parseFloat(row.amount),
    date: row.date,
  };
}

// CREATE
export async function createExpense(
  data: Omit<Expense, "id" | "date"> & { user_id: number }
): Promise<Expense> {
  const { title, amount, user_id } = data;
  const date = new Date().toISOString();

  const stmt = db.prepare(
    "INSERT INTO expenses (title, amount, date, user_id) VALUES (?, ?, ?, ?)"
  );
  const result = stmt.run(title, amount, date, user_id);

  const inserted = db
    .query("SELECT * FROM expenses WHERE id = ?")
    .get(result.lastInsertRowid);

  return transformRow(inserted);
}

// READ (all)
export async function getExpenses(): Promise<Expense[]> {
  const rows = db.query("SELECT * FROM expenses ORDER BY id ASC").all();
  return rows.map(transformRow);
}

// READ (single)
export async function getExpenseById(id: number): Promise<Expense | null> {
  const row = db.query("SELECT * FROM expenses WHERE id = ?").get(id);
  return row ? transformRow(row) : null;
}

// UPDATE
export async function updateExpense(
  id: number,
  data: Partial<Omit<Expense, "id" | "date">>
): Promise<Expense | null> {
  const existingData = await getExpenseById(id);
  if (!existingData) return null;

  const title = data.title ?? existingData.title;
  const amount = data.amount ?? existingData.amount;

  db.prepare("UPDATE expenses SET title = ?, amount = ? WHERE id = ?").run(
    title,
    amount,
    id
  );

  const updated = db.query("SELECT * FROM expenses WHERE id = ?").get(id);
  return updated ? transformRow(updated) : null;
}

// DELETE
export async function deleteExpense(id: number): Promise<boolean> {
  const stmt = db.prepare("DELETE FROM expenses WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}
