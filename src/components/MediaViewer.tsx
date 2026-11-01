import React, { useState } from 'react';
import { MediaType } from '../types';
import { resolveMediaSource } from '../utils/mediaUtils';
import {
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  Video as VideoIcon,
  Maximize2,
  X,
} from 'lucide-react';

interface MediaViewerProps {
  mediaUrl: string;
  mediaType: MediaType;
  caption?: string;
  altText: string;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({
  mediaUrl,
  mediaType,
  caption,
  altText,
}) => {
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const parsed = resolveMediaSource(mediaUrl, mediaType);

  // If no URL provided yet: Maintain exact same media frame dimensions
  if (!mediaUrl || !mediaUrl.trim()) {
    return (
      <div className="w-full">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#FAF5F2] border border-[#E9DFD8] rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-xs overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-[#F3EBF7] text-[#8C7A9E] flex items-center justify-center mb-3">
            {mediaType === 'image' ? (
              <ImageIcon className="w-6 h-6" />
            ) : (
              <VideoIcon className="w-6 h-6" />
            )}
          </div>
          <p className="font-serif text-lg text-[#52455F] mb-1">
            {mediaType === 'image' ? 'Photograph slot ready' : 'Video slot ready'}
          </p>
          <p className="text-xs text-[#8A7C93] max-w-sm mb-3">
            Paste your Google Drive link or direct media link in the Story Content Editor or configuration file.
          </p>
          <span className="text-[11px] font-mono text-[#A89CB0] bg-white/70 px-2.5 py-1 rounded border border-[#E6DEE9]">
            Drive link format: drive.google.com/file/d/ID/view
          </span>
        </div>
      </div>
    );
  }

  // Handle Google Photos warning: Maintain exact same media frame dimensions
  if (parsed.errorWarning) {
    return (
      <div className="w-full">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#FFFBF8] border border-[#F3DFD2] rounded-2xl p-6 flex flex-col items-center justify-center text-left shadow-xs overflow-hidden">
          <div className="flex items-start gap-3 max-w-md">
            <AlertCircle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-serif font-medium text-base text-[#78350F]">
                Media link format notice
              </h4>
              <p className="text-xs text-[#92400E] leading-relaxed">
                {parsed.errorWarning}
              </p>
              {mediaUrl && (
                <a
                  href={mediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#B45309] hover:underline pt-1"
                >
                  <span>Open link in new window</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Current active display URL (with fallbacks if needed)
  const currentUrl =
    fallbackIndex === 0
      ? parsed.displayUrl
      : parsed.fallbackUrls[fallbackIndex - 1] || parsed.displayUrl;

  const handleImageError = () => {
    if (fallbackIndex < parsed.fallbackUrls.length) {
      setFallbackIndex((prev) => prev + 1);
    } else {
      setLoadError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* 
        Standardized Media Frame:
        - Consistent aspect ratio: 4/3 on mobile, 16/10 on tablet/desktop.
        - Matches across every image and video section without changing frame dimensions.
        - Center-aligned flex container that clips media overflow cleanly.
      */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-2xl bg-[#FAF6F3] border border-[#ECE2DA] shadow-xs flex items-center justify-center">
        {/* Loading shimmer overlay */}
        {isLoading && !loadError && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF5F2] via-[#FCFAF8] to-[#FAF5F2] animate-pulse z-20 flex items-center justify-center">
            <span className="font-serif text-xs text-[#9E90A6] tracking-wide">
              {parsed.type === 'video' ? 'Loading video...' : 'Loading photograph...'}
            </span>
          </div>
        )}

        {loadError ? (
          <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-[#FCF8F5]">
            <AlertCircle className="w-8 h-8 text-[#BA8C9B] mb-2" />
            <h5 className="font-serif text-base text-[#574962] mb-1">
              Unable to load media directly
            </h5>
            <p className="text-xs text-[#8A7996] max-w-md mb-3 leading-relaxed">
              If this is a Google Drive file, please verify that sharing is set to{' '}
              <strong className="text-[#4E3E5B]">"Anyone with the link can view"</strong> so web visitors can see it.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setLoadError(false);
                  setIsLoading(true);
                  setFallbackIndex(0);
                }}
                className="px-3 py-1.5 text-xs font-medium text-[#4E3E5B] bg-white border border-[#DDD3E2] rounded-lg hover:bg-[#F9F5FA] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              <a
                href={mediaUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs font-medium text-[#6B5A79] bg-white border border-[#DDD3E2] rounded-lg hover:bg-[#F9F5FA] flex items-center gap-1.5 transition-colors"
              >
                <span>View file directly</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : parsed.type === 'video' ? (
          parsed.isEmbed ? (
            /* Embedded Video (Google Drive Preview Player, YouTube, Vimeo) */
            <div className="relative w-full h-full flex items-center justify-center bg-[#FAF6F3]">
              <iframe
                src={currentUrl}
                title={altText}
                className="w-full h-full border-0 rounded-2xl object-contain"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
              />
            </div>
          ) : (
            /* Direct HTML5 Video Player */
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#271E33] via-[#1E1728] to-[#161020]">
              <video
                src={currentUrl}
                controls
                playsInline
                className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain object-center"
                onLoadedData={() => setIsLoading(false)}
                onError={() => setLoadError(true)}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )
        ) : (
          /* Photograph / Image Presentation */
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FAF5F2] via-[#F7EEF5] to-[#EFE7F2]">
            {/* 
              Subtle Ambient Background Layer for Empty Space (Pillarbox/Letterbox):
              Uses a soft frosted, blurred copy of the photo plus the birthday pastel palette.
              Never distracts; fills margins seamlessly with complementary warm tones.
            */}
            <img
              src={currentUrl}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-25 pointer-events-none select-none transition-opacity duration-700 ${
                isLoading ? 'opacity-0' : 'opacity-25'
              }`}
            />

            {/* Subtle inner ambient vignette */}
            <div
              className="absolute inset-0 pointer-events-none bg-radial-[circle_at_center,transparent_60%,rgba(240,230,238,0.4)_100%]"
              aria-hidden="true"
            />

            {/* 
              The Photograph:
              - object-fit: contain (preserves full image, never crops faces or details)
              - max-w-full max-h-full w-auto h-auto (adapts to portrait, square, panorama, or landscape)
              - Perfectly centered inside the container
              - No distortion or stretching
            */}
            <img
              src={currentUrl}
              alt={altText}
              referrerPolicy="no-referrer"
              loading="lazy"
              onLoad={() => setIsLoading(false)}
              onError={handleImageError}
              className={`relative z-10 max-w-full max-h-full w-auto h-auto object-contain object-center transition-all duration-500 drop-shadow-2xs rounded-lg select-none ${
                isLoading ? 'opacity-0 scale-98' : 'opacity-100 scale-100'
              }`}
            />

            {/* Expand / View Fullsize button */}
            {!isLoading && !loadError && (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="absolute top-3 right-3 z-30 p-2 rounded-xl bg-white/80 hover:bg-white text-[#6B5A79] hover:text-[#38264A] shadow-2xs hover:shadow-xs transition-all backdrop-blur-xs opacity-70 hover:opacity-100 focus:opacity-100 focus:outline-none"
                title="View full-size photograph"
                aria-label="View full-size photograph"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Optional Caption */}
      {caption && (
        <div className="mt-3 text-center">
          <p className="font-serif italic text-xs sm:text-sm text-[#877894] tracking-wide">
            {caption}
          </p>
        </div>
      )}

      {/* Full-size Photo Lightbox Modal */}
      {isExpanded && parsed.type === 'image' && (
        <div
          className="fixed inset-0 z-50 bg-[#1F1926]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute -top-12 right-0 sm:top-2 sm:right-2 z-20 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
              aria-label="Close full-size view"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={currentUrl}
              alt={altText}
              className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl"
            />

            {caption && (
              <p className="mt-3 font-serif italic text-sm text-[#E7DCF0] text-center max-w-lg">
                {caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
