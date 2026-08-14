import React, { useEffect, useState } from 'react';
import Nav from '@/components/mhlanga/Nav';
import Hero from '@/components/mhlanga/Hero';
import Features from '@/components/mhlanga/Features';
import Heritage from '@/components/mhlanga/Heritage';
import Performance from '@/components/mhlanga/Performance';
import Curriculum from '@/components/mhlanga/Curriculum';
import Staff from '@/components/mhlanga/Staff';
import Testimonials from '@/components/mhlanga/Testimonials';
import ApplyCTA from '@/components/mhlanga/ApplyCTA';
import GalleryPreview from '@/components/mhlanga/GalleryPreview';
import Footer from '@/components/mhlanga/Footer';
import AscensionLine from '@/components/mhlanga/AscensionLine';
import useReveal from '@/components/mhlanga/useReveal';

export default function Home() {
  useReveal();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      setProgress(scrolled * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="basalt-bg min-h-screen text-[#F4F4F4] font-body overflow-x-hidden">
      <AscensionLine progress={progress} />
      <Nav />
      <main>
        <Hero />
        <Features />
        <Heritage />
        <Performance />
        <Curriculum />
        <Staff />
        <Testimonials />
        <ApplyCTA />
        <GalleryPreview />
      </main>
      <Footer />
    </div>
  );
}