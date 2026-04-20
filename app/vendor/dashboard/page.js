<<<<<<< HEAD
// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/hooks/useAuth";
// import { usePaystack } from "@/hooks/usePaystack";
// import { useToast } from "@/components/ui/Toast";
// import Button from "@/components/ui/Button";
// import Card from "@/components/ui/Card";
// import Badge from "@/components/ui/Badge";
// import Modal from "@/components/ui/Modal";
// import { PageLoader } from "@/components/ui/Spinner";
// import { VENDOR_SLOTS, naira } from "@/lib/constants";
// import { generateRef, formatDate } from "@/lib/utils";

// export default function VendorDashboard() {
//   const { user, loading: authLoading } = useAuth();
//   const { pay } = usePaystack();
//   const { toast } = useToast();
//   const router = useRouter();

//   const [vendor, setVendor] = useState(null);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [bookingModal, setBookingModal] = useState(false);
//   const [paying, setPaying] = useState(false);

//   useEffect(() => {
//     if (!authLoading && !user) router.push("/vendor/apply");
//     if (!authLoading && user && user.role !== "vendor" && user.role !== "admin")
//       router.push("/vendor/apply");
//   }, [user, authLoading]);

//   useEffect(() => {
//     if (user) fetchData();
//   }, [user]);

//   async function fetchData() {
//     setLoading(true);
//     try {
//       const [vendorRes, bookingsRes] = await Promise.all([
//         fetch("/api/vendors/my-bookings"),
//         fetch("/api/vendors/my-bookings"),
//       ]);
//       const data = await vendorRes.json();
//       setVendor(data.vendor);
//       setBookings(data.bookings || []);
//     } catch {
//       toast("Failed to load data", "error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleBookSlot() {
//     if (!selectedSlot) return;
//     const ref = generateRef("VND");
//     setPaying(true);
//     try {
//       await pay({
//         email: user.email,
//         amount: selectedSlot.price,
//         reference: ref,
//         metadata: { slot_id: selectedSlot.id, slot_name: selectedSlot.name, vendor_id: vendor?.id },
//         onSuccess: async (response) => {
//           const res = await fetch("/api/vendors/book", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               reference: response.reference,
//               slot_type_id: selectedSlot.id,
//               slot_name: selectedSlot.name,
//               price: selectedSlot.price,
//             }),
//           });
//           const data = await res.json();
//           if (res.ok) {
//             toast("Slot booked! Pending admin confirmation. ✅", "success");
//             setBookingModal(false);
//             setSelectedSlot(null);
//             await fetchData();
//           } else {
//             toast(data.error || "Booking failed. Contact support.", "error");
//           }
//         },
//       });
//     } catch (err) {
//       if (err.message !== "Payment closed") toast(err.message, "error");
//     } finally {
//       setPaying(false);
//     }
//   }

//   if (authLoading || loading) return <PageLoader />;

//   const statusColor = {
//     pending: "bg-yellow-400/10 border-yellow-400/30 text-yellow-400",
//     approved: "bg-emerald/10 border-emerald/30 text-emerald",
//     rejected: "bg-red-400/10 border-red-400/30 text-red-400",
//   };

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-10">
//       {/* Header */}
//       <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
//         <div>
//           <h1 className="font-display text-4xl font-bold mb-1">{vendor?.biz_name || user?.name}</h1>
//           <div className="flex items-center gap-2 mt-2 flex-wrap">
//             {vendor?.category && <Badge color="#FF6348">{vendor.category}</Badge>}
//             <Badge status={vendor?.status || "pending"}>{vendor?.status || "pending"}</Badge>
//           </div>
//         </div>
//         {(vendor?.status === "approved" || !vendor) && (
//           <Button onClick={() => setBookingModal(true)}>
//             + Book a Slot
//           </Button>
//         )}
//       </div>

//       {/* Status banner */}
//       {vendor?.status === "pending" && (
//         <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 mb-8 text-sm text-yellow-400">
//           ⏳ <strong>Application under review.</strong> Our team will respond within 48 hours.
//           You can preview available slots below, but payment will only be processed once approved.
//         </div>
//       )}
//       {vendor?.status === "rejected" && (
//         <div className="bg-red-400/10 border border-red-400/30 rounded-xl p-4 mb-8 text-sm text-red-400">
//           ❌ <strong>Application not approved.</strong> Please contact{" "}
//           <a href="mailto:vendors@olambedetty.ng" className="underline">vendors@olambedetty.ng</a> to discuss next steps.
//         </div>
//       )}

//       {/* Vendor info */}
//       {vendor && (
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
//           {[
//             ["Business", vendor.biz_name],
//             ["Category", vendor.category],
//             ["Email", vendor.email],
//             ["Phone", vendor.phone],
//           ].map(([label, val]) => (
//             <Card key={label} className="!p-4">
//               <p className="text-xs text-muted uppercase tracking-wider mb-1">{label}</p>
//               <p className="text-sm font-semibold truncate">{val}</p>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Available slots preview */}
//       <h2 className="font-display text-2xl font-bold mb-5">Available Slots</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
//         {VENDOR_SLOTS.map((slot) => (
//           <Card key={slot.id} hover className="cursor-pointer" onClick={() => { setSelectedSlot(slot); setBookingModal(true); }}>
//             <div className="flex justify-between items-start mb-3">
//               <h3 className="font-semibold">{slot.name}</h3>
//               {slot.popular && <Badge color="#F0B429">Popular</Badge>}
//             </div>
//             <p className="font-mono text-gold text-2xl font-bold mb-3">{naira(slot.price)}</p>
//             <p className="text-muted text-sm mb-3">{slot.desc}</p>
//             <div className="flex gap-2 flex-wrap text-xs">
//               <span className="bg-surface border border-border px-2 py-1 rounded-lg">📐 {slot.size}</span>
//               <span className="bg-surface border border-border px-2 py-1 rounded-lg">⚡ {slot.power}</span>
//             </div>
//             <ul className="mt-3 space-y-1">
//               {slot.includes.map((item) => (
//                 <li key={item} className="text-xs text-muted flex items-center gap-1.5">
//                   <span className="text-emerald">✓</span> {item}
//                 </li>
//               ))}
//             </ul>
//           </Card>
//         ))}
//       </div>

//       {/* My bookings */}
//       <h2 className="font-display text-2xl font-bold mb-5">My Bookings</h2>
//       {bookings.length === 0 ? (
//         <Card className="text-center py-12">
//           <p className="text-4xl mb-3">🏪</p>
//           <p className="text-muted">No slot bookings yet. Click a slot above to get started.</p>
//         </Card>
//       ) : (
//         <div className="flex flex-col gap-3">
//           {bookings.map((b) => (
//             <Card key={b.id}>
//               <div className="flex justify-between items-center flex-wrap gap-3">
//                 <div>
//                   <p className="font-semibold mb-1">{b.slot_name}</p>
//                   <p className="font-mono text-xs text-muted">{b.paystack_ref}</p>
//                   <p className="text-xs text-muted mt-1">{formatDate(b.created_at)}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-bold text-gold mb-1">{naira(b.price)}</p>
//                   <Badge status={b.status}>{b.status}</Badge>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Booking modal */}
//       <Modal open={bookingModal} onClose={() => { setBookingModal(false); setSelectedSlot(null); }} title="Book a Vendor Slot">
//         <div className="space-y-4">
//           {/* Slot selector */}
//           <div className="grid grid-cols-1 gap-3">
//             {VENDOR_SLOTS.map((slot) => (
//               <div
//                 key={slot.id}
//                 onClick={() => setSelectedSlot(slot)}
//                 className="flex justify-between items-center p-4 rounded-xl border cursor-pointer transition-all"
//                 style={{
//                   borderColor: selectedSlot?.id === slot.id ? "#FF6348" : "#252338",
//                   background: selectedSlot?.id === slot.id ? "#FF634810" : "transparent",
//                 }}
//               >
//                 <div>
//                   <p className="font-semibold text-sm">{slot.name}</p>
//                   <p className="text-xs text-muted">{slot.size} · {slot.power}</p>
//                 </div>
//                 <p className="font-mono font-bold text-gold">{naira(slot.price)}</p>
//               </div>
//             ))}
//           </div>

//           {selectedSlot && (
//             <>
//               <div className="bg-surface rounded-xl p-4 text-sm space-y-2">
//                 <div className="flex justify-between"><span className="text-muted">Slot</span><span>{selectedSlot.name}</span></div>
//                 <div className="flex justify-between"><span className="text-muted">Size</span><span>{selectedSlot.size}</span></div>
//                 <div className="flex justify-between"><span className="text-muted">Power</span><span>{selectedSlot.power}</span></div>
//                 <div className="flex justify-between font-bold text-base border-t border-border pt-2">
//                   <span>Total</span><span className="text-gold">{naira(selectedSlot.price)}</span>
//                 </div>
//               </div>
//               <Button className="w-full" size="lg" onClick={handleBookSlot} loading={paying}
//                 disabled={vendor?.status === "pending"}>
//                 {vendor?.status === "pending"
//                   ? "⏳ Awaiting Approval Before Payment"
//                   : `💳 Pay ${naira(selectedSlot.price)} with Paystack`}
//               </Button>
//             </>
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// }


=======
>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePaystack } from "@/hooks/usePaystack";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { PageLoader } from "@/components/ui/Spinner";
import { VENDOR_SLOTS, naira } from "@/lib/constants";
import { generateRef, formatDate } from "@/lib/utils";

export default function VendorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { pay } = usePaystack();
  const { toast } = useToast();
  const router = useRouter();

  const [vendor, setVendor] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingModal, setBookingModal] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (authLoading) return; // wait for auth state to settle
    if (!user) {
      router.replace("/vendor/apply");
      return;
    }
    if (user.role !== "vendor" && user.role !== "admin") {
      router.replace("/login");
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  async function fetchData() {
    setLoading(true);
    try {
      const [vendorRes, bookingsRes] = await Promise.all([
        fetch("/api/vendors/my-bookings"),
        fetch("/api/vendors/my-bookings"),
      ]);
      const data = await vendorRes.json();
      setVendor(data.vendor);
      setBookings(data.bookings || []);
    } catch {
      toast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleBookSlot() {
    if (!selectedSlot) return;
    const ref = generateRef("VND");
    setPaying(true);
    try {
      await pay({
        email: user.email,
        amount: selectedSlot.price,
        reference: ref,
        metadata: { slot_id: selectedSlot.id, slot_name: selectedSlot.name, vendor_id: vendor?.id },
        onSuccess: async (response) => {
          const res = await fetch("/api/vendors/book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reference: response.reference,
              slot_type_id: selectedSlot.id,
              slot_name: selectedSlot.name,
              price: selectedSlot.price,
            }),
          });
          const data = await res.json();
          if (res.ok) {
            toast("Slot booked! Pending admin confirmation. ✅", "success");
            setBookingModal(false);
            setSelectedSlot(null);
            await fetchData();
          } else {
            toast(data.error || "Booking failed. Contact support.", "error");
          }
        },
      });
    } catch (err) {
      if (err.message !== "Payment closed") toast(err.message, "error");
    } finally {
      setPaying(false);
    }
  }

  if (authLoading || loading) return <PageLoader />;

  const statusColor = {
    pending: "bg-yellow-400/10 border-yellow-400/30 text-yellow-400",
    approved: "bg-emerald/10 border-emerald/30 text-emerald",
    rejected: "bg-red-400/10 border-red-400/30 text-red-400",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold mb-1">{vendor?.biz_name || user?.name}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {vendor?.category && <Badge color="#FF6348">{vendor.category}</Badge>}
            <Badge status={vendor?.status || "pending"}>{vendor?.status || "pending"}</Badge>
          </div>
        </div>
        {(vendor?.status === "approved" || !vendor) && (
          <Button onClick={() => setBookingModal(true)}>
            + Book a Slot
          </Button>
        )}
      </div>

      {/* Status banner */}
      {vendor?.status === "pending" && (
        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4 mb-8 text-sm text-yellow-400">
          ⏳ <strong>Application under review.</strong> Our team will respond within 48 hours.
          You can preview available slots below, but payment will only be processed once approved.
        </div>
      )}
      {vendor?.status === "rejected" && (
        <div className="bg-red-400/10 border border-red-400/30 rounded-xl p-4 mb-8 text-sm text-red-400">
          ❌ <strong>Application not approved.</strong> Please contact{" "}
          <a href="mailto:vendors@olambedetty.ng" className="underline">vendors@olambedetty.ng</a> to discuss next steps.
        </div>
      )}

      {/* Vendor info */}
      {vendor && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            ["Business", vendor.biz_name],
            ["Category", vendor.category],
            ["Email", vendor.email],
            ["Phone", vendor.phone],
          ].map(([label, val]) => (
            <Card key={label} className="!p-4">
              <p className="text-xs text-muted uppercase tracking-wider mb-1">{label}</p>
              <p className="text-sm font-semibold truncate">{val}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Available slots preview */}
      <h2 className="font-display text-2xl font-bold mb-5">Available Slots</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {VENDOR_SLOTS.map((slot) => (
          <Card key={slot.id} hover className="cursor-pointer" onClick={() => { setSelectedSlot(slot); setBookingModal(true); }}>
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold">{slot.name}</h3>
              {slot.popular && <Badge color="#F0B429">Popular</Badge>}
            </div>
            <p className="font-mono text-gold text-2xl font-bold mb-3">{naira(slot.price)}</p>
            <p className="text-muted text-sm mb-3">{slot.desc}</p>
            <div className="flex gap-2 flex-wrap text-xs">
              <span className="bg-surface border border-border px-2 py-1 rounded-lg">📐 {slot.size}</span>
              <span className="bg-surface border border-border px-2 py-1 rounded-lg">⚡ {slot.power}</span>
            </div>
            <ul className="mt-3 space-y-1">
              {slot.includes.map((item) => (
                <li key={item} className="text-xs text-muted flex items-center gap-1.5">
                  <span className="text-emerald">✓</span> {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* My bookings */}
      <h2 className="font-display text-2xl font-bold mb-5">My Bookings</h2>
      {bookings.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-4xl mb-3">🏪</p>
          <p className="text-muted">No slot bookings yet. Click a slot above to get started.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((b) => (
            <Card key={b.id}>
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <p className="font-semibold mb-1">{b.slot_name}</p>
                  <p className="font-mono text-xs text-muted">{b.paystack_ref}</p>
                  <p className="text-xs text-muted mt-1">{formatDate(b.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gold mb-1">{naira(b.price)}</p>
                  <Badge status={b.status}>{b.status}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Booking modal */}
      <Modal open={bookingModal} onClose={() => { setBookingModal(false); setSelectedSlot(null); }} title="Book a Vendor Slot">
        <div className="space-y-4">
          {/* Slot selector */}
          <div className="grid grid-cols-1 gap-3">
            {VENDOR_SLOTS.map((slot) => (
              <div
                key={slot.id}
                onClick={() => setSelectedSlot(slot)}
                className="flex justify-between items-center p-4 rounded-xl border cursor-pointer transition-all"
                style={{
                  borderColor: selectedSlot?.id === slot.id ? "#FF6348" : "#252338",
                  background: selectedSlot?.id === slot.id ? "#FF634810" : "transparent",
                }}
              >
                <div>
                  <p className="font-semibold text-sm">{slot.name}</p>
                  <p className="text-xs text-muted">{slot.size} · {slot.power}</p>
                </div>
                <p className="font-mono font-bold text-gold">{naira(slot.price)}</p>
              </div>
            ))}
          </div>

          {selectedSlot && (
            <>
              <div className="bg-surface rounded-xl p-4 text-sm space-y-2">
                <div className="flex justify-between"><span className="text-muted">Slot</span><span>{selectedSlot.name}</span></div>
                <div className="flex justify-between"><span className="text-muted">Size</span><span>{selectedSlot.size}</span></div>
                <div className="flex justify-between"><span className="text-muted">Power</span><span>{selectedSlot.power}</span></div>
                <div className="flex justify-between font-bold text-base border-t border-border pt-2">
                  <span>Total</span><span className="text-gold">{naira(selectedSlot.price)}</span>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={handleBookSlot} loading={paying}
                disabled={vendor?.status === "pending"}>
                {vendor?.status === "pending"
                  ? "⏳ Awaiting Approval Before Payment"
                  : `💳 Pay ${naira(selectedSlot.price)} with Paystack`}
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
