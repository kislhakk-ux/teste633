import React from 'react';

export type MineOreType = 'coal' | 'iron_ore' | 'silver_ore' | 'gold_ore' | 'diamond';
export type MineToolType = 'shovel' | 'pickaxe' | 'dynamite' | 'tnt_barrel';

interface Ore3DProps {
  type: MineOreType;
  size?: number;
  className?: string;
  animate?: boolean;
}

/**
 * High-definition 3D Cartoon Ore Artwork
 * Replaces simplistic flat emojis with rich, multi-layered, volumetric 3D cartoon graphics.
 */
export const Ore3DIcon: React.FC<Ore3DProps> = ({
  type,
  size = 48,
  className = '',
  animate = false,
}) => {
  const s = size;

  switch (type) {
    case 'coal':
      return (
        <svg
          width={s}
          height={s}
          viewBox="-30 -30 60 60"
          className={`overflow-visible inline-block ${className}`}
        >
          <defs>
            <radialGradient id="coal-body-grad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#4B5563" />
              <stop offset="40%" stopColor="#374151" />
              <stop offset="80%" stopColor="#1F2937" />
              <stop offset="100%" stopColor="#111827" />
            </radialGradient>
            <linearGradient id="coal-facet-top" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6B7280" />
              <stop offset="100%" stopColor="#374151" />
            </linearGradient>
            <linearGradient id="coal-facet-edge" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#374151" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Ambient Ground Shadow */}
          <ellipse cx="0" cy="18" rx="22" ry="7" fill="rgba(0,0,0,0.4)" />

          {/* Main Chunky Coal Boulder */}
          <g className={animate ? 'hover:scale-110 transition-transform duration-200' : ''}>
            {/* Base faceted silhouette */}
            <polygon
              points="-18,-6 -10,-20 12,-22 22,-8 18,12 -2,18 -18,10"
              fill="url(#coal-body-grad)"
              stroke="#111827"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Front crystalline facets */}
            <polygon
              points="-10,-20 12,-22 4,-6 -8,-4"
              fill="url(#coal-facet-top)"
              stroke="#1F2937"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <polygon
              points="12,-22 22,-8 14,4 4,-6"
              fill="#262E3B"
              stroke="#111827"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <polygon
              points="-18,-6 -8,-4 0,14 -18,10"
              fill="#1F2937"
              stroke="#111827"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <polygon
              points="-8,-4 4,-6 14,4 0,14"
              fill="#374151"
              stroke="#1F2937"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <polygon
              points="14,4 22,-8 18,12 0,14"
              fill="#18202F"
              stroke="#0B0F19"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <polygon
              points="0,14 18,12 -2,18"
              fill="#111827"
              stroke="#0B0F19"
              strokeWidth="1"
              strokeLinejoin="round"
            />

            {/* Glossy Obsidian Rim Highlights */}
            <path
              d="M -10 -20 L 12 -22 L 4 -6"
              stroke="url(#coal-facet-edge)"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
            <line
              x1="-8"
              y1="-4"
              x2="4"
              y2="-6"
              stroke="#9CA3AF"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Small stray mineral chips */}
            <polygon points="-16,14 -22,12 -19,18" fill="#374151" stroke="#111827" strokeWidth="0.8" />
            <polygon points="17,14 23,16 19,20" fill="#2D3748" stroke="#111827" strokeWidth="0.8" />
          </g>
        </svg>
      );

    case 'iron_ore':
      return (
        <svg
          width={s}
          height={s}
          viewBox="-30 -30 60 60"
          className={`overflow-visible inline-block ${className}`}
        >
          <defs>
            <radialGradient id="iron-rock-grad" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#71717A" />
              <stop offset="45%" stopColor="#52525B" />
              <stop offset="85%" stopColor="#27272A" />
              <stop offset="100%" stopColor="#18181B" />
            </radialGradient>
            {/* Raw Metallic Iron Vein Gradient */}
            <linearGradient id="iron-metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="25%" stopColor="#FB7185" />
              <stop offset="60%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#9F1239" />
            </linearGradient>
            <linearGradient id="iron-rust-accent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
          </defs>

          {/* Ambient Shadow */}
          <ellipse cx="0" cy="18" rx="23" ry="7" fill="rgba(0,0,0,0.42)" />

          <g className={animate ? 'hover:scale-110 transition-transform duration-200' : ''}>
            {/* Host Granite Rock Base */}
            <polygon
              points="-19,-8 -12,-21 11,-21 21,-7 19,13 -1,19 -19,11"
              fill="url(#iron-rock-grad)"
              stroke="#18181B"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Facet divisions */}
            <polygon points="-12,-21 0,-20 -4,-7 -17,-8" fill="#64748B" opacity="0.6" />
            <polygon points="0,-20 11,-21 18,-7 7,-6 -4,-7" fill="#475569" opacity="0.7" />
            <polygon points="-17,-8 -4,-7 0,14 -19,11" fill="#334155" opacity="0.7" />
            <polygon points="-4,-7 7,-6 16,3 0,14" fill="#52525B" opacity="0.8" />
            <polygon points="7,-6 21,-7 19,13 16,3" fill="#27272A" opacity="0.9" />

            {/* Embedded Raw Iron Ore Nuggets (Vibrant Hematite / Iron Red-Bronze) */}
            <g>
              {/* Central primary iron cluster */}
              <polygon
                points="-5,-12 6,-14 9,-4 1,3 -7,0"
                fill="url(#iron-metal-grad)"
                stroke="#881337"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <polygon points="-5,-12 2,-13 4,-6 -2,-5" fill="#FDA4AF" opacity="0.8" />
              <circle cx="1" cy="-7" r="1.5" fill="#FFFFFF" />

              {/* Secondary iron nodule top-left */}
              <polygon
                points="-14,-15 -7,-17 -5,-11 -12,-9"
                fill="url(#iron-metal-grad)"
                stroke="#881337"
                strokeWidth="1"
                strokeLinejoin="round"
              />
              <line x1="-12" y1="-15" x2="-8" y2="-16" stroke="#FECDD3" strokeWidth="1" strokeLinecap="round" />

              {/* Bottom right iron nugget */}
              <polygon
                points="5,2 14,0 16,7 8,9"
                fill="url(#iron-metal-grad)"
                stroke="#881337"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <polygon points="6,3 12,2 11,6 7,7" fill="#FB7185" />
              <line x1="8" y1="3" x2="13" y2="2" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" />
            </g>

            {/* Rust / Hematite Vein Streaks */}
            <path
              d="M -9 2 Q -2 5 3 2 T 12 7"
              stroke="url(#iron-rust-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />

            {/* Specular White Highlights */}
            <line x1="-10" y1="-20" x2="9" y2="-20" stroke="#E4E4E7" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 'silver_ore':
      return (
        <svg
          width={s}
          height={s}
          viewBox="-30 -30 60 60"
          className={`overflow-visible inline-block ${className}`}
        >
          <defs>
            <radialGradient id="silver-rock-grad" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="90%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </radialGradient>
            {/* Luminous Silver Crystal Gradient */}
            <linearGradient id="silver-crystal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#E2E8F0" />
              <stop offset="70%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="silver-light-facet" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#BFDBFE" />
            </linearGradient>
          </defs>

          {/* Ambient Shadow */}
          <ellipse cx="0" cy="18" rx="23" ry="7" fill="rgba(0,0,0,0.45)" />

          <g className={animate ? 'hover:scale-110 transition-transform duration-200' : ''}>
            {/* Deep Slate Rock Body */}
            <polygon
              points="-18,-7 -10,-20 12,-21 22,-8 19,13 -1,19 -19,11"
              fill="url(#silver-rock-grad)"
              stroke="#0F172A"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Rock facets */}
            <polygon points="-10,-20 3,-19 -3,-6 -16,-7" fill="#64748B" opacity="0.5" />
            <polygon points="3,-19 12,-21 19,-8 9,-6 -3,-6" fill="#475569" opacity="0.6" />
            <polygon points="-16,-7 -3,-6 0,14 -19,11" fill="#1E293B" opacity="0.8" />
            <polygon points="-3,-6 9,-6 16,4 0,14" fill="#334155" opacity="0.7" />

            {/* Glowing Cluster of 3D Silver Geodes / Crystals */}
            {/* Central Main Crystal Spire */}
            <polygon
              points="0,-23 -8,-6 2,4 10,-8"
              fill="url(#silver-crystal-grad)"
              stroke="#1E3A8A"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <polygon points="0,-23 -8,-6 -2,3" fill="url(#silver-light-facet)" opacity="0.9" />
            <polygon points="0,-23 2,4 10,-8" fill="#60A5FA" opacity="0.7" />

            {/* Right Silver Shard */}
            <polygon
              points="11,-16 6,-3 14,6 18,-4"
              fill="url(#silver-crystal-grad)"
              stroke="#1E3A8A"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <polygon points="11,-16 6,-3 11,4" fill="#FFFFFF" opacity="0.95" />

            {/* Left Silver Shard */}
            <polygon
              points="-11,-14 -16,-2 -7,2 -4,-7"
              fill="url(#silver-crystal-grad)"
              stroke="#1E3A8A"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <polygon points="-11,-14 -16,-2 -10,0" fill="#FFFFFF" opacity="0.8" />

            {/* Lower Crystal Spire */}
            <polygon
              points="-3,3 4,4 7,12 -1,14"
              fill="url(#silver-crystal-grad)"
              stroke="#1E3A8A"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <polygon points="-3,3 4,4 5,10 0,11" fill="#FFFFFF" opacity="0.85" />

            {/* 4-Point Specular Star Glint on Peak */}
            <g transform="translate(0, -23)">
              <polygon
                points="0,-6 1.8,-1.8 6,0 1.8,1.8 0,6 -1.8,1.8 -6,0 -1.8,-1.8"
                fill="#FFFFFF"
                className="animate-spin"
                style={{ transformOrigin: 'center', animationDuration: '4s' }}
              />
              <circle cx="0" cy="0" r="1.5" fill="#E0F2FE" />
            </g>
            {/* Secondary tiny sparkle */}
            <circle cx="11" cy="-16" r="1.5" fill="#FFFFFF" />
            <circle cx="-11" cy="-14" r="1.2" fill="#FFFFFF" />
          </g>
        </svg>
      );

    case 'gold_ore':
      return (
        <svg
          width={s}
          height={s}
          viewBox="-30 -30 60 60"
          className={`overflow-visible inline-block ${className}`}
        >
          <defs>
            <radialGradient id="gold-rock-grad" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#57534E" />
              <stop offset="45%" stopColor="#44403C" />
              <stop offset="85%" stopColor="#292524" />
              <stop offset="100%" stopColor="#1C1917" />
            </radialGradient>
            {/* 24K Pure Solid Gold 3D Gradient */}
            <radialGradient id="gold-nugget-grad" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="25%" stopColor="#FACC15" />
              <stop offset="60%" stopColor="#EAB308" />
              <stop offset="85%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#854D0E" />
            </radialGradient>
            <linearGradient id="gold-bright-facet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF9C3" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
          </defs>

          {/* Ambient Shadow */}
          <ellipse cx="0" cy="18" rx="23" ry="7" fill="rgba(0,0,0,0.45)" />

          <g className={animate ? 'hover:scale-110 transition-transform duration-200' : ''}>
            {/* Granite Rock Matrix */}
            <polygon
              points="-18,-7 -11,-21 11,-21 21,-7 19,13 -1,19 -19,11"
              fill="url(#gold-rock-grad)"
              stroke="#1C1917"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Rock facets */}
            <polygon points="-11,-21 1,-20 -4,-7 -16,-7" fill="#78716C" opacity="0.5" />
            <polygon points="1,-20 11,-21 18,-7 8,-6 -4,-7" fill="#57534E" opacity="0.6" />
            <polygon points="-16,-7 -4,-7 0,14 -19,11" fill="#292524" opacity="0.8" />
            <polygon points="-4,-7 8,-6 16,3 0,14" fill="#44403C" opacity="0.7" />

            {/* Plump, Chunky 3D Gold Nuggets Protruding */}
            {/* Large center nugget */}
            <polygon
              points="-6,-13 7,-16 11,-5 3,5 -8,0"
              fill="url(#gold-nugget-grad)"
              stroke="#713F12"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* Facets on main nugget */}
            <polygon points="-6,-13 2,-15 5,-7 -3,-5" fill="url(#gold-bright-facet)" />
            <polygon points="2,-15 7,-16 11,-5 5,-7" fill="#FACC15" />
            <polygon points="-3,-5 5,-7 3,5 -4,2" fill="#CA8A04" />
            <circle cx="1" cy="-9" r="1.8" fill="#FFFFFF" />

            {/* Top-left gold vein cluster */}
            <polygon
              points="-15,-17 -8,-19 -5,-12 -12,-10"
              fill="url(#gold-nugget-grad)"
              stroke="#713F12"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <polygon points="-14,-16 -9,-18 -7,-13 -11,-12" fill="url(#gold-bright-facet)" />
            <circle cx="-10" cy="-14" r="1.2" fill="#FFFFFF" />

            {/* Top-right gold nugget */}
            <polygon
              points="9,-18 16,-15 17,-8 11,-9"
              fill="url(#gold-nugget-grad)"
              stroke="#713F12"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <polygon points="10,-17 15,-15 15,-10 11,-10" fill="url(#gold-bright-facet)" />

            {/* Bottom-right gold cluster */}
            <polygon
              points="4,3 13,1 17,8 8,11"
              fill="url(#gold-nugget-grad)"
              stroke="#713F12"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <polygon points="5,4 12,2 12,8 6,8" fill="url(#gold-bright-facet)" />
            <circle cx="9" cy="5" r="1.4" fill="#FFFFFF" />

            {/* Floating Sparkle Stars */}
            <g transform="translate(14, -16)">
              <polygon
                points="0,-5 1.5,-1.5 5,0 1.5,1.5 0,5 -1.5,1.5 -5,0 -1.5,-1.5"
                fill="#FEF08A"
                stroke="#CA8A04"
                strokeWidth="0.5"
                className="animate-spin"
                style={{ transformOrigin: 'center', animationDuration: '3s' }}
              />
            </g>
            <g transform="translate(-7, 2)">
              <polygon
                points="0,-4 1.2,-1.2 4,0 1.2,1.2 0,4 -1.2,1.2 -4,0 -1.2,-1.2"
                fill="#FEF08A"
                className="animate-pulse"
              />
            </g>
          </g>
        </svg>
      );

    case 'diamond':
      return (
        <svg
          width={s}
          height={s}
          viewBox="-30 -30 60 60"
          className={`overflow-visible inline-block ${className}`}
        >
          <defs>
            {/* Brilliant Cut Diamond Refraction Gradient */}
            <linearGradient id="dia-table-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="dia-facet-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="dia-facet-right" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
            <linearGradient id="dia-pavilion" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>
            <radialGradient id="dia-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Luminous Glow Aura */}
          <circle cx="0" cy="0" r="28" fill="url(#dia-aura)" className="animate-pulse" />

          {/* Ground Shadow */}
          <ellipse cx="0" cy="20" rx="18" ry="6" fill="rgba(2,132,199,0.3)" />

          <g className={animate ? 'hover:scale-110 transition-transform duration-200' : ''}>
            {/* Crown & Pavilion Silhouette with thick outline */}
            <polygon
              points="-18,-8 -10,-20 10,-20 18,-8 0,18"
              fill="url(#dia-pavilion)"
              stroke="#0C4A6E"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            {/* Table Facet (Top Center) */}
            <polygon
              points="-7,-20 7,-20 5,-8 -5,-8"
              fill="url(#dia-table-grad)"
              stroke="#0284C7"
              strokeWidth="1"
              strokeLinejoin="round"
            />

            {/* Star & Kite Facets (Crown) */}
            {/* Top Left */}
            <polygon
              points="-10,-20 -7,-20 -5,-8 -18,-8"
              fill="url(#dia-facet-left)"
              stroke="#0369A1"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Top Right */}
            <polygon
              points="7,-20 10,-20 18,-8 5,-8"
              fill="url(#dia-facet-right)"
              stroke="#0369A1"
              strokeWidth="1"
              strokeLinejoin="round"
            />

            {/* Pavilion Facets (Lower Triangular Cones) */}
            {/* Center lower */}
            <polygon
              points="-5,-8 5,-8 0,18"
              fill="#38BDF8"
              stroke="#0284C7"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Left lower */}
            <polygon
              points="-18,-8 -5,-8 0,18"
              fill="url(#dia-facet-left)"
              stroke="#0369A1"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Right lower */}
            <polygon
              points="5,-8 18,-8 0,18"
              fill="url(#dia-facet-right)"
              stroke="#075985"
              strokeWidth="1"
              strokeLinejoin="round"
            />

            {/* Specular White Table Prism Highlight */}
            <polygon points="-6,-19 4,-19 2,-11 -4,-11" fill="#FFFFFF" opacity="0.8" />
            <line x1="-15" y1="-8" x2="15" y2="-8" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.7" />

            {/* Dazzling Rotating Star Glints */}
            <g transform="translate(12, -18)">
              <polygon
                points="0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2"
                fill="#FFFFFF"
                className="animate-spin"
                style={{ transformOrigin: 'center', animationDuration: '3.5s' }}
              />
              <circle cx="0" cy="0" r="1.5" fill="#E0F2FE" />
            </g>
            <g transform="translate(-14, -6)">
              <polygon
                points="0,-5 1.5,-1.5 5,0 1.5,1.5 0,5 -1.5,1.5 -5,0 -1.5,-1.5"
                fill="#FFFFFF"
                className="animate-pulse"
              />
            </g>
          </g>
        </svg>
      );

    default:
      return null;
  }
};

/**
 * 3D Cartoon Mining Tools Visual Assets
 */
export const MineTool3DIcon: React.FC<{
  type: MineToolType;
  size?: number;
  className?: string;
  animate?: boolean;
}> = ({ type, size = 56, className = '', animate = false }) => {
  const s = size;

  switch (type) {
    case 'shovel':
      return (
        <svg width={s} height={s} viewBox="-30 -30 60 60" className={`overflow-visible ${className}`}>
          <defs>
            <linearGradient id="shovel-blade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="40%" stopColor="#94A3B8" />
              <stop offset="80%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="shovel-wood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="50%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
          </defs>
          <g className={animate ? 'hover:rotate-12 transition-transform duration-300' : ''}>
            {/* Ground Shadow */}
            <ellipse cx="0" cy="20" rx="16" ry="5" fill="rgba(0,0,0,0.3)" />

            {/* Wooden Handle Shaft tilted 45 deg */}
            <g transform="rotate(-35)">
              <rect x="-3" y="-22" width="6" height="28" rx="2" fill="url(#shovel-wood)" stroke="#451A03" strokeWidth="1" />
              
              {/* D-Grip Top Handle */}
              <path d="M -7 -22 L 7 -22 C 9 -28 -9 -28 -7 -22 Z" fill="#92400E" stroke="#451A03" strokeWidth="1" />
              <rect x="-3" y="-27" width="6" height="3" rx="1" fill="#FEF3C7" />

              {/* Steel Blade Socket collar */}
              <rect x="-4.5" y="4" width="9" height="5" rx="1" fill="#64748B" stroke="#1E293B" strokeWidth="1" />

              {/* Pointed Steel Spade Blade */}
              <path
                d="M -10 9 C -12 18 -8 26 0 28 C 8 26 12 18 10 9 Z"
                fill="url(#shovel-blade)"
                stroke="#1E293B"
                strokeWidth="1.5"
              />
              {/* Blade Ridge Spine */}
              <line x1="0" y1="9" x2="0" y2="25" stroke="#F1F5F9" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M -7 11 L -2 24" stroke="#F8FAFC" strokeWidth="1" opacity="0.7" />
            </g>
          </g>
        </svg>
      );

    case 'pickaxe':
      return (
        <svg width={s} height={s} viewBox="-30 -30 60 60" className={`overflow-visible ${className}`}>
          <defs>
            <linearGradient id="pick-metal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="30%" stopColor="#CBD5E1" />
              <stop offset="70%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="pick-wood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="50%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
          </defs>
          <g className={animate ? 'hover:rotate-12 transition-transform duration-300' : ''}>
            {/* Ground Shadow */}
            <ellipse cx="2" cy="20" rx="16" ry="5" fill="rgba(0,0,0,0.3)" />

            <g transform="rotate(-30)">
              {/* Wooden Handle */}
              <rect x="-3" y="-12" width="6" height="34" rx="2.5" fill="url(#pick-wood)" stroke="#451A03" strokeWidth="1.2" />
              {/* Grip tape */}
              <line x1="-3" y1="12" x2="3" y2="15" stroke="#78350F" strokeWidth="1.5" />
              <line x1="-3" y1="16" x2="3" y2="19" stroke="#78350F" strokeWidth="1.5" />

              {/* Heavy Double-Sided Cast Iron Pick Head */}
              <path
                d="M -24 -6 Q 0 -18 24 -6 Q 16 -12 0 -13 Q -16 -12 -24 -6 Z"
                fill="url(#pick-metal)"
                stroke="#0F172A"
                strokeWidth="1.6"
              />
              {/* Center Iron Collar Eye */}
              <circle cx="0" cy="-11" r="5" fill="#475569" stroke="#0F172A" strokeWidth="1.4" />
              <circle cx="0" cy="-11" r="2.2" fill="#94A3B8" />

              {/* Steel Point Tips */}
              <polygon points="-24,-6 -27,-5 -22,-9" fill="#FFFFFF" />
              <polygon points="24,-6 27,-5 22,-9" fill="#FFFFFF" />
              {/* Highlight Ridge */}
              <path d="M -20 -8 Q 0 -15 20 -8" stroke="#FFFFFF" strokeWidth="1.2" fill="none" opacity="0.8" />
            </g>
          </g>
        </svg>
      );

    case 'dynamite':
      return (
        <svg width={s} height={s} viewBox="-30 -30 60 60" className={`overflow-visible ${className}`}>
          <defs>
            <linearGradient id="dyn-stick" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <linearGradient id="dyn-tape" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          <g className={animate ? 'hover:scale-105 transition-transform duration-200' : ''}>
            {/* Ground Shadow */}
            <ellipse cx="0" cy="18" rx="18" ry="6" fill="rgba(0,0,0,0.35)" />

            {/* Back Sticks */}
            <g transform="translate(-7, 2)">
              <rect x="-4" y="-16" width="8" height="28" rx="3" fill="url(#dyn-stick)" stroke="#7F1D1D" strokeWidth="1.2" />
            </g>
            <g transform="translate(7, 2)">
              <rect x="-4" y="-16" width="8" height="28" rx="3" fill="url(#dyn-stick)" stroke="#7F1D1D" strokeWidth="1.2" />
            </g>

            {/* Front Main Stick */}
            <g transform="translate(0, 0)">
              <rect x="-5" y="-18" width="10" height="32" rx="3.5" fill="url(#dyn-stick)" stroke="#7F1D1D" strokeWidth="1.4" />
              {/* Gloss Highlight */}
              <rect x="-3" y="-16" width="2.5" height="28" rx="1" fill="#FCA5A5" opacity="0.6" />
              {/* "DANGER" Stencil line */}
              <line x1="-3" y1="0" x2="3" y2="0" stroke="#FEF2F2" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Heavy Brass Binding Straps / Tape */}
            <rect x="-12" y="-10" width="24" height="4.5" rx="1" fill="url(#dyn-tape)" stroke="#78350F" strokeWidth="1" />
            <rect x="-12" y="4" width="24" height="4.5" rx="1" fill="url(#dyn-tape)" stroke="#78350F" strokeWidth="1" />

            {/* Sparkling Woven Fuse Line */}
            <path
              d="M 0 -18 C 0 -25 8 -24 7 -30"
              stroke="#D1D5DB"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Dancing Spark Flame at Tip */}
            <g transform="translate(7, -30)">
              <circle cx="0" cy="0" r="3.5" fill="#F59E0B" className="animate-ping" />
              <polygon points="0,-4 1.5,-1 4,0 1.5,1 0,4 -1.5,1 -4,0 -1.5,-1" fill="#FEF08A" />
              <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
            </g>
          </g>
        </svg>
      );

    case 'tnt_barrel':
      return (
        <svg width={s} height={s} viewBox="-30 -30 60 60" className={`overflow-visible ${className}`}>
          <defs>
            <linearGradient id="keg-wood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="35%" stopColor="#DC2626" />
              <stop offset="65%" stopColor="#B91C1C" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </linearGradient>
            <linearGradient id="keg-hoop" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="40%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <g className={animate ? 'hover:scale-105 transition-transform duration-200' : ''}>
            {/* Ground Shadow */}
            <ellipse cx="0" cy="20" rx="20" ry="7" fill="rgba(0,0,0,0.45)" />

            {/* Bulging Barrel Body */}
            <path
              d="M -14 -16 Q -20 2 -16 18 L 16 18 Q 20 2 14 -16 Z"
              fill="url(#keg-wood)"
              stroke="#450A0A"
              strokeWidth="1.8"
            />
            {/* Top Lid Rim */}
            <ellipse cx="0" cy="-16" rx="14" ry="4" fill="#991B1B" stroke="#450A0A" strokeWidth="1.2" />

            {/* Steel Barrel Hoops (Rings) */}
            <path d="M -15 -10 Q 0 -6 15 -10" stroke="url(#keg-hoop)" strokeWidth="3" fill="none" />
            <path d="M -18 3 Q 0 8 18 3" stroke="url(#keg-hoop)" strokeWidth="3.5" fill="none" />
            <path d="M -16 13 Q 0 17 16 13" stroke="url(#keg-hoop)" strokeWidth="3" fill="none" />

            {/* "TNT" Stencil Typography Badge */}
            <rect x="-12" y="-5" width="24" height="11" rx="2" fill="#1C1917" stroke="#FEF08A" strokeWidth="1" />
            <text
              x="0"
              y="3.5"
              fill="#FDE047"
              fontSize="9"
              fontWeight="900"
              fontFamily="Impact, sans-serif"
              textAnchor="middle"
              letterSpacing="1"
            >
              TNT
            </text>

            {/* Fuse Cord and Flame */}
            <path d="M 0 -16 Q 4 -23 10 -24" stroke="#F1F5F9" strokeWidth="2" fill="none" strokeLinecap="round" />
            <g transform="translate(10, -24)">
              <circle cx="0" cy="0" r="4.5" fill="#F97316" className="animate-ping" />
              <polygon points="0,-5 1.5,-1.5 5,0 1.5,1.5 0,5 -1.5,1.5 -5,0 -1.5,-1.5" fill="#FEF08A" />
              <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
            </g>
          </g>
        </svg>
      );

    default:
      return null;
  }
};
