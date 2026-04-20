// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useAuth } from "@/hooks/useAuth";
// import { useToast } from "@/components/ui/Toast";
// import Button from "@/components/ui/Button";
// import Input, { Select } from "@/components/ui/Input";
// import Card from "@/components/ui/Card";

// const ROLES = [
//   {
//     id: "attendee",
//     label: "Attendee",
//     icon: "🎟️",
//     desc: "Buy tickets and attend the carnival",
//     destination: "/attendee/dashboard",
//   },
//   {
//     id: "vendor",
//     label: "Vendor",
//     icon: "🏪",
//     desc: "Book a booth slot and sell at the event",
//     destination: "/vendor/dashboard",
//   },
//   {
//     id: "sponsor",
//     label: "Sponsor",
//     icon: "🤝",
//     desc: "Sponsor the event and grow your brand",
//     destination: "/sponsor/packages",
//   },
// ];

// const VENDOR_CATEGORIES = [
//   "Food & Beverage",
//   "Fashion & Clothing",
//   "Beauty & Wellness",
//   "Technology",
//   "Entertainment",
//   "Retail & Merchandise",
//   "Services",
//   "Arts & Crafts",
// ];

// export default function RegisterPage() {
//   const { register } = useAuth();
//   const { toast } = useToast();
//   const router = useRouter();

//   const [selectedRole, setSelectedRole] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Shared fields
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     // Vendor-specific
//     biz_name: "",
//     category: "Food & Beverage",
//     rc_number: "",
//     description: "",
//     logo_url: "",
//     // Sponsor-specific
//     company: "",
//     contact_name: "",
//     website: "",
//   });

//   const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

//   function validate() {
//     if (!form.name.trim()) return "Full name is required";
//     if (!form.email.trim()) return "Email address is required";
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email address";
//     if (!form.phone.trim()) return "Phone number is required";
//     if (form.password.length < 8) return "Password must be at least 8 characters";
//     if (form.password !== form.confirmPassword) return "Passwords do not match";
//     if (selectedRole === "vendor") {
//       if (!form.biz_name.trim()) return "Business name is required";
//       if (!form.description.trim()) return "Business description is required";
//     }
//     if (selectedRole === "sponsor") {
//       if (!form.company.trim()) return "Company name is required";
//       if (!form.contact_name.trim()) return "Contact person name is required";
//     }
//     return null;
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     const error = validate();
//     if (error) return toast(error, "error");

//     setLoading(true);
//     try {
//       const payload = {
//         name: selectedRole === "sponsor" ? form.contact_name : form.name,
//         email: form.email.toLowerCase().trim(),
//         phone: form.phone.trim(),
//         password: form.password,
//         role: selectedRole,
//         // Vendor extras
//         ...(selectedRole === "vendor" && {
//           biz_name: form.biz_name,
//           category: form.category,
//           rc_number: form.rc_number,
//           description: form.description,
//           logo_url: form.logo_url,
//         }),
//         // Sponsor extras — handled via /sponsor/packages flow,
//         // but we pass company info for the user record
//         ...(selectedRole === "sponsor" && {
//           name: form.contact_name,
//           company: form.company,
//           website: form.website,
//         }),
//       };

//       const user = await register(payload);
//       toast(`Welcome, ${user.name.split(" ")[0]}! Account created 🎉`, "success");

//       const dest = ROLES.find((r) => r.id === selectedRole)?.destination || "/";
//       router.push(dest);
//     } catch (err) {
//       toast(err.message || "Registration failed. Please try again.", "error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // ── Step 1: Role picker ──────────────────────────────────────────────────
//   if (!selectedRole) {
//     return (
//       <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
//         <div className="w-full max-w-xl">
//           <div className="text-center mb-10">
//             <Link href="/" className="font-display text-2xl font-black">
//               ODDC<span className="text-gold">25</span>
//             </Link>
//             <h1 className="font-display text-4xl font-bold mt-4 mb-2">Create an Account</h1>
//             <p className="text-muted">How will you be joining us?</p>
//           </div>

//           <div className="flex flex-col gap-4">
//             {ROLES.map((role) => (
//               <button
//                 key={role.id}
//                 onClick={() => setSelectedRole(role.id)}
//                 className="flex items-center gap-5 bg-card border border-border rounded-2xl p-5 text-left hover:border-gold/50 hover:-translate-y-0.5 transition-all group"
//               >
//                 <span className="text-4xl w-14 h-14 flex items-center justify-center bg-surface rounded-xl shrink-0 group-hover:scale-110 transition-transform">
//                   {role.icon}
//                 </span>
//                 <div>
//                   <p className="font-semibold text-base">{role.label}</p>
//                   <p className="text-muted text-sm mt-0.5">{role.desc}</p>
//                 </div>
//                 <span className="ml-auto text-muted group-hover:text-gold transition-colors text-xl">→</span>
//               </button>
//             ))}
//           </div>

//           <p className="text-center text-sm text-muted mt-8">
//             Already have an account?{" "}
//             <Link href="/login" className="text-gold hover:underline font-semibold">
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const role = ROLES.find((r) => r.id === selectedRole);

//   // ── Step 2: Registration form ────────────────────────────────────────────
//   return (
//     <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
//       <div className="w-full max-w-2xl">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <Link href="/" className="font-display text-2xl font-black">
//             ODDC<span className="text-gold">25</span>
//           </Link>
//           <div className="flex items-center justify-center gap-3 mt-4 mb-2">
//             <span className="text-3xl">{role.icon}</span>
//             <h1 className="font-display text-3xl font-bold">{role.label} Registration</h1>
//           </div>
//           <p className="text-muted text-sm">{role.desc}</p>
//         </div>

//         {/* Back to role picker */}
//         <button
//           onClick={() => setSelectedRole(null)}
//           className="flex items-center gap-2 text-muted hover:text-text-base text-sm mb-6 transition-colors"
//         >
//           ← Change account type
//         </button>

//         <Card>
//           <form onSubmit={handleSubmit} className="space-y-6">

//             {/* ── PERSONAL DETAILS (all roles) ────────────────────────── */}
//             <div>
//               <h3 className="font-semibold text-gold mb-4 text-sm uppercase tracking-wider">
//                 Personal Details
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <Input
//                   label="Full Name *"
//                   placeholder={selectedRole === "sponsor" ? "Emeka Okafor" : "Adaeze Nwankwo"}
//                   value={selectedRole === "sponsor" ? form.contact_name : form.name}
//                   onChange={selectedRole === "sponsor" ? set("contact_name") : set("name")}
//                   required
//                 />
//                 <Input
//                   label="Email Address *"
//                   type="email"
//                   placeholder="you@example.com"
//                   value={form.email}
//                   onChange={set("email")}
//                   required
//                 />
//                 <Input
//                   label="Phone Number *"
//                   type="tel"
//                   placeholder="08012345678"
//                   value={form.phone}
//                   onChange={set("phone")}
//                   required
//                 />
//                 {/* Empty cell for grid alignment on larger screens */}
//                 <div className="hidden sm:block" />
//                 <Input
//                   label="Password *"
//                   type="password"
//                   placeholder="Minimum 8 characters"
//                   value={form.password}
//                   onChange={set("password")}
//                   required
//                 />
//                 <Input
//                   label="Confirm Password *"
//                   type="password"
//                   placeholder="Repeat your password"
//                   value={form.confirmPassword}
//                   onChange={set("confirmPassword")}
//                   error={
//                     form.confirmPassword && form.password !== form.confirmPassword
//                       ? "Passwords do not match"
//                       : undefined
//                   }
//                   required
//                 />
//               </div>
//             </div>

//             {/* ── VENDOR FIELDS ────────────────────────────────────────── */}
//             {selectedRole === "vendor" && (
//               <div className="border-t border-border pt-6">
//                 <h3 className="font-semibold text-gold mb-4 text-sm uppercase tracking-wider">
//                   Business Information
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <Input
//                     label="Business Name *"
//                     placeholder="Mama Nkechi's Kitchen"
//                     value={form.biz_name}
//                     onChange={set("biz_name")}
//                     required
//                   />
//                   <Select
//                     label="Category *"
//                     value={form.category}
//                     onChange={set("category")}
//                   >
//                     {VENDOR_CATEGORIES.map((c) => (
//                       <option key={c} value={c}>{c}</option>
//                     ))}
//                   </Select>
//                   <Input
//                     label="CAC / RC Number (optional)"
//                     placeholder="RC1234567"
//                     value={form.rc_number}
//                     onChange={set("rc_number")}
//                   />
//                   <Input
//                     label="Logo URL (optional)"
//                     placeholder="https://yourbrand.com/logo.png"
//                     value={form.logo_url}
//                     onChange={set("logo_url")}
//                   />
//                   <div className="sm:col-span-2">
//                     <Input
//                       textarea
//                       label="Business Description *"
//                       placeholder="Tell us about your business — what you sell, your specialty, and why you want to be part of ODDC 2025..."
//                       value={form.description}
//                       onChange={set("description")}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Vendor info notice */}
//                 <div className="mt-4 bg-gold/10 border border-gold/30 rounded-xl p-4 text-sm">
//                   <p className="text-gold font-semibold mb-1">📋 What happens after registration?</p>
//                   <ol className="text-muted list-decimal list-inside space-y-1">
//                     <li>Your application is reviewed within 48 hours</li>
//                     <li>On approval you'll receive an email confirmation</li>
//                     <li>Log back in to choose and pay for your booth slot</li>
//                     <li>Receive your setup brief with venue details</li>
//                   </ol>
//                 </div>
//               </div>
//             )}

//             {/* ── SPONSOR FIELDS ───────────────────────────────────────── */}
//             {selectedRole === "sponsor" && (
//               <div className="border-t border-border pt-6">
//                 <h3 className="font-semibold text-gold mb-4 text-sm uppercase tracking-wider">
//                   Company Information
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <Input
//                     label="Company Name *"
//                     placeholder="Acme Nigeria Ltd"
//                     value={form.company}
//                     onChange={set("company")}
//                     required
//                   />
//                   <Input
//                     label="Company Website"
//                     type="url"
//                     placeholder="https://yourcompany.com"
//                     value={form.website}
//                     onChange={set("website")}
//                   />
//                 </div>

//                 <div className="mt-4 bg-gold/10 border border-gold/30 rounded-xl p-4 text-sm">
//                   <p className="text-gold font-semibold mb-1">🤝 What happens after registration?</p>
//                   <ol className="text-muted list-decimal list-inside space-y-1">
//                     <li>Your account is created immediately</li>
//                     <li>Browse and select a sponsorship package</li>
//                     <li>Pay securely via Paystack</li>
//                     <li>Submit brand assets (logo, colour, tagline)</li>
//                     <li>Our team will be in touch within 48 hours</li>
//                   </ol>
//                 </div>
//               </div>
//             )}

//             {/* ── ATTENDEE INFO NOTICE ─────────────────────────────────── */}
//             {selectedRole === "attendee" && (
//               <div className="bg-surface border border-border rounded-xl p-4 text-sm text-muted">
//                 After registering you'll be taken straight to your ticket dashboard to purchase your passes for Olambe Detty December Carnival 2025.
//               </div>
//             )}

//             {/* Submit */}
//             <Button
//               type="submit"
//               loading={loading}
//               size="lg"
//               className="w-full"
//             >
//               Create {role.label} Account
//             </Button>

//             <p className="text-center text-xs text-muted">
//               By registering you agree to our{" "}
//               <Link href="/terms" className="text-gold hover:underline">Terms of Service</Link>
//               {" "}and{" "}
//               <Link href="/privacy" className="text-gold hover:underline">Privacy Policy</Link>.
//             </p>
//           </form>
//         </Card>

//         <p className="text-center text-sm text-muted mt-6">
//           Already have an account?{" "}
//           <Link href="/login" className="text-gold hover:underline font-semibold">
//             Sign in here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input, { Select } from "@/components/ui/Input";
import Card from "@/components/ui/Card";

const ROLES = [
  {
    id: "attendee",
    label: "Attendee",
    icon: "🎟️",
    desc: "Buy tickets and attend the carnival",
    destination: "/attendee/dashboard",
  },
  {
    id: "vendor",
    label: "Vendor",
    icon: "🏪",
    desc: "Book a booth slot and sell at the event",
    destination: "/vendor/dashboard",
  },
  {
    id: "sponsor",
    label: "Sponsor",
    icon: "🤝",
    desc: "Sponsor the event and grow your brand",
    destination: "/sponsor/packages",
  },
];

const VENDOR_CATEGORIES = [
  "Food & Beverage",
  "Fashion & Clothing",
  "Beauty & Wellness",
  "Technology",
  "Entertainment",
  "Retail & Merchandise",
  "Services",
  "Arts & Crafts",
];

export default function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  // Shared fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Vendor-specific
    biz_name: "",
    category: "Food & Beverage",
    rc_number: "",
    description: "",
    logo_url: "",
    // Sponsor-specific
    company: "",
    contact_name: "",
    website: "",
  });

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  function validate() {
    if (!form.name.trim()) return "Full name is required";
    if (!form.email.trim()) return "Email address is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email address";
    if (!form.phone.trim()) return "Phone number is required";
    if (form.password.length < 8) return "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    if (selectedRole === "vendor") {
      if (!form.biz_name.trim()) return "Business name is required";
      if (!form.description.trim()) return "Business description is required";
    }
    if (selectedRole === "sponsor") {
      if (!form.company.trim()) return "Company name is required";
      if (!form.contact_name.trim()) return "Contact person name is required";
    }
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const error = validate();
    if (error) return toast(error, "error");

    setLoading(true);
    try {
      const payload = {
        name: selectedRole === "sponsor" ? form.contact_name : form.name,
        email: form.email.toLowerCase().trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: selectedRole,
        // Vendor extras
        ...(selectedRole === "vendor" && {
          biz_name: form.biz_name,
          category: form.category,
          rc_number: form.rc_number,
          description: form.description,
          logo_url: form.logo_url,
        }),
        // Sponsor extras — handled via /sponsor/packages flow,
        // but we pass company info for the user record
        ...(selectedRole === "sponsor" && {
          name: form.contact_name,
          company: form.company,
          website: form.website,
        }),
      };

      const user = await register(payload);
      toast(`Welcome, ${user.name.split(" ")[0]}! Account created 🎉`, "success");

      const dest = ROLES.find((r) => r.id === selectedRole)?.destination || "/";
      setTimeout(() => router.replace(dest), 100);
    } catch (err) {
      toast(err.message || "Registration failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 1: Role picker ──────────────────────────────────────────────────
  if (!selectedRole) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl">
          <div className="text-center mb-10">
            <Link href="/" className="font-display text-2xl font-black">
              ODDC<span className="text-gold">25</span>
            </Link>
            <h1 className="font-display text-4xl font-bold mt-4 mb-2">Create an Account</h1>
            <p className="text-muted">How will you be joining us?</p>
          </div>

          <div className="flex flex-col gap-4">
            {ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className="flex items-center gap-5 bg-card border border-border rounded-2xl p-5 text-left hover:border-gold/50 hover:-translate-y-0.5 transition-all group"
              >
                <span className="text-4xl w-14 h-14 flex items-center justify-center bg-surface rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                  {role.icon}
                </span>
                <div>
                  <p className="font-semibold text-base">{role.label}</p>
                  <p className="text-muted text-sm mt-0.5">{role.desc}</p>
                </div>
                <span className="ml-auto text-muted group-hover:text-gold transition-colors text-xl">→</span>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-muted mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-gold hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const role = ROLES.find((r) => r.id === selectedRole);

  // ── Step 2: Registration form ────────────────────────────────────────────
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl font-black">
            ODDC<span className="text-gold">25</span>
          </Link>
          <div className="flex items-center justify-center gap-3 mt-4 mb-2">
            <span className="text-3xl">{role.icon}</span>
            <h1 className="font-display text-3xl font-bold">{role.label} Registration</h1>
          </div>
          <p className="text-muted text-sm">{role.desc}</p>
        </div>

        {/* Back to role picker */}
        <button
          onClick={() => setSelectedRole(null)}
          className="flex items-center gap-2 text-muted hover:text-text-base text-sm mb-6 transition-colors"
        >
          ← Change account type
        </button>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ── PERSONAL DETAILS (all roles) ────────────────────────── */}
            <div>
              <h3 className="font-semibold text-gold mb-4 text-sm uppercase tracking-wider">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  placeholder={selectedRole === "sponsor" ? "Emeka Okafor" : "Adaeze Nwankwo"}
                  value={selectedRole === "sponsor" ? form.contact_name : form.name}
                  onChange={selectedRole === "sponsor" ? set("contact_name") : set("name")}
                  required
                />
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set("email")}
                  required
                />
                <Input
                  label="Phone Number *"
                  type="tel"
                  placeholder="08012345678"
                  value={form.phone}
                  onChange={set("phone")}
                  required
                />
                {/* Empty cell for grid alignment on larger screens */}
                <div className="hidden sm:block" />
                <Input
                  label="Password *"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={set("password")}
                  required
                />
                <Input
                  label="Confirm Password *"
                  type="password"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  error={
                    form.confirmPassword && form.password !== form.confirmPassword
                      ? "Passwords do not match"
                      : undefined
                  }
                  required
                />
              </div>
            </div>

            {/* ── VENDOR FIELDS ────────────────────────────────────────── */}
            {selectedRole === "vendor" && (
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-gold mb-4 text-sm uppercase tracking-wider">
                  Business Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Business Name *"
                    placeholder="Mama Nkechi's Kitchen"
                    value={form.biz_name}
                    onChange={set("biz_name")}
                    required
                  />
                  <Select
                    label="Category *"
                    value={form.category}
                    onChange={set("category")}
                  >
                    {VENDOR_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Select>
                  <Input
                    label="CAC / RC Number (optional)"
                    placeholder="RC1234567"
                    value={form.rc_number}
                    onChange={set("rc_number")}
                  />
                  <Input
                    label="Logo URL (optional)"
                    placeholder="https://yourbrand.com/logo.png"
                    value={form.logo_url}
                    onChange={set("logo_url")}
                  />
                  <div className="sm:col-span-2">
                    <Input
                      textarea
                      label="Business Description *"
                      placeholder="Tell us about your business — what you sell, your specialty, and why you want to be part of ODDC 2025..."
                      value={form.description}
                      onChange={set("description")}
                      required
                    />
                  </div>
                </div>

                {/* Vendor info notice */}
                <div className="mt-4 bg-gold/10 border border-gold/30 rounded-xl p-4 text-sm">
                  <p className="text-gold font-semibold mb-1">📋 What happens after registration?</p>
                  <ol className="text-muted list-decimal list-inside space-y-1">
                    <li>Your application is reviewed within 48 hours</li>
                    <li>On approval you'll receive an email confirmation</li>
                    <li>Log back in to choose and pay for your booth slot</li>
                    <li>Receive your setup brief with venue details</li>
                  </ol>
                </div>
              </div>
            )}

            {/* ── SPONSOR FIELDS ───────────────────────────────────────── */}
            {selectedRole === "sponsor" && (
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-gold mb-4 text-sm uppercase tracking-wider">
                  Company Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Company Name *"
                    placeholder="Acme Nigeria Ltd"
                    value={form.company}
                    onChange={set("company")}
                    required
                  />
                  <Input
                    label="Company Website"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={form.website}
                    onChange={set("website")}
                  />
                </div>

                <div className="mt-4 bg-gold/10 border border-gold/30 rounded-xl p-4 text-sm">
                  <p className="text-gold font-semibold mb-1">🤝 What happens after registration?</p>
                  <ol className="text-muted list-decimal list-inside space-y-1">
                    <li>Your account is created immediately</li>
                    <li>Browse and select a sponsorship package</li>
                    <li>Pay securely via Paystack</li>
                    <li>Submit brand assets (logo, colour, tagline)</li>
                    <li>Our team will be in touch within 48 hours</li>
                  </ol>
                </div>
              </div>
            )}

            {/* ── ATTENDEE INFO NOTICE ─────────────────────────────────── */}
            {selectedRole === "attendee" && (
              <div className="bg-surface border border-border rounded-xl p-4 text-sm text-muted">
                After registering you'll be taken straight to your ticket dashboard to purchase your passes for Olambe Detty December Carnival 2025.
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              loading={loading}
              size="lg"
              className="w-full"
            >
              Create {role.label} Account
            </Button>

            <p className="text-center text-xs text-muted">
              By registering you agree to our{" "}
              <Link href="/terms" className="text-gold hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-gold hover:underline">Privacy Policy</Link>.
            </p>
          </form>
        </Card>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-gold hover:underline font-semibold">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
