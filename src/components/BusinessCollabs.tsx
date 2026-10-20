import React, { useState } from 'react';
import { Mail, Copy, Check, Briefcase, ArrowUpRight } from 'lucide-react';

interface BusinessCollabsProps {
  email: string;
  inquiryNotice: string;
  management: string;
}

export const BusinessCollabs: React.FC<BusinessCollabsProps> = ({
  email,
  inquiryNotice,
  management,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6 select-none">
      {/* Unboxed Minimal Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-900/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-neutral-900/10 flex items-center justify-center text-neutral-800">
            <Briefcase className="w-3.5 h-3.5" />
          </div>
          <span className="font-syne font-bold text-xs uppercase tracking-wider text-neutral-900">
            Work With Sadija
          </span>
        </div>

        <span className="text-xs text-neutral-500 font-medium">
          Bookings & Press
        </span>
      </div>

      {/* Floating Description */}
      <p className="text-sm sm:text-base text-neutral-700 max-w-md leading-relaxed">
        {inquiryNotice}
      </p>

      {/* Clean Unboxed Interactive Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
        <a
          href={`mailto:${email}?subject=Collaboration%20Inquiry%20—%20Sadija%20Gure`}
          className="py-3.5 px-6 rounded-full bg-neutral-950 text-white font-syne font-bold text-xs tracking-wider uppercase hover:bg-black transition-all text-center flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
        >
          <Mail className="w-4 h-4" />
          <span>Send Inquiry</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>

        <button
          onClick={handleCopyEmail}
          aria-label="Copy booking email"
          className="py-3.5 px-6 rounded-full border border-neutral-300/80 bg-white/85 hover:bg-white text-neutral-900 text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-medium">Copied Email</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-neutral-500" />
              <span className="truncate">{email}</span>
            </>
          )}
        </button>
      </div>

      {/* Minimal Agency Footer */}
      <div className="pt-2 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-900/5">
        <span>Media Kit available upon request</span>
        <span>{management}</span>
      </div>
    </div>
  );
};
