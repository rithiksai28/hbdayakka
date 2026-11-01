import React from 'react';

/**
 * Subtle Doremi-inspired decorative elements:
 * Soft pastel flowers, gentle ribbons, sparkles, and warm starlets.
 * Elegant, refined, and non-distracting.
 */

export const PastelBow: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 48 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
    aria-hidden="true"
  >
    {/* Left loop */}
    <path
      d="M24 18 C18 10, 8 10, 4 16 C0 22, 10 26, 24 18 Z"
      fill="#F5D0DC"
      stroke="#D6A7B8"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right loop */}
    <path
      d="M24 18 C30 10, 40 10, 44 16 C48 22, 38 26, 24 18 Z"
      fill="#F5D0DC"
      stroke="#D6A7B8"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Center knot */}
    <ellipse cx="24" cy="18" rx="4.5" ry="5" fill="#E8B4C8" stroke="#C98DA3" strokeWidth="1.2" />
    {/* Left tail */}
    <path
      d="M22 21 C18 27, 14 31, 10 34"
      stroke="#D6A7B8"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Right tail */}
    <path
      d="M26 21 C30 27, 34 31, 38 34"
      stroke="#D6A7B8"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const PastelFlower: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-5 h-5',
  color = '#E9DDF5',
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
    aria-hidden="true"
  >
    {/* 5 Petals */}
    <circle cx="16" cy="9" r="6" fill={color} opacity="0.85" />
    <circle cx="22.6" cy="13.9" r="6" fill={color} opacity="0.85" />
    <circle cx="20.1" cy="21.7" r="6" fill={color} opacity="0.85" />
    <circle cx="11.9" cy="21.7" r="6" fill={color} opacity="0.85" />
    <circle cx="9.4" cy="13.9" r="6" fill={color} opacity="0.85" />
    {/* Center core */}
    <circle cx="16" cy="16" r="4" fill="#FDF6D8" stroke="#E2C978" strokeWidth="1" />
  </svg>
);

export const SoftSparkle: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-4 h-4',
  color = '#ECCDF7',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
    aria-hidden="true"
  >
    <path
      d="M12 2 C12 7, 17 12, 22 12 C17 12, 12 17, 12 22 C12 17, 7 12, 2 12 C7 12, 12 7, 12 2 Z"
      fill={color}
    />
  </svg>
);

export const SubtleDivider: React.FC<{ label?: string }> = ({ label }) => (
  <div className="flex items-center justify-center gap-3 my-12 text-[#9A8FA8]" aria-hidden="true">
    <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#DDD4E8] to-[#DDD4E8]" />
    <PastelFlower className="w-4 h-4 text-[#CBB9DE]" />
    {label && (
      <span className="font-serif italic text-sm text-[#7D708E] tracking-wider px-2">
        {label}
      </span>
    )}
    <PastelBow className="w-5 h-4 text-[#E8B4C8]" />
    <div className="h-px w-16 bg-gradient-to-l from-transparent via-[#DDD4E8] to-[#DDD4E8]" />
  </div>
);
