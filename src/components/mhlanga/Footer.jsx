import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

export default function Footer() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handle = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <footer id="contact" className="basalt-bg text-[#F4F4F4] pt-24 pb-10 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 reveal">
          <p className="text-xs tracking-[0.3em] uppercase text-[#D27D2D] mb-5">Contact</p>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-[0.95] tracking-tight">
            REACH US.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-white/10">
          {/* Contact info column */}
          <div className="lg:col-span-3 reveal">
            <h3 className="font-display text-lg mb-6">Get In Touch</h3>
            <div className="space-y-6 text-sm">
              <ContactRow icon={<MapPin size={16} />} label="Principal's Office" value="Mtontsasa Circuit · Lusikisiki District · Eastern Cape" />
              <ContactRow icon={<Phone size={16} />} label="Mobile" value="+27 72 915 5354" />
              <ContactRow icon={<Mail size={16} />} label="Email" value="principal27@ecschools.org.za" />
            </div>
          </div>

          {/* Map column */}
          <div className="lg:col-span-4 reveal">
            <div className="w-full h-72 lg:h-full min-h-[18rem] overflow-hidden border border-white/10">
              <iframe
                title="Mhlanga Senior Secondary School location"
                src="https://www.google.com/maps?q=Mhlanga+Senior+Secondary+School,+Lusikisiki,+Eastern+Cape&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(20%) contrast(1.05)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-5 reveal">
            <form onSubmit={handle} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs tracking-widest uppercase text-[#F4F4F4]/50 mb-1 block">Your Name</label>
                  <input className="line-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-[#F4F4F4]/50 mb-1 block">Your Email</label>
                  <input type="email" className="line-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-[#F4F4F4]/50 mb-1 block">Subject</label>
                <input className="line-input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-[#F4F4F4]/50 mb-1 block">Message</label>
                <textarea rows={4} className="line-input resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              </div>
              <div className="flex items-center gap-4">
                <button type="submit" className="portal-btn font-display text-sm tracking-wide flex items-center gap-2 px-7 py-4 bg-[#D27D2D] text-[#121416]">
                  SEND MESSAGE <Send size={15} />
                </button>
                {sent && <span className="text-sm cyan-acc">Message sent — thank you.</span>}
              </div>
            </form>
          </div>
        </div>

        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-[#F4F4F4]/45">
  <div className="flex items-center gap-3">
    <div className="font-display tracking-tight text-[#F4F4F4]/80">MHLANGA<span className="ochre"> SS</span></div>
    <span className="hidden sm:inline">·</span>
    <span>Designed by Vuyokazi Gogi</span>
  </div>
  <p>© {new Date().getFullYear()} Mhlanga Senior Secondary School. Lusikisiki District · Mtontsasa Circuit.</p>
</div>
      </div>
    </footer>
  );
}

function ContactRow({ icon, label, value }) {
  return (
    <div className="flex gap-4">
      <span className="w-9 h-9 shrink-0 rounded-md bg-[#00A3AD] text-[#121416] flex items-center justify-center">
        {icon}
      </span>
      <div>
        <div className="text-xs tracking-widest uppercase text-[#F4F4F4]/40">{label}</div>
        <div className="text-[#F4F4F4]/85">{value}</div>
      </div>
    </div>
  );
}