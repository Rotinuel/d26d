"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

<<<<<<< HEAD
=======
const ROLE_DESTINATIONS = {
  attendee: "/attendee/dashboard",
  vendor:   "/vendor/dashboard",
  sponsor:  "/sponsor/dashboard",
  admin:    "/admin/dashboard",
};

>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMe();
  }, []);

  async function fetchMe() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
<<<<<<< HEAD
      }
    } catch {
      // not authenticated
=======
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
<<<<<<< HEAD
    setUser(data.user);
=======

    // Set user in context so all components know immediately
    setUser(data.user);

    // Tell Next.js to re-run server components / re-read cookies
    router.refresh();

>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
    return data.user;
  }

  async function register(payload) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
<<<<<<< HEAD
    setUser(data.user);
=======

    setUser(data.user);
    router.refresh();

>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
    return data.user;
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
<<<<<<< HEAD
=======
    router.refresh();
>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
    router.push("/");
  }

  return (
<<<<<<< HEAD
    <AuthContext.Provider value={{ user, loading, login, register, logout, refetch: fetchMe }}>
=======
    <AuthContext.Provider value={{ user, loading, login, register, logout, refetch: fetchMe, ROLE_DESTINATIONS }}>
>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
<<<<<<< HEAD
=======

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
