import type { Expense } from "schema/validations";
import "./assets/tailwind.css";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Plus, Pencil, Trash2, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/expenses");
        if (!response.ok) throw new Error("Failed to fetch expenses");
        const data = await response.json();
        setExpenses(data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        toast.error("Failed to load expenses");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete expense");

      setExpenses((prev) => prev.filter((e) => e.id !== id));
      toast.success("Expense deleted successfully");
    } catch (err) {
      console.error("Error deleting expense:", err);
      toast.error("Failed to delete expense. Please try again");
    } finally {
      setDeletingId(null);
      setOpenDialogId(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">Expense Tracker</h1>
          <Button asChild size="lg">
            <a href="/create">
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </a>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>
              A list of all your tracked expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : expenses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No expenses found
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Get started by adding your first expense
                </p>
                <Button asChild className="mt-4">
                  <a href="/create">
                    <Plus className="mr-2 h-4 w-4" /> Add Your First Expense
                  </a>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        {expense.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          <DollarSign /> {expense.amount.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/edit/${expense.id}`}>
                            <Pencil className="h-4 w-4" />
                          </a>
                        </Button>

                        <Dialog
                          open={openDialogId === expense.id}
                          onOpenChange={(open) =>
                            setOpenDialogId(open ? expense.id : null)
                          }
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setOpenDialogId(expense.id)}
                            className="text-destructive hover:text-destructive"
                            disabled={deletingId === expense.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Expense</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete “{expense.title}
                                ”? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setOpenDialogId(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(expense.id)}
                                disabled={deletingId === expense.id}
                              >
                                {deletingId === expense.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
