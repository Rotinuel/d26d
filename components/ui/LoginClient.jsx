export const dynamic = "force-dynamic";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect");

  const roleDestinations = {
    attendee: "/attendee/dashboard",
    vendor:   "/vendor/dashboard",
    sponsor:  "/sponsor/dashboard",
    admin:    "/admin/dashboard",
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) return toast("Please fill in all fields", "error");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast(`Welcome back, ${user.name.split(" ")[0]}! 👋`, "success");
      const destination = redirect || roleDestinations[user.role] || "/";
      // Small delay so the httpOnly cookie is committed before navigation
      setTimeout(() => router.replace(destination), 100);
    } catch (err) {
      toast(err.message || "Login failed. Check your credentials.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl font-black">
            ODDC<span className="text-gold">26</span>
          </Link>
          <h1 className="font-display text-3xl font-bold mt-4 mb-2">Welcome Back</h1>
          <p className="text-muted text-sm">Sign in to your account to access your portal</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
              Sign In
            </Button>
          </form>
        </Card>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account?{" "}
          <Link href="/register" className="text-gold hover:underline font-semibold">
            Register here
          </Link>
        </p>

        {/* Quick portals */}
        <div className="mt-6">
          <p className="text-center text-xs text-muted uppercase tracking-widest mb-3">Or go directly to</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["/attendee/dashboard", "🎟️", "Attendee"],
              ["/vendor/apply",       "🏪", "Vendor"],
              ["/sponsor/packages",   "🤝", "Sponsor"],
            ].map(([href, icon, label]) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1.5 bg-surface border border-border rounded-xl p-3 hover:border-gold/40 transition-colors"
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-xs font-semibold text-muted">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
