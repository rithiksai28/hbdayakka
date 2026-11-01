export type MediaType = 'image' | 'video';

export interface MemorySection {
  id: string;
  order: number;
  heading: string;
  message: string;
  mediaType: MediaType;
  mediaUrl: string;
  caption?: string;
  dateOrPlace?: string;
}

export interface BirthdayConfig {
  recipientName: string;
  recipientNicknames: string[];
  birthdayTitle: string;
  heroSubtitle: string;
  sections: MemorySection[];
  galleryButtonText: string;
}

export type EyeArtStyle = 
  | 'Watercolour'
  | 'Pencil & Graphite'
  | 'Celestial Anime'
  | 'Floral Botanical'
  | 'Fantasy Iris'
  | 'Surrealist'
  | 'Minimalist Ink'
  | 'Digital Painting'
  | 'Abstract Prismatic'
  | 'Classical Oil'
  | 'Luminous Pastel'
  | 'Cosmic Nebula';

export interface EyeArtwork {
  id: string;
  number: number; // 1 to 50
  title: string;
  style: EyeArtStyle;
  technique: string;
  description: string;
  imageUrl?: string;
  accentColor: string;
  secondaryColor: string;
  featured?: boolean;
}
