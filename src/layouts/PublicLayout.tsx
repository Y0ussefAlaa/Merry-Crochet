import React, { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { ShoppingBag, Sun, Moon, Menu, X, Heart, Sparkles, Phone, Mail, Camera } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useCartStore } from '../store/cartStore';
import logoImg from '../assets/logo.jpg';

export const PublicLayout: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const totalCartQuantity = useCartStore((state) => state.getTotalQuantity());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 dark:bg-darkbg text-warmbrown-800 dark:text-darkbg-cream transition-colors duration-300">
      {/* Top Boutique Announcement Bar */}
      <div className="bg-sage-400 dark:bg-sage-900 text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Handmade with love • Free custom ribbon gift packing on all orders</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-cream-100/95 dark:bg-darkbg/95 backdrop-blur-md border-b border-cream-200/60 dark:border-darkbg-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand Name featuring official uploaded studio logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-cozy border-2 border-sage-300 group-hover:scale-105 transition-transform duration-300 bg-cream-200">
              <img
                src={logoImg}
                alt="Merry Crochet Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-warmbrown-800 dark:text-darkbg-cream group-hover:text-sage-600 dark:group-hover:text-sage-300 transition-colors">
                Merry Crochet
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-rose-500 dark:text-rose-300 font-semibold -mt-1">
                Handmade Studio
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick('hero')}
              className="font-medium text-sm text-warmbrown-700 hover:text-sage-600 dark:text-darkbg-muted dark:hover:text-darkbg-cream transition-colors"
            >
              Home
            </button>
            <Link
              to="/products"
              className={`font-medium text-sm transition-colors ${
                location.pathname === '/products'
                  ? 'text-sage-600 dark:text-sage-300 font-semibold'
                  : 'text-warmbrown-700 hover:text-sage-600 dark:text-darkbg-muted dark:hover:text-darkbg-cream'
              }`}
            >
              Products
            </Link>
            <button
              onClick={() => handleNavClick('about')}
              className="font-medium text-sm text-warmbrown-700 hover:text-sage-600 dark:text-darkbg-muted dark:hover:text-darkbg-cream transition-colors"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="font-medium text-sm text-warmbrown-700 hover:text-sage-600 dark:text-darkbg-muted dark:hover:text-darkbg-cream transition-colors"
            >
              Contact Us
            </button>
          </nav>

          {/* Action Tools (Cart & Theme Toggle) */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl bg-cream-200/70 hover:bg-cream-200 dark:bg-darkbg-surface dark:hover:bg-darkbg-card text-warmbrown-700 dark:text-darkbg-cream transition-colors"
              aria-label="Toggle Theme"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-warmbrown-700" />}
            </button>

            {/* Cart Drawer Trigger */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-2xl bg-sage-400 hover:bg-sage-500 text-white shadow-cozy hover:shadow-cozy-lg transition-all duration-300 flex items-center justify-center"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartQuantity > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalCartQuantity}
                </span>
              )}
            </Link>

            {/* Admin Portal Quick Link */}
            <Link
              to="/admin/login"
              className="hidden lg:inline-flex text-xs font-semibold text-warmbrown-600 dark:text-darkbg-muted hover:text-sage-600 dark:hover:text-sage-300 underline underline-offset-4 ml-2"
            >
              Admin
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-2xl bg-cream-200/70 dark:bg-darkbg-surface text-warmbrown-700 dark:text-darkbg-cream"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-cream-50 dark:bg-darkbg-card border-b border-cream-200 dark:border-darkbg-border px-4 py-6 space-y-4 animate-fade-in">
            <button
              onClick={() => handleNavClick('hero')}
              className="block w-full text-left text-base font-medium text-warmbrown-800 dark:text-darkbg-cream py-2 border-b border-cream-200/40 dark:border-darkbg-border/40"
            >
              Home
            </button>
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-medium text-warmbrown-800 dark:text-darkbg-cream py-2 border-b border-cream-200/40 dark:border-darkbg-border/40"
            >
              Products
            </Link>
            <button
              onClick={() => handleNavClick('about')}
              className="block w-full text-left text-base font-medium text-warmbrown-800 dark:text-darkbg-cream py-2 border-b border-cream-200/40 dark:border-darkbg-border/40"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="block w-full text-left text-base font-medium text-warmbrown-800 dark:text-darkbg-cream py-2 border-b border-cream-200/40 dark:border-darkbg-border/40"
            >
              Contact Us
            </button>
            <Link
              to="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-sage-600 dark:text-sage-300 py-2"
            >
              Admin Portal
            </Link>
          </div>
        )}
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Boutique Footer */}
      <footer className="bg-cream-200/60 dark:bg-darkbg-surface border-t border-cream-300 dark:border-darkbg-border mt-16 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Brand Column with Logo */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <img
                  src={logoImg}
                  alt="Merry Crochet"
                  className="w-10 h-10 rounded-xl object-cover border border-sage-300"
                />
                <span className="font-serif text-xl font-bold text-warmbrown-800 dark:text-darkbg-cream">
                  Merry Crochet
                </span>
              </div>
              <p className="text-xs text-warmbrown-600 dark:text-darkbg-muted leading-relaxed">
                Unique, cozy handmade crochet pieces carefully created just for you with premium cotton yarns.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-serif font-bold text-sm text-warmbrown-800 dark:text-darkbg-cream mb-3">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs text-warmbrown-600 dark:text-darkbg-muted">
                <li><button onClick={() => handleNavClick('hero')} className="hover:text-sage-600 dark:hover:text-sage-300 transition-colors">Home</button></li>
                <li><Link to="/products" className="hover:text-sage-600 dark:hover:text-sage-300 transition-colors">All Products</Link></li>
                <li><button onClick={() => handleNavClick('about')} className="hover:text-sage-600 dark:hover:text-sage-300 transition-colors">About Story</button></li>
                <li><button onClick={() => handleNavClick('contact')} className="hover:text-sage-600 dark:hover:text-sage-300 transition-colors">Contact Us</button></li>
              </ul>
            </div>

            {/* Ordering & Care */}
            <div>
              <h4 className="font-serif font-bold text-sm text-warmbrown-800 dark:text-darkbg-cream mb-3">
                Ordering & Care
              </h4>
              <ul className="space-y-2 text-xs text-warmbrown-600 dark:text-darkbg-muted">
                <li><span>Guest Checkout Available</span></li>
                <li><span>Custom Order Requests</span></li>
                <li><span>Soft Milk Cotton Yarn</span></li>
                <li><Link to="/cart" className="hover:text-sage-600 dark:hover:text-sage-300 transition-colors">View Cart</Link></li>
              </ul>
            </div>

            {/* Contact & Socials */}
            <div>
              <h4 className="font-serif font-bold text-sm text-warmbrown-800 dark:text-darkbg-cream mb-3">
                Get in Touch
              </h4>
              <div className="space-y-2 text-xs text-warmbrown-600 dark:text-darkbg-muted">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
                  <span>+20 100 123 4567</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
                  <span>hello@merrycrochet.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5 text-rose-500" />
                  <span>@merry.crochet.studio</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-cream-300/60 dark:border-darkbg-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-warmbrown-500 dark:text-darkbg-muted gap-4">
            <p>© {new Date().getFullYear()} Merry Crochet Studio. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for crochet lovers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
