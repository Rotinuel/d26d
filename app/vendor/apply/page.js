<<<<<<< HEAD
// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useAuth } from "@/hooks/useAuth";
// import { useToast } from "@/components/ui/Toast";
// import Button from "@/components/ui/Button";
// import Input, { Select } from "@/components/ui/Input";
// import Card from "@/components/ui/Card";

// const CATEGORIES = [
//   "Food & Beverage",
//   "Fashion & Clothing",
//   "Beauty & Wellness",
//   "Technology",
//   "Entertainment",
//   "Retail & Merchandise",
//   "Services",
//   "Arts & Crafts",
// ];

// export default function VendorApplyPage() {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const router = useRouter();
//   const [tab, setTab] = useState(user ? "apply" : "login");
//   const [loading, setLoading] = useState(false);

//   const [loginForm, setLoginForm] = useState({ email: "", password: "" });
//   const [regForm, setRegForm] = useState({
//     name: "", email: "", phone: "", password: "",
//     biz_name: "", category: "Food & Beverage", rc_number: "", description: "",
//   });

//   async function handleLogin(e) {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);
//       if (data.user.role !== "vendor" && data.user.role !== "admin") {
//         throw new Error("This account is not a vendor account. Please register.");
//       }
//       toast("Welcome back!", "success");
//       router.push("/vendor/dashboard");
//     } catch (err) {
//       toast(err.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleRegister(e) {
//     e.preventDefault();
//     const required = ["name", "email", "phone", "password", "biz_name", "description"];
//     for (const f of required) {
//       if (!regForm[f]) return toast(`Please fill in: ${f.replace("_", " ")}`, "error");
//     }
//     setLoading(true);
//     try {
//       const res = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...regForm, role: "vendor" }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);
//       toast("Application submitted! Our team will review within 48 hours.", "success");
//       router.push("/vendor/dashboard");
//     } catch (err) {
//       toast(err.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-16">
//       <div className="text-center mb-10">
//         <span className="text-5xl block mb-4">🏪</span>
//         <h1 className="font-display text-4xl font-bold mb-2">Vendor Portal</h1>
//         <p className="text-muted">Apply for a slot at the Olambe Detty December Carnival</p>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-0 bg-surface border border-border rounded-xl p-1 mb-8">
//         {[
//           { id: "login", label: "Sign In" },
//           { id: "apply", label: "Apply / Register" },
//         ].map((t) => (
//           <button
//             key={t.id}
//             onClick={() => setTab(t.id)}
//             className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
//               tab === t.id ? "bg-card text-text-base shadow" : "text-muted hover:text-text-base"
//             }`}
//           >
//             {t.label}
//           </button>
//         ))}
//       </div>

//       {/* LOGIN */}
//       {tab === "login" && (
//         <Card>
//           <form onSubmit={handleLogin} className="flex flex-col gap-5">
//             <Input label="Email" type="email" placeholder="business@example.com" value={loginForm.email}
//               onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
//             <Input label="Password" type="password" placeholder="••••••••" value={loginForm.password}
//               onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
//             <Button type="submit" loading={loading} size="lg" className="w-full">Sign In</Button>
//           </form>
//         </Card>
//       )}

//       {/* APPLY / REGISTER */}
//       {tab === "apply" && (
//         <Card>
//           <form onSubmit={handleRegister} className="flex flex-col gap-5">
//             <div>
//               <h3 className="font-semibold mb-4 text-gold">Personal Details</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <Input label="Full Name *" placeholder="Emeka Okafor" value={regForm.name}
//                   onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} required />
//                 <Input label="Email *" type="email" placeholder="emeka@business.ng" value={regForm.email}
//                   onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} required />
//                 <Input label="Phone *" placeholder="08012345678" value={regForm.phone}
//                   onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} required />
//                 <Input label="Password *" type="password" placeholder="Min 8 characters" value={regForm.password}
//                   onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} required />
//               </div>
//             </div>

//             <div className="border-t border-border pt-5">
//               <h3 className="font-semibold mb-4 text-gold">Business Information</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <Input label="Business Name *" placeholder="Mama Nkechi's Kitchen" value={regForm.biz_name}
//                   onChange={(e) => setRegForm({ ...regForm, biz_name: e.target.value })} required />
//                 <Select label="Category *" value={regForm.category}
//                   onChange={(e) => setRegForm({ ...regForm, category: e.target.value })}>
//                   {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
//                 </Select>
//                 <Input label="CAC / RC Number (optional)" placeholder="RC1234567" value={regForm.rc_number}
//                   onChange={(e) => setRegForm({ ...regForm, rc_number: e.target.value })} />
//                 <Input label="Logo URL (optional)" placeholder="https://yourbrand.com/logo.png" value={regForm.logo_url || ""}
//                   onChange={(e) => setRegForm({ ...regForm, logo_url: e.target.value })} />
//               </div>
//               <div className="mt-4">
//                 <Input textarea label="Business Description *"
//                   placeholder="Tell us about your business, what you sell, and why you want to be part of ODDC 2025..."
//                   value={regForm.description}
//                   onChange={(e) => setRegForm({ ...regForm, description: e.target.value })} required />
//               </div>
//             </div>

//             {/* Info box */}
//             <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 text-sm text-muted">
//               <p className="text-gold font-semibold mb-1">What happens next?</p>
//               <ol className="list-decimal list-inside space-y-1">
//                 <li>Submit your application (this form)</li>
//                 <li>Our team reviews within 48 hours</li>
//                 <li>On approval, you log in and book your slot + pay via Paystack</li>
//                 <li>Receive confirmation email with setup details</li>
//               </ol>
//             </div>

//             <Button type="submit" loading={loading} size="lg" className="w-full">
//               Submit Vendor Application
//             </Button>
//           </form>
//         </Card>
//       )}

//       {/* Already registered link */}
//       {tab === "apply" && (
//         <p className="text-center text-sm text-muted mt-6">
//           Already applied?{" "}
//           <button onClick={() => setTab("login")} className="text-gold hover:underline">Sign in to your account</button>
//         </p>
//       )}
//     </div>
//   );
// }


=======
>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input, { Select } from "@/components/ui/Input";
import Card from "@/components/ui/Card";

const CATEGORIES = [
  "Food & Beverage",
  "Fashion & Clothing",
  "Beauty & Wellness",
  "Technology",
  "Entertainment",
  "Retail & Merchandise",
  "Services",
  "Arts & Crafts",
];

export default function VendorApplyPage() {
  const { user, login, register } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [tab, setTab] = useState(user ? "apply" : "login");
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({
    name: "", email: "", phone: "", password: "",
    biz_name: "", category: "Food & Beverage", rc_number: "", description: "",
  });

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedInUser = await login(loginForm.email, loginForm.password);
      if (loggedInUser.role !== "vendor" && loggedInUser.role !== "admin") {
        throw new Error("This account is not a vendor account. Please register a vendor account.");
      }
      toast("Welcome back!", "success");
      setTimeout(() => router.replace("/vendor/dashboard"), 100);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    const required = ["name", "email", "phone", "password", "biz_name", "description"];
    for (const f of required) {
      if (!regForm[f]) return toast(`Please fill in: ${f.replace("_", " ")}`, "error");
    }
    setLoading(true);
    try {
      await register({ ...regForm, role: "vendor" });
      toast("Application submitted! Our team will review within 48 hours.", "success");
      setTimeout(() => router.replace("/vendor/dashboard"), 100);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <span className="text-5xl block mb-4">🏪</span>
        <h1 className="font-display text-4xl font-bold mb-2">Vendor Portal</h1>
        <p className="text-muted">Apply for a slot at the Olambe Detty December Carnival</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 bg-surface border border-border rounded-xl p-1 mb-8">
        {[
          { id: "login", label: "Sign In" },
          { id: "apply", label: "Apply / Register" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === t.id ? "bg-card text-text-base shadow" : "text-muted hover:text-text-base"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* LOGIN */}
      {tab === "login" && (
        <Card>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <Input label="Email" type="email" placeholder="business@example.com" value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
            <Input label="Password" type="password" placeholder="••••••••" value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
            <Button type="submit" loading={loading} size="lg" className="w-full">Sign In</Button>
          </form>
        </Card>
      )}

      {/* APPLY / REGISTER */}
      {tab === "apply" && (
        <Card>
          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div>
              <h3 className="font-semibold mb-4 text-gold">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name *" placeholder="Emeka Okafor" value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} required />
                <Input label="Email *" type="email" placeholder="emeka@business.ng" value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} required />
                <Input label="Phone *" placeholder="08012345678" value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} required />
                <Input label="Password *" type="password" placeholder="Min 8 characters" value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} required />
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <h3 className="font-semibold mb-4 text-gold">Business Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Business Name *" placeholder="Mama Nkechi's Kitchen" value={regForm.biz_name}
                  onChange={(e) => setRegForm({ ...regForm, biz_name: e.target.value })} required />
                <Select label="Category *" value={regForm.category}
                  onChange={(e) => setRegForm({ ...regForm, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </Select>
                <Input label="CAC / RC Number (optional)" placeholder="RC1234567" value={regForm.rc_number}
                  onChange={(e) => setRegForm({ ...regForm, rc_number: e.target.value })} />
                <Input label="Logo URL (optional)" placeholder="https://yourbrand.com/logo.png" value={regForm.logo_url || ""}
                  onChange={(e) => setRegForm({ ...regForm, logo_url: e.target.value })} />
              </div>
              <div className="mt-4">
                <Input textarea label="Business Description *"
                  placeholder="Tell us about your business, what you sell, and why you want to be part of ODDC 2025..."
                  value={regForm.description}
                  onChange={(e) => setRegForm({ ...regForm, description: e.target.value })} required />
              </div>
            </div>

            {/* Info box */}
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 text-sm text-muted">
              <p className="text-gold font-semibold mb-1">What happens next?</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Submit your application (this form)</li>
                <li>Our team reviews within 48 hours</li>
                <li>On approval, you log in and book your slot + pay via Paystack</li>
                <li>Receive confirmation email with setup details</li>
              </ol>
            </div>

            <Button type="submit" loading={loading} size="lg" className="w-full">
              Submit Vendor Application
            </Button>
          </form>
        </Card>
      )}

      {/* Already registered link */}
      {tab === "apply" && (
        <p className="text-center text-sm text-muted mt-6">
          Already applied?{" "}
          <button onClick={() => setTab("login")} className="text-gold hover:underline">Sign in to your account</button>
        </p>
      )}
    </div>
  );
}
