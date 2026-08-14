import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function SubPageHeader() {
  return (
    <header className="sticky top-0 z-50 basalt-bg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-lg tracking-tight leading-none">
          MHLANGA<span className="ochre"> SS</span>
        </Link>
        <Link to="/" className="flex items-center gap-2 text-sm text-[#F4F4F4]/70 hover:text-[#00A3AD] transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    </header>
  );
}