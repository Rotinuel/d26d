// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { useAuth } from "@/hooks/useAuth";
// import { usePaystack } from "@/hooks/usePaystack";
// import { useToast } from "@/components/ui/Toast";
// import Button from "@/components/ui/Button";
// import Card from "@/components/ui/Card";
// import Badge from "@/components/ui/Badge";
// import Input, { Select } from "@/components/ui/Input";
// import Modal from "@/components/ui/Modal";
// import { PageLoader } from "@/components/ui/Spinner";
// import { TICKET_TIERS, SCHEDULE, naira } from "@/lib/constants";
// import { generateRef, qrUrl, generateQRData, formatDate } from "@/lib/utils";

// export default function AttendeeDashboard() {
//   const { user, loading: authLoading } = useAuth();
//   const { pay } = usePaystack();
//   const { toast } = useToast();
//   const router = useRouter();

//   const [tickets, setTickets] = useState([]);
//   const [loadingTickets, setLoadingTickets] = useState(true);
//   const [buyModal, setBuyModal] = useState(false);
//   const [selectedTier, setSelectedTier] = useState(null);
//   const [selectedDay, setSelectedDay] = useState("Dec 23");
//   const [qty, setQty] = useState(1);
//   const [paying, setPaying] = useState(false);
//   const [viewTicket, setViewTicket] = useState(null);

//   useEffect(() => {
//     if (!authLoading && !user) router.push("/login?redirect=/attendee/dashboard");
//     if (!authLoading && user && user.role !== "attendee" && user.role !== "admin") {
//       router.push("/login");
//     }
//   }, [user, authLoading]);

//   useEffect(() => {
//     if (user) fetchTickets();
//   }, [user]);

//   async function fetchTickets() {
//     setLoadingTickets(true);
//     try {
//       const res = await fetch("/api/tickets/my-tickets");
//       if (res.ok) {
//         const data = await res.json();
//         setTickets(data.tickets);
//       }
//     } catch {
//       toast("Could not load tickets", "error");
//     } finally {
//       setLoadingTickets(false);
//     }
//   }

//   async function handlePurchase() {
//     if (!selectedTier) return toast("Please select a ticket type", "error");
//     const total = selectedTier.price * qty;
//     const ref = generateRef("TKT");
//     setPaying(true);
//     try {
//       await pay({
//         email: user.email,
//         amount: total,
//         reference: ref,
//         metadata: {
//           tier: selectedTier.id,
//           tier_name: selectedTier.name,
//           day: selectedTier.id === "single" ? selectedDay : "Dec 23–26",
//           quantity: qty,
//           user_id: user.id,
//         },
//         onSuccess: async (response) => {
//           // Verify and issue on backend
//           const res = await fetch("/api/tickets/purchase", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               reference: response.reference,
//               tier: selectedTier.id,
//               tier_name: selectedTier.name,
//               day: selectedTier.id === "single" ? selectedDay : "Dec 23–26",
//               price: selectedTier.price,
//               quantity: qty,
//             }),
//           });
//           const data = await res.json();
//           if (res.ok) {
//             toast(`${qty} ticket${qty > 1 ? "s" : ""} purchased successfully! 🎉`, "success");
//             setBuyModal(false);
//             setSelectedTier(null);
//             setQty(1);
//             await fetchTickets();
//           } else {
//             toast(data.error || "Payment verified but ticket issuance failed. Contact support.", "error");
//           }
//         },
//       });
//     } catch (err) {
//       if (err.message !== "Payment closed") {
//         toast(err.message || "Payment failed", "error");
//       }
//     } finally {
//       setPaying(false);
//     }
//   }

//   if (authLoading || loadingTickets) return <PageLoader />;

//   const total = selectedTier ? selectedTier.price * qty : 0;

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-10">
//       {/* Header */}
//       <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
//         <div>
//           <h1 className="font-display text-4xl font-bold mb-1">
//             My Tickets
//           </h1>
//           <p className="text-muted">
//             {user?.name} · {user?.email}
//           </p>
//         </div>
//         <Button onClick={() => setBuyModal(true)}>
//           🎟️ Buy More Tickets
//         </Button>
//       </div>

//       {/* Tickets grid */}
//       {tickets.length === 0 ? (
//         <Card className="text-center py-20">
//           <div className="text-6xl mb-4">🎟️</div>
//           <h3 className="font-display text-2xl mb-2">No tickets yet</h3>
//           <p className="text-muted mb-6">Get your tickets for the Olambe Detty December Carnival</p>
//           <Button onClick={() => setBuyModal(true)}>Browse Tickets</Button>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {tickets.map((t) => (
//             <div
//               key={t.id}
//               onClick={() => setViewTicket(t)}
//               className="bg-card border border-border rounded-2xl p-5 cursor-pointer hover:border-gold/40 transition-all hover:-translate-y-1"
//             >
//               <div className="flex justify-between items-start mb-4">
//                 <Badge color="#F0B429">{t.tier_name}</Badge>
//                 <Badge status={t.status}>{t.status}</Badge>
//               </div>
//               <p className="font-display text-lg font-bold mb-1">ODDC 2025</p>
//               <p className="text-muted text-sm mb-4">{t.day}</p>
//               <div className="bg-surface rounded-xl p-3 flex items-center justify-center mb-4">
//                 <img
//                   src={qrUrl(generateQRData(t.id, t.paystack_ref))}
//                   alt="QR Code"
//                   width={100}
//                   height={100}
//                   className="rounded-lg"
//                 />
//               </div>
//               <p className="font-mono text-[10px] text-muted text-center truncate">{t.paystack_ref}</p>
//               {t.quantity > 1 && (
//                 <p className="text-xs text-gold text-center mt-1">×{t.quantity} tickets</p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ── BUY TICKETS MODAL ─────────────────────────────────────────────── */}
//       <Modal open={buyModal} onClose={() => setBuyModal(false)} title="Buy Tickets" size="lg">
//         {/* Tier selection */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
//           {TICKET_TIERS.map((tier) => (
//             <div
//               key={tier.id}
//               onClick={() => setSelectedTier(tier)}
//               className="p-4 rounded-xl border cursor-pointer transition-all"
//               style={{
//                 borderColor: selectedTier?.id === tier.id ? tier.color : "#252338",
//                 background: selectedTier?.id === tier.id ? tier.color + "10" : "transparent",
//               }}
//             >
//               <p className="font-semibold mb-0.5">{tier.name}</p>
//               <p className="font-mono text-gold font-bold">{naira(tier.price)}</p>
//               <p className="text-xs text-muted mt-1">{tier.desc}</p>
//             </div>
//           ))}
//         </div>

//         {selectedTier && (
//           <div className="space-y-4">
//             {/* Day picker for single */}
//             {selectedTier.id === "single" && (
//               <Select
//                 label="Select Day"
//                 value={selectedDay}
//                 onChange={(e) => setSelectedDay(e.target.value)}
//               >
//                 {Object.keys(SCHEDULE).map((d) => (
//                   <option key={d} value={d}>{d} — {SCHEDULE[d].theme}</option>
//                 ))}
//               </Select>
//             )}

//             {/* Quantity */}
//             <div>
//               <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-2">
//                 Quantity
//               </label>
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => setQty(Math.max(1, qty - 1))}
//                   className="w-10 h-10 bg-surface border border-border rounded-xl text-lg hover:border-gold/50 transition-colors"
//                 >
//                   −
//                 </button>
//                 <span className="font-mono text-xl w-8 text-center">{qty}</span>
//                 <button
//                   onClick={() => setQty(Math.min(10, qty + 1))}
//                   className="w-10 h-10 bg-surface border border-border rounded-xl text-lg hover:border-gold/50 transition-colors"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {/* Summary */}
//             <div className="bg-surface rounded-xl p-4 space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-muted">Ticket</span>
//                 <span>{selectedTier.name}</span>
//               </div>
//               {selectedTier.id === "single" && (
//                 <div className="flex justify-between">
//                   <span className="text-muted">Day</span>
//                   <span>{selectedDay}</span>
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-muted">Unit price</span>
//                 <span>{naira(selectedTier.price)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted">Quantity</span>
//                 <span>×{qty}</span>
//               </div>
//               <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-2">
//                 <span>Total</span>
//                 <span className="text-gold">{naira(total)}</span>
//               </div>
//             </div>

//             <Button
//               className="w-full"
//               size="lg"
//               onClick={handlePurchase}
//               loading={paying}
//             >
//               💳 Pay {naira(total)} with Paystack
//             </Button>
//             <p className="text-center text-[11px] text-muted">
//               Card · Bank Transfer · USSD · Verve · Mobile Money
//             </p>
//           </div>
//         )}
//       </Modal>

//       {/* ── VIEW TICKET MODAL ─────────────────────────────────────────────── */}
//       <Modal open={!!viewTicket} onClose={() => setViewTicket(null)} title="Your Ticket">
//         {viewTicket && (
//           <div className="text-center space-y-4">
//             <div>
//               <p className="font-display text-2xl font-bold">Olambe Detty December Carnival</p>
//               <p className="text-muted text-sm mt-1">2025 · Olambe, Ogun State</p>
//             </div>
//             <div className="flex justify-center gap-3">
//               <Badge color="#F0B429">{viewTicket.tier_name}</Badge>
//               <Badge status={viewTicket.status}>{viewTicket.status}</Badge>
//             </div>
//             <p className="text-lg font-semibold">{viewTicket.day}</p>
//             <div className="bg-white p-4 rounded-2xl inline-block">
//               <img
//                 src={qrUrl(generateQRData(viewTicket.id, viewTicket.paystack_ref))}
//                 alt="QR Code"
//                 width={180}
//                 height={180}
//               />
//             </div>
//             <div className="bg-surface rounded-xl p-4 text-left space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-muted">Reference</span>
//                 <span className="font-mono text-xs">{viewTicket.paystack_ref}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted">Purchased</span>
//                 <span>{formatDate(viewTicket.created_at)}</span>
//               </div>
//               {viewTicket.quantity > 1 && (
//                 <div className="flex justify-between">
//                   <span className="text-muted">Quantity</span>
//                   <span className="text-gold font-bold">×{viewTicket.quantity}</span>
//                 </div>
//               )}
//               <div className="flex justify-between">
//                 <span className="text-muted">Amount Paid</span>
//                 <span className="font-bold">{naira(viewTicket.price * (viewTicket.quantity || 1))}</span>
//               </div>
//             </div>
//             <p className="text-xs text-muted">
//               Present this QR code at the gate. One scan per entry.
//             </p>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { usePaystack } from "@/hooks/usePaystack";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input, { Select } from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { PageLoader } from "@/components/ui/Spinner";
import { TICKET_TIERS, SCHEDULE, naira } from "@/lib/constants";
import { generateRef, qrUrl, generateQRData, formatDate } from "@/lib/utils";

export default function AttendeeDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { pay } = usePaystack();
  const { toast } = useToast();
  const router = useRouter();

  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [buyModal, setBuyModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedDay, setSelectedDay] = useState("Dec 23");
  const [qty, setQty] = useState(1);
  const [paying, setPaying] = useState(false);
  const [viewTicket, setViewTicket] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?redirect=/attendee/dashboard");
      return;
    }
    if (user.role !== "attendee" && user.role !== "admin") {
      router.replace("/login");
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) fetchTickets();
  }, [user]);

  async function fetchTickets() {
    setLoadingTickets(true);
    try {
      const res = await fetch("/api/tickets/my-tickets");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets);
      }
    } catch {
      toast("Could not load tickets", "error");
    } finally {
      setLoadingTickets(false);
    }
  }

  async function handlePurchase() {
    if (!selectedTier) return toast("Please select a ticket type", "error");
    const total = selectedTier.price * qty;
    const ref = generateRef("TKT");
    setPaying(true);
    try {
      await pay({
        email: user.email,
        amount: total,
        reference: ref,
        metadata: {
          tier: selectedTier.id,
          tier_name: selectedTier.name,
          day: selectedTier.id === "single" ? selectedDay : "Dec 23–26",
          quantity: qty,
          user_id: user.id,
        },
        onSuccess: async (response) => {
          // Verify and issue on backend
          const res = await fetch("/api/tickets/purchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reference: response.reference,
              tier: selectedTier.id,
              tier_name: selectedTier.name,
              day: selectedTier.id === "single" ? selectedDay : "Dec 23–26",
              price: selectedTier.price,
              quantity: qty,
            }),
          });
          const data = await res.json();
          if (res.ok) {
            toast(`${qty} ticket${qty > 1 ? "s" : ""} purchased successfully! 🎉`, "success");
            setBuyModal(false);
            setSelectedTier(null);
            setQty(1);
            await fetchTickets();
          } else {
            toast(data.error || "Payment verified but ticket issuance failed. Contact support.", "error");
          }
        },
      });
    } catch (err) {
      if (err.message !== "Payment closed") {
        toast(err.message || "Payment failed", "error");
      }
    } finally {
      setPaying(false);
    }
  }

  if (authLoading || loadingTickets) return <PageLoader />;

  const total = selectedTier ? selectedTier.price * qty : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-4xl font-bold mb-1">
            My Tickets
          </h1>
          <p className="text-muted">
            {user?.name} · {user?.email}
          </p>
        </div>
        <Button onClick={() => setBuyModal(true)}>
          🎟️ Buy More Tickets
        </Button>
      </div>

      {/* Tickets grid */}
      {tickets.length === 0 ? (
        <Card className="text-center py-20">
          <div className="text-6xl mb-4">🎟️</div>
          <h3 className="font-display text-2xl mb-2">No tickets yet</h3>
          <p className="text-muted mb-6">Get your tickets for the Olambe Detty December Carnival</p>
          <Button onClick={() => setBuyModal(true)}>Browse Tickets</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((t) => (
            <div
              key={t.id}
              onClick={() => setViewTicket(t)}
              className="bg-card border border-border rounded-2xl p-5 cursor-pointer hover:border-gold/40 transition-all hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <Badge color="#F0B429">{t.tier_name}</Badge>
                <Badge status={t.status}>{t.status}</Badge>
              </div>
              <p className="font-display text-lg font-bold mb-1">ODDC 2025</p>
              <p className="text-muted text-sm mb-4">{t.day}</p>
              <div className="bg-surface rounded-xl p-3 flex items-center justify-center mb-4">
                <img
                  src={qrUrl(generateQRData(t.id, t.paystack_ref))}
                  alt="QR Code"
                  width={100}
                  height={100}
                  className="rounded-lg"
                />
              </div>
              <p className="font-mono text-[10px] text-muted text-center truncate">{t.paystack_ref}</p>
              {t.quantity > 1 && (
                <p className="text-xs text-gold text-center mt-1">×{t.quantity} tickets</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── BUY TICKETS MODAL ─────────────────────────────────────────────── */}
      <Modal open={buyModal} onClose={() => setBuyModal(false)} title="Buy Tickets" size="lg">
        {/* Tier selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {TICKET_TIERS.map((tier) => (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier)}
              className="p-4 rounded-xl border cursor-pointer transition-all"
              style={{
                borderColor: selectedTier?.id === tier.id ? tier.color : "#252338",
                background: selectedTier?.id === tier.id ? tier.color + "10" : "transparent",
              }}
            >
              <p className="font-semibold mb-0.5">{tier.name}</p>
              <p className="font-mono text-gold font-bold">{naira(tier.price)}</p>
              <p className="text-xs text-muted mt-1">{tier.desc}</p>
            </div>
          ))}
        </div>

        {selectedTier && (
          <div className="space-y-4">
            {/* Day picker for single */}
            {selectedTier.id === "single" && (
              <Select
                label="Select Day"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                {Object.keys(SCHEDULE).map((d) => (
                  <option key={d} value={d}>{d} — {SCHEDULE[d].theme}</option>
                ))}
              </Select>
            )}

            {/* Quantity */}
            <div>
              <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 bg-surface border border-border rounded-xl text-lg hover:border-gold/50 transition-colors"
                >
                  −
                </button>
                <span className="font-mono text-xl w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(10, qty + 1))}
                  className="w-10 h-10 bg-surface border border-border rounded-xl text-lg hover:border-gold/50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-surface rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Ticket</span>
                <span>{selectedTier.name}</span>
              </div>
              {selectedTier.id === "single" && (
                <div className="flex justify-between">
                  <span className="text-muted">Day</span>
                  <span>{selectedDay}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted">Unit price</span>
                <span>{naira(selectedTier.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Quantity</span>
                <span>×{qty}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-2">
                <span>Total</span>
                <span className="text-gold">{naira(total)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handlePurchase}
              loading={paying}
            >
              💳 Pay {naira(total)} with Paystack
            </Button>
            <p className="text-center text-[11px] text-muted">
              Card · Bank Transfer · USSD · Verve · Mobile Money
            </p>
          </div>
        )}
      </Modal>

      {/* ── VIEW TICKET MODAL ─────────────────────────────────────────────── */}
      <Modal open={!!viewTicket} onClose={() => setViewTicket(null)} title="Your Ticket">
        {viewTicket && (
          <div className="text-center space-y-4">
            <div>
              <p className="font-display text-2xl font-bold">Olambe Detty December Carnival</p>
              <p className="text-muted text-sm mt-1">2025 · Olambe, Ogun State</p>
            </div>
            <div className="flex justify-center gap-3">
              <Badge color="#F0B429">{viewTicket.tier_name}</Badge>
              <Badge status={viewTicket.status}>{viewTicket.status}</Badge>
            </div>
            <p className="text-lg font-semibold">{viewTicket.day}</p>
            <div className="bg-white p-4 rounded-2xl inline-block">
              <img
                src={qrUrl(generateQRData(viewTicket.id, viewTicket.paystack_ref))}
                alt="QR Code"
                width={180}
                height={180}
              />
            </div>
            <div className="bg-surface rounded-xl p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Reference</span>
                <span className="font-mono text-xs">{viewTicket.paystack_ref}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Purchased</span>
                <span>{formatDate(viewTicket.created_at)}</span>
              </div>
              {viewTicket.quantity > 1 && (
                <div className="flex justify-between">
                  <span className="text-muted">Quantity</span>
                  <span className="text-gold font-bold">×{viewTicket.quantity}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted">Amount Paid</span>
                <span className="font-bold">{naira(viewTicket.price * (viewTicket.quantity || 1))}</span>
              </div>
            </div>
            <p className="text-xs text-muted">
              Present this QR code at the gate. One scan per entry.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
