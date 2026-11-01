/**
 * Utilities to parse, sanitize, and transform Google Drive, Google Photos,
 * and direct image/video URLs into reliable playback/display sources.
 */

export interface ParsedMedia {
  type: 'image' | 'video';
  originalUrl: string;
  displayUrl: string;
  fallbackUrls: string[];
  isEmbed: boolean;
  provider: 'google-drive' | 'google-photos' | 'youtube' | 'vimeo' | 'direct' | 'unknown';
  errorWarning?: string;
}

/**
 * Extracts Google Drive File ID from numerous link patterns:
 * - https://drive.google.com/file/d/1A2B3C.../view?usp=sharing
 * - https://drive.google.com/open?id=1A2B3C...
 * - https://drive.google.com/uc?id=1A2B3C...
 * - https://drive.google.com/thumbnail?id=1A2B3C...
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Pattern 1: /file/d/{id}
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) {
    return matchFileD[1];
  }

  // Pattern 2: id={id}
  const matchIdParam = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam && matchIdParam[1]) {
    return matchIdParam[1];
  }

  // Pattern 3: /folders/{id} or /d/{id}
  const matchGenericD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchGenericD && matchGenericD[1]) {
    return matchGenericD[1];
  }

  return null;
}

/**
 * Normalizes user-supplied media URL based on mediaType (image or video)
 */
export function resolveMediaSource(url: string, mediaType: 'image' | 'video'): ParsedMedia {
  if (!url || !url.trim()) {
    return {
      type: mediaType,
      originalUrl: '',
      displayUrl: '',
      fallbackUrls: [],
      isEmbed: false,
      provider: 'unknown',
      errorWarning: 'No media link provided.',
    };
  }

  const rawUrl = url.trim();

  // 1. Check Google Drive
  const driveId = extractGoogleDriveId(rawUrl);
  if (driveId) {
    if (mediaType === 'image') {
      // Direct high-res image link via Googleusercontent thumbnail API + fallback to uc export
      const primary = `https://lh3.googleusercontent.com/d/${driveId}`;
      const fallback1 = `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600`;
      const fallback2 = `https://drive.google.com/uc?export=view&id=${driveId}`;
      return {
        type: 'image',
        originalUrl: rawUrl,
        displayUrl: primary,
        fallbackUrls: [fallback1, fallback2],
        isEmbed: false,
        provider: 'google-drive',
      };
    } else {
      // Video: Use the Google Drive preview player in iframe for reliable video streaming
      // or direct uc export download link for HTML5 video
      const previewEmbed = `https://drive.google.com/file/d/${driveId}/preview`;
      return {
        type: 'video',
        originalUrl: rawUrl,
        displayUrl: previewEmbed,
        fallbackUrls: [`https://drive.google.com/uc?export=download&id=${driveId}`],
        isEmbed: true,
        provider: 'google-drive',
      };
    }
  }

  // 2. Check Google Photos
  if (rawUrl.includes('photos.app.goo.gl') || rawUrl.includes('photos.google.com')) {
    // If it's a direct Googleusercontent image URL already:
    if (rawUrl.includes('googleusercontent.com')) {
      return {
        type: mediaType,
        originalUrl: rawUrl,
        displayUrl: rawUrl,
        fallbackUrls: [],
        isEmbed: false,
        provider: 'google-photos',
      };
    }
    // Web album link detected
    return {
      type: mediaType,
      originalUrl: rawUrl,
      displayUrl: rawUrl,
      fallbackUrls: [],
      isEmbed: false,
      provider: 'google-photos',
      errorWarning:
        "Google Photos shared album links cannot be embedded directly by web browsers. To use this photo or video, open it in Google Photos, right-click and choose 'Copy image address', or upload it to Google Drive and set sharing to 'Anyone with link can view'.",
    };
  }

  // 3. Check YouTube (if user provided video link from YouTube)
  if (mediaType === 'video' && (rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be'))) {
    let videoId: string | null = null;
    const matchYt = rawUrl.match(/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/);
    if (matchYt && matchYt[1] && matchYt[1].length === 11) {
      videoId = matchYt[1];
    }
    if (videoId) {
      return {
        type: 'video',
        originalUrl: rawUrl,
        displayUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0`,
        fallbackUrls: [],
        isEmbed: true,
        provider: 'youtube',
      };
    }
  }

  // 4. Check Vimeo
  if (mediaType === 'video' && rawUrl.includes('vimeo.com')) {
    const vimeoMatch = rawUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/);
    if (vimeoMatch && vimeoMatch[3]) {
      return {
        type: 'video',
        originalUrl: rawUrl,
        displayUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}`,
        fallbackUrls: [],
        isEmbed: true,
        provider: 'vimeo',
      };
    }
  }

  // 5. Direct URL (image or video)
  return {
    type: mediaType,
    originalUrl: rawUrl,
    displayUrl: rawUrl,
    fallbackUrls: [],
    isEmbed: false,
    provider: 'direct',
  };
}
