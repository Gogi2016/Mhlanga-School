import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Curriculum', href: '#curriculum' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', href: '#contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const renderItem = (l, onClick) =>
    l.to ? (
      <Link key={l.label} to={l.to} onClick={onClick} className="text-sm tracking-wide text-[#F4F4F4]/70 hover:text-[#00A3AD] transition-colors duration-300">
        {l.label}
      </Link>
    ) : (
      <a key={l.label} href={l.href} onClick={onClick} className="text-sm tracking-wide text-[#F4F4F4]/70 hover:text-[#00A3AD] transition-colors duration-300">
        {l.label}
      </a>
    );

  return (
    <nav
      className={`fixed inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-6'
      }`}
      style={{
        top: 'var(--announcement-height, 0px)',
        backgroundColor: scrolled ? 'rgba(18,20,22,0.92)' : 'rgba(18,20,22,0.55)',
        backdropFilter: 'blur(10px)',
        borderBottom: scrolled ? '1px solid rgba(244,244,244,0.05)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        <Link to="/" className="font-display text-lg sm:text-xl tracking-tight leading-none">
          MHLANGA<span className="ochre"> SS</span>
        </Link>

        <div className="hidden md:flex items-center gap-9">
          {LINKS.map((l) => renderItem(l))}
          <Link
            to="/admissions"
            className="portal-btn text-xs font-semibold uppercase tracking-widest px-5 py-3 border border-[#00A3AD] text-[#00A3AD] hover:bg-[#00A3AD] hover:text-[#121416]"
          >
            Apply 2026
          </Link>
        </div>

        <button className="md:hidden text-[#F4F4F4]" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden basalt-bg border-t border-white/5 px-5 py-5 flex flex-col gap-4">
          {LINKS.map((l) => renderItem(l, () => setOpen(false)))}
          <Link to="/admissions" onClick={() => setOpen(false)} className="text-sm font-semibold uppercase tracking-widest text-[#00A3AD]">
            Apply 2026
          </Link>
        </div>
      )}
    </nav>
  );
}