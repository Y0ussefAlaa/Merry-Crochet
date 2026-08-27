import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Mail, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@merrycrochet.com',
      password: 'admin123',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    try {
      /**
       * TODO: FIREBASE AUTH
       * In Stage 2, replace this call with Firebase Authentication:
       * await signInWithEmailAndPassword(auth, data.email, data.password);
       */
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-darkbg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-8 shadow-cozy-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sage-400 dark:bg-sage-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream">
            Merry Admin Portal
          </h1>
          <p className="text-xs text-warmbrown-600 dark:text-darkbg-muted">
            Sign in to manage orders, inventory, and boutique products.
          </p>
        </div>

        {/* Development Credentials Hint Banner */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-2xl text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <p className="font-bold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Stage 1 Development Credentials:
          </p>
          <p>Email: <code className="bg-amber-100 dark:bg-amber-900/60 px-1 rounded">admin@merrycrochet.com</code></p>
          <p>Password: <code className="bg-amber-100 dark:bg-amber-900/60 px-1 rounded">admin123</code></p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-600 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                {...register('email')}
                className="w-full pl-10 pr-4 py-3 bg-cream-50 dark:bg-darkbg-surface text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-sm border border-cream-300 dark:border-darkbg-border focus:ring-2 focus:ring-sage-400 outline-none transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                {...register('password')}
                className="w-full pl-10 pr-4 py-3 bg-cream-50 dark:bg-darkbg-surface text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-sm border border-cream-300 dark:border-darkbg-border focus:ring-2 focus:ring-sage-400 outline-none transition-all"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-sage-400 hover:bg-sage-500 text-white font-bold rounded-2xl shadow-cozy transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
