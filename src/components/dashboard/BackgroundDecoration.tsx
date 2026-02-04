import React from 'react';

const BackgroundDecoration: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Right side classroom decoration */}
      <div className="absolute right-0 top-16 bottom-0 w-72 opacity-40">
        <svg viewBox="0 0 250 700" className="w-full h-full" preserveAspectRatio="xMaxYMin slice">
          {/* Bookshelf */}
          <rect x="30" y="50" width="200" height="600" fill="#8B4513" rx="5" />
          
          {/* Shelf boards */}
          <rect x="30" y="120" width="200" height="10" fill="#A0522D" />
          <rect x="30" y="220" width="200" height="10" fill="#A0522D" />
          <rect x="30" y="320" width="200" height="10" fill="#A0522D" />
          <rect x="30" y="420" width="200" height="10" fill="#A0522D" />
          <rect x="30" y="520" width="200" height="10" fill="#A0522D" />
          
          {/* Books row 1 */}
          <rect x="45" y="65" width="20" height="50" fill="#E53935" rx="2" />
          <rect x="68" y="60" width="16" height="55" fill="#1E88E5" rx="2" />
          <rect x="87" y="70" width="22" height="45" fill="#43A047" rx="2" />
          <rect x="112" y="62" width="18" height="53" fill="#FB8C00" rx="2" />
          <rect x="133" y="68" width="20" height="47" fill="#8E24AA" rx="2" />
          <rect x="156" y="58" width="15" height="57" fill="#00ACC1" rx="2" />
          <rect x="174" y="65" width="25" height="50" fill="#F4511E" rx="2" />
          
          {/* Books row 2 */}
          <rect x="50" y="170" width="22" height="45" fill="#7CB342" rx="2" />
          <rect x="75" y="165" width="18" height="50" fill="#5E35B1" rx="2" />
          <rect x="96" y="172" width="20" height="43" fill="#FFB300" rx="2" />
          <rect x="119" y="168" width="24" height="47" fill="#039BE5" rx="2" />
          <rect x="146" y="175" width="16" height="40" fill="#D81B60" rx="2" />
          <rect x="165" y="165" width="20" height="50" fill="#00897B" rx="2" />
          
          {/* Books row 3 */}
          <rect x="42" y="270" width="20" height="45" fill="#3949AB" rx="2" />
          <rect x="65" y="265" width="25" height="50" fill="#C0CA33" rx="2" />
          <rect x="93" y="272" width="18" height="43" fill="#E91E63" rx="2" />
          <rect x="114" y="268" width="22" height="47" fill="#00BCD4" rx="2" />
          <rect x="139" y="275" width="19" height="40" fill="#FF7043" rx="2" />
          <rect x="161" y="265" width="28" height="50" fill="#9C27B0" rx="2" />
          
          {/* Plant pot on shelf */}
          <ellipse cx="200" cy="115" rx="18" ry="10" fill="#795548" />
          <rect x="185" y="85" width="30" height="30" fill="#A1887F" rx="4" />
          <ellipse cx="200" cy="70" rx="25" ry="18" fill="#4CAF50" />
          <ellipse cx="195" cy="62" rx="15" ry="12" fill="#66BB6A" />
          <ellipse cx="208" cy="55" rx="12" ry="10" fill="#81C784" />
          
          {/* Globe */}
          <circle cx="80" cy="480" r="30" fill="#2196F3" />
          <ellipse cx="80" cy="480" rx="30" ry="10" fill="#1976D2" />
          <path d="M 55 470 Q 80 458 105 470" stroke="#4CAF50" strokeWidth="4" fill="none" />
          <path d="M 60 490 Q 80 502 100 490" stroke="#4CAF50" strokeWidth="4" fill="none" />
          <rect x="75" y="510" width="10" height="25" fill="#795548" />
          <rect x="65" y="535" width="30" height="6" fill="#5D4037" rx="2" />
          
          {/* Clock */}
          <circle cx="190" cy="35" r="25" fill="#FFFFFF" stroke="#1976D2" strokeWidth="4" />
          <circle cx="190" cy="35" r="3" fill="#333" />
          <line x1="190" y1="35" x2="190" y2="18" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          <line x1="190" y1="35" x2="205" y2="35" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Bottom right - Teacher and students */}
      <div className="absolute bottom-0 right-10 w-96 h-64 opacity-30">
        <svg viewBox="0 0 380 240" className="w-full h-full">
          {/* Teacher figure */}
          <g transform="translate(280, 20)">
            <circle cx="35" cy="25" r="18" fill="#5D4037" />
            <circle cx="35" cy="22" r="14" fill="#FFCCBC" />
            <rect x="18" y="45" width="34" height="50" fill="#D32F2F" rx="6" />
            <rect x="12" y="95" width="18" height="45" fill="#1976D2" />
            <rect x="40" y="95" width="18" height="45" fill="#1976D2" />
          </g>
          
          {/* Student 1 */}
          <g transform="translate(60, 80)">
            <circle cx="25" cy="18" r="15" fill="#3E2723" />
            <circle cx="25" cy="15" r="12" fill="#FFCCBC" />
            <rect x="10" y="35" width="30" height="38" fill="#1976D2" rx="5" />
            <rect x="6" y="73" width="15" height="32" fill="#455A64" />
            <rect x="29" y="73" width="15" height="32" fill="#455A64" />
          </g>
          
          {/* Student 2 */}
          <g transform="translate(130, 90)">
            <circle cx="25" cy="18" r="15" fill="#5D4037" />
            <circle cx="25" cy="15" r="12" fill="#FFCCBC" />
            <rect x="10" y="35" width="30" height="38" fill="#E91E63" rx="5" />
            <rect x="6" y="73" width="15" height="32" fill="#455A64" />
            <rect x="29" y="73" width="15" height="32" fill="#455A64" />
          </g>
          
          {/* Student 3 */}
          <g transform="translate(200, 85)">
            <circle cx="25" cy="18" r="15" fill="#3E2723" />
            <circle cx="25" cy="15" r="12" fill="#FFCCBC" />
            <rect x="10" y="35" width="30" height="38" fill="#4CAF50" rx="5" />
            <rect x="6" y="73" width="15" height="32" fill="#455A64" />
            <rect x="29" y="73" width="15" height="32" fill="#455A64" />
          </g>
          
          {/* Desk */}
          <rect x="40" y="185" width="180" height="10" fill="#8D6E63" rx="3" />
          <rect x="55" y="195" width="10" height="35" fill="#6D4C41" />
          <rect x="195" y="195" width="10" height="35" fill="#6D4C41" />
          
          {/* Books on desk */}
          <rect x="80" y="170" width="40" height="15" fill="#4CAF50" rx="2" />
          <rect x="125" y="168" width="35" height="17" fill="#2196F3" rx="2" />
        </svg>
      </div>

      {/* Bottom left books */}
      <div className="absolute bottom-0 left-64 w-56 h-40 opacity-25">
        <svg viewBox="0 0 220 150" className="w-full h-full">
          <rect x="10" y="100" width="50" height="40" fill="#E53935" rx="4" transform="rotate(-5 35 120)" />
          <rect x="55" y="95" width="45" height="45" fill="#1E88E5" rx="4" transform="rotate(3 77 117)" />
          <rect x="95" y="90" width="55" height="50" fill="#43A047" rx="4" transform="rotate(-2 122 115)" />
          <rect x="145" y="98" width="48" height="42" fill="#FB8C00" rx="4" transform="rotate(5 169 119)" />
        </svg>
      </div>
    </div>
  );
};

export default BackgroundDecoration;
