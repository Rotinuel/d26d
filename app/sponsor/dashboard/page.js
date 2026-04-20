// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useAuth } from "@/hooks/useAuth";
// import { useToast } from "@/components/ui/Toast";
// import Card from "@/components/ui/Card";
// import Badge from "@/components/ui/Badge";
// import Button from "@/components/ui/Button";
// import Input from "@/components/ui/Input";
// import { PageLoader } from "@/components/ui/Spinner";
// import { SPONSOR_PACKAGES, naira } from "@/lib/constants";
// import { formatDate } from "@/lib/utils";

// export default function SponsorDashboard() {
//   const { user, loading: authLoading } = useAuth();
//   const { toast } = useToast();
//   const router = useRouter();
//   const [sponsorship, setSponsorship] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [assetForm, setAssetForm] = useState({ logo_url: "", tagline: "", brand_color: "#F0B429" });
//   const [savingAssets, setSavingAssets] = useState(false);

//   useEffect(() => {
//     if (!authLoading && !user) router.push("/sponsor/packages");
//     if (!authLoading && user && user.role !== "sponsor" && user.role !== "admin") router.push("/sponsor/packages");
//   }, [user, authLoading]);

//   useEffect(() => {
//     if (user) fetchSponsorship();
//   }, [user]);

//   async function fetchSponsorship() {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/sponsors/my-sponsorship");
//       if (res.ok) {
//         const data = await res.json();
//         setSponsorship(data.sponsorship);
//         if (data.sponsorship) {
//           setAssetForm({
//             logo_url: data.sponsorship.logo_url || "",
//             tagline: data.sponsorship.tagline || "",
//             brand_color: data.sponsorship.brand_color || "#F0B429",
//           });
//         }
//       }
//     } catch {
//       toast("Failed to load sponsorship data", "error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function saveAssets(e) {
//     e.preventDefault();
//     setSavingAssets(true);
//     try {
//       const res = await fetch("/api/sponsors/my-sponsorship", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(assetForm),
//       });
//       if (res.ok) toast("Brand assets saved! ✅", "success");
//       else throw new Error("Save failed");
//     } catch {
//       toast("Failed to save assets", "error");
//     } finally {
//       setSavingAssets(false);
//     }
//   }

//   if (authLoading || loading) return <PageLoader />;

//   const pkg = SPONSOR_PACKAGES.find((p) => p.id === sponsorship?.package);

//   if (!sponsorship) {
//     return (
//       <div className="max-w-xl mx-auto px-4 py-24 text-center">
//         <span className="text-6xl block mb-4">🤝</span>
//         <h2 className="font-display text-3xl font-bold mb-3">No Active Sponsorship</h2>
//         <p className="text-muted mb-6">You don't have an active sponsorship yet.</p>
//         <Link href="/sponsor/packages"><Button size="lg">View Sponsorship Packages</Button></Link>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-10">
//       {/* Header */}
//       <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
//         <div>
//           <h1 className="font-display text-4xl font-bold mb-1">{sponsorship.company}</h1>
//           <div className="flex items-center gap-2 mt-2">
//             {pkg && <Badge color={pkg.color}>{pkg.emoji} {pkg.name} Sponsor</Badge>}
//             <Badge status={sponsorship.status}>{sponsorship.status}</Badge>
//           </div>
//         </div>
//       </div>

//       {/* Status banner */}
//       {sponsorship.status === "pending" && (
//         <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 mb-8 text-sm text-yellow-400">
//           ⏳ Your sponsorship is being reviewed. Our partnership team will contact you within 48 hours.
//         </div>
//       )}
//       {sponsorship.status === "approved" && (
//         <div className="bg-emerald/10 border border-emerald/30 rounded-xl p-4 mb-8 text-sm text-emerald">
//           ✅ <strong>Sponsorship Active!</strong> Your brand is confirmed for Olambe Detty December Carnival 2025.
//         </div>
//       )}

//       {/* Package details */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
//         {[
//           ["Package", `${pkg?.emoji} ${pkg?.name}`, "#F0B429"],
//           ["Amount", sponsorship.price ? naira(sponsorship.price) : "Custom Deal", "#10B981"],
//           ["Ref", sponsorship.paystack_ref || "N/A", "#8B5CF6"],
//         ].map(([label, val, color]) => (
//           <Card key={label}>
//             <p className="text-xs text-muted uppercase tracking-wide mb-2">{label}</p>
//             <p className="font-mono font-bold truncate" style={{ color }}>{val}</p>
//           </Card>
//         ))}
//       </div>

//       {/* Package perks */}
//       {pkg && (
//         <Card className="mb-8">
//           <h3 className="font-display text-xl font-bold mb-4">Your Package Includes</h3>
//           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//             {pkg.perks.map((p) => (
//               <li key={p} className="flex items-center gap-2 text-sm text-muted">
//                 <span style={{ color: pkg.color }}>✓</span> {p}
//               </li>
//             ))}
//           </ul>
//         </Card>
//       )}

//       {/* Brand assets form */}
//       <Card>
//         <h3 className="font-display text-xl font-bold mb-2">Brand Assets</h3>
//         <p className="text-muted text-sm mb-6">
//           Submit your brand assets before <strong className="text-gold">December 5, 2025</strong> for placement on all event materials.
//         </p>
//         <form onSubmit={saveAssets} className="space-y-4">
//           <Input label="Logo URL" placeholder="https://yourcompany.com/logo.png"
//             value={assetForm.logo_url} onChange={(e) => setAssetForm({ ...assetForm, logo_url: e.target.value })} />
//           <Input label="Brand Tagline" placeholder="Your brand's tagline"
//             value={assetForm.tagline} onChange={(e) => setAssetForm({ ...assetForm, tagline: e.target.value })} />
//           <div className="flex items-center gap-4">
//             <label className="text-xs font-semibold text-muted uppercase tracking-wide">Brand Color</label>
//             <input type="color" value={assetForm.brand_color}
//               onChange={(e) => setAssetForm({ ...assetForm, brand_color: e.target.value })}
//               className="w-12 h-10 rounded-lg border border-border cursor-pointer bg-transparent" />
//             <span className="font-mono text-sm text-muted">{assetForm.brand_color}</span>
//             {assetForm.logo_url && (
//               <img src={assetForm.logo_url} alt="Logo preview" className="h-10 rounded-lg border border-border object-contain bg-white px-2" />
//             )}
//           </div>
//           <Button type="submit" loading={savingAssets}>Save Brand Assets</Button>
//         </form>
//       </Card>

//       {/* Contact */}
//       <Card className="mt-6 bg-surface">
//         <p className="text-sm text-muted">
//           📞 For partnership queries, contact our sponsorship team at{" "}
//           <a href="mailto:sponsors@olambedetty.ng" className="text-gold hover:underline">sponsors@olambedetty.ng</a>{" "}
//           or WhatsApp <a href="https://wa.me/2348012345678" className="text-gold hover:underline">+234 801 234 5678</a>.
//         </p>
//       </Card>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { PageLoader } from "@/components/ui/Spinner";
import { SPONSOR_PACKAGES, naira } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default function SponsorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [sponsorship, setSponsorship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assetForm, setAssetForm] = useState({ logo_url: "", tagline: "", brand_color: "#F0B429" });
  const [savingAssets, setSavingAssets] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/sponsor/packages");
      return;
    }
    if (user.role !== "sponsor" && user.role !== "admin") {
      router.replace("/sponsor/packages");
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) fetchSponsorship();
  }, [user]);

  async function fetchSponsorship() {
    setLoading(true);
    try {
      const res = await fetch("/api/sponsors/my-sponsorship");
      if (res.ok) {
        const data = await res.json();
        setSponsorship(data.sponsorship);
        if (data.sponsorship) {
          setAssetForm({
            logo_url: data.sponsorship.logo_url || "",
            tagline: data.sponsorship.tagline || "",
            brand_color: data.sponsorship.brand_color || "#F0B429",
          });
        }
      }
    } catch {
      toast("Failed to load sponsorship data", "error");
    } finally {
      setLoading(false);
    }
  }

  async function saveAssets(e) {
    e.preventDefault();
    setSavingAssets(true);
    try {
      const res = await fetch("/api/sponsors/my-sponsorship", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assetForm),
      });
      if (res.ok) toast("Brand assets saved! ✅", "success");
      else throw new Error("Save failed");
    } catch {
      toast("Failed to save assets", "error");
    } finally {
      setSavingAssets(false);
    }
  }

  if (authLoading || loading) return <PageLoader />;

  const pkg = SPONSOR_PACKAGES.find((p) => p.id === sponsorship?.package);

  if (!sponsorship) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <span className="text-6xl block mb-4">🤝</span>
        <h2 className="font-display text-3xl font-bold mb-3">No Active Sponsorship</h2>
        <p className="text-muted mb-6">You don't have an active sponsorship yet.</p>
        <Link href="/sponsor/packages"><Button size="lg">View Sponsorship Packages</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold mb-1">{sponsorship.company}</h1>
          <div className="flex items-center gap-2 mt-2">
            {pkg && <Badge color={pkg.color}>{pkg.emoji} {pkg.name} Sponsor</Badge>}
            <Badge status={sponsorship.status}>{sponsorship.status}</Badge>
          </div>
        </div>
      </div>

      {/* Status banner */}
      {sponsorship.status === "pending" && (
        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 mb-8 text-sm text-yellow-400">
          ⏳ Your sponsorship is being reviewed. Our partnership team will contact you within 48 hours.
        </div>
      )}
      {sponsorship.status === "approved" && (
        <div className="bg-emerald/10 border border-emerald/30 rounded-xl p-4 mb-8 text-sm text-emerald">
          ✅ <strong>Sponsorship Active!</strong> Your brand is confirmed for Olambe Detty December Carnival 2025.
        </div>
      )}

      {/* Package details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          ["Package", `${pkg?.emoji} ${pkg?.name}`, "#F0B429"],
          ["Amount", sponsorship.price ? naira(sponsorship.price) : "Custom Deal", "#10B981"],
          ["Ref", sponsorship.paystack_ref || "N/A", "#8B5CF6"],
        ].map(([label, val, color]) => (
          <Card key={label}>
            <p className="text-xs text-muted uppercase tracking-wide mb-2">{label}</p>
            <p className="font-mono font-bold truncate" style={{ color }}>{val}</p>
          </Card>
        ))}
      </div>

      {/* Package perks */}
      {pkg && (
        <Card className="mb-8">
          <h3 className="font-display text-xl font-bold mb-4">Your Package Includes</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pkg.perks.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-muted">
                <span style={{ color: pkg.color }}>✓</span> {p}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Brand assets form */}
      <Card>
        <h3 className="font-display text-xl font-bold mb-2">Brand Assets</h3>
        <p className="text-muted text-sm mb-6">
          Submit your brand assets before <strong className="text-gold">December 5, 2025</strong> for placement on all event materials.
        </p>
        <form onSubmit={saveAssets} className="space-y-4">
          <Input label="Logo URL" placeholder="https://yourcompany.com/logo.png"
            value={assetForm.logo_url} onChange={(e) => setAssetForm({ ...assetForm, logo_url: e.target.value })} />
          <Input label="Brand Tagline" placeholder="Your brand's tagline"
            value={assetForm.tagline} onChange={(e) => setAssetForm({ ...assetForm, tagline: e.target.value })} />
          <div className="flex items-center gap-4">
            <label className="text-xs font-semibold text-muted uppercase tracking-wide">Brand Color</label>
            <input type="color" value={assetForm.brand_color}
              onChange={(e) => setAssetForm({ ...assetForm, brand_color: e.target.value })}
              className="w-12 h-10 rounded-lg border border-border cursor-pointer bg-transparent" />
            <span className="font-mono text-sm text-muted">{assetForm.brand_color}</span>
            {assetForm.logo_url && (
              <img src={assetForm.logo_url} alt="Logo preview" className="h-10 rounded-lg border border-border object-contain bg-white px-2" />
            )}
          </div>
          <Button type="submit" loading={savingAssets}>Save Brand Assets</Button>
        </form>
      </Card>

      {/* Contact */}
      <Card className="mt-6 bg-surface">
        <p className="text-sm text-muted">
          📞 For partnership queries, contact our sponsorship team at{" "}
          <a href="mailto:sponsors@olambedetty.ng" className="text-gold hover:underline">sponsors@olambedetty.ng</a>{" "}
          or WhatsApp <a href="https://wa.me/2348134284100" className="text-gold hover:underline">+234 801 234 5678</a>.
        </p>
      </Card>
    </div>
  );
}
