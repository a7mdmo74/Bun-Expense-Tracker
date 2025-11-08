import { useState, useEffect } from "react";
import * as z from "zod";
import { toast } from "react-toastify";
import type { Expense } from "schema/validations";

const ExpenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().positive("Amount must be positive"),
  date: z.string().min(1, "Date is required"),
});

export default function CreateExpense({ expense }: { expense?: Expense }) {
  const isEditing = !!expense;

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(expense.amount.toString());
      const dateObj = new Date(expense.date);
      const formattedDate = dateObj.toISOString().split("T")[0];
      formattedDate && setDate(formattedDate);
    }
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = ExpenseSchema.safeParse({
      title,
      amount: parseFloat(amount),
      date,
    });

    if (!parsed.success) {
      toast.error("Fill all fields correctly");
      return;
    }

    try {
      setLoading(true);

      const url = isEditing ? `/api/expenses/${expense.id}` : "/api/expenses";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok)
        throw new Error(`Failed to ${isEditing ? "update" : "create"} expense`);

      toast.success(
        `Expense ${
          isEditing ? "updated" : "created"
        } successfully! ${title} - $${amount}`
      );

      if (!isEditing) {
        setTitle("");
        setAmount("");
        setDate("");
      }

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error(
        `Failed to ${
          isEditing ? "update" : "create"
        } expense. Please try again later`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {isEditing ? "Edit Expense" : "Create Expense"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter title"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter amount"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? `${isEditing ? "Updating" : "Creating"}...`
            : `${isEditing ? "Update" : "Create"} Expense`}
        </button>

        <a
          href="/"
          className="block text-center text-gray-600 hover:text-gray-800 underline"
        >
          Cancel
        </a>
      </form>
    </div>
  );
}
