import React from 'react';
import { motion } from 'motion/react';
import { MemorySection } from '../types';
import { MediaViewer } from './MediaViewer';
import { PastelFlower, PastelBow, SoftSparkle } from './DecorativeMotifs';

interface MemorySectionItemProps {
  section: MemorySection;
  index: number;
  totalSections: number;
}

// Gentle pastel backdrop variations to give each section its subtle personality
const SECTION_PALETTES = [
  { bg: 'bg-[#FCFAF7]', border: 'border-[#EFE7E1]', accent: '#D6A7B8', icon: 'flower' },
  { bg: 'bg-[#F9F6FA]', border: 'border-[#ECE3EE]', accent: '#C4B0D9', icon: 'sparkle' },
  { bg: 'bg-[#F6F9FA]', border: 'border-[#E0EBF0]', accent: '#9BBEC8', icon: 'flower' },
  { bg: 'bg-[#FAF6F8]', border: 'border-[#EFE1E7]', accent: '#D89BAE', icon: 'bow' },
];

export const MemorySectionItem: React.FC<MemorySectionItemProps> = ({
  section,
  index,
  totalSections,
}) => {
  const palette = SECTION_PALETTES[index % SECTION_PALETTES.length];
  const isPlaceholder = section.message.startsWith('[') && section.message.endsWith(']');

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl mx-auto mb-20 sm:mb-28 px-4"
    >
      <div
        className={`${palette.bg} border ${palette.border} rounded-3xl p-6 sm:p-10 md:p-12 shadow-xs transition-shadow hover:shadow-md relative overflow-hidden`}
      >
        {/* Subtle decorative watermark element in the corner */}
        <div className="absolute top-4 right-4 pointer-events-none opacity-40" aria-hidden="true">
          {palette.icon === 'bow' ? (
            <PastelBow className="w-6 h-6" />
          ) : palette.icon === 'sparkle' ? (
            <SoftSparkle className="w-5 h-5 text-[#B7A4CB]" />
          ) : (
            <PastelFlower className="w-5 h-5" />
          )}
        </div>

        {/* Section sequence index */}
        <div className="text-center mb-6">
          <span className="text-[11px] uppercase tracking-[0.2em] font-serif text-[#9B8C9F]">
            Memory {index + 1} of {totalSections}
          </span>
          {section.dateOrPlace && (
            <span className="text-[11px] text-[#A69AA9] font-serif italic ml-2">
              · {section.dateOrPlace}
            </span>
          )}
        </div>

        {/* ============================================================== */}
        {/* 1. PHOTOGRAPH OR VIDEO (Strictly First) */}
        {/* ============================================================== */}
        <div className="mb-8 sm:mb-10">
          <MediaViewer
            mediaUrl={section.mediaUrl}
            mediaType={section.mediaType}
            caption={section.caption}
            altText={section.heading}
          />
        </div>

        {/* ============================================================== */}
        {/* 2. HEADING CONTAINING HER NAME OR NICKNAME (Strictly Second) */}
        {/* ============================================================== */}
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-2" aria-hidden="true">
            <div className="h-px w-8 bg-[#E2D5E8]" />
            <SoftSparkle className="w-3.5 h-3.5 text-[#C4B2D8]" />
            <div className="h-px w-8 bg-[#E2D5E8]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#392E46] tracking-tight leading-tight">
            {section.heading}
          </h2>
        </header>

        {/* ============================================================== */}
        {/* 3. PERSONAL MESSAGE WRITTEN ENTIRELY BY USER (Strictly Third) */}
        {/* ============================================================== */}
        <div className="max-w-2xl mx-auto">
          {isPlaceholder ? (
            <div className="p-5 sm:p-6 rounded-2xl bg-white/80 border border-dashed border-[#D6C7DE] text-left">
              <div className="flex items-center gap-2 text-xs font-serif text-[#876F96] mb-2">
                <PastelFlower className="w-4 h-4 text-[#C9B1DC]" />
                <span className="font-medium">Personal Message Reserved Space</span>
              </div>
              <p className="font-sans text-sm sm:text-base text-[#61546E] leading-relaxed italic">
                {section.message}
              </p>
              <p className="mt-3 text-[11px] text-[#9A8DA2]">
                Tip: Click <strong>"Story Content Editor"</strong> in the bottom right to paste your genuine words, or update <code className="text-[#735384] font-mono">src/data/birthdayContent.ts</code>.
              </p>
            </div>
          ) : (
            <div className="prose prose-purple max-w-none">
              <p className="font-sans text-base sm:text-lg text-[#3F364B] leading-relaxed sm:leading-loose whitespace-pre-line text-left md:text-justify selection:bg-[#EBDFF8]">
                {section.message}
              </p>
            </div>
          )}
        </div>

        {/* Subtle bottom floral flourish */}
        <div className="flex justify-center mt-8 pt-4 border-t border-[#F0E6EE]/60" aria-hidden="true">
          <PastelFlower className="w-4 h-4 text-[#DCCAE9] opacity-75" />
        </div>
      </div>
    </motion.article>
  );
};
