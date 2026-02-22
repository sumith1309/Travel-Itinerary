'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Check, Share2, Twitter, Facebook, MessageCircle } from 'lucide-react';
import { tapSpring } from '@/lib/animations';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  title: string;
}

export function ShareModal({ isOpen, onClose, shareUrl, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(`Check out my ${title} itinerary on Trails & Miles!`);

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="h-5 w-5" />,
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md"
          >
            <div className="neu-raised rounded-2xl p-6 bg-white">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-forest" />
                  <h3 className="font-display text-lg font-bold text-midnight">
                    Share Itinerary
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-stone hover:bg-sand-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Copy Link */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex-1 rounded-lg border border-sand-200 bg-sand-50 px-3 py-2.5 text-sm text-stone truncate font-mono">
                  {shareUrl}
                </div>
                <motion.button
                  {...tapSpring}
                  onClick={copyLink}
                  className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors ${
                    copied ? 'bg-green-500' : 'bg-forest hover:bg-forest/90'
                  }`}
                >
                  {copied ? (
                    <span className="flex items-center gap-1">
                      <Check className="h-4 w-4" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Link2 className="h-4 w-4" /> Copy
                    </span>
                  )}
                </motion.button>
              </div>

              {/* Social Share */}
              <p className="text-xs text-stone mb-3">Share on social</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-colors ${social.color}`}
                  >
                    {social.icon}
                    <span className="hidden sm:inline">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
