import type { ExpenseSchema } from "schema/validations";
import * as z from "zod";
import "./assets/tailwind.css";
import { useEffect, useState } from "react";
type Expense = z.infer<typeof ExpenseSchema>;

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      const response = await fetch("/api/expenses");
      const data = await response.json();
      setExpenses(data);
    };
    fetchExpenses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setExpenses((prev) => prev.filter((e) => e.id !== id));
      } else {
        console.error("Failed to delete expense");
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-6">Expense Tracker</h1>
        <a href="/create">Create Expense</a>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No expenses found
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {expense.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${expense.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      disabled={deletingId === expense.id}
                      style={{ cursor: "pointer" }}
                      className={`${
                        deletingId === expense.id
                          ? "text-gray-400 opacity-50"
                          : "text-red-500 hover:text-red-700"
                      }`}
                    >
                      {deletingId === expense.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
