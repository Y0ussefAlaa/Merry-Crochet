import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Phone, Mail, Camera, Send, CheckCircle2, Loader2, User, MessageSquare } from 'lucide-react';
import { useCreateMessage } from '../../hooks/useMessages';
import { isValidEgyptianPhone } from '../../utils/formatters';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(
      (val) => isValidEgyptianPhone(val),
      'Please enter a valid Egyptian phone number (e.g. 01012345678 or +201001234567)'
    ),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactSection: React.FC = () => {
  const createMessageMutation = useCreateMessage();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      /**
       * TODO: FIREBASE FIRESTORE INTEGRATION
       * Replace createMessage mutation with addDoc(collection(db, "messages"), data)
       */
      await createMessageMutation.mutateAsync({
        name: data.name,
        phone: data.phone,
        message: data.message,
      });

      setSubmitted(true);
      reset();

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (e) {
      console.error('Failed to send message:', e);
    }
  };

  return (
    // TODO: DASHBOARD DATA - Messages sent here are stored in messages dataset and rendered as cards on the Admin Dashboard Messages page (/admin/messages)
    <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-[2.5rem] p-8 sm:p-12 shadow-cozy grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs uppercase tracking-widest text-sage-600 dark:text-sage-400 font-bold">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream">
            Contact Merry Crochet
          </h2>
          <p className="text-sm text-warmbrown-600 dark:text-darkbg-muted leading-relaxed">
            Have a custom order request, color preference, or questions about delivery? Send us a message or contact us directly.
          </p>

          <div className="space-y-4 pt-2 text-sm text-warmbrown-700 dark:text-darkbg-cream">
            <div className="flex items-center gap-3.5 p-3 bg-cream-100 dark:bg-darkbg-surface rounded-2xl">
              <div className="p-2.5 bg-sage-400 text-white rounded-xl">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-warmbrown-500 dark:text-darkbg-muted block">Phone / WhatsApp</span>
                <span className="font-semibold">+20 100 123 4567</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 bg-cream-100 dark:bg-darkbg-surface rounded-2xl">
              <div className="p-2.5 bg-rose-400 text-white rounded-xl">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-warmbrown-500 dark:text-darkbg-muted block">Email Support</span>
                <span className="font-semibold">hello@merrycrochet.com</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 bg-cream-100 dark:bg-darkbg-surface rounded-2xl">
              <div className="p-2.5 bg-rose-500 text-white rounded-xl">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-warmbrown-500 dark:text-darkbg-muted block">Instagram Studio</span>
                <span className="font-semibold">@merry.crochet.studio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Contact Form */}
        <div className="lg:col-span-7 bg-cream-50 dark:bg-darkbg-surface p-6 sm:p-8 rounded-3xl border border-cream-200 dark:border-darkbg-border space-y-4">
          <h3 className="text-xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream">
            Send us a message
          </h3>

          {submitted ? (
            <div className="p-6 bg-sage-100 dark:bg-sage-950/60 text-sage-800 dark:text-sage-300 rounded-2xl flex flex-col items-center text-center space-y-2 animate-fade-in">
              <CheckCircle2 className="w-8 h-8 text-sage-600" />
              <p className="font-bold">Thank you for reaching out!</p>
              <p className="text-xs">Your message has been sent to our dashboard. We will contact your Egyptian phone number shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream mb-1">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. Mariam"
                    {...register('name')}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-darkbg-card text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-sm border border-cream-300 dark:border-darkbg-border focus:ring-2 focus:ring-sage-400 outline-none"
                  />
                </div>
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream mb-1">
                  Egyptian Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="e.g. 01001234567 or +201001234567"
                    {...register('phone')}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-darkbg-card text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-sm border border-cream-300 dark:border-darkbg-border focus:ring-2 focus:ring-sage-400 outline-none"
                  />
                </div>
                {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream mb-1">
                  Message / Custom Request *
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <textarea
                    rows={4}
                    placeholder="Tell us what you would like crafted..."
                    {...register('message')}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-darkbg-card text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-sm border border-cream-300 dark:border-darkbg-border focus:ring-2 focus:ring-sage-400 outline-none"
                  />
                </div>
                {errors.message && <p className="text-xs text-rose-500 mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || createMessageMutation.isPending}
                className="w-full py-3.5 px-6 bg-sage-400 hover:bg-sage-500 text-white font-bold rounded-2xl shadow-cozy text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting || createMessageMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
