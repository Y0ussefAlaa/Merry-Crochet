import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Trash2, Calendar, Search } from 'lucide-react';
import { useMessages, useDeleteMessage } from '../../hooks/useMessages';
import { formatDate } from '../../utils/formatters';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { EmptyState } from '../../components/ui/EmptyState';

export const Messages: React.FC = () => {
  const { data: messages, isLoading, isError } = useMessages();
  const deleteMessageMutation = useDeleteMessage();

  const [searchTerm, setSearchTerm] = useState('');
  const [messageToDelete, setMessageToDelete] = useState<{ id: string; name: string } | null>(null);

  const filteredMessages = messages?.filter((msg) =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.phone.includes(searchTerm) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) return;
    try {
      await deleteMessageMutation.mutateAsync(messageToDelete.id);
      setMessageToDelete(null);
    } catch (e) {
      console.error('Failed to delete message:', e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <ConfirmModal
        isOpen={!!messageToDelete}
        onClose={() => setMessageToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Message?"
        message={`Are you sure you want to delete the message from "${messageToDelete?.name}"?`}
        confirmText="Delete Message"
        isLoading={deleteMessageMutation.isPending}
      />

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream flex items-center gap-3">
            <Mail className="w-8 h-8 text-sage-600 dark:text-sage-400" />
            <span>Customer Messages</span>
          </h1>
          <p className="text-xs sm:text-sm text-warmbrown-600 dark:text-darkbg-muted mt-1">
            Inquiries and custom requests submitted via the Contact Us section.
          </p>
        </div>

        {messages && (
          <span className="px-3.5 py-1.5 bg-sage-100 dark:bg-sage-900/60 text-sage-800 dark:text-sage-300 font-bold rounded-2xl text-xs">
            {messages.length} Messages Received
          </span>
        )}
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search messages by name, phone, or text..."
            className="w-full pl-10 pr-4 py-2.5 bg-cream-100 dark:bg-darkbg-surface text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-xs sm:text-sm border-none focus:ring-2 focus:ring-sage-400 outline-none"
          />
        </div>
      </div>

      {/* Messages Grid Cards */}
      {isLoading ? (
        <div className="p-8 text-center text-warmbrown-600 dark:text-darkbg-muted text-xs">
          Loading customer messages...
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-3xl">
          Error loading messages.
        </div>
      ) : filteredMessages.length === 0 ? (
        <EmptyState
          type="products"
          title="No customer messages found"
          description="Inquiries sent from the Contact Us form will appear here as cards."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredMessages.map((msg) => {
            const cleanPhone = msg.phone.replace(/[^\d+]/g, '').replace('+', '');
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hello ${msg.name}, thank you for contacting Merry Crochet regarding your request.`
            )}`;

            return (
              <div
                key={msg.id}
                className="bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-6 shadow-sm hover:shadow-cozy transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-lg text-warmbrown-800 dark:text-darkbg-cream truncate">
                      {msg.name}
                    </h3>
                    <button
                      onClick={() => setMessageToDelete({ id: msg.id, name: msg.name })}
                      className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-warmbrown-600 dark:text-darkbg-muted">
                    <Phone className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
                    <span className="font-mono font-semibold">{msg.phone}</span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-4 bg-cream-50 dark:bg-darkbg-surface rounded-2xl border border-cream-100 dark:border-darkbg-border/60">
                  <p className="text-xs sm:text-sm text-warmbrown-800 dark:text-darkbg-cream leading-relaxed whitespace-pre-wrap">
                    "{msg.message}"
                  </p>
                </div>

                {/* Footer Date & Actions */}
                <div className="pt-2 border-t border-cream-100 dark:border-darkbg-border flex flex-col gap-3">
                  <span className="text-[11px] text-warmbrown-500 dark:text-darkbg-muted flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Received on {formatDate(msg.createdAt)}
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${msg.phone}`}
                      className="py-2.5 px-3 bg-sage-100 hover:bg-sage-200 dark:bg-sage-950/60 dark:hover:bg-sage-900 text-sage-800 dark:text-sage-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Phone
                    </a>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
