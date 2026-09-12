import React, { useState, useEffect, useRef } from 'react';
import { FarmEntity } from '../../types/game';

interface IsoFlyingBeesProps {
  entities: FarmEntity[];
  gridToIso: (gx: number, gy: number) => { x: number; y: number };
  maxBees: number;
  onHarvestNectarFromBush?: (bushId: string) => void;
  onAddNectarToTree?: () => void;
}

interface BeeState {
  id: number;
  state: 'idle' | 'flying_to_bush' | 'harvesting' | 'flying_to_tree';
  progress: number;
  targetBushId: string | null;
  harvestStart: number;
  idleStart?: number;
  angleOffset: number;
  speed: number;
  hasNectar: boolean;
  archHeight: number;
  wobbleAmp: number;
  wobbleFreq: number;
  wobblePhase: number;
}

export const IsoFlyingBees: React.FC<IsoFlyingBeesProps> = React.memo(({
  entities,
  gridToIso,
  maxBees,
  onHarvestNectarFromBush,
  onAddNectarToTree,
}) => {
  const [visualBees, setVisualBees] = useState<BeeState[]>([]);
  const entitiesRef = useRef(entities);
  entitiesRef.current = entities;
  const onHarvestRef = useRef(onHarvestNectarFromBush);
  onHarvestRef.current = onHarvestNectarFromBush;
  const onAddNectarRef = useRef(onAddNectarToTree);
  onAddNectarRef.current = onAddNectarToTree;

  // Initialize and sync bees array
  useEffect(() => {
    if (maxBees <= 0) {
      setVisualBees([]);
      return;
    }
    setVisualBees((prev) => {
      if (prev.length === maxBees) return prev;
      const nextBees = [...prev];
      if (nextBees.length > maxBees) {
        return nextBees.slice(0, maxBees);
      }
      while (nextBees.length < maxBees) {
        nextBees.push({
          id: Math.random(),
          state: 'idle',
          progress: 0,
          targetBushId: null,
          harvestStart: 0,
          idleStart: Date.now() - Math.random() * 12000,
          angleOffset: Math.random() * Math.PI * 2,
          speed: 0.85 + Math.random() * 0.3,
          hasNectar: false,
          archHeight: -25 - Math.random() * 35,
          wobbleAmp: 8 + Math.random() * 14,
          wobbleFreq: 4 + Math.random() * 4,
          wobblePhase: Math.random() * Math.PI * 2,
        });
      }
      return nextBees;
    });
  }, [maxBees]);

  // Self-contained RAF loop running at 30-60 FPS isolated inside this component ONLY
  useEffect(() => {
    if (maxBees <= 0) return;

    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const deltaSec = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      setVisualBees((prevBees) => {
        const currentEntities = entitiesRef.current;
        const tree = currentEntities.find((e) => e.type === 'bee_tree');
        if (!tree || !tree.beeTreeData) return prevBees;

        const currentNectar = tree.beeTreeData.nectarCount;
        const pendingNectar = prevBees.filter((b) => b.hasNectar || b.state === 'harvesting').length;
        const projectedNectar = currentNectar + pendingNectar;

        const activeBushes = currentEntities.filter(
          (e) => e.type === 'nectar_bush' && e.nectarBushData && e.nectarBushData.nectarLeft > 0
        );

        return prevBees.map((bee) => {
          let { state, progress, targetBushId, harvestStart, idleStart, hasNectar } = bee;

          if (state === 'idle') {
            if (!idleStart) {
              idleStart = Date.now();
            }
            const idleTime = Date.now() - idleStart;
            const customIdleDuration = 10000 + (Math.round(bee.id * 10000) % 6000);
            if (idleTime >= customIdleDuration) {
              if (projectedNectar < 100 && activeBushes.length > 0) {
                const chosenBush = activeBushes[Math.floor(Math.random() * activeBushes.length)];
                state = 'flying_to_bush';
                progress = 0;
                targetBushId = chosenBush.id;
                hasNectar = false;
                idleStart = undefined;
              }
            }
          } else if (state === 'flying_to_bush') {
            progress += deltaSec * 0.075 * bee.speed;
            if (progress >= 1) {
              progress = 1;
              state = 'harvesting';
              harvestStart = Date.now();
            }
          } else if (state === 'harvesting') {
            const elapsed = Date.now() - harvestStart;
            if (elapsed >= 10000) {
              const targetBush = currentEntities.find((e) => e.id === targetBushId);
              if (targetBush && targetBush.nectarBushData && targetBush.nectarBushData.nectarLeft > 0) {
                if (onHarvestRef.current && targetBushId) {
                  onHarvestRef.current(targetBushId);
                }
                state = 'flying_to_tree';
                progress = 0;
                hasNectar = true;
              } else {
                if (activeBushes.length > 0) {
                  const newBush = activeBushes[Math.floor(Math.random() * activeBushes.length)];
                  state = 'flying_to_bush';
                  progress = 0;
                  targetBushId = newBush.id;
                  hasNectar = false;
                } else {
                  state = 'flying_to_tree';
                  progress = 0;
                  hasNectar = false;
                }
              }
            }
          } else if (state === 'flying_to_tree') {
            progress += deltaSec * 0.075 * bee.speed;
            if (progress >= 1) {
              progress = 1;
              state = 'idle';
              if (hasNectar) {
                if (onAddNectarRef.current) {
                  onAddNectarRef.current();
                }
              }
              hasNectar = false;
              targetBushId = null;
              idleStart = Date.now();
            }
          }

          return { ...bee, state, progress, targetBushId, harvestStart, idleStart, hasNectar };
        });
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [maxBees]);

  if (maxBees <= 0 || visualBees.length === 0) return null;

  const tree = entities.find((e) => e.type === 'bee_tree');
  if (!tree) return null;
  const treeCenter = gridToIso(tree.x + 1.0, tree.y + 1.0);

  return (
    <div className="pointer-events-none select-none">
      {visualBees.map((bee) => {
        let bx = treeCenter.x;
        let by = treeCenter.y - 45;
        let isFacingRight = true;
        let leanAngle = 0;

        const bush = bee.targetBushId ? entities.find((e) => e.id === bee.targetBushId) : null;
        const bushCenter = bush ? gridToIso(bush.x + 0.5, bush.y + 0.5) : null;

        if (bee.state === 'idle') {
          bx = treeCenter.x + (Math.round(bee.id * 100) % 2 === 0 ? 12 : -12);
          by = treeCenter.y - 48 + (Math.round(bee.id * 100) % 3 === 0 ? 5 : -5);
          isFacingRight = Math.round(bee.id * 100) % 2 === 0;
          leanAngle = 0;
        } else if (bee.state === 'flying_to_bush' && bushCenter) {
          const startX = treeCenter.x;
          const startY = treeCenter.y - 45;
          const endX = bushCenter.x;
          const endY = bushCenter.y - 25;

          const arch = bee.archHeight !== undefined ? bee.archHeight : -35;
          const baseLineX = startX + (endX - startX) * bee.progress;
          const baseLineY = startY + (endY - startY) * bee.progress + Math.sin(bee.progress * Math.PI) * arch;

          const dx = endX - startX;
          const dy = endY - startY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const nx = -dy / dist;
          const ny = dx / dist;

          const amp = bee.wobbleAmp !== undefined ? bee.wobbleAmp : 18;
          const freq = bee.wobbleFreq !== undefined ? bee.wobbleFreq : 6;
          const phase = bee.wobblePhase !== undefined ? bee.wobblePhase : 0;
          const wobbleVal = Math.sin(bee.progress * Math.PI * freq + phase) * amp;

          bx = baseLineX + nx * wobbleVal;
          by = baseLineY + ny * wobbleVal;
          isFacingRight = endX > startX;
          leanAngle = Math.cos(bee.progress * Math.PI * freq + phase) * (amp * 0.9);
        } else if (bee.state === 'harvesting' && bushCenter) {
          bx = bushCenter.x;
          by = bushCenter.y - 25;
          isFacingRight = true;
          leanAngle = 0;
        } else if (bee.state === 'flying_to_tree' && bushCenter) {
          const startX = bushCenter.x;
          const startY = bushCenter.y - 25;
          const endX = treeCenter.x;
          const endY = treeCenter.y - 45;

          const arch = bee.archHeight !== undefined ? bee.archHeight : -35;
          const baseLineX = startX + (endX - startX) * bee.progress;
          const baseLineY = startY + (endY - startY) * bee.progress + Math.sin(bee.progress * Math.PI) * arch;

          const dx = endX - startX;
          const dy = endY - startY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const nx = -dy / dist;
          const ny = dx / dist;

          const amp = bee.wobbleAmp !== undefined ? bee.wobbleAmp : 18;
          const freq = bee.wobbleFreq !== undefined ? bee.wobbleFreq : 6;
          const phase = bee.wobblePhase !== undefined ? bee.wobblePhase : 0;
          const wobbleVal = Math.sin(bee.progress * Math.PI * freq + phase) * amp;

          bx = baseLineX + nx * wobbleVal;
          by = baseLineY + ny * wobbleVal;
          isFacingRight = endX > startX;
          leanAngle = Math.cos(bee.progress * Math.PI * freq + phase) * (amp * 0.9);
        }

        return (
          <div
            key={`bee_${bee.id}`}
            style={{
              position: 'absolute',
              left: bx,
              top: by,
              zIndex: 9999,
              transform: `translate(-50%, -50%) scaleX(${isFacingRight ? 1 : -1}) rotate(${leanAngle}deg)`,
              willChange: 'transform, left, top',
            }}
            className="transition-transform duration-75"
          >
            {/* 3D Glossy Cartoon Bee */}
            <svg width="22" height="18" viewBox="0 0 24 20" fill="none">
              <ellipse cx="12" cy="11" rx="8" ry="6" fill="#FACC15" stroke="#713F12" strokeWidth="1.2" />
              <path d="M 10 5.5 L 10 16.5" stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 14 6 L 14 16" stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="17.5" cy="9.5" r="1.5" fill="#1F2937" />
              <circle cx="18" cy="9" r="0.6" fill="#FFFFFF" />
              <ellipse cx="9" cy="5" rx="4.5" ry="3" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="0.8" opacity="0.85" />
              <ellipse cx="13" cy="4.5" rx="4.5" ry="3" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="0.8" opacity="0.85" />
              {bee.hasNectar && (
                <circle cx="14" cy="14" r="3.2" fill="#F43F5E" stroke="#881337" strokeWidth="1" />
              )}
            </svg>
          </div>
        );
      })}
    </div>
  );
});
