/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initialBirthdayConfig } from './data/birthdayContent';
import { BirthdayConfig } from './types';
import { BirthdayExperience } from './components/BirthdayExperience';
import { EyesGalleryPage } from './components/EyesGalleryPage';
import { StoryManagerDrawer } from './components/StoryManagerDrawer';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'story' | 'gallery'>('story');
  const [isStoryManagerOpen, setIsStoryManagerOpen] = useState(false);
  const [showEditorButton, setShowEditorButton] = useState(false);

  // Load config from localStorage if user tested edits, fallback to initialBirthdayConfig
  const [config, setConfig] = useState<BirthdayConfig>(() => {
    try {
      const saved = localStorage.getItem('birthday_experience_config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved config:', e);
    }
    return initialBirthdayConfig;
  });

  // Custom artworks map (id -> imageUrl)
  const [customArtworks, setCustomArtworks] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('birthday_custom_artworks');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse custom artworks:', e);
    }
    return {};
  });

  // Auto-persist: Ensure whatever was edited in localStorage is permanently saved to src/data/birthdayContent.ts
  useEffect(() => {
    try {
      const saved = localStorage.getItem('birthday_experience_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        fetch('/api/save-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              console.log('[Auto-Sync] Saved user edited story content permanently into project files.');
            }
          })
          .catch(() => {
            // Silently ignore in static builds
          });
      }
    } catch (err) {
      console.warn('Auto-sync check:', err);
    }
  }, []);

  // Always start on the Birthday Story upon opening/refreshing the site
  useEffect(() => {
    setCurrentPage('story');
    if (window.location.hash === '#eyes-gallery') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Allow creator to access the editor via ?edit=true or #edit if needed
    if (window.location.search.includes('edit=true') || window.location.hash === '#edit') {
      setIsStoryManagerOpen(true);
      setShowEditorButton(true);
    }
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#eyes-gallery') {
        setCurrentPage('gallery');
      } else {
        setCurrentPage('story');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Keyboard shortcut for creator to toggle editor: Ctrl+Shift+E or Alt+E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key === 'E') || (e.altKey && (e.key === 'e' || e.key === 'E'))) {
        e.preventDefault();
        setIsStoryManagerOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateToGallery = () => {
    window.location.hash = 'eyes-gallery';
    setCurrentPage('gallery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStory = () => {
    setCurrentPage('story');
    if (window.location.hash) {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveConfig = (newConfig: BirthdayConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('birthday_experience_config', JSON.stringify(newConfig));
      // Save permanently to server file
      fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      }).catch(() => {});
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const handleResetToDefault = () => {
    setConfig(initialBirthdayConfig);
    try {
      localStorage.removeItem('birthday_experience_config');
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }
  };

  const handleUpdateArtworkUrl = (id: string, url: string) => {
    const updated = { ...customArtworks, [id]: url };
    setCustomArtworks(updated);
    try {
      localStorage.setItem('birthday_custom_artworks', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save custom artwork URL', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5]">
      {currentPage === 'story' ? (
        <BirthdayExperience
          config={config}
          onOpenGallery={navigateToGallery}
          onOpenStoryManager={() => setIsStoryManagerOpen(true)}
          showEditorButton={showEditorButton}
        />
      ) : (
        <EyesGalleryPage
          onBackToStory={navigateToStory}
          customArtworks={customArtworks}
          onUpdateArtworkUrl={handleUpdateArtworkUrl}
        />
      )}

      {/* Floating Story Content Editor Drawer (Hidden from regular visitors, openable via ?edit=true or Ctrl+Shift+E) */}
      <StoryManagerDrawer
        isOpen={isStoryManagerOpen}
        onClose={() => setIsStoryManagerOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        onResetToDefault={handleResetToDefault}
      />
    </div>
  );
}
