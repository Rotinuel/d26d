"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePaystack } from "@/hooks/usePaystack";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { SPONSOR_PACKAGES, naira } from "@/lib/constants";
import { generateRef } from "@/lib/utils";

export default function SponsorPackagesPage() {
  const { user } = useAuth();
  const { pay } = usePaystack();
  const { toast } = useToast();
  const router = useRouter();

  const [selectedPkg, setSelectedPkg] = useState(null);
  const [modal, setModal] = useState(false);
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({
    company: "", contact_name: "", email: "", phone: "", website: "",
    password: "", tagline: "", logo_url: "", brand_color: "#F0B429",
  });

  async function handleSponsor(e) {
    e.preventDefault();
    if (!selectedPkg) return;

    // For title sponsor — no payment, just inquiry
    if (!selectedPkg.price) {
      const res = await fetch("/api/sponsors/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, package: selectedPkg.id, price: null }),
      });
      const data = await res.json();
      if (res.ok) {
        toast("Title Sponsor inquiry submitted! Our team will contact you within 24 hours. 🎊", "success");
        setModal(false);
        router.push("/sponsor/dashboard");
      } else {
        toast(data.error || "Submission failed", "error");
      }
      return;
    }

    // Paid packages — go through Paystack
    const ref = generateRef("SPN");
    setPaying(true);
    try {
      await pay({
        email: form.email || user?.email,
        amount: selectedPkg.price,
        reference: ref,
        metadata: { package: selectedPkg.id, company: form.company },
        onSuccess: async (response) => {
          const res = await fetch("/api/sponsors/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...form,
              package: selectedPkg.id,
              price: selectedPkg.price,
              paystack_ref: response.reference,
            }),
          });
          const data = await res.json();
          if (res.ok) {
            toast(`${selectedPkg.name} sponsorship confirmed! Welcome aboard 🎊`, "success");
            setModal(false);
            router.push("/sponsor/dashboard");
          } else {
            toast(data.error || "Payment received but submission failed. Contact us.", "error");
          }
        },
      });
    } catch (err) {
      if (err.message !== "Payment closed") toast(err.message, "error");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-gold text-xs font-bold uppercase tracking-widest mb-3">Partnership Opportunities</p>
        <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">
          Sponsor <span className="text-gold">ODDC 2025</span>
        </h1>
        <p className="text-muted max-w-xl mx-auto text-lg">
          Put your brand in front of 3,000+ attendees over 4 unforgettable days.
          Nigeria's most energetic December crowd.
        </p>
      </div>

      {/* Package grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {SPONSOR_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className="relative bg-card rounded-2xl p-7 flex flex-col gap-5 border transition-all hover:-translate-y-1"
            style={{ borderColor: pkg.popular ? pkg.color + "60" : "#252338" }}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-bg text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                Most Popular
              </div>
            )}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: pkg.color + "20", border: `1px solid ${pkg.color}40` }}>
              {pkg.emoji}
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold mb-1" style={{ color: pkg.color }}>{pkg.name}</h3>
              <div className="font-mono text-2xl font-bold">
                {pkg.price ? naira(pkg.price) : <span className="text-coral">Custom</span>}
              </div>
            </div>
            <ul className="flex flex-col gap-2 flex-1">
              {pkg.perks.map((p) => (
                <li key={p} className="text-sm text-muted flex items-start gap-2">
                  <span style={{ color: pkg.color }} className="shrink-0 mt-0.5">✓</span>
                  {p}
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              style={pkg.popular ? {} : { background: pkg.color + "20", color: pkg.color, border: `1px solid ${pkg.color}40` }}
              variant={pkg.popular ? "primary" : "ghost"}
              onClick={() => { setSelectedPkg(pkg); setModal(true); }}
            >
              {pkg.price ? `Sponsor at ${naira(pkg.price)}` : "Get Custom Quote"}
            </Button>
          </div>
        ))}
      </div>

      {/* Why sponsor */}
      <Card className="mb-16">
        <h2 className="font-display text-3xl font-bold mb-8 text-center">Why Sponsor ODDC?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            ["🏟️", "3,000+", "Expected Attendees"],
            ["📱", "50,000+", "Social Media Reach"],
            ["🎤", "4 Days", "of brand exposure"],
          ].map(([icon, num, label]) => (
            <div key={label}>
              <span className="text-4xl block mb-2">{icon}</span>
              <p className="font-mono text-3xl font-bold text-gold">{num}</p>
              <p className="text-muted text-sm">{label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Sponsorship modal */}
      <Modal open={modal} onClose={() => { setModal(false); setSelectedPkg(null); }} title={`${selectedPkg?.name} Sponsorship`} size="lg">
        {selectedPkg && (
          <form onSubmit={handleSponsor} className="space-y-5">
            {/* Package summary */}
            <div className="p-4 rounded-xl border" style={{ borderColor: selectedPkg.color + "40", background: selectedPkg.color + "08" }}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold" style={{ color: selectedPkg.color }}>{selectedPkg.emoji} {selectedPkg.name} Package</p>
                  <p className="text-sm text-muted">{selectedPkg.perks.length} perks included</p>
                </div>
                <p className="font-mono font-bold text-xl">
                  {selectedPkg.price ? naira(selectedPkg.price) : "Custom"}
                </p>
              </div>
            </div>

            {/* Company details */}
            {!user && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Company Name *" placeholder="Acme Corp Nigeria" value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })} required />
                  <Input label="Contact Person *" placeholder="Ngozi Adeyemi" value={form.contact_name}
                    onChange={(e) => setForm({ ...form, contact_name: e.target.value })} required />
                  <Input label="Email *" type="email" placeholder="sponsor@company.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  <Input label="Phone" placeholder="+234 801 234 5678" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <Input label="Website" placeholder="https://company.com" value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })} />
                  <Input label="Password (to access sponsor portal)" type="password" placeholder="••••••••" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-3">Brand Assets (can be updated later)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Logo URL" placeholder="https://company.com/logo.png" value={form.logo_url}
                      onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
                    <Input label="Brand Tagline" placeholder="Your brand tagline" value={form.tagline}
                      onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-semibold text-muted uppercase tracking-wide">Brand Color</label>
                      <input type="color" value={form.brand_color}
                        onChange={(e) => setForm({ ...form, brand_color: e.target.value })}
                        className="w-12 h-10 rounded-lg border border-border cursor-pointer bg-transparent" />
                      <span className="font-mono text-sm text-muted">{form.brand_color}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" size="lg" loading={paying}>
              {selectedPkg.price
                ? `💳 Pay ${naira(selectedPkg.price)} with Paystack`
                : "📧 Submit Title Sponsor Inquiry"}
            </Button>
            {selectedPkg.price && (
              <p className="text-center text-[11px] text-muted">
                Secured by Paystack · Visa · Mastercard · Verve · Bank Transfer
              </p>
            )}
          </form>
        )}
      </Modal>
    </div>
  );
}
