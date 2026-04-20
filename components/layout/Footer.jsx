import Link from "next/link";
import { EVENT } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <p className="font-display text-2xl font-black text-text-base mb-2">
              Olambe Detty<br />
              <span className="text-gold">December Carnival</span>
            </p>
            <p className="text-muted text-sm mb-4 leading-relaxed max-w-sm">
              The most anticipated December celebration. Four days of music, food, culture, and unforgettable memories in Ogun State.
            </p>
            <div className="flex gap-4 text-muted text-sm">
              <a href={`https://instagram.com/${EVENT.instagram.replace("@","")}`} target="_blank" className="hover:text-gold transition-colors">Instagram</a>
              <a href={`https://x.com/${EVENT.twitter.replace("@","")}`} target="_blank" className="hover:text-gold transition-colors">X</a>
              <a href={`https://facebook.com/${EVENT.facebook}`} target="_blank" className="hover:text-gold transition-colors">Facebook</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Quick Links</p>
            <div className="flex flex-col gap-2">
              {[
                ["/#tickets", "Buy Tickets"],
                ["/vendor/apply", "Become a Vendor"],
                ["/sponsor/packages", "Sponsor the Event"],
                ["/login", "Attendee Login"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="text-sm text-muted hover:text-gold transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Contact</p>
            <div className="flex flex-col gap-2 text-sm text-muted">
              <span>📍 {EVENT.address}</span>
              <a href={`mailto:${EVENT.email}`} className="hover:text-gold transition-colors">✉️ {EVENT.email}</a>
              <a href={`tel:${EVENT.phone}`} className="hover:text-gold transition-colors">📞 {EVENT.phone}</a>
              <a href={`https://wa.me/${EVENT.whatsapp.replace(/\D/g,"")}`} target="_blank" className="hover:text-gold transition-colors">
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted">
          <p>© 2026 Olambe Detty December Carnival. All rights reserved.</p>
          <p>Payments powered by <span className="text-gold font-semibold">Paystack</span> · Secured with 256-bit SSL</p>
        </div>
      </div>
    </footer>
  );
}
