import React, { useState, useRef, useEffect } from 'react';
import { EyeArtwork } from '../types';

interface ArtisticEyeRendererProps {
  artwork: EyeArtwork;
  className?: string;
  isDetailedView?: boolean;
}

export const ArtisticEyeRenderer: React.FC<ArtisticEyeRendererProps> = ({
  artwork,
  className = '',
  isDetailedView = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Master high-resolution pair-of-eyes artwork image
  const hasExternalImage = Boolean(artwork.imageUrl && !imageError);

  // Master Procedural Fine-Art Canvas Painter
  // Renders a high-detail, fully painted pair of eyes matching the first four artworks
  useEffect(() => {
    if (hasExternalImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use high DPI for sharp rendering
    const width = 800;
    const height = 500;
    canvas.width = width;
    canvas.height = height;

    const style = artwork.style;
    const accent = artwork.accentColor;
    const secondary = artwork.secondaryColor;
    const num = artwork.number;

    // -------------------------------------------------------------
    // 1. BASE BACKGROUND & PAINTERLY TEXTURE
    // -------------------------------------------------------------
    // Skin Tone / Atmosphere Gradient
    const bgGrad = ctx.createRadialGradient(400, 260, 40, 400, 250, 460);

    if (style === 'Watercolour') {
      bgGrad.addColorStop(0, '#FAF5F2');
      bgGrad.addColorStop(0.5, '#F6EFF7');
      bgGrad.addColorStop(1, '#EFE6F3');
    } else if (style === 'Cosmic Nebula') {
      bgGrad.addColorStop(0, '#211833');
      bgGrad.addColorStop(0.6, '#181126');
      bgGrad.addColorStop(1, '#0F091A');
    } else if (style === 'Floral Botanical') {
      bgGrad.addColorStop(0, '#FFFDF9');
      bgGrad.addColorStop(0.6, '#FBF3F0');
      bgGrad.addColorStop(1, '#F7E7E4');
    } else if (style === 'Pencil & Graphite') {
      bgGrad.addColorStop(0, '#FDFBF7');
      bgGrad.addColorStop(0.7, '#F3EFEA');
      bgGrad.addColorStop(1, '#E7E2DB');
    } else if (style === 'Classical Oil' || style === 'Luminous Pastel') {
      bgGrad.addColorStop(0, '#FDF9F3');
      bgGrad.addColorStop(0.6, '#F8EFE3');
      bgGrad.addColorStop(1, '#EEDEC9');
    } else {
      bgGrad.addColorStop(0, '#FDFBF9');
      bgGrad.addColorStop(0.6, secondary);
      bgGrad.addColorStop(1, '#EFEAE5');
    }

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle paper tooth / grain
    ctx.save();
    ctx.globalAlpha = 0.04;
    for (let x = 0; x < width; x += 4) {
      for (let y = 0; y < height; y += 4) {
        if ((x * 13 + y * 7) % 5 === 0) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }
    ctx.restore();

    // Thematic background blooms (Watercolour drips / Cosmic nebulae / Botanicals)
    if (style === 'Watercolour') {
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = accent;
      // Soft organic splatter / blooms around the eyes
      for (let i = 0; i < 14; i++) {
        const bx = 160 + (i % 7) * 80 + Math.sin(i) * 30;
        const by = 180 + Math.cos(i * 1.5) * 80;
        const br = 25 + (i % 4) * 20;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (style === 'Cosmic Nebula') {
      ctx.save();
      // Glowing star clusters
      ctx.fillStyle = '#FFFFFF';
      for (let s = 0; s < 45; s++) {
        const sx = (s * 79 + 45) % width;
        const sy = (s * 53 + 20) % height;
        const sr = (s % 3 === 0) ? 2 : 1;
        ctx.globalAlpha = 0.3 + (s % 5) * 0.15;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // -------------------------------------------------------------
    // 2. SOFT FACIAL MODELING (Bridge of nose, socket shadows)
    // -------------------------------------------------------------
    ctx.save();
    // Nose bridge soft shadow
    const bridgeGrad = ctx.createLinearGradient(380, 200, 420, 200);
    bridgeGrad.addColorStop(0, 'rgba(180, 150, 160, 0.08)');
    bridgeGrad.addColorStop(0.5, 'rgba(180, 150, 160, 0.15)');
    bridgeGrad.addColorStop(1, 'rgba(180, 150, 160, 0.08)');
    ctx.fillStyle = bridgeGrad;
    ctx.fillRect(380, 170, 40, 140);
    ctx.restore();

    // -------------------------------------------------------------
    // 3. EYE DRAWING HELPER FUNCTION (Renders left and right eye)
    // -------------------------------------------------------------
    const drawEye = (centerX: number, centerY: number, isRight: boolean) => {
      const eyeWidth = 140;
      const eyeHeight = 58;

      ctx.save();

      // A. Orbital Socket Shadow
      const socketGrad = ctx.createRadialGradient(
        centerX,
        centerY - 6,
        20,
        centerX,
        centerY - 6,
        110
      );
      socketGrad.addColorStop(0, 'rgba(190, 160, 175, 0.16)');
      socketGrad.addColorStop(0.8, 'rgba(190, 160, 175, 0.08)');
      socketGrad.addColorStop(1, 'rgba(190, 160, 175, 0)');
      ctx.fillStyle = socketGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY - 6, eyeWidth * 0.85, eyeHeight * 1.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // B. Eyebrow
      ctx.save();
      const browY = centerY - 72;
      const browGrad = ctx.createLinearGradient(
        centerX - eyeWidth,
        browY,
        centerX + eyeWidth,
        browY
      );
      if (style === 'Cosmic Nebula') {
        browGrad.addColorStop(0, 'rgba(140, 110, 170, 0.6)');
        browGrad.addColorStop(0.5, 'rgba(190, 160, 220, 0.85)');
        browGrad.addColorStop(1, 'rgba(140, 110, 170, 0.3)');
      } else {
        browGrad.addColorStop(0, 'rgba(70, 55, 68, 0.4)');
        browGrad.addColorStop(0.4, 'rgba(60, 48, 58, 0.85)');
        browGrad.addColorStop(1, 'rgba(80, 65, 75, 0.3)');
      }
      ctx.strokeStyle = browGrad;
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (!isRight) {
        ctx.moveTo(centerX - 100, browY + 12);
        ctx.quadraticCurveTo(centerX - 10, browY - 14, centerX + 90, browY + 4);
      } else {
        ctx.moveTo(centerX - 90, browY + 4);
        ctx.quadraticCurveTo(centerX + 10, browY - 14, centerX + 100, browY + 12);
      }
      ctx.stroke();

      // Fine eyebrow hairs
      ctx.lineWidth = 1;
      ctx.strokeStyle = style === 'Cosmic Nebula' ? 'rgba(210, 190, 240, 0.5)' : 'rgba(55, 42, 52, 0.6)';
      for (let h = -80; h <= 80; h += 7) {
        const hx = centerX + h;
        const hy = browY + (isRight ? h * -0.05 : h * 0.05);
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx + (isRight ? 6 : -6), hy - 7 - Math.sin(h * 0.05) * 3);
        ctx.stroke();
      }
      ctx.restore();

      // C. Upper Crease Line (Double Eyelid)
      ctx.save();
      ctx.strokeStyle = style === 'Cosmic Nebula' ? 'rgba(170, 140, 210, 0.4)' : 'rgba(110, 85, 100, 0.45)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY - 28, eyeWidth * 0.72, 14, 0, Math.PI, 0);
      ctx.stroke();
      ctx.restore();

      // D. Eyeball / Sclera Path
      ctx.beginPath();
      // Outer corner to inner corner curve
      const innerX = isRight ? centerX - eyeWidth * 0.8 : centerX + eyeWidth * 0.8;
      const outerX = isRight ? centerX + eyeWidth * 0.8 : centerX - eyeWidth * 0.8;
      ctx.moveTo(outerX, centerY + 2);
      ctx.quadraticCurveTo(centerX, centerY - eyeHeight, innerX, centerY + 2);
      ctx.quadraticCurveTo(centerX, centerY + eyeHeight * 0.85, outerX, centerY + 2);
      ctx.closePath();

      // Sclera fill (Warm ivory / porcelain 3D shading)
      const scleraGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        eyeWidth * 0.85
      );
      scleraGrad.addColorStop(0, '#FFFFFF');
      scleraGrad.addColorStop(0.7, '#F7F4F2');
      scleraGrad.addColorStop(1, '#E6DCD8');
      ctx.fillStyle = scleraGrad;
      ctx.fill();

      // E. Caruncle / Tear Duct (Soft warm pink healthy tone, no tears)
      ctx.save();
      ctx.fillStyle = '#F4BDC7';
      ctx.beginPath();
      ctx.arc(innerX + (isRight ? 4 : -4), centerY + 2, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Clip inside eye contours for iris rendering
      ctx.save();
      ctx.clip();

      // F. Upper Eyelid Shadow onto Sclera & Iris
      const eyeShadow = ctx.createLinearGradient(0, centerY - eyeHeight, 0, centerY + 10);
      eyeShadow.addColorStop(0, 'rgba(40, 30, 45, 0.45)');
      eyeShadow.addColorStop(1, 'rgba(40, 30, 45, 0)');
      ctx.fillStyle = eyeShadow;
      ctx.fillRect(centerX - eyeWidth, centerY - eyeHeight, eyeWidth * 2, eyeHeight * 1.5);

      // G. The Iris (Exquisite multi-layered gem/celestial/painterly design)
      const irisRadius = 42;
      const irisX = centerX;
      const irisY = centerY - 1;

      // 1. Limbal Ring (Dark outer ring of iris)
      ctx.beginPath();
      ctx.arc(irisX, irisY, irisRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#18121E';
      ctx.fill();

      // 2. Main Iris Gradient Base
      const irisGrad = ctx.createRadialGradient(
        irisX,
        irisY,
        8,
        irisX,
        irisY,
        irisRadius
      );
      irisGrad.addColorStop(0, '#FFFFFF');
      irisGrad.addColorStop(0.3, secondary);
      irisGrad.addColorStop(0.75, accent);
      irisGrad.addColorStop(1, '#1A1420');
      ctx.fillStyle = irisGrad;
      ctx.beginPath();
      ctx.arc(irisX, irisY, irisRadius - 1.5, 0, Math.PI * 2);
      ctx.fill();

      // 3. Iris Radial Fibers & Crypts (Striations)
      ctx.save();
      const numFibers = 60;
      for (let f = 0; f < numFibers; f++) {
        const rad = (f * (360 / numFibers) * Math.PI) / 180;
        const innerR = 12 + ((f * 7) % 8);
        const outerR = irisRadius - 3 - ((f * 3) % 6);
        const fx1 = irisX + Math.cos(rad) * innerR;
        const fy1 = irisY + Math.sin(rad) * innerR;
        const fx2 = irisX + Math.cos(rad) * outerR;
        const fy2 = irisY + Math.sin(rad) * outerR;

        ctx.strokeStyle = (f % 2 === 0) ? 'rgba(255, 255, 255, 0.55)' : accent;
        ctx.lineWidth = (f % 4 === 0) ? 1.5 : 0.8;
        ctx.beginPath();
        ctx.moveTo(fx1, fy1);
        ctx.lineTo(fx2, fy2);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Style-Specific Iris Centerpiece
      if (style === 'Celestial Anime' || style === 'Cosmic Nebula') {
        // Starry glitter in iris
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        for (let sp = 0; sp < 12; sp++) {
          const sRad = (sp * 30 * Math.PI) / 180;
          const sDist = 18 + (sp % 4) * 4;
          const px = irisX + Math.cos(sRad) * sDist;
          const py = irisY + Math.sin(sRad) * sDist;
          ctx.beginPath();
          ctx.arc(px, py, sp % 3 === 0 ? 1.8 : 1, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      } else if (style === 'Abstract Prismatic') {
        // Prismatic faceted rainbow glimmers
        ctx.save();
        const colors = ['#FF9EAA', '#FFE5EC', '#BAE6FD', '#DDD6FE', '#FEF08A'];
        for (let c = 0; c < 5; c++) {
          ctx.fillStyle = colors[c];
          ctx.globalAlpha = 0.35;
          ctx.beginPath();
          ctx.arc(irisX + (c - 2) * 8, irisY + (c % 2) * 6, 7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      } else if (style === 'Floral Botanical') {
        // Delicate golden pollen ring
        ctx.save();
        ctx.fillStyle = '#FDE047';
        ctx.globalAlpha = 0.6;
        for (let fl = 0; fl < 8; fl++) {
          const frad = (fl * 45 * Math.PI) / 180;
          ctx.beginPath();
          ctx.arc(irisX + Math.cos(frad) * 22, irisY + Math.sin(frad) * 22, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 5. Pupil (Deep velvety black core with soft penumbra)
      ctx.beginPath();
      ctx.arc(irisX, irisY, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#0F0B14';
      ctx.fill();

      // 6. Specular Catchlights (Lifelike window reflection & sun sparkles - NO TEARS)
      // Primary Window Catchlight
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = 0.96;
      ctx.beginPath();
      ctx.ellipse(irisX - 10, irisY - 10, 7.5, 9, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Secondary Rim Catchlight
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(irisX + 11, irisY + 11, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Micro pinpoint glint
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(irisX - 5, irisY + 8, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore(); // Restore after eye clip

      // H. Eyelid Contours & Rim Lines
      ctx.save();
      // Upper lid line
      ctx.strokeStyle = style === 'Cosmic Nebula' ? '#3B2B4F' : '#332736';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(outerX, centerY + 2);
      ctx.quadraticCurveTo(centerX, centerY - eyeHeight, innerX, centerY + 2);
      ctx.stroke();

      // Lower lid line
      ctx.strokeStyle = style === 'Cosmic Nebula' ? 'rgba(160, 130, 190, 0.45)' : 'rgba(90, 70, 85, 0.55)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(innerX, centerY + 2);
      ctx.quadraticCurveTo(centerX, centerY + eyeHeight * 0.85, outerX, centerY + 2);
      ctx.stroke();
      ctx.restore();

      // I. Eyelashes (Carefully curved, natural, lush and fluttery)
      ctx.save();
      ctx.strokeStyle = style === 'Cosmic Nebula' ? '#2A1B3B' : '#261C28';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';

      // Upper Eyelashes (30 individual fluttery curved lashes)
      for (let l = 0; l <= 26; l++) {
        const t = l / 26;
        // Point along upper lid curve
        const lx = (1 - t) * (1 - t) * outerX + 2 * (1 - t) * t * centerX + t * t * innerX;
        const ly = (1 - t) * (1 - t) * (centerY + 2) + 2 * (1 - t) * t * (centerY - eyeHeight) + t * t * (centerY + 2);

        // Angle outward
        const lashLength = 14 + Math.sin(t * Math.PI) * 12;
        const lashDir = isRight ? (t - 0.5) * 1.2 : (0.5 - t) * 1.2;
        const tipX = lx + lashDir * lashLength;
        const tipY = ly - lashLength * 0.9;

        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.quadraticCurveTo(lx + lashDir * 4, ly - lashLength * 0.5, tipX, tipY);
        ctx.stroke();
      }

      // Lower Eyelashes (Delicate, shorter, softer)
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = style === 'Cosmic Nebula' ? 'rgba(160, 130, 200, 0.6)' : 'rgba(70, 50, 65, 0.65)';
      for (let bl = 3; bl <= 21; bl += 3) {
        const bt = bl / 24;
        const blx = (1 - bt) * (1 - bt) * innerX + 2 * (1 - bt) * bt * centerX + bt * bt * outerX;
        const bly = (1 - bt) * (1 - bt) * (centerY + 2) + 2 * (1 - bt) * bt * (centerY + eyeHeight * 0.85) + bt * bt * (centerY + 2);

        const blashLen = 6 + Math.sin(bt * Math.PI) * 5;
        const blashDir = isRight ? (bt - 0.5) * 0.8 : (0.5 - bt) * 0.8;

        ctx.beginPath();
        ctx.moveTo(blx, bly);
        ctx.lineTo(blx + blashDir * 3, bly + blashLen);
        ctx.stroke();
      }

      ctx.restore();

      ctx.restore(); // Restore drawEye transform
    };

    // Draw Left Eye
    drawEye(240, 250, false);

    // Draw Right Eye
    drawEye(560, 250, true);

    // -------------------------------------------------------------
    // 4. THEMATIC EMBELLISHMENTS ACROSS BOTH EYES
    // -------------------------------------------------------------
    ctx.save();
    if (style === 'Floral Botanical') {
      // Golden botanical vines & blooming cherry petals winding across the bridge
      ctx.strokeStyle = '#D4A373';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(120, 290);
      ctx.quadraticCurveTo(240, 330, 400, 270);
      ctx.quadraticCurveTo(560, 210, 680, 290);
      ctx.stroke();

      // Soft cherry blossoms & petals
      const petals = [
        { x: 170, y: 310, r: 7, c: '#FECDD3' },
        { x: 340, y: 285, r: 6, c: '#FFE4E6' },
        { x: 400, y: 265, r: 8, c: '#FCE7F3' },
        { x: 460, y: 250, r: 6, c: '#FFE4E6' },
        { x: 630, y: 300, r: 7, c: '#FECDD3' },
      ];
      petals.forEach((p) => {
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (style === 'Celestial Anime') {
      // Whimsical anime starlight ribbons & twinkling sparkles
      ctx.fillStyle = '#FFFFFF';
      const animeStars = [
        { x: 400, y: 170, s: 7 },
        { x: 100, y: 190, s: 5 },
        { x: 700, y: 190, s: 5 },
        { x: 390, y: 330, s: 6 },
      ];
      animeStars.forEach((st) => {
        ctx.save();
        ctx.translate(st.x, st.y);
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.rotate(Math.PI / 2);
          ctx.lineTo(st.s, 0);
          ctx.lineTo(st.s * 0.3, st.s * 0.3);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
    } else if (style === 'Watercolour') {
      // Delicate translucent pastel drip blooms
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(220, 340, 14, 0, Math.PI * 2);
      ctx.arc(580, 340, 14, 0, Math.PI * 2);
      ctx.arc(400, 360, 18, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }, [artwork, hasExternalImage]);

  // If real external image exists and loads
  if (hasExternalImage) {
    return (
      <div className={`relative overflow-hidden bg-[#FAF5F2] flex items-center justify-center ${className}`}>
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#F4EDE8] animate-pulse flex items-center justify-center text-xs text-[#8A7C93] font-serif">
            Loading master artwork...
          </div>
        )}
        <img
          src={artwork.imageUrl}
          alt={`${artwork.title} - Pair of eyes illustration`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {!isDetailedView && (
          <div className="absolute bottom-2.5 right-2.5 text-[10px] tracking-widest uppercase font-serif text-[#786B83] bg-white/85 backdrop-blur-xs px-2.5 py-0.5 rounded-md shadow-2xs border border-[#EAE3DE] pointer-events-none">
            #{artwork.number} · Pair
          </div>
        )}
      </div>
    );
  }

  // High-Resolution Procedural Painterly Fine-Art Canvas
  return (
    <div className={`relative overflow-hidden flex items-center justify-center bg-[#FAF6F3] ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Style & Number Watermark Badge in Corner for card view */}
      {!isDetailedView && (
        <div className="absolute bottom-2.5 right-2.5 text-[10px] tracking-widest uppercase font-serif text-[#786B83] bg-white/85 backdrop-blur-xs px-2.5 py-0.5 rounded-md shadow-2xs border border-[#EAE3DE] pointer-events-none">
          #{artwork.number} · Pair
        </div>
      )}
    </div>
  );
};
