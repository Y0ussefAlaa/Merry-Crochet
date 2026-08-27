import React from 'react';
import { ShieldCheck, Truck, Clock, Heart } from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

export const AboutSection: React.FC = () => {
  return (
    // TODO: DASHBOARD DATA - Connect About text, craft guarantees, and studio highlights to admin dashboard dynamic settings
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-cream-50 dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border rounded-[2.5rem] p-8 sm:p-12 lg:p-16 shadow-cozy grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* Left Story Text */}
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest text-rose-500 font-semibold">About Merry Crochet</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream leading-tight">
            Crafted slowly with intention, warmth & care.
          </h2>
          <p className="text-warmbrown-700 dark:text-darkbg-muted text-sm sm:text-base leading-relaxed">
            Merry Crochet began as a passion project to bring warmth, soft color, and cozy craftsmanship into everyday spaces. Each piece is individually crocheted stitch by stitch, using high-quality milk cotton yarn that is gentle to touch and built to last.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2 text-warmbrown-800 dark:text-darkbg-cream">
              <ShieldCheck className="w-5 h-5 text-sage-500" />
              <span>Hypoallergenic Cotton</span>
            </div>
            <div className="flex items-center gap-2 text-warmbrown-800 dark:text-darkbg-cream">
              <Truck className="w-5 h-5 text-sage-500" />
              <span>Safe Doorstep Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-warmbrown-800 dark:text-darkbg-cream">
              <Clock className="w-5 h-5 text-sage-500" />
              <span>Made to Order Available</span>
            </div>
            <div className="flex items-center gap-2 text-warmbrown-800 dark:text-darkbg-cream">
              <Heart className="w-5 h-5 text-rose-400" />
              <span>Gift Ribbon Included</span>
            </div>
          </div>
        </div>

        {/* Right Illustration / Brand Logo Image */}
        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-cream-200 dark:bg-darkbg-surface shadow-md border-2 border-cream-300 dark:border-darkbg-border">
          <img
            src={logoImg}
            alt="Merry Crochet Crafting Studio"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};
