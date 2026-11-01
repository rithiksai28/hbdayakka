import React from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { BirthdayConfig } from '../types';
import { MemorySectionItem } from './MemorySectionItem';
import { PastelBow, PastelFlower, SoftSparkle, SubtleDivider } from './DecorativeMotifs';
import { Heart, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';

interface BirthdayExperienceProps {
  config: BirthdayConfig;
  onOpenGallery: () => void;
  onOpenStoryManager?: () => void;
  showEditorButton?: boolean;
}

export const BirthdayExperience: React.FC<BirthdayExperienceProps> = ({
  config,
  onOpenGallery,
  onOpenStoryManager,
  showEditorButton = false,
}) => {
  // Gentle celebratory confetti trigger
  const triggerCelebration = () => {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#F5D0DC', '#E8DFF5', '#E3F2FD', '#FFF9DB', '#D8B4E2'],
      disableForReducedMotion: true,
    });
  };

  return (
    <div className="relative min-h-screen bg-[#FAF7F5] text-[#2D2836] overflow-x-hidden selection:bg-[#EBDFF8] selection:text-[#38274C]">
      {/* Subtle Floating Ambient Background Motifs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute top-12 left-[8%] opacity-35 animate-float-slow">
          <PastelFlower className="w-8 h-8 text-[#E2D4F0]" />
        </div>
        <div className="absolute top-44 right-[10%] opacity-40">
          <PastelBow className="w-9 h-7 text-[#F5CFDB]" />
        </div>
        <div className="absolute top-[45%] left-[5%] opacity-30">
          <SoftSparkle className="w-6 h-6 text-[#DACBEA]" />
        </div>
        <div className="absolute top-[75%] right-[7%] opacity-35">
          <PastelFlower className="w-7 h-7 text-[#FAD7E1]" />
        </div>
      </div>

      {/* Discrete Top Bar */}
      <header className="relative z-10 max-w-4xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PastelBow className="w-5 h-4 text-[#DCAAB9]" />
          <span className="font-serif italic text-xs sm:text-sm text-[#7D6E8D] tracking-wide">
            For {config.recipientName}
          </span>
        </div>

        {showEditorButton && onOpenStoryManager && (
          <button
            onClick={onOpenStoryManager}
            className="flex items-center gap-1.5 text-xs text-[#6A5A7B] bg-white/80 hover:bg-white border border-[#E0D5E3] px-3 py-1.5 rounded-xl shadow-2xs hover:shadow-xs transition-all"
            title="Open Story Content Editor to customize your text and Google Drive links"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#886F9E]" />
            <span>Story Content Editor</span>
          </button>
        )}
      </header>

      {/* Hero Presentation Header */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pt-10 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          {/* Subtle charming ribbon header motif */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/70 border border-[#EADFE9] shadow-2xs">
            <PastelBow className="w-4 h-3.5 text-[#DDAEB9]" />
            <span className="font-serif italic text-xs text-[#7B6A8B] tracking-wide">
              A Special Birthday Collection
            </span>
            <PastelFlower className="w-3.5 h-3.5 text-[#CDB8DF]" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#392E47] tracking-tight leading-tight">
            {config.birthdayTitle},{' '}
            <span className="italic text-[#6B4B87]">{config.recipientName}</span>
          </h1>

          <p className="font-sans text-sm sm:text-base text-[#675A75] max-w-xl mx-auto leading-relaxed pt-2">
            {config.heroSubtitle}
          </p>

          {/* Gentle interactive celebratory touch */}
          <div className="pt-2">
            <button
              onClick={triggerCelebration}
              className="inline-flex items-center gap-2 text-xs font-serif italic text-[#8B6E9E] hover:text-[#5F4571] px-3 py-1 rounded-full hover:bg-white/60 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#CBB2DD]" />
              <span>Click for a birthday sparkle</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Main Experience: Repeated Sequence of Memory Sections */}
      <main className="relative z-10">
        {config.sections.map((section, index) => (
          <React.Fragment key={section.id}>
            <MemorySectionItem
              section={section}
              index={index}
              totalSections={config.sections.length}
            />
            {index < config.sections.length - 1 && (
              <SubtleDivider label={section.heading} />
            )}
          </React.Fragment>
        ))}
      </main>

      {/* Bottom Transition to the Special Artistic Eyes Gallery */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pt-12 pb-24 text-center">
        <SubtleDivider />

        <div className="bg-white/90 border border-[#E9DFE9] rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
          {/* Subtle decorative background glow */}
          <div
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#F3EBF7] blur-2xl pointer-events-none opacity-60"
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-5">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF3F7] border border-[#ECD9E3] text-[#9D6882] flex items-center justify-center">
              <Heart className="w-5 h-5 fill-[#F2CAD6] stroke-[#9D6882]" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.2em] font-serif text-[#92829D]">
                A Special Exhibition
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#392E47]">
                A Curated Gallery Created Just for You
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#6C5F79] max-w-lg mx-auto leading-relaxed">
                Knowing how much you appreciate art and the expressive beauty in people's eyes, I put together
                a dedicated gallery of 50 artistic illustrations spanning watercolours, anime starlight, botanical petals,
                and delicate pencil sketches.
              </p>
            </div>

            {/* Suggested Special Button */}
            <div className="pt-4">
              <button
                onClick={onOpenGallery}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#543D6C] hover:bg-[#432F57] text-white font-serif text-base sm:text-lg rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <span>{config.galleryButtonText}</span>
                <ArrowRight className="w-4 h-4 text-[#E2D2ED] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <p className="text-[11px] font-serif italic text-[#9B8CA5] pt-1">
              50 individual artworks · Responsive lightbox view
            </p>
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="relative z-10 text-center pb-12 pt-4 border-t border-[#EDE4DB] text-xs font-serif italic text-[#9588A0]">
        <div className="flex items-center justify-center gap-2">
          <span>Crafted with love and care for your birthday</span>
          <PastelFlower className="w-3.5 h-3.5 text-[#D0BFDE]" />
        </div>
      </footer>
    </div>
  );
};
