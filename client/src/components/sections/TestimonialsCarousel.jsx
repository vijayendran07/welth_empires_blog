import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    quote: "The depth of intelligence provided by Wealth Empires is unparalleled. Their analysis on the UAE Corporate Tax shift saved us millions in restructuring fees.",
    author: "Elena Rostova",
    role: "Managing Director, Global Family Office",
    company: "Rostov Capital"
  },
  {
    quote: "A daily required reading for our strategy team. It's not just news; it's a blueprint for navigating increasingly complex global jurisdictions.",
    author: "David Chen",
    role: "Founder & CEO",
    company: "Nexus Expansion"
  },
  {
    quote: "The most authoritative voice in offshore incorporation and wealth preservation. The premium platform feels exactly like the high-end consulting it replaces.",
    author: "Marcus Sterling",
    role: "Principal Tax Consultant",
    company: "Sterling Advisory Group"
  }
];

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-surface py-32 border-y border-outline-variant/30 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-gutter relative z-10 text-center">
        <span className="material-symbols-outlined text-[48px] text-primary/50 mb-8 block">format_quote</span>
        
        <div className="h-[250px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <h3 className="font-headline-md text-[28px] md:text-[36px] font-bold text-on-surface leading-snug mb-10">
                "{testimonials[currentIndex].quote}"
              </h3>
              
              <div className="flex flex-col items-center">
                <p className="text-on-surface font-bold text-[16px] tracking-wide">{testimonials[currentIndex].author}</p>
                <p className="text-secondary text-[12px] uppercase tracking-widest mt-1">
                  {testimonials[currentIndex].role} <span className="text-primary mx-2">|</span> {testimonials[currentIndex].company}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-3 mt-12">
          {testimonials.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-outline-variant hover:bg-outline'}`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
