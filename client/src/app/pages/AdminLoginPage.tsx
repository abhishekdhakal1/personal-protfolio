import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { apiClient, endpoints } from "@/utils/api";
import { Lock, LogIn } from "lucide-react";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiClient.post(endpoints.auth.adminLogin, {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("admin_token", response.data.token);
        localStorage.setItem("admin_user", JSON.stringify(response.data.user));
        navigate("/admin");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-cyan-500/20 rounded-full">
              <Lock className="h-6 w-6 text-cyan-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>
          <p className="text-center text-muted-foreground mb-6">
            Access the admin dashboard to manage messages and content
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <Input
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full"
            >
              <LogIn className="h-4 w-4 mr-2" />
              {loading ? "Logging in..." : "Login to Admin"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center text-xs text-muted-foreground">
            <p>For security purposes, keep your credentials confidential.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
