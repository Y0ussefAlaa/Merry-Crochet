import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Sparkles, Heart, Star } from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

export const HeroSection: React.FC = () => {
  return (
    // TODO: DASHBOARD DATA - Connect hero headline, subtitle, and featured banner image to dynamic admin dashboard settings from Firestore (e.g. settings/hero document)
    <section id="hero" className="relative overflow-hidden pt-8 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Hero Content */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-100 dark:bg-sage-950/60 border border-sage-300 dark:border-sage-800 rounded-full text-sage-800 dark:text-sage-300 text-xs sm:text-sm font-semibold tracking-wide shadow-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Handmade Studio • Unique & Cozy</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream leading-[1.1] tracking-tight">
            Handmade with <span className="text-rose-400 dark:text-rose-300 italic font-serif">Love</span>
          </h1>

          <p className="text-base sm:text-xl text-warmbrown-700 dark:text-darkbg-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Unique crochet pieces, carefully handmade just for you. From soft floral bouquets to adorable plush companions and stylish tote bags.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 py-4 px-8 bg-sage-400 hover:bg-sage-500 text-white font-medium rounded-2xl shadow-cozy hover:shadow-cozy-lg transition-all duration-300 transform hover:-translate-y-0.5 text-base sm:text-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Shop All Products</span>
            </Link>
            <a
              href="#about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-8 bg-cream-200/80 hover:bg-cream-200 dark:bg-darkbg-surface dark:hover:bg-darkbg-card text-warmbrown-800 dark:text-darkbg-cream font-medium rounded-2xl transition-colors text-base sm:text-lg border border-cream-300/80 dark:border-darkbg-border"
            >
              <span>Our Craft Story</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Micro Value Props */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-cream-300/60 dark:border-darkbg-border text-center lg:text-left">
            <div>
              <span className="block font-serif font-bold text-lg text-warmbrown-800 dark:text-darkbg-cream">100%</span>
              <span className="text-xs text-warmbrown-600 dark:text-darkbg-muted">Hand-stitched</span>
            </div>
            <div>
              <span className="block font-serif font-bold text-lg text-warmbrown-800 dark:text-darkbg-cream">Soft</span>
              <span className="text-xs text-warmbrown-600 dark:text-darkbg-muted">Milk Cotton Yarn</span>
            </div>
            <div>
              <span className="block font-serif font-bold text-lg text-warmbrown-800 dark:text-darkbg-cream">Custom</span>
              <span className="text-xs text-warmbrown-600 dark:text-darkbg-muted">Orders Accepted</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Card Stack using Merry Crochet Official Logo */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-[2.5rem] overflow-hidden shadow-cozy-lg border-4 border-white dark:border-darkbg-card bg-cream-200 dark:bg-darkbg-surface transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <img
              src={logoImg}
              alt="Merry Crochet Official Studio"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-warmbrown-900/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs uppercase tracking-widest text-cream-200 font-semibold">Handmade Studio</span>
              <h3 className="font-serif text-2xl font-bold">Merry Crochet Studio</h3>
            </div>
          </div>

          {/* Floating Badge */}
          <div className="absolute -bottom-6 -left-4 sm:left-2 bg-white/90 dark:bg-darkbg-card/90 backdrop-blur-md p-4 rounded-2xl border border-cream-200 dark:border-darkbg-border shadow-cozy flex items-center gap-3 animate-fade-in z-20">
            <div className="p-2.5 bg-rose-100 dark:bg-rose-950/60 text-rose-500 rounded-xl">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs font-bold text-warmbrown-800 dark:text-darkbg-cream mt-0.5">Crafted with patience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
