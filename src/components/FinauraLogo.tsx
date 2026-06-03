import React from 'react';

interface FinauraLogoProps {
  variant?: 'full' | 'icon' | 'horizontal';
  className?: string;
  imgClassName?: string;
  // If the user has uploaded their logo.png to the public folder, they can set this to true
  useImage?: boolean;
}

export const FinauraLogo: React.FC<FinauraLogoProps> = ({
  variant = 'horizontal',
  className = '',
  imgClassName = '',
  useImage = false
}) => {
  // If user requests to use the image they uploaded or if we want to support image fallback
  if (useImage) {
    if (variant === 'icon') {
      return (
        <img 
          src="/logo.png" 
          alt="FinAura Capital" 
          referrerPolicy="no-referrer"
          className={`h-8 w-8 object-contain ${imgClassName}`}
          onError={(e) => {
            // Fallback back to SVG if image is missing
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      );
    }
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img 
          src="/logo.png" 
          alt="FinAura Capital Logo" 
          referrerPolicy="no-referrer"
          className={`h-11 w-11 object-contain rounded-full shadow-[0_0_15px_rgba(201,168,76,0.2)] border border-gold/20 ${imgClassName}`}
        />
        {variant === 'horizontal' && (
          <div className="flex flex-col select-none">
            <span className="font-serif text-xl font-extrabold tracking-wide text-gold leading-none">
              FINAURA
            </span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-[0.25em] font-medium leading-normal mt-0.5">
              CAPITAL
            </span>
          </div>
        )}
      </div>
    );
  }

  // --- VERY HIGH FIDELITY PURE VECTOR SVG FALLBACK ---
  // This SVG is an executive piece of design mimicking the user's uploaded gold coin seal.
  // It features fine typography, golden radial/linear gradient shading, inner compass star layout, 
  // stylized monogram 'F', dynamic upward trend curve with pointer, and a 4-bar column ledger chart.

  if (variant === 'icon') {
    return (
      <svg 
        viewBox="0 0 100 100" 
        className={`h-9 w-9 text-gold fill-none select-none ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="nav-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2CC" />
            <stop offset="30%" stopColor="#ECC86A" />
            <stop offset="70%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#967425" />
          </linearGradient>
        </defs>
        
        {/* Central Monogram symbol only for clean navbar icon */}
        <g>
          {/* Base Serif Letter F */}
          <text 
            x="42" 
            y="65" 
            fontFamily="'Cinzel', 'Playfair Display', 'Georgia', 'Times New Roman', serif" 
            fontWeight="900" 
            fontSize="46" 
            fill="url(#nav-gold)"
            textAnchor="end"
          >
            F
          </text>
          
          {/* 4 Growing Ledger Columns */}
          <rect x="52" y="50" width="4" height="15" rx="1" fill="url(#nav-gold)" />
          <rect x="59" y="42" width="4" height="23" rx="1" fill="url(#nav-gold)" />
          <rect x="66" y="33" width="4" height="32" rx="1" fill="url(#nav-gold)" />
          <rect x="73" y="22" width="4" height="43" rx="1" fill="url(#nav-gold)" />

          {/* Upward vector swoop arrow */}
          <path 
            d="M 22 55 Q 52 48 76 21" 
            stroke="url(#nav-gold)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          <path 
            d="M 68 20 Q 77 19 78 20 T 74 29" 
            stroke="url(#nav-gold)" 
            strokeWidth="3" 
            strokeLinecap="round"
            fill="url(#nav-gold)"
          />
        </g>
      </svg>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-2.5 select-none ${className}`}>
        {/* Navbar-sized mini logo representation */}
        <svg 
          viewBox="0 0 100 100" 
          className="h-10 w-10 text-gold fill-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="hz-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2CC" />
              <stop offset="30%" stopColor="#ECC86A" />
              <stop offset="70%" stopColor="#C9A84C" />
              <stop offset="100%" stopColor="#967425" />
            </linearGradient>
            <radialGradient id="hz-ring" cx="50%" cy="50%" r="50%">
              <stop offset="85%" stopColor="transparent" />
              <stop offset="90%" stopColor="#C9A84C" />
              <stop offset="96%" stopColor="#FFECA5" />
              <stop offset="100%" stopColor="#967425" />
            </radialGradient>
          </defs>

          {/* Small orbital background ring */}
          <circle cx="50%" cy="50%" r="46" fill="url(#hz-ring)" opacity="0.45" />
          <circle cx="50%" cy="50%" r="42" stroke="url(#hz-gold)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.6" />
          
          {/* Monogram inside */}
          <g transform="translate(1, 1) scale(0.95)">
            <text 
              x="42" 
              y="65" 
              fontFamily="'Cinzel', 'Playfair Display', 'Georgia', serif" 
              fontWeight="900" 
              fontSize="46" 
              fill="url(#hz-gold)"
              textAnchor="end"
            >
              F
            </text>
            <rect x="52" y="50" width="4.5" height="15" rx="1.5" fill="url(#hz-gold)" />
            <rect x="59" y="42" width="4.5" height="23" rx="1.5" fill="url(#hz-gold)" />
            <rect x="66" y="33" width="4.5" height="32" rx="1.5" fill="url(#hz-gold)" />
            <rect x="73" y="22" width="4.5" height="43" rx="1.5" fill="url(#hz-gold)" />
            <path d="M 22 55 Q 52 48 76 21" stroke="url(#hz-gold)" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 68 20 Q 77 19 78 20 T 74 29" stroke="url(#hz-gold)" strokeWidth="3" strokeLinecap="round" fill="url(#hz-gold)" />
          </g>
        </svg>

        <div className="flex flex-col">
          <span className="font-serif text-xl font-extrabold tracking-tight text-gold leading-none uppercase">
            FinAura
          </span>
          <span className="text-[9px] text-[#A2A4A8] uppercase tracking-[0.32em] font-extrabold leading-normal mt-0.5">
            Capital
          </span>
        </div>
      </div>
    );
  }

  // variant === 'full' -> The glorious circular company coin medallion seal!
  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      <svg 
        viewBox="0 0 320 320" 
        className="w-full max-w-[280px] md:max-w-[320px] aspect-square fill-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="full-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2CC" />
            <stop offset="25%" stopColor="#ECC86A" />
            <stop offset="50%" stopColor="#D9B241" />
            <stop offset="75%" stopColor="#B28C2B" />
            <stop offset="100%" stopColor="#7E5F15" />
          </linearGradient>

          {/* Solid rich circular gold ring gradient */}
          <radialGradient id="gold-seal-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E1F22" />
            <stop offset="85%" stopColor="#121316" />
            <stop offset="96%" stopColor="#252115" />
            <stop offset="100%" stopColor="#0B0B0C" />
          </radialGradient>

          {/* Paths for circular curved text spacing */}
          {/* Top text arc: Left-to-Right semi-circle on top */}
          <path id="circle-arc-top" d="M 44,160 A 116,116 0 0,1 276,160" fill="none" />
          
          {/* Bottom text arc: Right-to-Left semi-circle on bottom */}
          <path id="circle-arc-bottom" d="M 276,160 A 116,116 0 0,1 44,160" fill="none" />
        </defs>

        {/* Central Shadowed Backing Seal */}
        <circle cx="160" cy="160" r="148" fill="url(#gold-seal-bg)" stroke="url(#full-gold)" strokeWidth="1.5" />
        
        {/* Double Outer Rings */}
        <circle cx="160" cy="160" r="142" stroke="url(#full-gold)" strokeWidth="4.5" />
        <circle cx="160" cy="160" r="134" stroke="url(#full-gold)" strokeWidth="1" />
        
        {/* Inner Compass Dotted Ring */}
        <circle cx="160" cy="160" r="121" stroke="url(#full-gold)" strokeWidth="1" strokeDasharray="3.5 3.5" opacity="0.75" />
        <circle cx="160" cy="160" r="113" stroke="url(#full-gold)" strokeWidth="0.5" opacity="0.4" />

        {/* Left Side Compass Star */}
        <path d="M 36 160 L 40 157 L 44 160 L 40 163 Z" fill="url(#full-gold)" />
        <polygon points="32,160 40,154 48,160 40,166" fill="url(#full-gold)" transform="translate(1, -0.5) scale(0.65)" />
        <text x="38" y="163" fontFamily="serif" fontWeight="900" fontSize="16" fill="url(#full-gold)" textAnchor="middle">★</text>

        {/* Right Side Compass Star */}
        <text x="282" y="163" fontFamily="serif" fontWeight="900" fontSize="16" fill="url(#full-gold)" textAnchor="middle">★</text>
        
        {/* Circular Curved Typography - Top Heading */}
        <text fill="url(#full-gold)" fontSize="15" fontWeight="900" letterSpacing="0.28em" fontFamily="'Cinzel', 'Playfair Display', 'Georgia', serif">
          <textPath href="#circle-arc-top" startOffset="50%" textAnchor="middle">
            FINAURA CAPITAL
          </textPath>
        </text>

        {/* Circular Curved Typography - Bottom Slogan */}
        <text fill="url(#full-gold)" fontSize="10.5" fontWeight="900" letterSpacing="0.25em" fontFamily="'Inter', 'Fira Code', 'sans-serif'">
          <textPath href="#circle-arc-bottom" startOffset="50%" textAnchor="middle">
            INVEST | GROW | PROSPER
          </textPath>
        </text>

        {/* ================= CENTRAL SEAL ASSEMBLY ================= */}
        <g transform="translate(10, 5)">
          {/* Large Serif F Monogram */}
          <text 
            x="126" 
            y="172" 
            fontFamily="'Cinzel', 'Playfair Display', 'Georgia', 'Times New Roman', serif" 
            fontWeight="bold" 
            fontSize="78" 
            fill="url(#full-gold)"
            textAnchor="end"
          >
            F
          </text>

          {/* Ledger Growing Bar Columns */}
          <rect x="145" y="145" width="8" height="26" rx="2" fill="url(#full-gold)" />
          <rect x="158" y="132" width="8" height="39" rx="2" fill="url(#full-gold)" />
          <rect x="171" y="116" width="8" height="55" rx="2" fill="url(#full-gold)" />
          <rect x="184" y="99" width="8" height="72" rx="2" fill="url(#full-gold)" />

          {/* Dynamic Growth Swoop Cutting Across 'F' */}
          <path 
            d="M 96 155 Q 146 148 188 100" 
            stroke="url(#full-gold)" 
            strokeWidth="7" 
            strokeLinecap="round" 
          />
          {/* Arrow Head */}
          <path 
            d="M 182 101 L 195 95 L 192 110 Z" 
            fill="url(#full-gold)"
          />
        </g>

        {/* ================= CENTER HORIZONTAL TEXT BLOCK ================= */}
        <g transform="translate(0, 15)">
          {/* Brand Name Standard Line */}
          <text 
            x="160" 
            y="190" 
            fontFamily="'Cinzel', 'Playfair Display', 'Georgia', serif" 
            fontWeight="900" 
            fontSize="23" 
            letterSpacing="0.18em" 
            fill="url(#full-gold)" 
            textAnchor="middle"
          >
            FINAURA
          </text>
          
          {/* Division Dashline Subtitle */}
          <text 
            x="160" 
            y="211" 
            fontFamily="'Inter', sans-serif" 
            fontWeight="700" 
            fontSize="10" 
            letterSpacing="0.45em" 
            fill="url(#full-gold)" 
            textAnchor="middle"
          >
            — CAPITAL —
          </text>

          {/* Fine Anchor Line with Golden Bead */}
          <line x1="100" y1="223" x2="220" y2="223" stroke="url(#full-gold)" strokeWidth="0.75" opacity="0.6" />
          <circle cx="160" cy="223" r="3.5" fill="url(#full-gold)" />
        </g>
      </svg>
    </div>
  );
};
