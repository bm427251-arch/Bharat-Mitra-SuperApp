import React from 'react';

interface BharatMitraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  showSubtitle?: boolean;
  customLogoUrl?: string | null;
}

export const BharatMitraLogo: React.FC<BharatMitraLogoProps> = ({
  size = 'lg',
  className = '',
  showText = true,
  showSubtitle = true,
  customLogoUrl = null,
}) => {
  // Dimensions matching user's official uploaded logo
  const width = size === 'sm' ? 120 : size === 'md' ? 180 : size === 'xl' ? 300 : 240;
  const height = showText ? width * 1.25 : width * 0.95;

  if (customLogoUrl) {
    return (
      <div className={`flex flex-col items-center justify-center select-none ${className}`}>
        <img
          src={customLogoUrl}
          alt="Bharat Mitra Brand Logo"
          style={{ width: `${width * 0.85}px`, maxHeight: `${width * 0.85}px` }}
          className="object-contain rounded-2xl drop-shadow-md transition-transform"
        />
        {showText && (
          <div className="mt-3 text-center">
            <span className="text-xl font-black tracking-wider text-[#F58220]">BHARAT </span>
            <span className="text-xl font-black tracking-wider text-[#0F8A3C]">MITRA</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 320 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg transition-transform"
      >
        <defs>
          <clipPath id="indiaMapClip">
            {/* Detailed silhouette of India */}
            <path
              d="M160 35 
                 C150 35, 142 42, 138 48
                 C130 45, 122 55, 125 65
                 C118 72, 120 85, 128 92
                 C125 100, 115 105, 112 115
                 C108 125, 95 130, 92 140
                 C85 145, 80 155, 82 165
                 C75 168, 68 175, 70 185
                 C75 195, 88 198, 95 190
                 C102 188, 108 195, 110 205
                 C115 215, 112 225, 120 235
                 C125 245, 135 255, 140 270
                 C145 285, 150 300, 158 315
                 C162 315, 168 300, 172 285
                 C178 265, 185 250, 195 235
                 C205 220, 218 210, 225 195
                 C230 185, 240 178, 252 175
                 C265 170, 275 160, 268 150
                 C260 145, 250 152, 242 148
                 C235 140, 228 130, 220 120
                 C212 110, 205 105, 198 90
                 C190 75, 185 60, 175 48
                 Z"
            />
          </clipPath>

          {/* Stroke filters for text */}
          <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="1" floodColor="#000000" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* --- INDIA MAP BODY --- */}
        {/* Outer outline border */}
        <path
          d="M160 32
             C148 32, 140 40, 135 46
             C126 43, 118 53, 121 64
             C114 71, 116 85, 125 93
             C122 101, 112 106, 108 117
             C104 127, 91 132, 88 143
             C80 148, 75 159, 78 170
             C70 173, 63 181, 65 192
             C71 203, 85 206, 93 198
             C100 196, 107 203, 109 214
             C114 225, 111 236, 119 247
             C124 258, 134 269, 139 285
             C144 301, 149 317, 158 322
             C165 322, 171 306, 175 290
             C181 269, 189 253, 200 237
             C211 221, 225 210, 232 194
             C238 183, 249 175, 262 172
             C276 167, 285 155, 277 143
             C268 137, 257 145, 248 141
             C240 132, 233 121, 224 110
             C215 99, 207 94, 199 78
             C191 62, 185 46, 174 34
             Z"
          fill="none"
          stroke="#000000"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* TOP NORTHERN/WESTERN SECTION (SAFFRON / ORANGE #F58220) */}
        <path
          d="M160 34
             C148 34, 140 42, 135 48
             C126 45, 118 55, 121 66
             C114 73, 116 87, 125 95
             C122 103, 112 108, 108 119
             C104 129, 91 134, 88 145
             C80 150, 75 161, 78 172
             C70 175, 63 183, 65 194
             C71 205, 85 208, 93 200
             C100 198, 107 205, 109 216
             L135 220
             L165 190
             L205 155
             C200 140, 195 125, 190 115
             C185 100, 180 85, 174 55
             Z"
          fill="#F58220"
        />

        {/* LOWER SOUTHERN/EASTERN SECTION (INDIA GREEN #0F8A3C) */}
        <path
          d="M109 216
             C114 227, 111 238, 119 249
             C124 260, 134 271, 139 287
             C144 303, 149 318, 158 322
             C165 322, 171 307, 175 291
             C181 270, 189 254, 200 238
             C211 222, 225 211, 232 195
             C238 184, 249 176, 262 173
             C276 168, 285 156, 277 144
             C268 138, 257 146, 248 142
             C240 133, 233 122, 224 111
             L195 140
             L160 175
             L135 210
             Z"
          fill="#0F8A3C"
        />

        {/* Fill remainder of northeast/upper boundary */}
        <path
          d="M160 34
             L174 46
             C185 58, 191 74, 199 89
             C207 105, 215 110, 224 121
             L205 155
             L165 190
             L135 220
             L109 216
             L100 198
             L93 200
             C85 208, 71 205, 65 194
             C63 183, 70 175, 78 172
             C75 161, 80 150, 88 145
             C91 134, 104 129, 108 119
             C112 108, 122 103, 125 95
             C116 87, 114 73, 121 66
             C118 55, 126 45, 135 48
             C140 42, 148 34, 160 34
             Z"
          fill="#F58220"
        />

        <path
          d="M205 155
             L248 142
             C257 146, 268 138, 277 144
             C285 156, 276 168, 262 173
             C249 176, 238 184, 232 195
             C225 211, 211 222, 200 238
             C189 254, 181 270, 175 291
             C171 307, 165 322, 158 322
             L140 280
             L135 220
             L165 190
             Z"
          fill="#0F8A3C"
        />

        {/* --- CENTRAL HANDSHAKE EMBLEM --- */}
        {/* Left hand (Saffron/Orange wrist & palm extending into green side) */}
        <g id="handshake">
          {/* Base white silhouette behind handshake for strong contrast */}
          <path
            d="M125 155
               C132 142, 148 135, 162 136
               C172 137, 185 142, 192 150
               L205 165
               C212 173, 215 185, 208 195
               L190 215
               C182 222, 170 226, 160 220
               L138 202
               C128 194, 120 182, 118 170
               Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="3.5"
          />

          {/* Saffron Hand (Left to Center) */}
          <path
            d="M120 170
               C125 160, 135 150, 148 152
               C155 153, 162 158, 168 165
               L160 178
               L148 172
               C142 170, 136 175, 138 182
               C140 188, 146 192, 152 190
               L162 186
               L155 198
               C150 206, 140 205, 135 200
               L120 185
               Z"
            fill="#F58220"
          />

          {/* Right Hand & Fingers Clasping (Orange/Saffron with white borders) */}
          {/* Main Hand Body */}
          <path
            d="M198 162
               C188 150, 175 144, 162 148
               C155 151, 150 156, 145 162
               L165 185
               C172 192, 180 198, 192 190
               L205 175
               Z"
            fill="#F58220"
            stroke="#FFFFFF"
            strokeWidth="3"
          />

          {/* Clasping Fingers (4 oval fingers curled forward) */}
          <ellipse cx="128" cy="195" rx="7" ry="11" transform="rotate(-35 128 195)" fill="#F58220" stroke="#FFFFFF" strokeWidth="2.5" />
          <ellipse cx="140" cy="204" rx="7" ry="11" transform="rotate(-35 140 204)" fill="#F58220" stroke="#FFFFFF" strokeWidth="2.5" />
          <ellipse cx="152" cy="212" rx="7" ry="11" transform="rotate(-35 152 212)" fill="#F58220" stroke="#FFFFFF" strokeWidth="2.5" />
          <ellipse cx="164" cy="218" rx="7" ry="11" transform="rotate(-35 164 218)" fill="#F58220" stroke="#FFFFFF" strokeWidth="2.5" />

          {/* Finger segments on the right hand */}
          <path
            d="M165 178 L195 205
               M172 172 L200 196
               M180 166 L205 188"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* THE 3 BLUE DOTS ON THE HAND (EXACT AS LOGO) */}
          {/* Arranged in a triangle: top dot, bottom-left, bottom-right */}
          <circle cx="168" cy="162" r="4.2" fill="#0052CC" stroke="#FFFFFF" strokeWidth="0.8" />
          <circle cx="162" cy="172" r="4.2" fill="#0052CC" stroke="#FFFFFF" strokeWidth="0.8" />
          <circle cx="174" cy="172" r="4.2" fill="#0052CC" stroke="#FFFFFF" strokeWidth="0.8" />

          {/* Outer stroke of the handshake lock */}
          <path
            d="M136 150
               C145 138, 160 134, 172 138
               C184 142, 195 152, 204 162
               L208 170
               C215 180, 212 192, 202 200
               L190 210
               C180 218, 168 220, 158 215
               L140 202
               C126 192, 120 180, 118 168
               Z"
            fill="none"
            stroke="#000000"
            strokeWidth="2.5"
          />
        </g>

        {/* --- BRAND NAME TYPOGRAPHY: BHARAT MITRA --- */}
        {showText && (
          <g transform="translate(160, 368)" textAnchor="middle" filter="url(#textGlow)">
            {/* White outline backdrop for ultra-crisp legibility */}
            <text
              x="-68"
              y="0"
              fontSize="34"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="1.5"
              fill="#F58220"
              stroke="#FFFFFF"
              strokeWidth="5"
              paintOrder="stroke fill"
            >
              BHARAT
            </text>
            <text
              x="62"
              y="0"
              fontSize="34"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="1.5"
              fill="#0F8A3C"
              stroke="#FFFFFF"
              strokeWidth="5"
              paintOrder="stroke fill"
            >
              MITRA
            </text>

            {/* Inner fill text */}
            <text
              x="-68"
              y="0"
              fontSize="34"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="1.5"
              fill="#F58220"
            >
              BHARAT
            </text>
            <text
              x="62"
              y="0"
              fontSize="34"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="1.5"
              fill="#0F8A3C"
            >
              MITRA
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
