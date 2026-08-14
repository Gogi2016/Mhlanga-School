import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Bell } from 'lucide-react';

const ADMISSIONS_CLOSE_DATE = new Date('2026-11-30T23:59:59');

export default function AdmissionsBanner() {
  const { pathname } = useLocation();
  const [closed, setClosed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setClosed(new Date() > ADMISSIONS_CLOSE_DATE);
  }, []);

  const hidden = closed || pathname === '/admissions';

  useEffect(() => {
    const setOffset = () => {
      const height = !hidden && ref.current ? ref.current.offsetHeight : 0;

      document.documentElement.style.setProperty(
        '--announcement-height',
        `${height}px`
      );
    };

    setOffset();

    window.addEventListener('resize', setOffset);

    return () => window.removeEventListener('resize', setOffset);
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[#121416] via-[#1a1d20] to-[#121416] border-b border-[#D27D2D]/40"
    >
      <style>{`
        @keyframes bell-ring {
          0%, 82%, 100% {
            transform: rotate(0deg);
          }

          84% {
            transform: rotate(-14deg);
          }

          86% {
            transform: rotate(11deg);
          }

          88% {
            transform: rotate(-8deg);
          }

          90% {
            transform: rotate(5deg);
          }

          92% {
            transform: rotate(-3deg);
          }

          94% {
            transform: rotate(0deg);
          }
        }

        .bell-ring {
          transform-origin: top center;
          animation: bell-ring 4s ease-in-out infinite;
        }

        @keyframes dot-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.35);
            opacity: 0.6;
          }
        }

        .dot-pulse {
          animation: dot-pulse 1.6s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-center gap-3 sm:gap-4 flex-wrap text-center">

        {/* Large Red Attention Bell */}
        <span className="relative hidden sm:flex w-10 h-10 shrink-0 items-center justify-center bg-[#D27D2D]">
          <Bell
            size={26}
            strokeWidth={3}
            className="bell-ring text-[#FF0000]"
          />

          {/* Red Pulsing Notification Dot */}
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#FF0000] dot-pulse" />
        </span>

        {/* Admissions Status */}
        <span className="font-display text-[11px] sm:text-xs tracking-[0.15em] uppercase text-[#F4F4F4]">
          2027 Admissions Open
        </span>

        <span className="hidden sm:inline text-[#F4F4F4]/30">
          ·
        </span>

        {/* Limited Space */}
        <span className="text-[11px] sm:text-xs text-[#F4F4F4]/60">
          Grade 8–10 · Limited space
        </span>

        {/* Apply Button */}
        <Link
          to="/admissions"
          className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-display tracking-wide px-3.5 py-1.5 bg-[#00A3AD] text-[#121416] hover:opacity-90 transition-opacity"
        >
          Apply Now
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}