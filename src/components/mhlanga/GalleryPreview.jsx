import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { ArrowRight } from 'lucide-react';

const SHOTS = [
  'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/65d47057d_generated_62a08246.png',
  'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/2d605f5db_generated_7814401f.png',
  'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/83dd16a7f_generated_c138818f.png',
  'https://media.base44.com/images/public/6a7e1de32b26888cf5755e75/47649e2b1_generated_b778c529.png',
];

export default function GalleryPreview() {
  return (
    <section id="gallery" className="relative py-24 sm:py-32 bg-[#F4F4F4] text-[#121416]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 reveal">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[#D27D2D] mb-5">Gallery</p>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight">
              MOMENTS AT MHLANGA
            </h2>
          </div>
          <Link to="/gallery" className="flex items-center gap-2 text-sm font-semibold hover:text-[#00A3AD] transition-colors">
            View full gallery <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 reveal">
          {SHOTS.map((src, idx) => (
            <div key={idx} className="h-40 md:h-56 overflow-hidden">
              <Image src={src} alt="" fittingType="fill" className="w-full h-full object-cover reveal-img" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}