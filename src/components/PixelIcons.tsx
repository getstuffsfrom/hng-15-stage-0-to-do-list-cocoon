import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Pixel Heart (Minecraft style)
export const PixelHeart: React.FC<{ filled?: boolean; half?: boolean; size?: number; className?: string }> = ({
  filled = true,
  half = false,
  size = 18,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      style={{ shapeRendering: 'crispEdges' }}
    >
      {/* Black Outline */}
      <path
        d="M2 0H4V1H5V0H7V1H8V4H7V5H6V6H5V7H4V6H3V5H2V4H1V1H2V0Z"
        fill="#110707"
      />
      {/* Background/Empty fill */}
      <path
        d="M2 1H4V2H5V1H7V4H6V5H5V6H4V5H3V4H2V1Z"
        fill={filled || half ? '#e82236' : '#3d1619'}
      />
      {/* Highlight pixel on full or half heart */}
      {(filled || half) && (
        <rect x="2" y="1" width="1" height="1" fill="#ff8591" />
      )}
      {/* If half, darken right side */}
      {half && (
        <path
          d="M5 1H7V4H6V5H5V6V1Z"
          fill="#3d1619"
        />
      )}
    </svg>
  );
};

// Hunger Drumstick
export const PixelHunger: React.FC<{ filled?: boolean; size?: number; className?: string }> = ({
  filled = true,
  size = 18,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      style={{ shapeRendering: 'crispEdges' }}
    >
      {/* Outline */}
      <path
        d="M3 1H6V2H8V5H7V7H5V8H4V7H2V6H1V3H2V2H3V1Z"
        fill="#1a1105"
      />
      {/* Filling */}
      <path
        d="M3 2H6V3H7V5H6V6H4V7H3V6H2V3H3V2Z"
        fill={filled ? '#b35d1f' : '#2d1b10'}
      />
      {filled && (
        <>
          <rect x="3" y="2" width="2" height="1" fill="#e58f4a" />
          <rect x="7" y="6" width="1" height="1" fill="#e2d6c5" />
          <rect x="6" y="7" width="1" height="1" fill="#e2d6c5" />
        </>
      )}
    </svg>
  );
};

// XP Orb (Blinking diamond pixel orb)
export const PixelXpOrb: React.FC<IconProps> = ({ size = 16, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      style={{ shapeRendering: 'crispEdges' }}
    >
      <path d="M3 0H5V1H6V2H7V3H8V5H7V6H6V7H5V8H3V7H2V6H1V5H0V3H1V2H2V1H3V0Z" fill="#1b4d00" />
      <path d="M3 1H5V2H6V3H7V5H6V6H5V7H3V6H2V5H1V3H2V2H3V1Z" fill="#55ff55" />
      <rect x="3" y="2" width="2" height="4" fill="#ffff55" />
      <rect x="2" y="3" width="4" height="2" fill="#ffff55" />
      <rect x="3" y="3" width="2" height="2" fill="#ffffff" />
    </svg>
  );
};

// Book and Quill
export const PixelBookQuill: React.FC<IconProps> = ({ size = 20, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
    >
      {/* Book Cover */}
      <rect x="1" y="4" width="10" height="11" fill="#4d2417" />
      <rect x="2" y="3" width="9" height="1" fill="#693322" />
      {/* Pages */}
      <rect x="3" y="5" width="7" height="9" fill="#f0e2be" />
      <rect x="4" y="6" width="5" height="1" fill="#755a40" />
      <rect x="4" y="8" width="5" height="1" fill="#755a40" />
      <rect x="4" y="10" width="3" height="1" fill="#755a40" />
      {/* Quill Feather */}
      <path d="M14 1H16V3H15V5H14V7H13V9H12V11H11V13H10V14H9V15H8V16H7V15H8V14H9V12H10V10H11V8H12V6H13V4H14V2H15V1H14Z" fill="#e5dfcf" />
      <rect x="12" y="4" width="2" height="2" fill="#917b63" />
      <rect x="7" y="15" width="1" height="1" fill="#1f1813" />
    </svg>
  );
};

// Cherry Blossom Flower
export const PixelCherryBlossom: React.FC<IconProps> = ({ size = 18, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
    >
      {/* Petals */}
      <rect x="4" y="1" width="4" height="2" fill="#d97d99" />
      <rect x="1" y="4" width="2" height="4" fill="#d97d99" />
      <rect x="9" y="4" width="2" height="4" fill="#d97d99" />
      <rect x="4" y="9" width="4" height="2" fill="#d97d99" />
      {/* Inner Petal highlight */}
      <rect x="3" y="3" width="6" height="6" fill="#f2a7be" />
      {/* Center Pistil */}
      <rect x="5" y="5" width="2" height="2" fill="#ffe29c" />
      <rect x="5" y="5" width="1" height="1" fill="#e27042" />
    </svg>
  );
};

// Amethyst Shard
export const PixelAmethyst: React.FC<IconProps> = ({ size = 18, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
    >
      <path d="M5 1H7V3H8V5H9V8H7V10H5V8H3V5H4V3H5V1Z" fill="#2d1340" />
      <path d="M5 2H7V4H8V7H7V9H5V7H4V4H5V2Z" fill="#a46ed6" />
      <rect x="5" y="3" width="2" height="3" fill="#e0c2ff" />
      <rect x="5" y="4" width="1" height="1" fill="#ffffff" />
    </svg>
  );
};

// Chest / Shulker
export const PixelChest: React.FC<IconProps> = ({ size = 18, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
    >
      <rect x="1" y="1" width="12" height="12" fill="#1b120c" />
      <rect x="2" y="2" width="10" height="4" fill="#875128" />
      <rect x="2" y="7" width="10" height="5" fill="#693b18" />
      {/* Lid rim */}
      <rect x="2" y="6" width="10" height="1" fill="#231710" />
      {/* Lock Latch */}
      <rect x="6" y="5" width="2" height="3" fill="#cfbe90" />
      <rect x="6.5" y="6" width="1" height="1" fill="#30241a" />
    </svg>
  );
};

// Levitation / Anti-Gravity Potion
export const PixelPotion: React.FC<IconProps> = ({ size = 18, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
    >
      {/* Cork */}
      <rect x="5" y="1" width="2" height="1" fill="#8b572a" />
      {/* Neck */}
      <rect x="5" y="2" width="2" height="2" fill="#4d5366" />
      {/* Bottle glass outline */}
      <path d="M3 4H9V5H10V9H9V10H3V9H2V5H3V4Z" fill="#1c202a" />
      {/* Liquid */}
      <path d="M3 5H9V9H8V10H4V9H3V5Z" fill="#7552aa" />
      {/* Shimmer / Bubbles */}
      <rect x="4" y="6" width="1" height="1" fill="#d8b4fe" />
      <rect x="7" y="7" width="1" height="1" fill="#ffffff" />
      <rect x="5" y="8" width="1" height="1" fill="#d8b4fe" />
    </svg>
  );
};

// Crafting Table
export const PixelCraftingTable: React.FC<IconProps> = ({ size = 18, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
    >
      <rect x="1" y="1" width="12" height="12" fill="#1c120c" />
      <rect x="2" y="2" width="10" height="10" fill="#9e6e3c" />
      {/* Grid lines */}
      <rect x="2" y="5" width="10" height="1" fill="#4a2e15" />
      <rect x="2" y="9" width="10" height="1" fill="#4a2e15" />
      <rect x="5" y="2" width="1" height="10" fill="#4a2e15" />
      <rect x="9" y="2" width="1" height="10" fill="#4a2e15" />
      {/* Saw/Hammer tool detail */}
      <rect x="3" y="3" width="1" height="2" fill="#dedede" />
      <rect x="7" y="7" width="1" height="1" fill="#bd9062" />
    </svg>
  );
};

// Sound speaker icon
export const PixelSpeaker: React.FC<{ on?: boolean; size?: number; className?: string }> = ({
  on = true,
  size = 18,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
    >
      <rect x="1" y="4" width="3" height="6" fill="#ffffff" />
      <path d="M4 4L8 1V13L4 10H1V4H4Z" fill="#ffffff" />
      {on ? (
        <>
          <rect x="10" y="4" width="1" height="6" fill="#55ff55" />
          <rect x="12" y="2" width="1" height="10" fill="#55ff55" />
        </>
      ) : (
        <path d="M10 4L13 10M13 4L10 10" stroke="#ff5555" strokeWidth="1.5" />
      )}
    </svg>
  );
};

// Sword (Diamond / Quest)
export const PixelSword: React.FC<IconProps> = ({ size = 18, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
    >
      {/* Blade */}
      <rect x="11" y="1" width="2" height="2" fill="#55ffff" />
      <rect x="9" y="2" width="2" height="2" fill="#2ebfbf" />
      <rect x="8" y="4" width="2" height="2" fill="#55ffff" />
      <rect x="6" y="5" width="2" height="2" fill="#2ebfbf" />
      <rect x="5" y="7" width="2" height="2" fill="#55ffff" />
      {/* Guard */}
      <rect x="3" y="7" width="2" height="2" fill="#5a3d28" />
      <rect x="6" y="10" width="2" height="2" fill="#5a3d28" />
      <rect x="4" y="8" width="3" height="3" fill="#2d1c10" />
      {/* Handle */}
      <rect x="2" y="10" width="2" height="2" fill="#8c6239" />
      <rect x="1" y="12" width="2" height="1" fill="#5a3d28" />
    </svg>
  );
};

// Checkmark
export const PixelCheck: React.FC<{ checked?: boolean; size?: number; className?: string }> = ({
  checked = true,
  size = 14,
  className = '',
}) => {
  if (!checked) return <span style={{ width: size, height: size }} className="inline-block" />;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ shapeRendering: 'crispEdges' }}
    >
      <rect x="1" y="5" width="2" height="2" fill="#55ff55" />
      <rect x="3" y="7" width="2" height="2" fill="#55ff55" />
      <rect x="5" y="5" width="2" height="2" fill="#55ff55" />
      <rect x="7" y="3" width="2" height="2" fill="#55ff55" />
      <rect x="8" y="1" width="2" height="2" fill="#55ff55" />
      {/* Dark outline */}
      <rect x="1" y="7" width="2" height="1" fill="#1b4d00" />
      <rect x="3" y="9" width="2" height="1" fill="#1b4d00" />
      <rect x="5" y="7" width="2" height="1" fill="#1b4d00" />
      <rect x="7" y="5" width="2" height="1" fill="#1b4d00" />
      <rect x="8" y="3" width="2" height="1" fill="#1b4d00" />
    </svg>
  );
};
