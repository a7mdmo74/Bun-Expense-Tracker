import { useState } from "react";
import { toast } from "sonner"; // optional, you can replace with alert()
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/src/components/ui/card";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        toast.success("Account created successfully!");
        window.location.href = "/login";
      } else {
        const err = await res.json();
        toast.error(err.error || "Signup failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center max-w-4xl mx-auto min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm shadow-lg p-6">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Sign Up"}
            </Button>

            <p className="text-center text-sm mt-2">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Log in
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
