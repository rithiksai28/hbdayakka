import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EyeArtwork } from '../types';
import { eyesGalleryData } from '../data/eyesGalleryData';
import { ArtisticEyeRenderer } from './ArtisticEyeRenderer';
import { PastelBow, PastelFlower, SoftSparkle } from './DecorativeMotifs';
import { ArrowLeft, ChevronLeft, ChevronRight, X, ExternalLink, Sparkles, Filter } from 'lucide-react';

interface EyesGalleryPageProps {
  onBackToStory: () => void;
  customArtworks?: Record<string, string>; // user custom URLs override
  onUpdateArtworkUrl?: (id: string, url: string) => void;
}

const STYLES_LIST = [
  'All',
  'Watercolour',
  'Celestial Anime',
  'Floral Botanical',
  'Pencil & Graphite',
  'Digital Painting',
  'Classical Oil',
  'Cosmic Nebula',
  'Luminous Pastel',
  'Minimalist Ink',
  'Abstract Prismatic',
  'Surrealist',
];

export const EyesGalleryPage: React.FC<EyesGalleryPageProps> = ({
  onBackToStory,
  customArtworks = {},
  onUpdateArtworkUrl,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const [activeArtworkIndex, setActiveArtworkIndex] = useState<number | null>(null);
  const [editUrlId, setEditUrlId] = useState<string | null>(null);
  const [customInputUrl, setCustomInputUrl] = useState('');

  // Merge custom URLs if provided
  const artworks: EyeArtwork[] = eyesGalleryData.map((art) => {
    if (customArtworks[art.id]) {
      return { ...art, imageUrl: customArtworks[art.id] };
    }
    return art;
  });

  const filteredArtworks =
    selectedStyle === 'All'
      ? artworks
      : artworks.filter((item) => item.style === selectedStyle);

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (activeArtworkIndex === null) return;
      if (e.key === 'Escape') {
        setActiveArtworkIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveArtworkIndex((prev) =>
          prev !== null ? (prev + 1) % filteredArtworks.length : 0
        );
      } else if (e.key === 'ArrowLeft') {
        setActiveArtworkIndex((prev) =>
          prev !== null
            ? (prev - 1 + filteredArtworks.length) % filteredArtworks.length
            : 0
        );
      }
    },
    [activeArtworkIndex, filteredArtworks.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Scroll to top upon opening gallery
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const activeArtwork =
    activeArtworkIndex !== null ? filteredArtworks[activeArtworkIndex] : null;

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2E2838] pb-24">
      {/* Top Bar Navigation */}
      <nav className="sticky top-0 z-40 bg-[#FAF7F5]/90 backdrop-blur-md border-b border-[#EDE4DB] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={onBackToStory}
          className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#5E5170] hover:text-[#382B49] bg-white border border-[#DDD3E2] px-3.5 py-1.5 rounded-xl shadow-2xs hover:bg-[#F9F4FB] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Birthday Story</span>
        </button>

        <div className="flex items-center gap-2">
          <PastelFlower className="w-4 h-4 text-[#D8BFD8]" />
          <span className="font-serif italic text-xs sm:text-sm text-[#7F718E]">
            Artistic Exhibition · 50 Works
          </span>
          <PastelBow className="w-5 h-4 text-[#E5B5C5]" />
        </div>
      </nav>

      {/* Gallery Header */}
      <header className="max-w-4xl mx-auto px-6 pt-12 pb-10 text-center">
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-10 bg-[#E2D5E8]" />
          <SoftSparkle className="w-4 h-4 text-[#C4B2D8]" />
          <span className="text-xs tracking-[0.2em] uppercase font-serif text-[#91819D]">
            Curated Special Collection
          </span>
          <SoftSparkle className="w-4 h-4 text-[#C4B2D8]" />
          <div className="h-px w-10 bg-[#E2D5E8]" />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#372B46] tracking-tight mb-4">
          The Art of the Gaze
        </h1>

        <p className="font-sans text-sm sm:text-base text-[#655874] max-w-2xl mx-auto leading-relaxed">
          Because of your love for artistic illustrations of eyes, this dedicated gallery brings together
          exactly 50 distinct artistic interpretations—each showcasing a breathtaking <strong>pair of eyes in one frame</strong>,
          spanning delicate watercolour washes, celestial anime starlight, botanical cherry blossoms, and fine graphite sketches.
        </p>

        {/* Style Filter Control */}
        <div className="mt-8 flex items-center justify-center flex-wrap gap-1.5 p-1.5 bg-[#F2ECE6] rounded-2xl max-w-3xl mx-auto">
          {STYLES_LIST.map((style) => (
            <button
              key={style}
              onClick={() => {
                setSelectedStyle(style);
                setActiveArtworkIndex(null);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap ${
                selectedStyle === style
                  ? 'bg-white text-[#382B49] shadow-xs font-semibold'
                  : 'text-[#6D5F7C] hover:text-[#382B49]'
              }`}
            >
              {style}
            </button>
          ))}
        </div>

        <div className="mt-4 text-xs text-[#9587A1] font-serif italic">
          Showing {filteredArtworks.length} of {artworks.length} illustrations · Click any artwork to view details
        </div>
      </header>

      {/* Gallery Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredArtworks.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (index % 12) * 0.03 }}
              onClick={() => setActiveArtworkIndex(index)}
              className="group cursor-pointer bg-white border border-[#E9DFD8] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-[#D9C4E0] transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#FAF6F3]">
                <ArtisticEyeRenderer artwork={item} className="w-full h-full" />
                <div className="absolute inset-0 bg-[#3B2C52]/0 group-hover:bg-[#3B2C52]/10 transition-colors pointer-events-none" />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#8F7E9B] mb-1">
                    <span>Artwork #{item.number}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-serif italic">{item.style}</span>
                  </div>
                  <h3 className="font-serif font-semibold text-base text-[#382B48] group-hover:text-[#5B3E7A] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#726480] line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#F2ECE5] flex items-center justify-between text-[11px] text-[#A093AB]">
                  <span className="truncate pr-2">{item.technique}</span>
                  <span className="text-[#6D5385] font-medium group-hover:translate-x-0.5 transition-transform shrink-0">
                    View →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1F1926]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
            onClick={() => setActiveArtworkIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveArtworkIndex(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 text-[#40344F] hover:bg-white flex items-center justify-center shadow-md transition-colors"
                aria-label="Close artwork viewer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Artwork Display Side */}
              <div className="relative w-full md:w-3/5 bg-[#F9F5F2] flex items-center justify-center min-h-[280px] md:min-h-[460px] p-4 sm:p-6 overflow-hidden">
                <div className="w-full h-full max-h-[440px] flex items-center justify-center rounded-2xl overflow-hidden shadow-sm">
                  <ArtisticEyeRenderer
                    artwork={activeArtwork}
                    isDetailedView={true}
                    className="w-full h-full max-h-[440px] aspect-[4/3] rounded-2xl"
                  />
                </div>

                {/* Prev / Next navigation buttons on media side */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveArtworkIndex((prev) =>
                      prev !== null
                        ? (prev - 1 + filteredArtworks.length) % filteredArtworks.length
                        : 0
                    );
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-[#40344F] hover:bg-white flex items-center justify-center shadow-md transition-all hover:scale-105"
                  aria-label="Previous artwork"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveArtworkIndex((prev) =>
                      prev !== null
                        ? (prev + 1) % filteredArtworks.length
                        : 0
                    );
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-[#40344F] hover:bg-white flex items-center justify-center shadow-md transition-all hover:scale-105"
                  aria-label="Next artwork"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Artwork Details Side */}
              <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-white">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#8A7A9A] mb-2">
                    <span>Artwork {activeArtwork.number} of 50</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-serif italic font-medium text-[#65497B]">
                      {activeArtwork.style}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl text-[#332642] mb-3">
                    {activeArtwork.title}
                  </h2>

                  <div className="space-y-4 text-xs sm:text-sm text-[#5B4E6B] leading-relaxed">
                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#9887A8] mb-1">
                        Technique & Medium
                      </h4>
                      <p className="bg-[#FAF6F3] p-3 rounded-xl border border-[#EDE3DA]">
                        {activeArtwork.technique}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#9887A8] mb-1">
                        Artistic Notes
                      </h4>
                      <p className="leading-relaxed">
                        {activeArtwork.description}
                      </p>
                    </div>

                    {/* Custom Link Slot */}
                    <div className="pt-2">
                      {editUrlId === activeArtwork.id ? (
                        <div className="space-y-2 p-3 bg-[#FAF5F9] rounded-xl border border-[#E8DAE8]">
                          <label className="text-[11px] font-medium text-[#6D557B] block">
                            Supply your own image link for Artwork #{activeArtwork.number}:
                          </label>
                          <input
                            type="url"
                            value={customInputUrl}
                            onChange={(e) => setCustomInputUrl(e.target.value)}
                            placeholder="https://... or Google Drive image link"
                            className="w-full text-xs p-2 rounded-lg border border-[#DAC7DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#9D7CB0]"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (onUpdateArtworkUrl) {
                                  onUpdateArtworkUrl(activeArtwork.id, customInputUrl.trim());
                                }
                                setEditUrlId(null);
                              }}
                              className="px-3 py-1 bg-[#6D5183] text-white text-xs font-medium rounded-lg hover:bg-[#583E6C]"
                            >
                              Save Link
                            </button>
                            <button
                              onClick={() => setEditUrlId(null)}
                              className="px-3 py-1 bg-white border border-[#DDD] text-xs rounded-lg text-[#666]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditUrlId(activeArtwork.id);
                            setCustomInputUrl(activeArtwork.imageUrl || '');
                          }}
                          className="text-[11px] text-[#7A5B91] hover:underline flex items-center gap-1"
                        >
                          <span>Replace this artwork with your own link</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Navigation Bar within Lightbox */}
                <div className="pt-6 mt-6 border-t border-[#F0EAE3] flex items-center justify-between text-xs text-[#8B7C98]">
                  <span>Use ← → keys to browse</span>
                  <button
                    onClick={() => setActiveArtworkIndex(null)}
                    className="font-medium text-[#5B3E7A] hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Back Button */}
      <div className="mt-16 text-center">
        <button
          onClick={onBackToStory}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#4E3D60] text-white font-medium text-sm rounded-2xl shadow-sm hover:bg-[#3E2F4F] transition-all hover:scale-102"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Birthday Story</span>
        </button>
      </div>
    </div>
  );
};
