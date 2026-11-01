import { BirthdayConfig } from '../types';

/**
 * =======================================================================
 * PERSONAL BIRTHDAY CONTENT CONFIGURATION
 * =======================================================================
 * Edit this file to customize:
 * 1. Recipient names & nicknames
 * 2. Memory sections (photo/video URL, heading, personal message, caption)
 * 3. Section order
 *
 * NOTE ON PERSONAL MESSAGES:
 * As requested, no fake emotional paragraphs are generated.
 * Replace the bracketed placeholder text with your genuine words.
 *
 * GOOGLE DRIVE LINKS SUPPORTED:
 * - Any standard Google Drive share link (e.g. https://drive.google.com/file/d/XYZ/view?usp=sharing)
 * - Make sure file permissions in Google Drive are set to "Anyone with the link can view".
 * =======================================================================
 */

export const initialBirthdayConfig: BirthdayConfig = {
  recipientName: 'Her Name',
  recipientNicknames: ['Little Star', 'Sunflower', 'Doremi', 'Sweetheart'],
  birthdayTitle: 'Happy Birthday',
  heroSubtitle: 'A collection of moments, your favorite things, and thoughts written just for you.',
  galleryButtonText: 'Something you might love ♡',
  sections: [
    {
      id: 'memory-01',
      order: 1,
      heading: 'Her Name',
      message: '[Write your first personal message here. This could be where you wish her a wonderful birthday, reflect on how special she is, or set the tone for this personal celebration.]',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1200&auto=format&fit=crop', // Replace with your Google Drive image link
      caption: 'A gentle beginning to your special day',
      dateOrPlace: 'A quiet morning',
    },
    {
      id: 'memory-02',
      order: 2,
      heading: 'A Favorite Nickname',
      message: '[Write your personal message here. You can speak to what this nickname means to both of you, a story from when it first started, or a sweet memory that always makes you smile.]',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1200&auto=format&fit=crop', // Replace with your Google Drive image link
      caption: 'Sunlight and flowers that remind me of you',
      dateOrPlace: 'Afternoon walk',
    },
    {
      id: 'memory-03',
      order: 3,
      heading: 'Another Endearing Name',
      message: '[Write your personal message here. Perhaps about a shared trip, a laugh that only the two of you understand, or an everyday moment you cherish.]',
      mediaType: 'video',
      mediaUrl: '', // Paste your Google Drive video link (e.g., https://drive.google.com/file/d/.../view) or direct video URL
      caption: 'A moving memory captured in motion',
      dateOrPlace: 'Captured on video',
    },
    {
      id: 'memory-04',
      order: 4,
      heading: 'My Dearest Doremi',
      message: '[Write your personal message here. A warm reflection on her art, her gentle spirit, her favorite things, and your heartfelt birthday wishes for the year ahead.]',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200?q=80&w=1200&auto=format&fit=crop', // Replace with your Google Drive image link
      caption: 'Celebrating everything you are',
      dateOrPlace: 'With all my heart',
    },
  ],
};
