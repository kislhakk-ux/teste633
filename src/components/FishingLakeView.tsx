import React, { useState, useEffect, useRef } from 'react';
import { GameState, ItemId } from '../types/game';
import { ITEMS } from '../constants/gameData';
import { sound } from '../utils/sound';
import { FishingCanvas } from './FishingCanvas';
import { FishCollectionModal } from './FishCollectionModal';
import { HD_BUILDING_SPRITES } from '../constants/buildingSprites';
import { getCutoutSprite } from '../utils/spriteCutout';
import { AdmAuthModal } from './adm/AdmAuthModal';
import { AdmToolbar } from './adm/AdmToolbar';
import {
  loadAdmEntities,
  saveAdmEntities,
  resetAdmEntities,
  loadAdmTerrain,
  saveAdmTerrain,
  resetAdmTerrain,
  checkIsAdmUnlocked,
  setAdmUnlocked,
  TerrainGridMap,
} from '../utils/admStorage';
import { LakeEntity, LakeEntityType, LakeTerrainType } from '../types/adm';
import confetti from 'canvas-confetti';

interface FishingLakeViewProps {
  gameState: GameState;
  onReturnToFarm: () => void;
  onCatchFish: (lureId: ItemId, fishId: ItemId, spotId: string) => void;
}

type MinigamePhase = 'casting' | 'bite' | 'fighting' | 'caught';

export const FishingLakeView: React.FC<FishingLakeViewProps> = ({
  gameState,
  onReturnToFarm,
  onCatchFish,
}) => {
  const [selectedLure, setSelectedLure] = useState<ItemId | null>(null);
  const [activeSpot, setActiveSpot] = useState<string | null>(null);

  // Minigame states
  const [minigamePhase, setMinigamePhase] = useState<MinigamePhase>('casting');
  const [reelProgress, setReelProgress] = useState(0);
  const [fishPos, setFishPos] = useState({ x: 50, y: 50 });
  const [fishCaught, setFishCaught] = useState<{ id: ItemId; name: string; weight: number; isNewRecord: boolean } | null>(null);
  const [fish3dCutout, setFish3dCutout] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getCutoutSprite(HD_BUILDING_SPRITES.fish_3d).then((res) => {
      if (active) setFish3dCutout(res);
    });
    return () => {
      active = false;
    };
  }, []);

  // Modals
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isLureMakerOpen, setIsLureMakerOpen] = useState(false);
  const [isNetMakerOpen, setIsNetMakerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ADM States & Tools
  const [isAdmAuthOpen, setIsAdmAuthOpen] = useState(false);
  const [isAdmUnlocked, setIsAdmUnlocked] = useState(() => checkIsAdmUnlocked());
  const [isAdmActive, setIsAdmActive] = useState(false);
  const [activeAdmTab, setActiveAdmTab] = useState<'objects' | 'terrain' | 'transform'>('objects');
  const [entities, setEntities] = useState<LakeEntity[]>(() => loadAdmEntities());
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [entityToPlace, setEntityToPlace] = useState<LakeEntityType | null>(null);
  const [terrainMap, setTerrainMap] = useState<TerrainGridMap>(() => loadAdmTerrain());
  const [selectedTiles, setSelectedTiles] = useState<{ x: number; y: number }[]>([]);
  const [isSelectingArea, setIsSelectingArea] = useState(false);

  // ADM Handlers
  const handlePlaceEntityAt = (gx: number, gy: number) => {
    if (!entityToPlace) return;
    const newId = `ent_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newEnt: LakeEntity = {
      id: newId,
      type: entityToPlace,
      x: gx,
      y: gy,
      scale: 1,
    };
    const next = [...entities, newEnt];
    setEntities(next);
    saveAdmEntities(next);
    sound.playPop();
    setToastMessage(`Objeto criado em (${gx}, ${gy})!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDeleteSelectedEntity = () => {
    if (!selectedEntityId) return;
    const next = entities.filter((e) => e.id !== selectedEntityId);
    setEntities(next);
    saveAdmEntities(next);
    setSelectedEntityId(null);
    sound.playTrash?.();
    setToastMessage('Objeto excluído com sucesso!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDuplicateSelectedEntity = () => {
    const current = entities.find((e) => e.id === selectedEntityId);
    if (!current) return;
    const newEnt: LakeEntity = {
      ...current,
      id: `ent_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      x: current.x + 0.5,
      y: current.y + 0.5,
    };
    const next = [...entities, newEnt];
    setEntities(next);
    saveAdmEntities(next);
    setSelectedEntityId(newEnt.id);
    sound.playPop();
    setToastMessage('Objeto duplicado!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleScaleEntity = (delta: number) => {
    if (!selectedEntityId) return;
    const next = entities.map((e) => {
      if (e.id === selectedEntityId) {
        const currentScale = e.scale || 1;
        const newScale = Math.max(0.4, Math.min(3, currentScale + delta));
        return { ...e, scale: parseFloat(newScale.toFixed(2)) };
      }
      return e;
    });
    setEntities(next);
    saveAdmEntities(next);
  };

  const handleFlipEntity = () => {
    if (!selectedEntityId) return;
    const next = entities.map((e) => {
      if (e.id === selectedEntityId) {
        return { ...e, flipH: !e.flipH };
      }
      return e;
    });
    setEntities(next);
    saveAdmEntities(next);
    sound.playPop();
  };

  const handleNudgeEntity = (dx: number, dy: number) => {
    if (!selectedEntityId) return;
    const next = entities.map((e) => {
      if (e.id === selectedEntityId) {
        return {
          ...e,
          x: parseFloat((e.x + dx).toFixed(1)),
          y: parseFloat((e.y + dy).toFixed(1)),
        };
      }
      return e;
    });
    setEntities(next);
    saveAdmEntities(next);
  };

  const handleApplyTerrainToSelected = (type: LakeTerrainType) => {
    if (selectedTiles.length === 0) {
      setToastMessage('Selecione uma área no mapa primeiro!');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }
    const nextMap = { ...terrainMap };
    selectedTiles.forEach((t) => {
      nextMap[`${t.x}_${t.y}`] = type;
    });
    setTerrainMap(nextMap);
    saveAdmTerrain(nextMap);
    sound.playWaterSplash();
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    setToastMessage(`🌊 ${selectedTiles.length} quadrantes transformados com sucesso!`);
    setTimeout(() => setToastMessage(null), 3000);
    setSelectedTiles([]);
  };

  const handleTileClick = (gx: number, gy: number) => {
    setSelectedTiles((prev) => {
      const exists = prev.some((t) => t.x === gx && t.y === gy);
      if (exists) {
        return prev.filter((t) => !(t.x === gx && t.y === gy));
      } else {
        return [...prev, { x: gx, y: gy }];
      }
    });
  };

  const handleTileAreaSelected = (tiles: { x: number; y: number }[]) => {
    setSelectedTiles(tiles);
  };

  const handleClearTileSelection = () => {
    setSelectedTiles([]);
  };

  const handleSelectAllTiles = () => {
    const all: { x: number; y: number }[] = [];
    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        all.push({ x, y });
      }
    }
    setSelectedTiles(all);
    setToastMessage('Todos os 256 quadrantes do lago foram selecionados!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleExpandLakeOutward = () => {
    const nextMap = { ...terrainMap };
    for (let x = 1; x <= 14; x++) {
      for (let y = 1; y <= 14; y++) {
        nextMap[`${x}_${y}`] = 'water';
      }
    }
    setTerrainMap(nextMap);
    saveAdmTerrain(nextMap);
    sound.playWaterSplash();
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });
    setToastMessage('🌊 O Lago foi estendido por toda a bacia central!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResetTerrain = () => {
    const fresh = resetAdmTerrain();
    setTerrainMap(fresh);
    setSelectedTiles([]);
    sound.playSuccess();
    setToastMessage('🔄 Terreno restaurado para o formato padrão!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveAll = () => {
    saveAdmEntities(entities);
    saveAdmTerrain(terrainMap);
    sound.playSuccess();
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    setToastMessage('💾 Cenário e terreno salvos com sucesso no jogo!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResetAll = () => {
    const freshEnt = resetAdmEntities();
    const freshTerr = resetAdmTerrain();
    setEntities(freshEnt);
    setTerrainMap(freshTerr);
    setSelectedTiles([]);
    setSelectedEntityId(null);
    setEntityToPlace(null);
    sound.playSuccess();
    setToastMessage('🔄 Cenário e estruturas restaurados para o padrão Hay Day!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Available lures
  const lureTypes: { id: ItemId; name: string; icon: string; desc: string; rare: string }[] = [
    { id: 'red_lure' as ItemId, name: 'Isca Vermelha', icon: '🪱', desc: 'Isca simples de minhoca. Ideal para tilápias e robalos.', rare: 'Comum' },
    { id: 'green_lure' as ItemId, name: 'Isca Verde', icon: '🐛', desc: 'Isca viva especial. Atrai salmões nobres e trutas douradas.', rare: 'Rara' },
  ];

  const availableLures = lureTypes.filter((lure) => (gameState.inventory[lure.id] || 0) > 0);

  // Welcome starter kit if player has 0 lures so they can immediately test & enjoy fishing
  useEffect(() => {
    const totalLures = (gameState.inventory['red_lure' as ItemId] || 0) + (gameState.inventory['green_lure' as ItemId] || 0);
    if (totalLures === 0 && !gameState.inventory['red_lure' as ItemId]) {
      // Grant 3 starter red lures
      gameState.inventory['red_lure' as ItemId] = 3;
      gameState.inventory['green_lure' as ItemId] = 1;
      setToastMessage('🎁 Você recebeu 3 Iscas Vermelhas e 1 Isca Verde do Guarda do Lago!');
      setTimeout(() => setToastMessage(null), 4500);
    }
  }, [gameState.inventory]);

  // Auto-deselect if selected lure runs out
  useEffect(() => {
    if (selectedLure && (gameState.inventory[selectedLure] || 0) <= 0) {
      setSelectedLure(null);
    }
  }, [gameState.inventory, selectedLure]);

  // Handle Spot Click -> Start Casting
  const handleSpotClick = (spot: { id: string; status: string }) => {
    if (spot.status === 'cooldown') {
      sound.playError();
      setToastMessage('⏳ Este ponto está em descanso. Espere um momento para os peixes voltarem!');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    if (!selectedLure) {
      sound.playError();
      setToastMessage('🎣 Selecione uma isca na sua Caixa de Pesca abaixo primeiro!');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    sound.playWaterSplash();
    setActiveSpot(spot.id);
    setMinigamePhase('casting');
    setReelProgress(0);
    setFishCaught(null);

    // Phase 1: Casting -> Fish approaches -> Bite in 1.4s
    setTimeout(() => {
      sound.playWoodHit();
      setMinigamePhase('bite');

      // Phase 2: Bite -> Start fighting in 0.8s
      setTimeout(() => {
        sound.playWaterSplash();
        setMinigamePhase('fighting');
        setFishPos({ x: 50, y: 50 });
      }, 900);
    }, 1400);
  };

  // Minigame Fish Movement in Fighting Phase
  const fightTimerRef = useRef<any>(null);
  useEffect(() => {
    if (minigamePhase !== 'fighting') {
      if (fightTimerRef.current) clearInterval(fightTimerRef.current);
      return;
    }

    fightTimerRef.current = setInterval(() => {
      setFishPos({
        x: 25 + Math.random() * 50,
        y: 25 + Math.random() * 50,
      });
      // Fish dashes and pulls line
      sound.playReelClick();
    }, 600);

    return () => {
      if (fightTimerRef.current) clearInterval(fightTimerRef.current);
    };
  }, [minigamePhase]);

  // Player reels in by tapping the struggling fish or the reel button
  const handleReelIn = () => {
    if (minigamePhase !== 'fighting') return;

    sound.playReelClick();
    const newProgress = Math.min(100, reelProgress + 25);
    setReelProgress(newProgress);

    if (newProgress >= 100) {
      // FISH CAUGHT!
      sound.playWaterSplash();
      sound.playSuccess();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

      let caughtId: ItemId = 'fish_fillet';
      if (selectedLure === 'green_lure') {
        const r = Math.random();
        if (r > 0.8) caughtId = 'bass';
        else if (r > 0.5) caughtId = 'salmon';
        else if (r > 0.25) caughtId = 'trout';
        else caughtId = 'catfish';
      } else {
        const r = Math.random();
        if (r > 0.85) caughtId = 'trout';
        else if (r > 0.6) caughtId = 'catfish';
        else caughtId = 'fish_fillet';
      }

      const caughtName = ITEMS[caughtId]?.name || 'Filé de Peixe';
      const weight = parseFloat(((Math.random() * 10) + 1.2).toFixed(1));
      const previousMax = gameState.fishCollection?.[caughtId]?.largestWeight || 0;
      const isNewRecord = weight > previousMax;

      setFishCaught({
        id: caughtId,
        name: caughtName,
        weight,
        isNewRecord,
      });
      setMinigamePhase('caught');
    }
  };

  const handleFinishCatch = () => {
    if (!fishCaught || !selectedLure || !activeSpot) return;
    onCatchFish(selectedLure, fishCaught.id, activeSpot);
    setActiveSpot(null);
    setFishCaught(null);
    setSelectedLure(null);
    setMinigamePhase('casting');
  };

  // Craft Lures at Lure Maker
  const handleCraftLure = (lureId: ItemId, costCoins: number) => {
    if (costCoins > 0 && gameState.coins < costCoins) {
      sound.playError();
      setToastMessage('❌ Moedas insuficientes para fabricar esta isca!');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (costCoins > 0) {
      gameState.coins -= costCoins;
    }

    gameState.inventory[lureId] = (gameState.inventory[lureId] || 0) + 1;
    sound.playHarvest();
    sound.playDing();
    setToastMessage(`✅ ${lureId === 'red_lure' ? 'Isca Vermelha' : 'Isca Verde'} fabricada com sucesso!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExpansionUnlock = (name: string, cost: number) => {
    if (gameState.coins < cost) {
      sound.playError();
      setToastMessage(`❌ Você precisa de ${cost} moedas para desbloquear a ${name}!`);
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    gameState.coins -= cost;
    sound.playDing();
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    setToastMessage(`🎉 Incrível! Você expandiu seu lago com a ${name}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const spots = gameState.fishingBoat?.spots || [
    { id: 'spot_1', x: 6, y: 10, status: 'ready' },
    { id: 'spot_2', x: 10, y: 6, status: 'ready' },
    { id: 'spot_3', x: 12, y: 12, status: 'ready' },
    { id: 'spot_4', x: 7, y: 6.5, status: 'ready' },
  ];

  return (
    <div className="absolute inset-0 bg-[#0d47a1] overflow-hidden select-none flex flex-col font-sans">
      {/* Top Header Bar - Hay Day Mountain Lake Header */}
      <div className="absolute top-0 left-0 w-full p-3 sm:p-4 flex justify-between items-center z-30 bg-gradient-to-b from-black/60 via-black/30 to-transparent pointer-events-none">
        {/* Return Button */}
        <button
          onClick={() => {
            sound.playClick();
            onReturnToFarm();
          }}
          className="pointer-events-auto bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-black py-2 px-4 sm:px-5 rounded-2xl shadow-2xl border-2 border-amber-300 active:scale-95 transition-transform flex items-center gap-2 drop-shadow-lg cursor-pointer"
        >
          <span className="text-lg">⬅️</span>
          <span className="text-xs sm:text-sm uppercase tracking-wider">Voltar à Fazenda</span>
        </button>

        {/* Lake Title Banner */}
        <div className="pointer-events-auto bg-gradient-to-b from-amber-800 to-amber-950 px-5 py-2 rounded-2xl border-2 border-amber-400 text-yellow-100 font-black shadow-2xl flex items-center gap-2 drop-shadow-md">
          <span className="text-xl">🎣</span>
          <span className="text-sm sm:text-base tracking-wide uppercase">Lago de Pesca</span>
        </div>

        {/* Right side controls: ADM Button and Collection */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* ADM Mode Button */}
          <button
            onClick={() => {
              sound.playClick();
              if (!isAdmUnlocked) {
                setIsAdmAuthOpen(true);
              } else {
                setIsAdmActive((prev) => !prev);
              }
            }}
            className={`font-black py-2 px-3 sm:px-4 rounded-2xl shadow-2xl border-2 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer ${
              isAdmActive
                ? 'bg-gradient-to-b from-yellow-400 to-amber-600 text-amber-950 border-white ring-4 ring-yellow-300 animate-pulse'
                : 'bg-gradient-to-b from-purple-700 to-indigo-950 hover:from-purple-600 hover:to-indigo-900 text-yellow-200 border-yellow-400'
            }`}
            title="Painel Administrador (Senha: 2412)"
          >
            <span className="text-lg">👑</span>
            <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold">
              {isAdmActive ? 'ADM ATIVO' : 'ADM (2412)'}
            </span>
          </button>

          {/* Fish Collection Book Button */}
          <button
            onClick={() => {
              sound.playClick();
              setIsCollectionModalOpen(true);
            }}
            className="bg-gradient-to-b from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-black py-2 px-4 rounded-2xl shadow-2xl border-2 border-emerald-300 active:scale-95 transition-transform flex items-center gap-2 drop-shadow-lg cursor-pointer"
          >
            <span className="text-lg">📖</span>
            <span className="text-xs sm:text-sm uppercase tracking-wider hidden sm:inline">Coleção</span>
          </button>
        </div>
      </div>

      {/* Floating Lake Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-amber-950/95 text-yellow-200 border-2 border-yellow-400 font-extrabold px-5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-xs text-xs sm:text-sm animate-in fade-in slide-in-from-top-3 duration-200 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3D Lake Environment & Interactive Canvas */}
      <div className="relative flex-1 w-full h-full">
        <FishingCanvas
          spots={spots}
          activeSpot={activeSpot}
          selectedLure={selectedLure}
          onSpotClick={handleSpotClick}
          onReturnToFarm={onReturnToFarm}
          onHutClick={() => {
            sound.playClick();
            setIsCollectionModalOpen(true);
          }}
          onLureMakerClick={() => {
            sound.playClick();
            setIsLureMakerOpen(true);
          }}
          onNetMakerClick={() => {
            sound.playClick();
            setIsNetMakerOpen(true);
          }}
          onExpansionUnlock={handleExpansionUnlock}

          isAdmMode={isAdmActive}
          activeAdmTab={activeAdmTab}
          entities={entities}
          onEntitiesChange={(newEnts) => {
            setEntities(newEnts);
            saveAdmEntities(newEnts);
          }}
          selectedEntityId={selectedEntityId}
          onSelectEntity={(id) => setSelectedEntityId(id)}
          entityToPlace={entityToPlace}
          onPlaceEntityAt={handlePlaceEntityAt}
          terrainMap={terrainMap}
          selectedTiles={selectedTiles}
          onTileClick={handleTileClick}
          onTileAreaSelected={handleTileAreaSelected}
        />
      </div>

      {/* ADM Toolbar & World Builder Controls */}
      {isAdmActive && (
        <AdmToolbar
          activeTab={activeAdmTab}
          setActiveTab={setActiveAdmTab}
          selectedEntity={entities.find((e) => e.id === selectedEntityId) || null}
          entityToPlace={entityToPlace}
          setEntityToPlace={setEntityToPlace}
          onDeleteSelectedEntity={handleDeleteSelectedEntity}
          onDuplicateSelectedEntity={handleDuplicateSelectedEntity}
          onScaleEntity={handleScaleEntity}
          onFlipEntity={handleFlipEntity}
          onNudgeEntity={handleNudgeEntity}
          isSelectingArea={isSelectingArea}
          setIsSelectingArea={setIsSelectingArea}
          selectedTilesCount={selectedTiles.length}
          onApplyTerrainToSelected={handleApplyTerrainToSelected}
          onClearTileSelection={handleClearTileSelection}
          onSelectAllTiles={handleSelectAllTiles}
          onExpandLakeOutward={handleExpandLakeOutward}
          onResetTerrain={handleResetTerrain}
          onSaveAll={handleSaveAll}
          onResetAll={handleResetAll}
          onCloseAdm={() => setIsAdmActive(false)}
        />
      )}

      {/* ADM Authentication Modal (Password: 2412) */}
      <AdmAuthModal
        isOpen={isAdmAuthOpen}
        onClose={() => setIsAdmAuthOpen(false)}
        onSuccess={() => {
          setAdmUnlocked(true);
          setIsAdmUnlocked(true);
          setIsAdmActive(true);
          setIsAdmAuthOpen(false);
          setToastMessage('👑 Modo ADM desbloqueado com sucesso!');
          setTimeout(() => setToastMessage(null), 3500);
        }}
        isAlreadyUnlocked={isAdmUnlocked}
        onLock={() => {
          setAdmUnlocked(false);
          setIsAdmUnlocked(false);
          setIsAdmActive(false);
          setIsAdmAuthOpen(false);
          setToastMessage('🔒 Modo ADM bloqueado.');
          setTimeout(() => setToastMessage(null), 3000);
        }}
      />

      {/* ============================================================ */}
      {/* HAY DAY AUTHENTIC FISHING MINIGAME OVERLAY                    */}
      {/* ============================================================ */}
      {activeSpot && (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
          {/* Phase 1: Casting Float */}
          {minigamePhase === 'casting' && (
            <div className="flex flex-col items-center gap-4 animate-in zoom-in-90 duration-300">
              <div className="relative w-48 h-48 bg-cyan-500/30 rounded-full border-4 border-cyan-300/80 shadow-[0_0_40px_rgba(34,211,238,0.5)] flex items-center justify-center overflow-hidden">
                {/* Concentric ripples */}
                <div className="absolute inset-4 border-2 border-white/60 rounded-full animate-ping" />
                <div className="absolute inset-10 border border-cyan-200 rounded-full animate-pulse" />

                {/* Floating Bobber */}
                <div className="relative animate-bounce text-6xl drop-shadow-xl" style={{ animationDuration: '0.8s' }}>
                  🔴
                </div>
              </div>
              <div className="bg-amber-900/90 text-yellow-200 px-6 py-2 rounded-full border-2 border-amber-400 font-black text-sm uppercase tracking-wider shadow-lg flex items-center gap-2">
                <span className="animate-spin text-base">🎣</span>
                <span>Isca na água... Os peixes estão farejando!</span>
              </div>
            </div>
          )}

          {/* Phase 2: Fish Bites! */}
          {minigamePhase === 'bite' && (
            <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
              <div className="relative w-48 h-48 bg-blue-600/40 rounded-full border-4 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.8)] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-2 border-4 border-yellow-300 rounded-full animate-ping" />
                <div className="text-7xl animate-bounce">💦</div>
              </div>
              <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white px-8 py-3 rounded-full border-4 border-white font-black text-xl uppercase tracking-wider shadow-2xl animate-pulse">
                ⚡ FISGOU! SEGURE A LINHA! ⚡
              </div>
            </div>
          )}

          {/* Phase 3: The Fight & Tension Struggle */}
          {minigamePhase === 'fighting' && (
            <div className="flex flex-col items-center gap-4 max-w-md w-full">
              {/* Instructions */}
              <div className="bg-amber-900/90 text-amber-100 px-5 py-1.5 rounded-full border border-amber-400/80 font-black text-xs uppercase tracking-wider shadow-md">
                Toque no peixe para recolher a linha!
              </div>

              {/* Dynamic Tension Arena */}
              <div className="relative w-72 sm:w-80 h-72 sm:h-80 bg-gradient-to-b from-cyan-900/50 to-blue-950/80 rounded-full border-8 border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.6)] overflow-hidden flex items-center justify-center backdrop-blur-md">
                {/* Water swirls */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.25)_0%,transparent_70%)]" />

                {/* Target Safe Ring */}
                <div className="absolute w-44 h-44 border-4 border-dashed border-cyan-300/60 rounded-full animate-spin" style={{ animationDuration: '10s' }} />

                {/* Struggling Darting Fish Button */}
                <div
                  className="absolute cursor-pointer transition-all duration-300 ease-out hover:scale-125 active:scale-90"
                  style={{
                    left: `${fishPos.x}%`,
                    top: `${fishPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={handleReelIn}
                >
                  <div className="relative flex flex-col items-center">
                    <img
                      src={fish3dCutout || HD_BUILDING_SPRITES.fish_3d}
                      alt="Peixe 3D"
                      className="w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] animate-bounce"
                      style={{
                        mixBlendMode: !fish3dCutout ? 'multiply' : 'normal',
                      }}
                    />
                    <span className="text-xs bg-red-600 text-white font-black px-2.5 py-0.5 rounded-full border border-white shadow-md animate-pulse -mt-1">
                      PUXE!
                    </span>
                  </div>
                </div>

                {/* Water Splash Particles */}
                <div className="absolute inset-x-8 bottom-6 flex justify-between pointer-events-none opacity-60">
                  <span className="text-xl animate-ping">🫧</span>
                  <span className="text-2xl animate-bounce">💦</span>
                  <span className="text-xl animate-ping">🫧</span>
                </div>
              </div>

              {/* Tension Progress Bar */}
              <div className="w-72 sm:w-80 flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-black text-white px-1 drop-shadow">
                  <span>Força do Pescador</span>
                  <span>{reelProgress}%</span>
                </div>
                <div className="w-full h-6 bg-black/60 rounded-full border-2 border-white/60 overflow-hidden shadow-inner p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-green-500 transition-all duration-150 shadow-md"
                    style={{ width: `${reelProgress}%` }}
                  />
                </div>
              </div>

              {/* Reel Button for mobile or desktop ease */}
              <button
                onClick={handleReelIn}
                className="w-72 sm:w-80 bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white font-black py-3 rounded-2xl border-2 border-yellow-200 shadow-2xl active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer text-base uppercase tracking-wider"
              >
                <span>🎣</span>
                <span>RECOLHER LINHA!</span>
              </button>
            </div>
          )}

          {/* Phase 4: Trophy Caught Celebration */}
          {minigamePhase === 'caught' && fishCaught && (
            <div className="flex flex-col items-center bg-gradient-to-b from-amber-100 to-[#fff8e1] border-4 border-amber-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-75 duration-300 relative">
              {/* Header Ribbon */}
              <div className="absolute -top-5 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-black text-sm uppercase tracking-widest px-6 py-2 rounded-full border-2 border-white shadow-xl">
                🎉 PEIXE CAPTURADO!
              </div>

              {/* 3D Fish Trophy Visual */}
              <div className="relative my-3 flex flex-col items-center">
                <div className="absolute -bottom-2 w-32 h-10 bg-amber-950/25 rounded-[50%] blur-sm pointer-events-none" />
                <img
                  src={fish3dCutout || HD_BUILDING_SPRITES.fish_3d}
                  alt={fishCaught.name}
                  className="w-36 h-36 object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)] animate-bounce"
                  style={{
                    mixBlendMode: !fish3dCutout ? 'multiply' : 'normal',
                  }}
                />
              </div>

              {/* Fish Name */}
              <h3 className="text-2xl font-black text-amber-950 text-center tracking-wide mb-1">
                {fishCaught.name}
              </h3>

              {/* Weight Scale */}
              <div className="w-full bg-amber-200/70 border-2 border-amber-400 rounded-2xl p-3 my-3 flex flex-col items-center">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  Balança de Pesca
                </span>
                <span className="text-3xl font-black text-amber-950">
                  {fishCaught.weight} <span className="text-xl font-bold">kg</span>
                </span>
                {fishCaught.isNewRecord && (
                  <span className="bg-yellow-400 text-amber-950 text-[10px] font-black px-2.5 py-0.5 rounded-full mt-1 border border-amber-600 animate-pulse">
                    ⭐ NOVO RECORDE PESSOAL!
                  </span>
                )}
              </div>

              {/* Rewards */}
              <div className="flex gap-4 mb-5 text-sm font-black text-amber-900">
                <span className="bg-amber-300/80 px-3 py-1 rounded-xl border border-amber-400">
                  +25 XP ⭐
                </span>
                <span className="bg-yellow-300/80 px-3 py-1 rounded-xl border border-yellow-400">
                  +1 Peixe Fresco 🐟
                </span>
              </div>

              {/* Collect Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  handleFinishCatch();
                }}
                className="w-full bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-black py-3 rounded-2xl border-2 border-white shadow-xl active:scale-95 transition-transform text-center cursor-pointer text-base tracking-wider uppercase"
              >
                Guardar no Álbum 📖
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* BOTTOM DOCK: HAY DAY TACKLE BOX (Caixa de Iscas)              */}
      {/* ============================================================ */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#271915] via-[#3E2723] to-[#4E342E] border-t-4 border-[#8D6E63] p-3 sm:p-4 flex flex-col items-center z-20 shadow-[0_-12px_24px_rgba(0,0,0,0.6)]">
        <div className="w-full max-w-2xl flex justify-between items-center mb-2 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧰</span>
            <h3 className="text-amber-200 font-black uppercase tracking-wider text-xs sm:text-sm drop-shadow">
              Caixa de Iscas do Pescador
            </h3>
          </div>

          {/* Quick Craft Lures Button */}
          <button
            onClick={() => {
              sound.playClick();
              setIsLureMakerOpen(true);
            }}
            className="bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white text-xs font-black px-3 py-1.5 rounded-xl border border-amber-300 shadow-md active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer"
          >
            <span>⚙️</span>
            <span>Fabricar Iscas</span>
          </button>
        </div>

        {/* Lures Grid */}
        <div className="flex gap-4 items-center justify-center flex-wrap">
          {availableLures.length === 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-black/40 text-amber-100 px-6 py-3 rounded-2xl border border-amber-900/60 text-xs text-center">
              <span>Sua caixa está sem iscas no momento!</span>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsLureMakerOpen(true);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-black px-4 py-1.5 rounded-xl border border-white shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                Fabricar Agora 🎣
              </button>
            </div>
          ) : (
            availableLures.map((lure) => {
              const count = gameState.inventory[lure.id] || 0;
              const isSelected = selectedLure === lure.id;

              return (
                <button
                  key={lure.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedLure(isSelected ? null : lure.id);
                  }}
                  className={`relative flex items-center gap-3 px-4 py-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-400 to-amber-500 border-white scale-105 shadow-[0_0_20px_#FBBF24] z-10'
                      : 'bg-gradient-to-b from-[#6D4C41] to-[#4E342E] border-[#3E2723] hover:border-amber-300/60 hover:scale-[1.02]'
                  }`}
                >
                  <div className="text-3xl sm:text-4xl drop-shadow-md bg-black/20 p-1.5 rounded-xl">
                    {lure.icon}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className={`font-black text-xs sm:text-sm leading-tight ${isSelected ? 'text-amber-950' : 'text-white'}`}>
                      {lure.name}
                    </span>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-900' : 'text-amber-300'}`}>
                      {isSelected ? '✓ SELECIONADA' : 'Toque para usar'}
                    </span>
                  </div>

                  {/* Badge count */}
                  <div className="absolute -top-2.5 -right-2 bg-red-600 text-white font-black text-xs min-w-6 h-6 px-1.5 flex items-center justify-center rounded-full border-2 border-white shadow-lg">
                    {count}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL: LURE MAKER WORKBENCH (Fabricador de Iscas)             */}
      {/* ============================================================ */}
      {isLureMakerOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150 font-sans">
          <div className="bg-[#FFF8E1] w-full max-w-lg rounded-3xl shadow-2xl border-4 border-[#8D6E63] overflow-hidden flex flex-col relative">
            {/* Header */}
            <div className="bg-[#5D4037] p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎣</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black tracking-wide">Fabricador de Iscas</h3>
                  <p className="text-xs text-amber-200">Produza iscas artesanais para o lago</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsLureMakerOpen(false);
                }}
                className="w-9 h-9 bg-red-500 hover:bg-red-400 rounded-full text-white font-bold border-2 border-red-700 shadow-md cursor-pointer flex items-center justify-center active:scale-95"
              >
                ✕
              </button>
            </div>

            {/* Recipes */}
            <div className="p-4 sm:p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
              {/* Recipe 1: Red Lure (Free / Starter) */}
              <div className="bg-white rounded-2xl p-4 border-2 border-[#D7CCC8] shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl bg-amber-100 p-2 rounded-xl border border-amber-200">
                    🪱
                  </div>
                  <div>
                    <h4 className="font-black text-sm sm:text-base text-[#3E2723]">Isca Vermelha (Minhoca)</h4>
                    <p className="text-xs text-stone-600">Isca simples para tilápias, trutas e robalos comuns.</p>
                    <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                      Grátis • Instantânea
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleCraftLure('red_lure' as ItemId, 0)}
                  className="bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-white shadow-md active:scale-95 transition-transform cursor-pointer whitespace-nowrap"
                >
                  Fabricar 🪱
                </button>
              </div>

              {/* Recipe 2: Green Lure (Special) */}
              <div className="bg-white rounded-2xl p-4 border-2 border-[#D7CCC8] shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl bg-emerald-100 p-2 rounded-xl border border-emerald-200">
                    🐛
                  </div>
                  <div>
                    <h4 className="font-black text-sm sm:text-base text-[#3E2723]">Isca Verde (Especial)</h4>
                    <p className="text-xs text-stone-600">Isca premium para salmões, trutas e bagres nobres.</p>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                      Custo: 20 Moedas 🪙
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleCraftLure('green_lure' as ItemId, 20)}
                  className="bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-white shadow-md active:scale-95 transition-transform cursor-pointer whitespace-nowrap"
                >
                  Fabricar (20 🪙)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: NET MAKER (Fabricador de Redes)                       */}
      {/* ============================================================ */}
      {isNetMakerOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150 font-sans">
          <div className="bg-[#FFF8E1] w-full max-w-md rounded-3xl shadow-2xl border-4 border-[#8D6E63] overflow-hidden flex flex-col relative">
            <div className="bg-[#5D4037] p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🕸️</span>
                <div>
                  <h3 className="text-lg font-black tracking-wide">Fabricador de Redes</h3>
                  <p className="text-xs text-amber-200">Teça redes de pesca e armadilhas</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsNetMakerOpen(false);
                }}
                className="w-9 h-9 bg-red-500 hover:bg-red-400 rounded-full text-white font-bold border-2 border-red-700 shadow-md cursor-pointer flex items-center justify-center active:scale-95"
              >
                ✕
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 text-center">
              <div className="text-6xl my-2 animate-bounce">🕸️</div>
              <h4 className="font-black text-amber-950 text-base">Rede de Pesca em Desenvolvimento</h4>
              <p className="text-xs text-stone-600">
                O tear de redes tece malhas resistentes para capturar múltiplos peixes simultaneamente no lago.
              </p>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsNetMakerOpen(false);
                }}
                className="bg-amber-600 text-white font-black py-2.5 rounded-xl border border-amber-800 shadow-md cursor-pointer active:scale-95"
              >
                Entendido!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: FISH COLLECTION BOOK (Álbum de Peixes)                */}
      {/* ============================================================ */}
      {isCollectionModalOpen && (
        <FishCollectionModal
          gameState={gameState}
          onClose={() => setIsCollectionModalOpen(false)}
        />
      )}
    </div>
  );
};
