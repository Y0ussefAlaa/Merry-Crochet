import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Mail,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Store,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Messages', path: '/admin/messages', icon: Mail },
  ];

  return (
    <div className="min-h-screen flex bg-cream-100 dark:bg-darkbg text-warmbrown-800 dark:text-darkbg-cream">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-cream-50 dark:bg-darkbg-surface border-r border-cream-200 dark:border-darkbg-border p-6 fixed inset-y-0 z-30">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-sage-400 dark:bg-sage-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            MC
          </div>
          <div>
            <span className="font-serif text-lg font-bold block leading-tight">Merry Admin</span>
            <span className="text-[10px] text-sage-600 dark:text-sage-400 font-semibold tracking-wider uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Management
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-sage-400 text-white shadow-cozy'
                      : 'text-warmbrown-700 hover:bg-cream-200/60 dark:text-darkbg-muted dark:hover:bg-darkbg-card dark:hover:text-darkbg-cream'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Footer Tools */}
        <div className="pt-6 border-t border-cream-200 dark:border-darkbg-border space-y-3">
          <div className="flex items-center justify-between px-2 text-xs">
            <span className="text-warmbrown-600 dark:text-darkbg-muted truncate max-w-[120px]" title={user?.email}>
              {user?.email}
            </span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-cream-200 dark:bg-darkbg-card text-warmbrown-700 dark:text-darkbg-cream hover:opacity-80 transition-opacity"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-warmbrown-600 dark:text-darkbg-muted hover:bg-cream-200/50 dark:hover:bg-darkbg-card transition-colors"
          >
            <Store className="w-4 h-4 text-sage-600 dark:text-sage-400" />
            <span>View Public Store</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <aside className="relative w-72 bg-cream-50 dark:bg-darkbg-surface p-6 flex flex-col h-full shadow-2xl z-10">
            <div className="flex items-center justify-between mb-8">
              <span className="font-serif text-lg font-bold">Merry Admin</span>
              <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium ${
                        isActive
                          ? 'bg-sage-400 text-white'
                          : 'text-warmbrown-700 dark:text-darkbg-muted'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-rose-600 dark:text-rose-400 font-semibold text-sm mt-auto"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Mobile Header Bar */}
        <header className="md:hidden sticky top-0 z-20 bg-cream-50 dark:bg-darkbg-surface border-b border-cream-200 dark:border-darkbg-border px-4 py-3 flex items-center justify-between">
          <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif font-bold text-base">Merry Admin</span>
          <button onClick={toggleTheme} className="p-2">
            {isDark ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        {/* Content View */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
