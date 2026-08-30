import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FarmVisitor } from '../../types/game';

interface IsoNpcVisitorProps {
  visitor: FarmVisitor;
  gridToIso: (gx: number, gy: number) => { x: number; y: number };
  onOpenVisitor: () => void;
  targetPos?: { x: number; y: number };
  onVisitorLeaveComplete?: () => void;
  isLeaving?: boolean;
}

export const IsoNpcVisitor: React.FC<IsoNpcVisitorProps> = ({
  visitor,
  gridToIso,
  onOpenVisitor,
  targetPos = { x: 7.65, y: 4.05 }, // Default in front of the Farmhouse door
  onVisitorLeaveComplete,
  isLeaving = false,
}) => {
  const [phase, setPhase] = useState<'walking_in' | 'idle' | 'walking_out'>('walking_in');
  const [currentPos, setCurrentPos] = useState({ x: 0.2, y: 7.2 });
  const [walkFrame, setWalkFrame] = useState(0);
  const [facingLeft, setFacingLeft] = useState(false);
  const animRef = useRef<number | null>(null);
  const progressRef = useRef(0);

  // Compute dynamic pathway waypoints to the exact door of the Farmhouse
  const waypointsIn = useMemo(() => {
    const start = { x: 0.2, y: 7.2 }; // Road entrance
    const p1 = { x: 1.8, y: 6.2 };   // Entrance gate
    const p2 = { x: (targetPos.x + 1.8) / 2 + 0.2, y: (targetPos.y + 6.2) / 2 }; // Garden walkway
    const door = { x: targetPos.x, y: targetPos.y }; // Right in front of the Farmhouse door
    return [start, p1, p2, door];
  }, [targetPos.x, targetPos.y]);

  const waypointsOut = useMemo(() => {
    const door = { x: targetPos.x, y: targetPos.y };
    const p2 = { x: (targetPos.x + 1.8) / 2 + 0.2, y: (targetPos.y + 6.2) / 2 };
    const p1 = { x: 1.8, y: 6.2 };
    const exit = { x: 0.0, y: 7.8 };
    return [door, p2, p1, exit];
  }, [targetPos.x, targetPos.y]);

  // If isLeaving prop becomes true, switch to walking_out
  useEffect(() => {
    if (isLeaving && phase !== 'walking_out') {
      setPhase('walking_out');
      progressRef.current = 0;
    }
  }, [isLeaving, phase]);

  // Main animation / movement loop
  useEffect(() => {
    let lastTime = performance.now();

    const updateLoop = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (phase === 'walking_in') {
        // Move along waypoints to the door over ~4.2 seconds
        progressRef.current += delta / 4.2;
        const p = Math.min(1, progressRef.current);

        const pos = interpolateWaypoints(waypointsIn, p);
        setCurrentPos(pos.point);
        setFacingLeft(pos.dx < 0);
        setWalkFrame((prev) => (prev + delta * 8) % 1);

        if (p >= 1) {
          setPhase('idle');
          progressRef.current = 0;
          setFacingLeft(false); // Face front when waiting at the door
        }
      } else if (phase === 'walking_out') {
        // Move along waypoints to exit over ~3.6 seconds
        progressRef.current += delta / 3.6;
        const p = Math.min(1, progressRef.current);

        const pos = interpolateWaypoints(waypointsOut, p);
        setCurrentPos(pos.point);
        setFacingLeft(pos.dx < 0);
        setWalkFrame((prev) => (prev + delta * 8) % 1);

        if (p >= 1) {
          if (onVisitorLeaveComplete) {
            onVisitorLeaveComplete();
          }
          return; // Stop animation loop
        }
      } else {
        // Idle animation frame at the front door
        setWalkFrame((prev) => (prev + delta * 1.5) % 1);
      }

      animRef.current = requestAnimationFrame(updateLoop);
    };

    animRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [phase, waypointsIn, waypointsOut, onVisitorLeaveComplete]);

  // Screen coordinates & Isometric sorting depth
  const screenPos = gridToIso(currentPos.x, currentPos.y);
  const zIndex = Math.round((currentPos.x + currentPos.y) * 100 + 60);

  // Walk cycle bobbing & leg swing calculations
  const isWalking = phase === 'walking_in' || phase === 'walking_out';
  const walkAngle = isWalking ? Math.sin(walkFrame * Math.PI * 2) * 22 : 0;
  const walkBob = isWalking ? Math.abs(Math.sin(walkFrame * Math.PI * 2)) * 3.5 : Math.sin(walkFrame * Math.PI * 2) * 1.2;
  const shadowScale = isWalking ? 1 - Math.abs(Math.sin(walkFrame * Math.PI * 2)) * 0.15 : 1;

  // Character style based on visitor name/avatar
  const getCharacterTheme = (name: string, avatar: string) => {
    if (name.includes('Bob') || avatar === '🤠') {
      return { hat: 'cowboy', shirt: '#D97706', overalls: '#1E3A8A', skin: '#FDBA74', hair: '#78350F' };
    }
    if (name.includes('Maria') || avatar === '👧') {
      return { hat: 'bow', shirt: '#EC4899', overalls: '#3B82F6', skin: '#FED7AA', hair: '#F59E0B' };
    }
    if (name.includes('Clara') || avatar === '👩‍💼') {
      return { hat: 'beret', shirt: '#9333EA', overalls: '#4B5563', skin: '#FDE047', hair: '#1F2937' };
    }
    if (name.includes('Amélia') || avatar === '👵') {
      return { hat: 'bonnet', shirt: '#10B981', overalls: '#9CA3AF', skin: '#FED7AA', hair: '#E5E7EB' };
    }
    if (name.includes('Tom') || avatar === '👨‍🍳') {
      return { hat: 'chef', shirt: '#F3F4F6', overalls: '#B91C1C', skin: '#FDBA74', hair: '#451A03' };
    }
    // Default Farmer (Greg)
    return { hat: 'straw', shirt: '#EA580C', overalls: '#1D4ED8', skin: '#FDBA74', hair: '#92400E' };
  };

  const theme = getCharacterTheme(visitor.name, visitor.avatar);

  return (
    <React.Fragment>
      {/* Ground Contact Shadow (Soft isometric 2:1 shadow) */}
      <div
        id="npc-visitor-shadow"
        className="absolute pointer-events-none select-none transition-transform duration-75"
        style={{
          left: screenPos.x,
          top: screenPos.y,
          width: 44,
          height: 22,
          position: 'absolute',
          transform: `translate(-50%, -50%) scale(${shadowScale})`,
          zIndex: zIndex - 1,
        }}
      >
        <div
          className="w-full h-full rounded-[50%] blur-[2px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.48) 0%, rgba(15, 23, 42, 0.22) 55%, transparent 85%)',
          }}
        />
      </div>

      {/* Main Isometric NPC Character Entity waiting at the door */}
      <div
        id={`npc-visitor-${visitor.id}`}
        onClick={(e) => {
          e.stopPropagation();
          onOpenVisitor();
        }}
        style={{
          left: screenPos.x,
          top: screenPos.y - walkBob,
          position: 'absolute',
          zIndex: zIndex,
          transform: `translate(-50%, -100%) scaleX(${facingLeft ? -1 : 1})`,
          cursor: phase === 'idle' ? 'pointer' : 'default',
        }}
        className="group select-none flex flex-col items-center pointer-events-auto"
      >
        {/* Floating Interactive Dialogue / Order Balloon in Idle mode */}
        {phase === 'idle' && (
          <div
            style={{
              transform: `scaleX(${facingLeft ? -1 : 1})`,
            }}
            className="absolute -top-12 z-50 flex items-center gap-1 bg-white/95 text-amber-950 px-2.5 py-1 rounded-2xl shadow-xl border-2 border-amber-500 font-extrabold text-[11px] animate-bounce whitespace-nowrap cursor-pointer hover:scale-110 transition-transform"
          >
            <span>{visitor.avatar}</span>
            <span className="text-amber-800">Pedido!</span>
            <span className="text-yellow-600">💬</span>
          </div>
        )}

        {/* Rich Stylized SVG NPC Character */}
        <svg
          viewBox="0 0 60 90"
          className="w-14 h-20 overflow-visible filter drop-shadow-md hover:brightness-110 transition-all"
        >
          {/* Back Arm & Hand with walking swing */}
          <g transform={`rotate(${-walkAngle}, 30, 42)`}>
            <rect x="36" y="40" width="7" height="18" rx="3.5" fill={theme.shirt} />
            <circle cx="39.5" cy="59" r="3.5" fill={theme.skin} />
          </g>

          {/* Left Leg & Boot with walking swing */}
          <g transform={`rotate(${walkAngle}, 24, 62)`}>
            <rect x="20" y="60" width="8" height="18" rx="3" fill={theme.overalls} />
            {/* Boot */}
            <path d="M19 74 Q24 74 27 74 L29 78 Q28 80 20 80 Q18 80 18 76 Z" fill="#451a03" stroke="#291102" strokeWidth="0.8" />
          </g>

          {/* Right Leg & Boot with opposite walking swing */}
          <g transform={`rotate(${-walkAngle}, 36, 62)`}>
            <rect x="32" y="60" width="8" height="18" rx="3" fill={theme.overalls} />
            {/* Boot */}
            <path d="M31 74 Q36 74 39 74 L41 78 Q40 80 32 80 Q30 80 30 76 Z" fill="#451a03" stroke="#291102" strokeWidth="0.8" />
          </g>

          {/* Torso & Overalls */}
          <rect x="20" y="38" width="20" height="26" rx="5" fill={theme.shirt} stroke="#7c2d12" strokeWidth="0.8" />
          {/* Overalls body */}
          <path d="M20 48 L40 48 L40 64 L20 64 Z" fill={theme.overalls} />
          {/* Overall straps */}
          <rect x="22" y="38" width="4" height="14" fill={theme.overalls} />
          <rect x="34" y="38" width="4" height="14" fill={theme.overalls} />
          {/* Brass overall buttons */}
          <circle cx="24" cy="48" r="1.5" fill="#FACC15" />
          <circle cx="36" cy="48" r="1.5" fill="#FACC15" />
          {/* Center chest pocket */}
          <rect x="26" y="51" width="8" height="7" rx="1.5" fill="rgba(0,0,0,0.15)" />

          {/* Neck */}
          <rect x="27" y="33" width="6" height="7" fill={theme.skin} />

          {/* Head */}
          <circle cx="30" cy="24" r="12" fill={theme.skin} stroke="#c2410c" strokeWidth="0.6" />

          {/* Expressive Face: Eyes & Smile */}
          <ellipse cx="26" cy="23" rx="1.8" ry="2.4" fill="#1e1b4b" />
          <ellipse cx="34" cy="23" rx="1.8" ry="2.4" fill="#1e1b4b" />
          <circle cx="26.6" cy="22" r="0.6" fill="#ffffff" />
          <circle cx="34.6" cy="22" r="0.6" fill="#ffffff" />
          {/* Cheerful Rosy Cheeks */}
          <circle cx="23" cy="27" r="2.2" fill="#FB7185" opacity="0.6" />
          <circle cx="37" cy="27" r="2.2" fill="#FB7185" opacity="0.6" />
          {/* Happy Smile */}
          <path d="M26 28 Q30 32 34 28" fill="none" stroke="#7c2d12" strokeWidth="1.2" strokeLinecap="round" />

          {/* Hair & Hat based on character */}
          {theme.hat === 'straw' && (
            <g id="straw-hat">
              {/* Straw Hat Crown */}
              <ellipse cx="30" cy="15" rx="12" ry="7" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
              {/* Straw Hat Brim */}
              <ellipse cx="30" cy="18" rx="19" ry="6" fill="#EAB308" stroke="#A16207" strokeWidth="1" />
              {/* Red Hat Ribbon */}
              <ellipse cx="30" cy="17" rx="12" ry="3" fill="#DC2626" />
            </g>
          )}

          {theme.hat === 'cowboy' && (
            <g id="cowboy-hat">
              {/* Cowboy Hat Crown */}
              <path d="M20 14 Q30 8 40 14 L38 20 L22 20 Z" fill="#78350F" stroke="#451A03" strokeWidth="1" />
              {/* Curled Brim */}
              <ellipse cx="30" cy="19" rx="20" ry="5.5" fill="#92400E" stroke="#451A03" strokeWidth="1" />
            </g>
          )}

          {theme.hat === 'chef' && (
            <g id="chef-hat">
              <path d="M20 18 Q14 10 24 6 Q30 2 36 6 Q46 10 40 18 Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1" />
              <rect x="21" y="16" width="18" height="5" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="0.8" />
            </g>
          )}

          {theme.hat === 'bow' && (
            <g id="girl-hair-bow">
              {/* Hair strands */}
              <path d="M18 20 Q30 10 42 20 Q44 26 42 30 Q30 22 18 30 Z" fill={theme.hair} />
              {/* Pink Bow */}
              <circle cx="21" cy="14" r="3" fill="#EC4899" />
              <circle cx="27" cy="14" r="3" fill="#EC4899" />
              <circle cx="24" cy="14" r="2" fill="#BE185D" />
            </g>
          )}

          {theme.hat === 'bonnet' && (
            <g id="grandma-bonnet">
              <ellipse cx="30" cy="20" rx="14" ry="12" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1" />
              {/* Grandma glasses */}
              <circle cx="26" cy="24" r="3.2" fill="none" stroke="#71717A" strokeWidth="0.8" />
              <circle cx="34" cy="24" r="3.2" fill="none" stroke="#71717A" strokeWidth="0.8" />
              <line x1="29.2" y1="24" x2="30.8" y2="24" stroke="#71717A" strokeWidth="0.8" />
            </g>
          )}

          {/* Front Arm & Hand with walking swing */}
          <g transform={`rotate(${walkAngle}, 24, 42)`}>
            <rect x="17" y="40" width="7" height="18" rx="3.5" fill={theme.shirt} />
            <circle cx="20.5" cy="59" r="3.5" fill={theme.skin} />
            {/* Basket / Item pouch in hand */}
            <g transform="translate(14, 57) scale(0.65)">
              <ellipse cx="10" cy="10" rx="8" ry="6" fill="#B45309" stroke="#78350F" strokeWidth="1" />
              <path d="M4 8 Q10 2 16 8" fill="none" stroke="#78350F" strokeWidth="1.5" />
            </g>
          </g>
        </svg>

        {/* Visitor Name Badge on hover or idle */}
        <div className="bg-amber-950/85 text-yellow-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500 shadow-md whitespace-nowrap mt-[-4px]">
          {visitor.name}
        </div>
      </div>
    </React.Fragment>
  );
};

// Helper to interpolate smoothly along a series of waypoints
function interpolateWaypoints(
  waypoints: { x: number; y: number }[],
  t: number
): { point: { x: number; y: number }; dx: number; dy: number } {
  if (waypoints.length === 0) return { point: { x: 0, y: 0 }, dx: 0, dy: 0 };
  if (waypoints.length === 1 || t <= 0) return { point: waypoints[0], dx: 0, dy: 0 };
  if (t >= 1) {
    const last = waypoints[waypoints.length - 1];
    const prev = waypoints[waypoints.length - 2];
    return { point: last, dx: last.x - prev.x, dy: last.y - prev.y };
  }

  const numSegments = waypoints.length - 1;
  const segmentProgress = t * numSegments;
  const segmentIndex = Math.min(Math.floor(segmentProgress), numSegments - 1);
  const localT = segmentProgress - segmentIndex;

  const p0 = waypoints[segmentIndex];
  const p1 = waypoints[segmentIndex + 1];

  const x = p0.x + (p1.x - p0.x) * localT;
  const y = p0.y + (p1.y - p0.y) * localT;

  return {
    point: { x, y },
    dx: p1.x - p0.x,
    dy: p1.y - p0.y,
  };
}
