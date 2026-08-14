import React from 'react';
import { BookOpen, Compass, GraduationCap, Sparkles } from 'lucide-react';

const FEATURES = [
  { icon: BookOpen, title: 'Academic Support', body: 'Study skills and guidance, academic coaching and mentoring for every learner.' },
  { icon: Compass, title: 'Learning Plan', body: 'Personalised learning strategies, progress tracking and monitoring.' },
  { icon: GraduationCap, title: 'Skills Educators', body: 'Skilled teachers, personalised support — empowering your education.' },
  { icon: Sparkles, title: 'Extra Classes', body: 'Extra help, extra confidence — boost your grades and bridge the gap.' },
];

export default function Features() {
  return (
    <section className="relative -mt-px py-16 sm:py-20 px-5 sm:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
        {FEATURES.map((f) => (
          <div key={f.title} className="reveal basalt-bg p-7 group">
            <div className="w-12 h-12 flex items-center justify-center border border-[#00A3AD]/40 text-[#00A3AD] mb-6 group-hover:bg-[#00A3AD] group-hover:text-[#121416] transition-colors">
              <f.icon size={20} />
            </div>
            <h3 className="font-display text-lg tracking-tight mb-3">{f.title}</h3>
            <p className="text-sm text-[#F4F4F4]/60 leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}