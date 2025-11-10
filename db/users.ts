import { Database } from "bun:sqlite";
import bcrypt from "bcrypt";

export const db = new Database("mydb.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

export async function createUser(email: string, password: string) {
  const existing = db.query("SELECT * FROM users WHERE email = ?").get(email);

  if (existing) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const created_at = new Date().toISOString();

  const stmt = db.prepare(
    "INSERT INTO users (email, password, created_at) VALUES (?, ?, ?)"
  );
  const result = stmt.run(email, hashedPassword, created_at);

  return db
    .query("SELECT * FROM users WHERE id = ?")
    .get(result.lastInsertRowid);
}

export async function loginUser(email: string, password: string) {
  const stmt = db.query("SELECT * FROM users WHERE email = ?");
  const user = stmt.get(email) as
    | { password: string; [key: string]: any }
    | undefined;

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  const { password: _, ...safeUser } = user;
  return safeUser;
}
