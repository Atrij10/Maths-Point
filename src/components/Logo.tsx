import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8" }) => {
  return (
    <div className={`${className} relative group cursor-pointer`}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-all duration-300 group-hover:scale-110"
      >
        {/* Gradient Definitions */}
        <defs>
          {/* Rich Teal to Navy Gradient */}
          <linearGradient id="richGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="25%" stopColor="#0F766E" />
            <stop offset="50%" stopColor="#164E63" />
            <stop offset="75%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>
          
          {/* Hover Gradient - Even Richer */}
          <linearGradient id="hoverRichGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F766E" />
            <stop offset="25%" stopColor="#134E4A" />
            <stop offset="50%" stopColor="#0C4A6E" />
            <stop offset="75%" stopColor="#1E40AF" />
            <stop offset="100%" stopColor="#3730A3" />
          </linearGradient>
          
          {/* Bright White Text Gradient */}
          <linearGradient id="brightTextGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#F0F9FF" />
            <stop offset="70%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
          
          {/* Accent Ring Gradient */}
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          
          {/* Strong Shadow Filter */}
          <filter id="strongShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.5)"/>
          </filter>
          
          {/* Bright Glow Filter */}
          <filter id="brightGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer Accent Ring */}
        <circle
          cx="24"
          cy="24"
          r="23"
          fill="none"
          stroke="url(#accentGradient)"
          strokeWidth="2.5"
          opacity="0.7"
          className="group-hover:opacity-100 group-hover:stroke-width-[3] transition-all duration-300"
        />
        
        {/* Secondary Ring */}
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="url(#accentGradient)"
          strokeWidth="0.8"
          opacity="0.4"
          className="group-hover:opacity-70 transition-opacity duration-300"
        />
        
        {/* Main Background Circle */}
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="url(#richGradient)"
          filter="url(#strongShadow)"
          className="group-hover:fill-[url(#hoverRichGradient)] transition-all duration-300"
        />
        
        {/* Inner Decorative Rings */}
        <circle
          cx="24"
          cy="24"
          r="17"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.2"
          className="group-hover:stroke-white/50 transition-all duration-300"
        />
        <circle
          cx="24"
          cy="24"
          r="15"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.8"
          className="group-hover:stroke-white/40 transition-all duration-300"
        />
        
        {/* Subtle Mathematical Grid Background */}
        <g opacity="0.15" className="group-hover:opacity-25 transition-opacity duration-300">
          {/* Diagonal Lines */}
          <path d="M10 10 L38 38" stroke="white" strokeWidth="0.6" strokeLinecap="round" />
          <path d="M38 10 L10 38" stroke="white" strokeWidth="0.6" strokeLinecap="round" />
          
          {/* Cross Lines */}
          <path d="M10 24 L38 24" stroke="white" strokeWidth="0.4" strokeLinecap="round" />
          <path d="M24 10 L24 38" stroke="white" strokeWidth="0.4" strokeLinecap="round" />
          
          {/* Corner to Center Lines */}
          <path d="M14 14 L34 34" stroke="white" strokeWidth="0.3" strokeLinecap="round" />
          <path d="M34 14 L14 34" stroke="white" strokeWidth="0.3" strokeLinecap="round" />
        </g>
        
        {/* Main MP Text */}
        <text
          x="24"
          y="32"
          textAnchor="middle"
          fill="url(#brightTextGradient)"
          fontSize="17"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          filter="url(#brightGlow)"
          className="group-hover:fontSize-[19px] transition-all duration-300"
          style={{ 
            textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.3)',
            letterSpacing: '1.2px'
          }}
        >
          MP
        </text>
        
        {/* Corner Accent Dots with Colors */}
        <g className="opacity-70 group-hover:opacity-100 transition-opacity duration-500">
          <circle cx="12" cy="12" r="1.8" fill="#06B6D4">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" begin="0s" />
            <animate attributeName="r" values="1.5;2;1.5" dur="3s" repeatCount="indefinite" begin="0s" />
          </circle>
          <circle cx="36" cy="12" r="1.8" fill="#3B82F6">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" begin="0.75s" />
            <animate attributeName="r" values="1.5;2;1.5" dur="3s" repeatCount="indefinite" begin="0.75s" />
          </circle>
          <circle cx="36" cy="36" r="1.8" fill="#8B5CF6">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" begin="1.5s" />
            <animate attributeName="r" values="1.5;2;1.5" dur="3s" repeatCount="indefinite" begin="1.5s" />
          </circle>
          <circle cx="12" cy="36" r="1.8" fill="#10B981">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" begin="2.25s" />
            <animate attributeName="r" values="1.5;2;1.5" dur="3s" repeatCount="indefinite" begin="2.25s" />
          </circle>
        </g>
        
        {/* Rotating Border Accent */}
        <circle
          cx="24"
          cy="24"
          r="19"
          fill="none"
          stroke="url(#accentGradient)"
          strokeWidth="1"
          strokeDasharray="4 8"
          opacity="0"
          className="group-hover:opacity-80 transition-opacity duration-300"
          style={{
            transformOrigin: '24px 24px',
            animation: 'spin 10s linear infinite'
          }}
        />
        
        {/* Pulsing Inner Highlight */}
        <circle
          cx="24"
          cy="24"
          r="13"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="0.8"
          opacity="0"
          className="group-hover:opacity-100 transition-opacity duration-300"
        >
          <animate attributeName="r" values="11;15;11" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="4s" repeatCount="indefinite" />
        </circle>
        
        {/* Mathematical Symbols in Corners (Subtle) */}
        <g opacity="0.2" className="group-hover:opacity-35 transition-opacity duration-300">
          <g fontSize="3.5" fill="white" fontFamily="serif" fontWeight="bold">
            <text x="15" y="16" textAnchor="middle">∫</text>
            <text x="33" y="16" textAnchor="middle">π</text>
            <text x="15" y="34" textAnchor="middle">Σ</text>
            <text x="33" y="34" textAnchor="middle">√</text>
          </g>
        </g>
        
        {/* Sparkle Effects */}
        <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <circle cx="18" cy="18" r="0.8" fill="#06B6D4">
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0s" />
          </circle>
          <circle cx="30" cy="18" r="0.8" fill="#3B82F6">
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0.5s" />
          </circle>
          <circle cx="30" cy="30" r="0.8" fill="#8B5CF6">
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="1s" />
          </circle>
          <circle cx="18" cy="30" r="0.8" fill="#10B981">
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="1.5s" />
          </circle>
        </g>
      </svg>
      
      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Logo;