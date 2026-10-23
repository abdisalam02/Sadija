import React from 'react';
import { Mail, Briefcase, ArrowUpRight } from 'lucide-react';

interface BusinessCollabsProps {
  email: string;
  inquiryNotice: string;
}

export const BusinessCollabs: React.FC<BusinessCollabsProps> = ({
  email,
  inquiryNotice,
}) => {
  return (
    <div className="w-full grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:gap-x-12 xl:gap-y-6 xl:items-end select-none">
      {/* Unboxed Minimal Header */}
      <div className="flex items-center pb-3 border-b border-neutral-900/10 xl:col-span-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-neutral-900/10 flex items-center justify-center text-neutral-800">
            <Briefcase className="w-3.5 h-3.5" />
          </div>
          <span className="font-syne font-bold text-xs uppercase tracking-wider text-neutral-900">
            Work With Sadija
          </span>
        </div>
      </div>

      {/* Floating Description */}
      <p className="text-sm sm:text-base xl:text-lg text-neutral-700 max-w-md xl:max-w-none leading-relaxed">
        {inquiryNotice}
      </p>

      {/* Direct email — clear frosted glass, no secondary copy card */}
      <div className="flex flex-col items-stretch pt-1 xl:justify-end xl:pt-0">
        <a
          href={`mailto:${email}?subject=Collaboration%20Inquiry%20—%20Sadija`}
          className="group py-3.5 px-6 xl:px-4 rounded-full glass-frosted hover:bg-white/70 text-neutral-900 font-syne font-bold text-xs tracking-wider transition-all text-center flex items-center justify-center gap-2.5 active:scale-[0.98]"
        >
          <Mail className="w-4 h-4 text-neutral-700" />
          <span className="truncate">{email}</span>
          <ArrowUpRight className="w-4 h-4 text-neutral-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </div>
  );
};
