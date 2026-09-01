import React, { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  GameState,
  FarmEntity,
  ItemId,
  Recipe,
  AnimalType,
  BuildingType,
  DecorationType,
  StorageType,
  TruckOrder,
  FarmVisitor,
} from './types/game';
import {
  CROPS,
  BUILDINGS,
  ANIMAL_PENS,
  ITEMS,
  LEVEL_XP_REQUIREMENTS,
  DECORATIONS,
} from './constants/gameData';
import {
  loadGameState,
  saveGameState,
  generateRandomOrder,
  generateRandomVisitor,
  getStorageUsage,
  getInitialGameState,
} from './utils/storage';
import { sound } from './utils/sound';

import { FarmCanvas } from './components/FarmCanvas';
import { TopBar } from './components/TopBar';
import { ActionRadial } from './components/ActionRadial';
import { BuildingModal } from './components/BuildingModal';
import { OrderBoardModal } from './components/OrderBoardModal';
import { StorageModal } from './components/StorageModal';
import { RoadsideShopModal } from './components/RoadsideShopModal';
import { ShopModal } from './components/ShopModal';
import { LuckyWheelModal } from './components/LuckyWheelModal';
import { VisitorModal } from './components/VisitorModal';
import { LevelUpModal } from './components/LevelUpModal';
import { AchievementsModal } from './components/AchievementsModal';
import { QuickActionToolbar } from './components/QuickActionToolbar';
import { BuildingShowcaseModal } from './components/BuildingShowcaseModal';
import { MultiplayerModal } from './components/MultiplayerModal';
import { multiplayerClient } from './utils/multiplayerClient';
import { MultiplayerOffer, OnlineFarm } from './types/multiplayer';
import { SettingsModal } from './components/SettingsModal';
import { FreeGemsModal } from './components/FreeGemsModal';
import { BeeTreeModal } from './components/BeeTreeModal';
import { LoadingScreen } from './components/LoadingScreen';
import { UnlockParcelModal } from './components/UnlockParcelModal';
import { FishingBoatModal } from './components/FishingBoatModal';
import { DeliveryBoatModal } from './components/DeliveryBoatModal';
import { FishingLakeView } from './components/FishingLakeView';
import { generateForestForParcel } from './utils/forestGen';
import { EXPANSION_PARCELS, ExpansionParcel } from './constants/expansionData';
import { googleSignIn, googleSignOut, loadFarmFromFirestore, saveFarmToFirestore } from './utils/firebase';
import { validatePlacement, findNextAvailablePosition } from './utils/buildingPlacement';

function applyWongamerVip(state: GameState, email?: string): GameState {
  const name = (state.farmName || '').toLowerCase();
  const mail = (email || '').toLowerCase();
  if (
    name.includes('wongamer') ||
    name.includes('kislhakk') ||
    mail.includes('kislhakk') ||
    mail.includes('wongamer')
  ) {
    return {
      ...state,
      level: state.level === 1000 ? 100 : Math.max(state.level || 1, 100),
      coins: Math.max(state.coins || 0, 5000000),
      gems: Math.max(state.gems || 0, 10000),
      siloLevel: Math.max(state.siloLevel || 1, 100),
      barnLevel: Math.max(state.barnLevel || 1, 100),
      fishingBoat: { status: 'repaired' },
      inventory: {
        ...state.inventory,
        land_map: Math.max(state.inventory?.land_map || 0, 50),
        marker_stake: Math.max(state.inventory?.marker_stake || 0, 50),
        brick: Math.max(state.inventory?.brick || 0, 50),
        axe: Math.max(state.inventory?.axe || 0, 50),
        saw: Math.max(state.inventory?.saw || 0, 50),
        dynamite: Math.max(state.inventory?.dynamite || 0, 50),
      },
    };
  }
  return state;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const state = loadGameState();
    let initialEmail = undefined;
    try {
      const saved = localStorage.getItem('hayday_google_user_data');
      if (saved) initialEmail = JSON.parse(saved).email;
    } catch (e) {}
    return applyWongamerVip({ ...state, graphicsStyle: '3d_rendered' }, initialEmail);
  });
  // UID do usuário autenticado (null = ninguém logado)
  const [currentUid, setCurrentUid] = useState<string | null>(null);
  
  // Loading screen states
  const [isLoadingFarm, setIsLoadingFarm] = useState<boolean>(false);
  const [loadingStatusText, setLoadingStatusText] = useState<string>('Carregando sua fazenda');
  const [loadingSubMessage, setLoadingSubMessage] = useState<string>('Buscando seu progresso na nuvem ☁️');
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoadingFadingOut, setIsLoadingFadingOut] = useState<boolean>(false);

  const [selectedEntity, setSelectedEntity] = useState<FarmEntity | null>(null);
  const [activeBuildingModalEntity, setActiveBuildingModalEntity] = useState<FarmEntity | null>(null);
  const [selectedBeeTreeEntity, setSelectedBeeTreeEntity] = useState<FarmEntity | null>(null);
  const [isBeeTreeModalOpen, setIsBeeTreeModalOpen] = useState(false);
  const [isOrderBoardOpen, setIsOrderBoardOpen] = useState(false);
  const [isRoadsideOpen, setIsRoadsideOpen] = useState(false);
  const [roadsideInitialTab, setRoadsideInitialTab] = useState<'stand' | 'newspaper'>('stand');
  const [isMultiplayerModalOpen, setIsMultiplayerModalOpen] = useState(false);
  const [isFreeGemsModalOpen, setIsFreeGemsModalOpen] = useState(false);
  const [isFishingBoatModalOpen, setIsFishingBoatModalOpen] = useState(false);
  const [isDeliveryBoatModalOpen, setIsDeliveryBoatModalOpen] = useState(false);
  const [isFishingLakeMode, setIsFishingLakeMode] = useState(false);
  const [unlockModalParcelId, setUnlockModalParcelId] = useState<string | null>(null);
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [onlineFarms, setOnlineFarms] = useState<OnlineFarm[]>([]);
  const [newspaperOffers, setNewspaperOffers] = useState<MultiplayerOffer[]>([]);
  const [visitingFarm, setVisitingFarm] = useState<OnlineFarm | null>(null);
  const [playerAvatar, setPlayerAvatar] = useState<string>(() => {
    return localStorage.getItem('hayday_player_avatar') || '👨‍🌾';
  });
  const myFarmId = useMemo(() => multiplayerClient.getOrCreateFarmId(), []);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState(false);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isBuildingShowcaseOpen, setIsBuildingShowcaseOpen] = useState(false);
  const [storageModalType, setStorageModalType] = useState<StorageType | null>(null);
  const [levelUpPopupLevel, setLevelUpPopupLevel] = useState<number | null>(null);
  const [isMovingMode, setIsMovingMode] = useState(false);
  const [floatingMessage, setFloatingMessage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [googleUser, setGoogleUser] = useState<{ name?: string; email?: string; imageUrl?: string } | null>(() => {
    const saved = localStorage.getItem('hayday_google_user_data');
    return saved ? JSON.parse(saved) : null;
  });

  // Authentication requirement state
  const [isAuthRequired, setIsAuthRequired] = useState<boolean>(() => {
    return localStorage.getItem('hayday_google_logged_in') !== 'true';
  });

  // Initial cloud restore if session exists in localStorage
  useEffect(() => {
    const isLogged = localStorage.getItem('hayday_google_logged_in') === 'true';
    const savedUserData = localStorage.getItem('hayday_google_user_data');
    if (isLogged && savedUserData) {
      try {
        const parsed = JSON.parse(savedUserData);
        if (parsed.uid) {
          setCurrentUid(parsed.uid);
          setIsLoadingFarm(true);
          setLoadingStatusText('Sincronizando fazenda...');
          setLoadingSubMessage('Carregando seu progresso na nuvem ☁️');
          loadFarmFromFirestore(parsed.uid)
            .then((cloudFarm) => {
              if (cloudFarm) {
                const finalState = applyWongamerVip({ ...cloudFarm, graphicsStyle: '3d_rendered' }, parsed.email);
                setGameState(finalState);
                if (finalState.level === 100 && cloudFarm.level < 100) {
                  saveFarmToFirestore(parsed.uid, finalState);
                }
              }
              setIsLoadingFadingOut(true);
              setTimeout(() => {
                setIsLoadingFarm(false);
                setIsLoadingFadingOut(false);
              }, 400);
            })
            .catch(() => {
              // Graceful fallback to local cached state
              setIsLoadingFarm(false);
            });
        }
      } catch (_) {
        // ignore
      }
    }
  }, []);

  const handlePlayOffline = () => {
    setIsLoadingFarm(false);
    setIsAuthRequired(false);
    showToast('🌾 Bem-vindo à sua Fazenda!');
  };

  // Google Login flow handler — carrega/cria fazenda no Firestore pelo UID
  const handleGoogleLogin = async () => {
    sound.playClick();
    setLoadingError(null);
    setLoadingStatusText('Conectando ao Google...');
    setLoadingSubMessage('Aguardando autenticação segura');
    setIsLoadingFarm(true);
    setIsLoadingFadingOut(false);

    try {
      const firebaseUser = await googleSignIn();

      const uid = firebaseUser.uid;
      const defaultName = firebaseUser.displayName || 'Fazendeiro';
      const avatar = firebaseUser.photoURL || '👨‍🌾';
      const email = firebaseUser.email || '';

      // Atualizar status enquanto busca no Firestore
      setLoadingStatusText('Carregando sua fazenda...');
      setLoadingSubMessage('Buscando progresso no Firestore ☁️');

      // Buscar fazenda no Firestore pelo UID (com timeout interno resiliente de 6s)
      let farmState = await loadFarmFromFirestore(uid);

      if (farmState) {
        // Fazenda existente — carrega dados do Firestore
        const finalState = applyWongamerVip({ ...farmState, graphicsStyle: '3d_rendered' }, email);
        setGameState(finalState);
        setPlayerAvatar(avatar);
        if (finalState.level === 1000 && farmState.level !== 1000) {
          saveFarmToFirestore(uid, finalState);
        }
      } else {
        // Novo usuário — inicializa com nome da conta Google (sem prompt bloqueante)
        const farmName = defaultName.includes(' ') ? `Fazenda de ${defaultName.split(' ')[0]}` : `Fazenda de ${defaultName}`;
        const newState = applyWongamerVip({ ...getInitialGameState(), farmName, graphicsStyle: '3d_rendered' as const }, email);
        setGameState(newState);
        setPlayerAvatar(avatar);
        // Persiste a fazenda nova no Firestore em segundo plano
        saveFarmToFirestore(uid, newState);
      }

      // Registrar UID no state (fonte de verdade para o save)
      setCurrentUid(uid);
      multiplayerClient.setFarmId(uid);

      // Salvar dados de sessão no localStorage (apenas perfil, não o progresso)
      localStorage.setItem('hayday_player_avatar', avatar);
      localStorage.setItem('hayday_google_logged_in', 'true');
      const userData = { uid, name: farmState?.farmName ?? defaultName, email, imageUrl: avatar };
      localStorage.setItem('hayday_google_user_data', JSON.stringify(userData));
      setGoogleUser(userData);

      multiplayerClient.connect(
        farmState?.farmName ?? defaultName,
        farmState?.level ?? 1,
        avatar,
        farmState?.entities ?? [],
        farmState?.roadsideBoxes ?? []
      );

      setLoadingStatusText('Tudo pronto!');
      setLoadingSubMessage('Entrando na sua fazenda...');
      setIsLoadingFadingOut(true);

      setTimeout(() => {
        setIsLoadingFarm(false);
        setIsAuthRequired(false);
        setIsLoadingFadingOut(false);
        showToast(`🌾 Bem-vindo, ${farmState?.farmName ?? defaultName}!`);
      }, 400);
    } catch (err: any) {
      console.error('Google Sign In Error:', err);

      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        // Usuário apenas fechou o popup do Google
        setIsLoadingFarm(false);
        setLoadingError(null);
        return;
      }

      let friendlyMsg = 'Não conseguimos carregar sua fazenda. Verifique sua conexão e tente novamente.';
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
        friendlyMsg = `Domínio (${window.location.hostname}) não está nos domínios autorizados do Firebase Console. Adicione-o em Authentication > Settings > Authorized domains.`;
      }

      setLoadingError(friendlyMsg);
    }
  };

  const handleLogout = async () => {
    try {
      await googleSignOut();
    } catch (e) {
      // ignore
    }
    setCurrentUid(null); // Garante que o save Firestore para imediatamente
    localStorage.removeItem('hayday_google_logged_in');
    localStorage.removeItem('hayday_google_user_data');
    setGoogleUser(null);
    window.location.reload();
  };

  // Trigger floating feedback toast
  const showToast = useCallback((msg: string) => {
    setFloatingMessage(msg);
    setTimeout(() => {
      setFloatingMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  }, []);

  // Salva no localStorage imediatamente (cache local)
  // e no Firestore com debounce de 3s (evitar writes excessivos)
  useEffect(() => {
    saveGameState(gameState);

    if (!currentUid) return;

    const uid = currentUid;
    const timer = setTimeout(() => {
      saveFarmToFirestore(uid, gameState);
    }, 3000);

    return () => clearTimeout(timer);
  }, [gameState, currentUid]);

  // Sync sound settings with SoundManager
  useEffect(() => {
    sound.soundEnabled = gameState.soundEnabled;
    sound.musicEnabled = gameState.musicEnabled;
  }, [gameState.soundEnabled, gameState.musicEnabled]);

  // Connect to Multiplayer Server and listen for Newspaper & Sale updates
  useEffect(() => {
    multiplayerClient.connect(
      gameState.farmName,
      gameState.level,
      playerAvatar,
      gameState.entities,
      gameState.roadsideBoxes
    );

    // Initial fetch of Newspaper offers via REST API for immediate availability
    multiplayerClient.fetchNewspaper().then((offers) => {
      if (Array.isArray(offers) && offers.length > 0) {
        setNewspaperOffers(offers);
      }
    });

    const unsubPresence = multiplayerClient.on('presence', (msg) => {
      setOnlineCount(msg.onlineCount);
      setOnlineFarms(msg.farms);
    });

    const unsubInit = multiplayerClient.on('init', (msg) => {
      setOnlineCount(msg.onlineCount);
      setOnlineFarms(msg.farms);
      setNewspaperOffers(msg.offers);
    });

    const unsubOfferPublished = multiplayerClient.on('offer_published', (offer: MultiplayerOffer) => {
      console.log('[App] Received new offer via WebSocket:', offer);
      setNewspaperOffers((prev) => [offer, ...prev.filter((o) => o.id !== offer.id)]);
      showToast(`📰 Novo anúncio no Jornal: ${offer.count}x ${ITEMS[offer.itemId]?.name || offer.itemId} por ${offer.sellerFarmName}!`);
    });

    const unsubOfferSold = multiplayerClient.on('offer_sold', (msg) => {
      console.log('[App] Received offer_sold via WebSocket:', msg);
      setNewspaperOffers((prev) =>
        prev.map((o) =>
          o.id === msg.offerId
            ? { ...o, isSold: true, buyerFarmName: msg.buyerFarmName }
            : o
        )
      );
    });

    const unsubItemSoldToYou = multiplayerClient.on('item_sold_to_you', (sale) => {
      sound.playCoin();
      confetti({ particleCount: 40, spread: 50 });
      showToast(
        `🎉 Sua caixa #${sale.boxId} foi comprada por ${sale.buyerFarmName}! Toque na Banca para recolher 🪙 ${sale.price}!`
      );
      setGameState((prev) => ({
        ...prev,
        roadsideBoxes: prev.roadsideBoxes.map((b) =>
          b.id === sale.boxId ? { ...b, isSold: true } : b
        ),
      }));
    });

    return () => {
      unsubPresence();
      unsubInit();
      unsubOfferPublished();
      unsubOfferSold();
      unsubItemSoldToYou();
    };
  }, [gameState.farmName, gameState.level, playerAvatar]);

  // Refetch newspaper whenever Roadside Modal opens
  useEffect(() => {
    if (isRoadsideOpen) {
      multiplayerClient.fetchNewspaper().then((offers) => {
        setNewspaperOffers(offers);
      });
    }
  }, [isRoadsideOpen]);

  // Main Simulation Game Loop (Every 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setGameState((prev) => {
        let updated = false;
        let newEntities = [...prev.entities];
        let newInventory = { ...prev.inventory };
        let newStats = { ...prev.stats };

        // 1. Process Building Production Queues
        newEntities = newEntities.map((ent) => {
          if (ent.type === 'building' && ent.buildingData) {
            const bData = ent.buildingData;
            if (bData.queue.length > 0) {
              const activeItem = bData.queue[0];
              const elapsed = (now - activeItem.startedAt) / 1000;

              if (elapsed >= activeItem.durationSeconds) {
                // Completed!
                updated = true;
                const remainingQueue = bData.queue.slice(1);
                // Start next item if exists
                const updatedNextQueue = remainingQueue.map((item, idx) =>
                  idx === 0 ? { ...item, startedAt: now } : item
                );

                return {
                  ...ent,
                  buildingData: {
                    ...bData,
                    queue: updatedNextQueue,
                    completedItems: [...bData.completedItems, activeItem.recipeId],
                  },
                };
              }
            }
          }

          return ent;
        });

        // 2. Process Truck Delivery Completion
        let newTruckDeliveringUntil = prev.truckDeliveringUntil;
        let newCoins = prev.coins;
        let newXp = prev.xp;
        let newOrders = [...prev.orders];

        if (
          prev.truckDeliveringUntil !== null &&
          now >= prev.truckDeliveringUntil
        ) {
          updated = true;
          newTruckDeliveringUntil = null;
          // Find delivering order to reward
          const deliveringOrd = prev.orders.find((o) => o.state === 'delivering');
          if (deliveringOrd) {
            newCoins += deliveringOrd.rewardCoins;
            newXp += deliveringOrd.rewardXp;
            newStats.totalOrdersCompleted += 1;
            newStats.totalCoinsEarned += deliveringOrd.rewardCoins;

            // Replace with brand new order
            newOrders = prev.orders.filter((o) => o.id !== deliveringOrd.id);
            newOrders.push(generateRandomOrder(prev.level));

            sound.playCoin();
            showToast(
              `🚚 Caminhão retornou! +🪙 ${deliveringOrd.rewardCoins} +🌟 ${deliveringOrd.rewardXp} XP`
            );
          }
        }

        // 3. Process Roadside Stand NPC buyers
        let newBoxes = [...prev.roadsideBoxes];
        newBoxes = newBoxes.map((box) => {
          if (box.itemId && !box.isSold && Math.random() < 0.05) {
            updated = true;
            return {
              ...box,
              isSold: true,
              soldAt: now,
            };
          }
          return box;
        });

        // 4. Spawn Farm Visitor every 45 minutes after completion
        let newVisitor = prev.activeVisitor;
        let newNextVisitorTime = prev.nextVisitorAvailableAt;
        if (!newVisitor) {
          const isTimeForVisitor = !newNextVisitorTime || now >= newNextVisitorTime;
          if (isTimeForVisitor) {
            updated = true;
            newVisitor = generateRandomVisitor(prev.level, prev.inventory);
            newNextVisitorTime = null;
          }
        }

        // 5. Process Delivery Boat
        let newDeliveryBoat = prev.deliveryBoat ? { ...prev.deliveryBoat } : undefined;
        if (newDeliveryBoat) {
          if (newDeliveryBoat.status === 'away' && newDeliveryBoat.arrivesAt && now >= newDeliveryBoat.arrivesAt) {
            updated = true;
            newDeliveryBoat.status = 'docked';
            newDeliveryBoat.arrivesAt = undefined;
            newDeliveryBoat.leavesAt = now + 1000 * 60 * 60 * 15; // 15 horas para preencher
            // Gerar caixas baseadas no nível (simples por enquanto)
            const availableCrops: ItemId[] = ['wheat', 'corn', 'soybean', 'sugarcane'];
            const randomItem = () => availableCrops[Math.floor(Math.random() * availableCrops.length)];
            newDeliveryBoat.crates = [
              { id: 'c1', itemId: randomItem(), count: 10 + prev.level * 2, isFilled: false },
              { id: 'c2', itemId: randomItem(), count: 10 + prev.level * 2, isFilled: false },
              { id: 'c3', itemId: randomItem(), count: 10 + prev.level * 2, isFilled: false },
            ];
            sound.playDing();
            showToast('⛴️ O Barco Fluvial chegou! Prepare suas caixas de entrega!');
          } else if (newDeliveryBoat.status === 'docked' && newDeliveryBoat.leavesAt && now >= newDeliveryBoat.leavesAt) {
            updated = true;
            newDeliveryBoat.status = 'away';
            newDeliveryBoat.leavesAt = undefined;
            newDeliveryBoat.arrivesAt = now + 1000 * 60 * 60 * 4; // Retorna em 4 horas
            newDeliveryBoat.crates = [];
            showToast('⛴️ O Barco partiu. Voltará em 4 horas!');
          }
        }

        // Check for XP Level Up
        const getXpRequirement = (lvl: number) => {
          if (LEVEL_XP_REQUIREMENTS[lvl]) return LEVEL_XP_REQUIREMENTS[lvl];
          return Math.round(1000 + lvl * 1500);
        };

        const xpReq = getXpRequirement(prev.level);
        let finalLevel = prev.level;
        let finalGems = prev.gems;
        let finalCoins = newCoins;
        let finalXp = newXp;

        if (finalXp >= xpReq) {
          updated = true;
          finalXp = Math.max(0, finalXp - xpReq);
          finalLevel += 1;
          finalCoins += finalLevel * 100;
          finalGems += 3;
          setLevelUpPopupLevel(finalLevel);
          showToast(`🎉 Nível ${finalLevel} alcançado! Parabéns!`);
        }

        if (!updated) return prev;

        return {
          ...prev,
          entities: newEntities,
          inventory: newInventory,
          coins: finalCoins,
          gems: finalGems,
          level: finalLevel,
          xp: finalXp,
          orders: newOrders,
          truckDeliveringUntil: newTruckDeliveringUntil,
          roadsideBoxes: newBoxes,
          activeVisitor: newVisitor,
          deliveryBoat: newDeliveryBoat,
          stats: newStats,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showToast]);

  // Keep active building modal state synced
  useEffect(() => {
    if (activeBuildingModalEntity) {
      const refreshed = gameState.entities.find(
        (e) => e.id === activeBuildingModalEntity.id
      );
      if (refreshed) {
        setActiveBuildingModalEntity(refreshed);
      }
    }
  }, [gameState.entities, activeBuildingModalEntity]);

  // Storage usage stats
  const siloCap = gameState.siloLevel * 50;
  const barnCap = gameState.barnLevel * 50;
  const siloUsed = useMemo(() => getStorageUsage(gameState.inventory, 'silo').used, [gameState.inventory]);
  const barnUsed = useMemo(() => getStorageUsage(gameState.inventory, 'barn').used, [gameState.inventory]);

  // Check for any ready crops
  const hasHarvestableCrops = useMemo(() => {
    const now = Date.now();
    return gameState.entities.some((e) => {
      if (e.type === 'crop_plot' && e.cropData?.cropId && e.cropData?.plantedAt) {
        const elapsed = (now - e.cropData.plantedAt) / 1000;
        return elapsed >= e.cropData.growDuration;
      }
      return false;
    });
  }, [gameState.entities]);

  // Live Indicators for in-world structures
  const hasFulfillableOrders = useMemo(() => {
    if (!gameState.orders || !Array.isArray(gameState.orders)) return false;
    return gameState.orders.some((ord) => {
      if (!ord || ord.state !== 'available') return false;
      if (!ord.items || !Array.isArray(ord.items) || ord.items.length === 0) return false;
      return ord.items.every(
        (t) => t && (gameState.inventory[t.itemId] || 0) >= t.count
      );
    });
  }, [gameState.orders, gameState.inventory]);

  const hasRoadsideCoinsToCollect = useMemo(() => {
    if (!gameState.roadsideBoxes || !Array.isArray(gameState.roadsideBoxes)) return false;
    return gameState.roadsideBoxes.some((b) => b && b.isSold);
  }, [gameState.roadsideBoxes]);

  const canSpinWheel = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return gameState.lastLuckySpinDate !== todayStr;
  }, [gameState.lastLuckySpinDate]);

  // ================= ACTION HANDLERS =================

  // 1. Plant Crop
  const handlePlantCrop = (entityId: string, cropId: ItemId) => {
    const cropDef = CROPS[cropId];
    if (!cropDef) return;

    sound.playPlant();
    setGameState((prev) => {
      const newEntities = prev.entities.map((e) => {
        if (e.id === entityId && e.type === 'crop_plot') {
          return {
            ...e,
            cropData: {
              cropId,
              plantedAt: Date.now(),
              growDuration: cropDef.growTimeSeconds,
            },
          };
        }
        return e;
      });

      return {
        ...prev,
        entities: newEntities,
      };
    });

    showToast(`🌱 ${cropDef.name} plantado!`);
  };

  // 2. Harvest Single Crop
  const handleHarvestCrop = (entityId: string) => {
    const entity = gameState.entities.find((e) => e.id === entityId);
    if (!entity || !entity.cropData?.cropId) return;

    const cropId = entity.cropData.cropId;
    const cropDef = CROPS[cropId];
    if (!cropDef) return;

    if (siloUsed >= siloCap) {
      sound.playClick();
      showToast('⚠️ Silo cheio! Venda colheitas ou melhore o Silo.');
      return;
    }

    sound.playHarvest();
    const yieldCount = cropDef.harvestYield;

    if (selectedEntity?.id === entityId) {
      setSelectedEntity(null);
    }

    setGameState((prev) => {
      const newEntities = prev.entities.map((e) => {
        if (e.id === entityId) {
          return {
            ...e,
            cropData: { cropId: null, plantedAt: null, growDuration: 0 },
          };
        }
        return e;
      });

      const newInv = {
        ...prev.inventory,
        [cropId]: (prev.inventory[cropId] || 0) + yieldCount,
      };

      const newStats = {
        ...prev.stats,
        totalHarvested: prev.stats.totalHarvested + 1,
      };

      // Progress achievements
      const newAch = prev.achievements.map((a) => {
        if (a.id === 'first_harvest' || a.id === 'master_harvest') {
          return { ...a, current: a.current + 1 };
        }
        return a;
      });

      return {
        ...prev,
        entities: newEntities,
        inventory: newInv,
        xp: prev.xp + cropDef.xp,
        stats: newStats,
        achievements: newAch,
      };
    });

    showToast(`✂️ +${yieldCount} ${cropDef.name}! +${cropDef.xp} XP`);
  };

  // 3. Harvest All Ready Crops (One-tap button)
  const handleHarvestAllReady = () => {
    const now = Date.now();
    let totalHarvested = 0;
    let totalXpGain = 0;

    if (siloUsed >= siloCap) {
      showToast('⚠️ Silo cheio!');
      return;
    }

    sound.playHarvest();

    setGameState((prev) => {
      const newInv = { ...prev.inventory };
      const newEntities = prev.entities.map((e) => {
        if (e.type === 'crop_plot' && e.cropData?.cropId && e.cropData?.plantedAt) {
          const elapsed = (now - e.cropData.plantedAt) / 1000;
          if (elapsed >= e.cropData.growDuration) {
            const cDef = CROPS[e.cropData.cropId];
            if (cDef) {
              newInv[e.cropData.cropId] = (newInv[e.cropData.cropId] || 0) + cDef.harvestYield;
              totalXpGain += cDef.xp;
              totalHarvested += 1;
            }
            return {
              ...e,
              cropData: { cropId: null, plantedAt: null, growDuration: 0 },
            };
          }
        }
        return e;
      });

      const newStats = {
        ...prev.stats,
        totalHarvested: prev.stats.totalHarvested + totalHarvested,
      };

      const newAch = prev.achievements.map((a) => {
        if (a.id === 'first_harvest' || a.id === 'master_harvest') {
          return { ...a, current: a.current + totalHarvested };
        }
        return a;
      });

      return {
        ...prev,
        entities: newEntities,
        inventory: newInv,
        xp: prev.xp + totalXpGain,
        stats: newStats,
        achievements: newAch,
      };
    });

    showToast(`🌾 ${totalHarvested} canteiros colhidos! +${totalXpGain} XP`);
  };

  // 4. Feed Animals
  const handleFeedAnimals = (entityId: string) => {
    const entity = gameState.entities.find((e) => e.id === entityId);
    if (!entity || !entity.animalData) return;

    const penDef = ANIMAL_PENS[entity.animalData.animalType];
    const feedCount = gameState.inventory[penDef.feedId] || 0;
    if (feedCount <= 0) {
      showToast('⚠️ Ração insuficiente!');
      return;
    }

    sound.playPlant();
    setGameState((prev) => {
      let usedFeed = 0;
      const newEntities = prev.entities.map((e) => {
        if (e.id === entityId && e.animalData) {
          const updatedAnimals = e.animalData.animals.map((an) => {
            if (an.fedAt === null && usedFeed < feedCount) {
              usedFeed += 1;
              return { ...an, fedAt: Date.now(), isReady: false };
            }
            return an;
          });
          return {
            ...e,
            animalData: { ...e.animalData, animals: updatedAnimals },
          };
        }
        return e;
      });

      return {
        ...prev,
        entities: newEntities,
        inventory: {
          ...prev.inventory,
          [penDef.feedId]: Math.max(0, (prev.inventory[penDef.feedId] || 0) - usedFeed),
        },
      };
    });

    showToast(`🥣 ${penDef.penName} alimentado!`);
  };

  // 5. Collect Animal Product
  const handleCollectAnimal = (entityId: string, animalIdx: number) => {
    const entity = gameState.entities.find((e) => e.id === entityId);
    if (!entity || !entity.animalData) return;

    const penDef = ANIMAL_PENS[entity.animalData.animalType];
    if (barnUsed >= barnCap) {
      showToast('⚠️ Celeiro cheio! Venda produtos ou melhore o Celeiro.');
      return;
    }

    sound.playAnimal(penDef.type);

    setGameState((prev) => {
      const newEntities = prev.entities.map((e) => {
        if (e.id === entityId && e.animalData) {
          const updatedAnimals = e.animalData.animals.map((an, idx) => {
            if (idx === animalIdx) {
              return { ...an, fedAt: null, isReady: false };
            }
            return an;
          });
          return {
            ...e,
            animalData: { ...e.animalData, animals: updatedAnimals },
          };
        }
        return e;
      });

      const newInv = {
        ...prev.inventory,
        [penDef.produceId]: (prev.inventory[penDef.produceId] || 0) + 1,
      };

      const newStats = {
        ...prev.stats,
        totalAnimalCollected: prev.stats.totalAnimalCollected + 1,
      };

      const newAch = prev.achievements.map((a) => {
        if (a.id === 'animal_friend') {
          return { ...a, current: a.current + 1 };
        }
        return a;
      });

      return {
        ...prev,
        entities: newEntities,
        inventory: newInv,
        xp: prev.xp + penDef.xp,
        stats: newStats,
        achievements: newAch,
      };
    });

    showToast(`✨ +1 ${ITEMS[penDef.produceId]?.name}! +${penDef.xp} XP`);
  };

  // 6. Queue Recipe in Building
  const handleQueueRecipe = (entityId: string, recipe: Recipe) => {
    sound.playQueue();

    setGameState((prev) => {
      const newInv = { ...prev.inventory };
      // Deduct ingredients
      recipe.ingredients.forEach((ing) => {
        newInv[ing.itemId] = Math.max(0, (newInv[ing.itemId] || 0) - ing.count);
      });

      const newEntities = prev.entities.map((e) => {
        if (e.id === entityId && e.buildingData) {
          const isQueueEmpty = e.buildingData.queue.length === 0;
          const newItem = {
            id: 'qi_' + Math.random().toString(36).substring(2, 9),
            recipeId: recipe.id,
            durationSeconds: recipe.produceTimeSeconds,
            startedAt: isQueueEmpty ? Date.now() : 0,
            completed: false,
          };

          return {
            ...e,
            buildingData: {
              ...e.buildingData,
              queue: [...e.buildingData.queue, newItem],
            },
          };
        }
        return e;
      });

      return {
        ...prev,
        entities: newEntities,
        inventory: newInv,
      };
    });

    showToast(`⚙️ ${recipe.name} adicionado à produção!`);
  };

  // 7. Collect Finished Item from Building
  const handleCollectCompletedItem = (entityId: string, index: number) => {
    const entity = gameState.entities.find((e) => e.id === entityId);
    if (!entity || !entity.buildingData) return;

    const itemId = entity.buildingData.completedItems[index];
    if (!itemId) return;

    if (barnUsed >= barnCap) {
      showToast('⚠️ Celeiro cheio!');
      return;
    }

    sound.playDing();

    setGameState((prev) => {
      const newEntities = prev.entities.map((e) => {
        if (e.id === entityId && e.buildingData) {
          const newCompleted = [...e.buildingData.completedItems];
          newCompleted.splice(index, 1);
          return {
            ...e,
            buildingData: {
              ...e.buildingData,
              completedItems: newCompleted,
              totalCrafted: (e.buildingData.totalCrafted || 0) + 1,
            },
          };
        }
        return e;
      });

      const newInv = {
        ...prev.inventory,
        [itemId]: (prev.inventory[itemId] || 0) + 1,
      };

      const newStats = {
        ...prev.stats,
        totalCrafted: prev.stats.totalCrafted + 1,
      };

      const newAch = prev.achievements.map((a) => {
        if (a.id === 'master_chef') {
          return { ...a, current: a.current + 1 };
        }
        return a;
      });

      return {
        ...prev,
        entities: newEntities,
        inventory: newInv,
        xp: prev.xp + 10,
        stats: newStats,
        achievements: newAch,
      };
    });

    showToast(`🍞 +1 ${ITEMS[itemId]?.name} coletado!`);
  };

  // Collect All from building
  const handleCollectAllCompleted = (entityId: string) => {
    const entity = gameState.entities.find((e) => e.id === entityId);
    if (!entity || !entity.buildingData || entity.buildingData.completedItems.length === 0)
      return;

    const count = entity.buildingData.completedItems.length;
    if (barnUsed + count > barnCap) {
      showToast('⚠️ Celeiro sem espaço suficiente!');
      return;
    }

    sound.playDing();

    setGameState((prev) => {
      const newInv = { ...prev.inventory };
      entity.buildingData?.completedItems.forEach((id) => {
        newInv[id] = (newInv[id] || 0) + 1;
      });

      const newEntities = prev.entities.map((e) => {
        if (e.id === entityId && e.buildingData) {
          return {
            ...e,
            buildingData: {
              ...e.buildingData,
              completedItems: [],
              totalCrafted: (e.buildingData.totalCrafted || 0) + count,
            },
          };
        }
        return e;
      });

      return {
        ...prev,
        entities: newEntities,
        inventory: newInv,
        xp: prev.xp + count * 10,
        stats: {
          ...prev.stats,
          totalCrafted: prev.stats.totalCrafted + count,
        },
      };
    });

    showToast(`✨ ${count} produtos coletados!`);
  };

  // 8. Speed Up with Gems
  const handleSpeedUpCrop = (entityId: string, gemsCost: number) => {
    if (gameState.gems < gemsCost) return;
    sound.playDing();
    setGameState((prev) => ({
      ...prev,
      gems: prev.gems - gemsCost,
      entities: prev.entities.map((e) => {
        if (e.id === entityId && e.cropData) {
          return {
            ...e,
            cropData: {
              ...e.cropData,
              plantedAt: Date.now() - e.cropData.growDuration * 1000 - 1000,
            },
          };
        }
        return e;
      }),
    }));
    showToast('⚡ Colheita acelerada!');
  };

  const handleSpeedUpAnimal = (entityId: string, gemsCost: number) => {
    if (gameState.gems < gemsCost) return;
    sound.playDing();
    setGameState((prev) => ({
      ...prev,
      gems: prev.gems - gemsCost,
      entities: prev.entities.map((e) => {
        if (e.id === entityId && e.animalData) {
          return {
            ...e,
            animalData: {
              ...e.animalData,
              animals: e.animalData.animals.map((an) => ({
                ...an,
                fedAt: an.fedAt ? Date.now() - 999999 : null,
              })),
            },
          };
        }
        return e;
      }),
    }));
    showToast('⚡ Animais prontos!');
  };

  const handleSpeedUpBuilding = (entityId: string, gemsCost: number) => {
    if (gameState.gems < gemsCost) return;
    sound.playDing();
    setGameState((prev) => ({
      ...prev,
      gems: prev.gems - gemsCost,
      entities: prev.entities.map((e) => {
        if (e.id === entityId && e.buildingData && e.buildingData.queue.length > 0) {
          const activeItem = e.buildingData.queue[0];
          const remainingQueue = e.buildingData.queue.slice(1);
          return {
            ...e,
            buildingData: {
              ...e.buildingData,
              queue: remainingQueue.map((item, i) =>
                i === 0 ? { ...item, startedAt: Date.now() } : item
              ),
              completedItems: [...e.buildingData.completedItems, activeItem.recipeId],
            },
          };
        }
        return e;
      }),
    }));
    showToast('⚡ Produção acelerada!');
  };

  const handleUnlockQueueSlot = (entityId: string, gemsCost: number) => {
    if (gameState.gems < gemsCost) return;
    sound.playDing();
    setGameState((prev) => ({
      ...prev,
      gems: prev.gems - gemsCost,
      entities: prev.entities.map((e) => {
        if (e.id === entityId && e.buildingData) {
          return {
            ...e,
            buildingData: {
              ...e.buildingData,
              queueSlots: e.buildingData.queueSlots + 1,
            },
          };
        }
        return e;
      }),
    }));
    showToast('🎉 +1 Espaço de fila desbloqueado!');
  };

  // 9. Send Truck Order
  const handleSendOrder = (orderId: string) => {
    const order = gameState.orders.find((o) => o.id === orderId);
    if (!order) return;

    sound.playTruck();

    setGameState((prev) => {
      const newInv = { ...prev.inventory };
      order.items.forEach((it) => {
        newInv[it.itemId] = Math.max(0, (newInv[it.itemId] || 0) - it.count);
      });

      const updatedOrders = prev.orders.map((o) =>
        o.id === orderId ? { ...o, state: 'delivering' as const } : o
      );

      return {
        ...prev,
        inventory: newInv,
        orders: updatedOrders,
        truckDeliveringUntil: Date.now() + 8000, // 8 seconds delivery
      };
    });

    setIsOrderBoardOpen(false);
    showToast('🚚 Caminhão partiu para a entrega!');
  };

  const handleTrashOrder = (orderId: string) => {
    sound.playClick();
    setGameState((prev) => {
      const filtered = prev.orders.filter((o) => o.id !== orderId);
      filtered.push(generateRandomOrder(prev.level));
      return {
        ...prev,
        orders: filtered,
      };
    });
    showToast('🗑️ Pedido descartado! Novo pedido chegou.');
  };

  const handleSpeedUpTruck = (gemsCost: number) => {
    if (gameState.gems < gemsCost) return;
    sound.playDing();
    setGameState((prev) => ({
      ...prev,
      gems: prev.gems - gemsCost,
      truckDeliveringUntil: Date.now() - 100,
    }));
  };

  // 10. Storage Upgrades
  const handleUpgradeStorage = (type: StorageType) => {
    sound.playDing();
    confetti({ particleCount: 60, spread: 60 });

    setGameState((prev) => {
      const newInv = { ...prev.inventory };
      if (type === 'silo') {
        const req = prev.siloLevel * 2;
        newInv.nail = Math.max(0, (newInv.nail || 0) - req);
        newInv.screw = Math.max(0, (newInv.screw || 0) - req);
        return {
          ...prev,
          inventory: newInv,
          siloLevel: prev.siloLevel + 1,
        };
      } else {
        const req = prev.barnLevel * 2;
        newInv.wood_plank = Math.max(0, (newInv.wood_plank || 0) - req);
        newInv.bolt = Math.max(0, (newInv.bolt || 0) - req);
        return {
          ...prev,
          inventory: newInv,
          barnLevel: prev.barnLevel + 1,
        };
      }
    });

    showToast(`🎉 ${type === 'silo' ? 'Silo' : 'Celeiro'} expandido! (+50 capacidade)`);
  };

  // Direct quick sell from storage
  const handleSellItem = (itemId: ItemId, count: number) => {
    const itDef = ITEMS[itemId];
    const earned = (itDef?.basePrice || 5) * count;

    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + earned,
      inventory: {
        ...prev.inventory,
        [itemId]: Math.max(0, (prev.inventory[itemId] || 0) - count),
      },
      stats: {
        ...prev.stats,
        totalCoinsEarned: prev.stats.totalCoinsEarned + earned,
      },
    }));

    showToast(`💰 Vendeu ${count}x ${itDef?.name} por +🪙 ${earned}!`);
  };

  // 11. Roadside Stand Sales & Newspaper (Real-Time Multiplayer)
  const handlePutItemOnSale = (
    boxId: number,
    itemId: ItemId,
    count: number,
    price: number,
    advertised: boolean = true
  ) => {
    setGameState((prev) => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [itemId]: Math.max(0, (prev.inventory[itemId] || 0) - count),
      },
      roadsideBoxes: prev.roadsideBoxes.map((b) =>
        b.id === boxId
          ? {
              ...b,
              itemId,
              count,
              price,
              isSold: false,
              advertised,
            }
          : b
      ),
    }));

    multiplayerClient.publishOffer(boxId, itemId, count, price, advertised);
    setTimeout(() => {
      multiplayerClient.fetchNewspaper().then((offers) => {
        setNewspaperOffers(offers);
      });
    }, 200);

    showToast(
      `🏪 Item colocado à venda${advertised ? ' e anunciado no Jornal Multiplayer!' : '!'}`
    );
  };

  const handleCollectBoxMoney = (boxId: number) => {
    const box = gameState.roadsideBoxes.find((b) => b.id === boxId);
    if (!box || !box.isSold) return;

    sound.playCoin();
    multiplayerClient.collectBox(boxId);

    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + box.price,
      stats: {
        ...prev.stats,
        totalCoinsEarned: prev.stats.totalCoinsEarned + box.price,
      },
      roadsideBoxes: prev.roadsideBoxes.map((b) =>
        b.id === boxId
          ? {
              id: b.id,
              itemId: null,
              count: 0,
              price: 0,
              isSold: false,
              advertised: false,
            }
          : b
      ),
    }));

    showToast(`🪙 +${box.price} moedas coletadas da venda!`);
  };

  const handleBuyNewspaperItem = async (offerId: string) => {
    const offer = newspaperOffers.find((o) => o.id === offerId);
    if (!offer) return;

    if (offer.isSold) {
      showToast('⚠️ Este item já foi vendido!');
      return;
    }

    if (gameState.coins < offer.price) {
      showToast('⚠️ Moedas insuficientes!');
      return;
    }

    const res = await multiplayerClient.buyOffer(offerId);
    if (res.success && res.item) {
      sound.playCoin();
      confetti({ particleCount: 50, spread: 60 });
      const itDef = ITEMS[res.item.itemId as ItemId];

      setGameState((prev) => ({
        ...prev,
        coins: prev.coins - res.item.price,
        inventory: {
          ...prev.inventory,
          [res.item.itemId]: (prev.inventory[res.item.itemId as ItemId] || 0) + res.item.count,
        },
        stats: {
          ...prev.stats,
          totalCoinsEarned: prev.stats.totalCoinsEarned,
        },
      }));

      showToast(`🛒 Comprou ${res.item.count}x ${itDef?.name || res.item.itemId} de ${res.item.sellerFarmName}!`);
    } else {
      showToast(`⚠️ ${res.error || 'Não foi possível comprar o item'}`);
    }
  };

  // Visit Neighbor Farm
  const handleVisitFarm = async (farmId: string) => {
    if (farmId === myFarmId) {
      showToast('Você já está na sua própria fazenda!');
      return;
    }

    if (farmId.startsWith('npc_')) {
      const npcFarm: OnlineFarm = {
        farmId,
        farmName:
          farmId === 'npc_greg'
            ? 'Fazenda do Greg'
            : farmId === 'npc_ze'
            ? 'Recanto do Tio Zé'
            : 'Fazenda Vizinha',
        level: 50,
        avatar: farmId === 'npc_greg' ? '🧔‍♂️' : '👨‍🌾',
        isOnline: true,
        lastSeen: Date.now(),
        likes: 120,
        offersCount: 2,
        entities: gameState.entities,
        roadsideBoxes: [
          { id: 1, itemId: 'wood_plank', count: 2, price: 320, isSold: false, advertised: true },
          { id: 2, itemId: 'nail', count: 2, price: 320, isSold: false, advertised: true },
          { id: 3, itemId: 'bolt', count: 1, price: 160, isSold: false, advertised: true },
        ],
      };
      setVisitingFarm(npcFarm);
      showToast(`🏡 Visitando ${npcFarm.farmName}!`);
      return;
    }

    const farm = await multiplayerClient.fetchFarm(farmId);
    if (farm) {
      setVisitingFarm(farm);
      showToast(`🏡 Visitando ${farm.farmName}!`);
    } else {
      showToast('⚠️ Não foi possível carregar a fazenda vizinha.');
    }
  };

  const handleLeaveVisiting = () => {
    setVisitingFarm(null);
    showToast('🏡 De volta à sua fazenda!');
  };

  // 14. Limpeza de Obstáculos e Árvores Mortas
  const handleRemoveDeadEntity = (entityId: string) => {
    const entity = gameState.entities.find((e) => e.id === entityId);
    if (!entity) return;

    let toolRequired: ItemId | null = null;
    let toolName = '';

    if (entity.type === 'dead_tree') {
      toolRequired = 'saw'; toolName = 'Serrote';
    } else if (entity.type === 'dead_bush') {
      toolRequired = 'axe'; toolName = 'Machado';
    } else if (entity.type === 'obstacle') {
      const oType = entity.obstacleData?.type;
      if (oType === 'pine' || oType === 'bush') { toolRequired = 'axe'; toolName = 'Machadinha'; }
      if (oType === 'oak') { toolRequired = 'saw'; toolName = 'Serrote'; }
      if (oType === 'rock') { toolRequired = 'dynamite'; toolName = 'Dinamite'; }
    }

    if (toolRequired) {
      if ((gameState.inventory[toolRequired] || 0) < 1) {
        showToast(`⚠️ Você precisa de 1x ${toolName} para limpar isso!`);
        return;
      }
      
      // Consume tool & animate
      sound.playClick();
      
      setGameState((prev) => {
        const newInv = { ...prev.inventory };
        newInv[toolRequired!] = Math.max(0, (newInv[toolRequired!] || 0) - 1);
        
        return {
          ...prev,
          inventory: newInv,
          entities: prev.entities.map(e => e.id === entityId ? { ...e, isCutting: true } : e)
        };
      });

      // Remove after animation
      setTimeout(() => {
        sound.playDing();
        setGameState(prev => ({
          ...prev,
          entities: prev.entities.filter(e => e.id !== entityId),
          xp: prev.xp + 5 // Little XP reward for cleaning
        }));
      }, 1500);
    }
  };

  const handleLikeVisitingFarm = async () => {
    if (visitingFarm) {
      const newLikes = await multiplayerClient.likeFarm(visitingFarm.farmId);
      setVisitingFarm((p) => (p ? { ...p, likes: newLikes } : null));
      showToast('❤️ Você curtiu esta fazenda!');
    }
  };

  const handleUpdateProfile = (name: string, avatar: string) => {
    setGameState((p) => ({ ...p, farmName: name }));
    setPlayerAvatar(avatar);
    localStorage.setItem('hayday_player_avatar', avatar);
    multiplayerClient.sendRegister(gameState.entities, gameState.roadsideBoxes);
    showToast('✅ Perfil da sua fazenda atualizado!');
  };

  // 12. Farm Visitor Deal (45 minutes cooldown after completion)
  const handleAcceptVisitorDeal = (visitor: FarmVisitor) => {
    const nextSpawnTime = Date.now() + 45 * 60 * 1000; // 45 minutes

    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + visitor.offeredCoins,
      inventory: {
        ...prev.inventory,
        [visitor.requestedItem]: Math.max(
          0,
          (prev.inventory[visitor.requestedItem] || 0) - visitor.count
        ),
      },
      activeVisitor: null,
      nextVisitorAvailableAt: nextSpawnTime,
      stats: {
        ...prev.stats,
        totalCoinsEarned: prev.stats.totalCoinsEarned + visitor.offeredCoins,
      },
    }));

    setIsVisitorModalOpen(false);
    showToast(`🤝 Negócio fechado com ${visitor.name}! +🪙 ${visitor.offeredCoins}`);
  };

  const handleRefuseVisitorDeal = () => {
    const nextSpawnTime = Date.now() + 45 * 60 * 1000; // 45 minutes
    setGameState((prev) => ({
      ...prev,
      activeVisitor: null,
      nextVisitorAvailableAt: nextSpawnTime,
    }));
    setIsVisitorModalOpen(false);
    showToast('👋 Visitante foi embora. Próximo visitante em 45 minutos.');
  };

  // 13. Claim Wheel Reward
  const handleClaimWheelReward = (reward: {
    type: 'coins' | 'gems' | 'item';
    amount: number;
    itemId?: ItemId;
  }) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setGameState((prev) => {
      const newInv = { ...prev.inventory };
      let newCoins = prev.coins;
      let newGems = prev.gems;

      if (reward.type === 'coins') newCoins += reward.amount;
      if (reward.type === 'gems') newGems += reward.amount;
      if (reward.type === 'item' && reward.itemId) {
        newInv[reward.itemId] = (newInv[reward.itemId] || 0) + reward.amount;
      }

      return {
        ...prev,
        coins: newCoins,
        gems: newGems,
        inventory: newInv,
        lastLuckySpinDate: todayStr,
        stats: {
          ...prev.stats,
          wheelSpins: prev.stats.wheelSpins + 1,
        },
      };
    });
  };

  const handleUnlockParcel = (parcel: ExpansionParcel) => {
    setGameState((prev) => {
      const next = { ...prev };
      
      // Deduct coins
      next.coins -= parcel.cost.coins;
      
      // Deduct items
      const newInventory = { ...next.inventory };
      Object.entries(parcel.cost.items).forEach(([itemId, qty]) => {
        newInventory[itemId as ItemId] = Math.max(0, (newInventory[itemId as ItemId] || 0) - (qty as number));
      });
      next.inventory = newInventory;

      // Add parcel to unlocked list
      next.unlockedParcelIds = [...(next.unlockedParcelIds || []), parcel.id];

      // Convert the visual forest into real interactable FarmEntity obstacles
      const forestItems = generateForestForParcel(parcel);
      const newObstacles: FarmEntity[] = forestItems.map((item, index) => ({
        id: `obstacle_${parcel.id}_${index}`,
        x: item.x,
        y: item.y,
        width: 1,
        height: 1,
        type: 'obstacle',
        obstacleData: { type: item.type },
      }));

      next.entities = [...next.entities, ...newObstacles];

      // Add a small XP reward for expanding
      const xpReward = 50 * parcel.requiredLevel;
      
      sound.playLevelUp(); // Special sound effect
      
      setUnlockModalParcelId(null);
      
      return checkLevelUp({ ...next, xp: next.xp + xpReward });
    });
  };

  const handleStartBoatRepair = (costCoins: number) => {
    setGameState((prev) => {
      const next = { ...prev };
      next.coins -= costCoins;
      next.fishingBoat = {
        status: 'repairing',
        repairStartedAt: Date.now(),
      };
      setIsFishingBoatModalOpen(false);
      showToast('🔨 O reparo do barco começou! Volte em 36 horas.');
      return next;
    });
  };

  const handleSpeedUpBoatRepair = (costGems: number) => {
    setGameState((prev) => {
      const next = { ...prev };
      next.gems -= costGems;
      next.fishingBoat = {
        status: 'repaired',
      };
      setIsFishingBoatModalOpen(false);
      showToast('⛵ Barco restaurado! A área de pesca está liberada!');
      return next;
    });
  };

  const handleFillDeliveryCrate = (crateId: string) => {
    setGameState((prev) => {
      const boat = prev.deliveryBoat;
      if (!boat || boat.status !== 'docked') return prev;

      const newCrates = [...boat.crates];
      const crateIndex = newCrates.findIndex((c) => c.id === crateId);
      if (crateIndex === -1) return prev;

      const crate = newCrates[crateIndex];
      const inventoryCount = prev.inventory[crate.itemId] || 0;

      if (inventoryCount < crate.count) {
        showToast('⚠️ Itens insuficientes para encher a caixa!');
        return prev;
      }

      // Consume items
      const newInv = { ...prev.inventory };
      newInv[crate.itemId] -= crate.count;
      
      newCrates[crateIndex] = { ...crate, isFilled: true };

      sound.playDing();
      showToast(`📦 Caixa cheia! +${crate.count * 10} XP`);

      return {
        ...prev,
        inventory: newInv,
        deliveryBoat: {
          ...boat,
          crates: newCrates,
        },
        xp: prev.xp + crate.count * 10,
      };
    });
  };

  const handleSendDeliveryBoat = () => {
    setGameState((prev) => {
      const boat = prev.deliveryBoat;
      if (!boat || boat.status !== 'docked') return prev;

      const allFilled = boat.crates.every((c) => c.isFilled);
      let bonusXp = 0;
      let bonusCoins = 0;

      if (allFilled) {
        bonusXp = 500 * prev.level; // Big XP bonus
        bonusCoins = 1000;
        showToast(`🎉 Barco enviado com sucesso! +${bonusXp} XP, +${bonusCoins} Moedas!`);
        sound.playLevelUp();
      } else {
        showToast('⛴️ O Barco partiu incompleto. Volte em 4 horas!');
        sound.playDing();
      }

      setIsDeliveryBoatModalOpen(false);

      return {
        ...prev,
        coins: prev.coins + bonusCoins,
        xp: prev.xp + bonusXp,
        deliveryBoat: {
          status: 'away',
          arrivesAt: Date.now() + 1000 * 60 * 60 * 4, // Volta em 4 horas
          crates: [],
        },
      };
    });
  };

  const handleCatchFish = (lureId: ItemId, fishId: ItemId) => {
    setGameState((prev) => {
      const next = { ...prev };
      // Remove 1 lure
      next.inventory[lureId] = (next.inventory[lureId] || 0) - 1;
      if (next.inventory[lureId]! <= 0) {
        delete next.inventory[lureId];
      }
      // Add 1 fish
      next.inventory[fishId] = (next.inventory[fishId] || 0) + 1;
      
      // Some XP for catching fish
      const xpReward = fishId === 'salmon' ? 25 : 15;
      
      return checkLevelUp({ ...next, xp: next.xp + xpReward });
    });
  };

  // 14. Shop Buy & Place Entities (using centralized space occupation validator)
  const handleBuyCropPlot = () => {
    const currentPlots = gameState.entities.filter((e) => e.type === 'crop_plot').length;
    const cost = 20 + currentPlots * 10;
    if (gameState.coins < cost) return;

    const pos = findNextAvailablePosition(1, 1, gameState.entities, 0, gameState.unlockedParcelIds);
    const newPlot: FarmEntity = {
      id: 'plot_' + Date.now(),
      x: pos.x,
      y: pos.y,
      width: 1,
      height: 1,
      type: 'crop_plot',
      cropData: { cropId: null, plantedAt: null, growDuration: 0 },
    };

    setGameState((prev) => ({
      ...prev,
      coins: prev.coins - cost,
      entities: [...prev.entities, newPlot],
    }));

    showToast('🌱 Novo Canteiro construído na fazenda!');
  };

  const handleBuyAnimalPen = (animalType: AnimalType) => {
    const penDef = ANIMAL_PENS[animalType];
    if (gameState.coins < penDef.cost) return;

    const pos = findNextAvailablePosition(2, 2, gameState.entities, 0, gameState.unlockedParcelIds);
    const newPen: FarmEntity = {
      id: `${animalType}_pen_` + Date.now(),
      x: pos.x,
      y: pos.y,
      width: 2,
      height: 2,
      type: 'animal_pen',
      animalData: {
        animalType,
        animals: [
          { id: 'a1', fedAt: null, isReady: false },
          { id: 'a2', fedAt: null, isReady: false },
          { id: 'a3', fedAt: null, isReady: false },
        ],
      },
    };

    setGameState((prev) => ({
      ...prev,
      coins: prev.coins - penDef.cost,
      entities: [...prev.entities, newPen],
    }));

    showToast(`🐮 Novo ${penDef.penName} construído!`);
  };

  const handleBuyBuilding = (bType: BuildingType) => {
    const bDef = BUILDINGS[bType];
    if (gameState.coins < bDef.cost) return;

    const pos = findNextAvailablePosition(2, 2, gameState.entities, 0, gameState.unlockedParcelIds);
    const newBuilding: FarmEntity = {
      id: `${bType}_` + Date.now(),
      x: pos.x,
      y: pos.y,
      width: 2,
      height: 2,
      type: 'building',
      buildingData: {
        buildingType: bType,
        queueSlots: bDef.baseQueueSlots,
        queue: [],
        completedItems: [],
      },
    };

    setGameState((prev) => ({
      ...prev,
      coins: prev.coins - bDef.cost,
      entities: [...prev.entities, newBuilding],
    }));

    showToast(`🏭 Nova ${bDef.name} construída na fazenda!`);
  };

  const handleBuyBeeTree = () => {
    const alreadyHas = gameState.entities.some((e) => e.type === 'bee_tree');
    if (alreadyHas) {
      showToast('⚠️ Você já possui uma Árvore de Abelhas na fazenda (Máximo: 1)!');
      return;
    }
    if (gameState.level < 30) {
      showToast('🔒 A Árvore de Abelhas é desbloqueada no Nível 30!');
      return;
    }
    if (gameState.coins < 20000) {
      showToast('⚠️ Moedas insuficientes (Custo: 20.000 moedas)!');
      return;
    }

    const pos = findNextAvailablePosition(2, 2, gameState.entities, 0, gameState.unlockedParcelIds);
    const newTree: FarmEntity = {
      id: 'bee_tree_' + Date.now(),
      x: pos.x,
      y: pos.y,
      width: 2,
      height: 2,
      type: 'bee_tree',
      beeTreeData: {
        stage: 1,
        beesCount: 5,
        nectarCount: 0,
        maxNectar: 100,
        lastHarvestAt: Date.now(),
      },
    };

    setGameState((prev) => ({
      ...prev,
      coins: prev.coins - 20000,
      entities: [...prev.entities, newTree],
    }));

    setIsShopOpen(false);
    sound.playCoin();
    confetti({ particleCount: 70, spread: 70 });
    showToast('🌳🐝 Árvore de Abelhas construída na fazenda!');
  };

  const handleBuyNectarBush = () => {
    if (gameState.level < 30) {
      showToast('🔒 O Arbusto de Néctar é desbloqueado no Nível 30!');
      return;
    }
    if (gameState.coins < 1200) {
      showToast('⚠️ Moedas insuficientes (Custo: 1.200 moedas)!');
      return;
    }

    const pos = findNextAvailablePosition(1, 1, gameState.entities, 0, gameState.unlockedParcelIds);
    const newBush: FarmEntity = {
      id: 'nectar_bush_' + Date.now(),
      x: pos.x,
      y: pos.y,
      width: 1,
      height: 1,
      type: 'nectar_bush',
      nectarBushData: {
        nectarLeft: 200,
        maxNectar: 200,
        isWilted: false,
      },
    };

    setGameState((prev) => ({
      ...prev,
      coins: prev.coins - 1200,
      entities: [...prev.entities, newBush],
    }));

    setIsShopOpen(false);
    sound.playCoin();
    confetti({ particleCount: 50, spread: 50 });
    showToast('🌺 Arbusto de Néctar plantado na fazenda! (200 Néctar)');
  };

  const handleOpenBeeTree = (entity: FarmEntity) => {
    // Find latest entity state from gameState
    const latest = gameState.entities.find((e) => e.id === entity.id) || entity;
    setSelectedBeeTreeEntity(latest);
    setIsBeeTreeModalOpen(true);
  };

  const handleHarvestNectar = (entityId: string) => {
    const treeEntity = gameState.entities.find((e) => e.id === entityId);
    if (!treeEntity || !treeEntity.beeTreeData || treeEntity.beeTreeData.nectarCount <= 0) return;

    const count = treeEntity.beeTreeData.nectarCount;
    const xpGained = count * 2;

    setGameState((prev) => ({
      ...prev,
      xp: prev.xp + xpGained,
      inventory: {
        ...prev.inventory,
        nectar: (prev.inventory.nectar || 0) + count,
      },
      entities: prev.entities.map((e) =>
        e.id === entityId && e.beeTreeData
          ? {
              ...e,
              beeTreeData: {
                ...e.beeTreeData,
                nectarCount: 0,
                lastHarvestAt: Date.now(),
              },
            }
          : e
      ),
    }));

    setSelectedBeeTreeEntity((prev) =>
      prev && prev.id === entityId && prev.beeTreeData
        ? {
            ...prev,
            beeTreeData: {
              ...prev.beeTreeData,
              nectarCount: 0,
              lastHarvestAt: Date.now(),
            },
          }
        : prev
    );

    sound.playDing();
    showToast(`🍯 Colheu ${count}x Néctar Floral! +${xpGained} XP`);
  };

  const handleUpgradeBeeTreeStage = (entityId: string, cost: number) => {
    if (gameState.coins < cost) {
      showToast('⚠️ Moedas insuficientes para evoluir a árvore!');
      return;
    }

    setGameState((prev) => {
      const updatedEntities = prev.entities.map((e) => {
        if (e.id === entityId && e.beeTreeData && e.beeTreeData.stage < 5) {
          const newStage = e.beeTreeData.stage + 1;
          return {
            ...e,
            beeTreeData: {
              ...e.beeTreeData,
              stage: newStage,
              beesCount: newStage * 5,
            },
          };
        }
        return e;
      });

      return {
        ...prev,
        coins: prev.coins - cost,
        entities: updatedEntities,
      };
    });

    setSelectedBeeTreeEntity((prev) => {
      if (prev && prev.id === entityId && prev.beeTreeData && prev.beeTreeData.stage < 5) {
        const newStage = prev.beeTreeData.stage + 1;
        return {
          ...prev,
          beeTreeData: {
            ...prev.beeTreeData,
            stage: newStage,
            beesCount: newStage * 5,
          },
        };
      }
      return prev;
    });

    sound.playDing();
    confetti({ particleCount: 60, spread: 60 });
    showToast('⭐ Árvore de Abelhas evoluída! +5 Abelhas ativas adicionadas!');
  };

  const handleQuickPlantCrop = (plotId: string, cropId: string) => {
    const currentQty = gameState.inventory[cropId as ItemId] || 0;
    if (currentQty <= 0) return;

    if (selectedEntity?.id === plotId) {
      setSelectedEntity(null);
    }

    setGameState((prev) => {
      const updatedEntities = prev.entities.map((ent) => {
        if (ent.id === plotId && ent.type === 'crop_plot') {
          const cropDef = CROPS[cropId as ItemId];
          if (!cropDef) return ent;
          return {
            ...ent,
            cropData: {
              cropId: cropId as ItemId,
              plantedAt: Date.now(),
              growDuration: cropDef.growTimeSeconds, // ← fixed: was growTime
            },
          };
        }
        return ent;
      });

      const updatedInventory = {
        ...prev.inventory,
        [cropId]: Math.max(0, currentQty - 1),
      };

      return {
        ...prev,
        entities: updatedEntities,
        inventory: updatedInventory,
      };
    });
    sound.playPlant();
  };

  /**
   * Bulk-plant multiple plots in a single state update.
   * Respects available seed quantity — never goes negative.
   * Each entry: { plotId: string; cropId: ItemId }
   */
  const handleBulkPlantCrop = (entries: { plotId: string; cropId: ItemId }[]) => {
    if (!entries.length) return;

    // Count how many seeds of each type we need vs have
    const needed: Record<string, number> = {};
    entries.forEach(({ cropId }) => {
      needed[cropId] = (needed[cropId] || 0) + 1;
    });

    // Cap per-crop at available qty
    const available: Record<string, number> = {};
    for (const cropId of Object.keys(needed)) {
      available[cropId] = Math.min(
        needed[cropId],
        gameState.inventory[cropId as ItemId] || 0
      );
    }

    // Build the plant set respecting caps (first-come-first-served)
    const used: Record<string, number> = {};
    const toPlant: { plotId: string; cropId: ItemId }[] = [];
    for (const entry of entries) {
      const cap = available[entry.cropId] || 0;
      const soFar = used[entry.cropId] || 0;
      if (soFar < cap) {
        toPlant.push(entry);
        used[entry.cropId] = soFar + 1;
      }
    }

    if (!toPlant.length) return;

    const now = Date.now();
    setGameState((prev) => {
      const plantIds = new Set(toPlant.map((e) => e.plotId));
      const plotCrop: Record<string, ItemId> = {};
      toPlant.forEach(({ plotId, cropId }) => { plotCrop[plotId] = cropId; });

      const newInventory = { ...prev.inventory };
      const newEntities = prev.entities.map((ent) => {
        if (ent.type !== 'crop_plot' || !plantIds.has(ent.id)) return ent;
        const cropId = plotCrop[ent.id];
        const cropDef = CROPS[cropId];
        if (!cropDef) return ent;
        newInventory[cropId] = Math.max(0, (newInventory[cropId] || 0) - 1);
        return {
          ...ent,
          cropData: {
            cropId,
            plantedAt: now,
            growDuration: cropDef.growTimeSeconds,
          },
        };
      });

      return { ...prev, entities: newEntities, inventory: newInventory };
    });

    sound.playPlant();
    const names = [...new Set(toPlant.map(({ cropId }) => CROPS[cropId]?.name || cropId))];
    showToast(`🌱 ${toPlant.length} canteiro${toPlant.length > 1 ? 's' : ''} plantado${toPlant.length > 1 ? 's' : ''}! (${names.join(', ')})`);
  };


  const handleBuyDecoration = (decType: DecorationType) => {
    const decDef = DECORATIONS[decType];
    if (gameState.coins < decDef.cost) return;

    const pos = findNextAvailablePosition(decDef.width, decDef.height, gameState.entities, 0, gameState.unlockedParcelIds);
    const newDec: FarmEntity = {
      id: `dec_${decType}_` + Date.now(),
      x: pos.x,
      y: pos.y,
      width: decDef.width,
      height: decDef.height,
      type: 'decoration',
      decorationType: decType,
    };

    setGameState((prev) => ({
      ...prev,
      coins: prev.coins - decDef.cost,
      entities: [...prev.entities, newDec],
    }));

    showToast(`🌻 ${decDef.name} adicionada à fazenda!`);
  };

  // 15. Move Entity Position on Grid (with centralized space occupation validation)
  const handleMoveEntityPosition = (entityId: string, newX: number, newY: number) => {
    const ent = gameState.entities.find((e) => e.id === entityId);
    if (!ent) return;

    const validation = validatePlacement(
      newX,
      newY,
      ent.width || 1,
      ent.height || 1,
      gameState.entities,
      entityId,
      0,
      gameState.unlockedParcelIds
    );

    if (!validation.isValid) {
      sound.playWoodHit();
      showToast('⚠️ Posição inválida! Não é possível sobrepor outras construções.');
      return;
    }

    setGameState((prev) => {
      const updatedEntities = prev.entities.map((e) =>
        e.id === entityId ? { ...e, x: newX, y: newY } : e
      );
      const nextState = { ...prev, entities: updatedEntities };
      if (currentUid) {
        saveFarmToFirestore(currentUid, nextState);
      }
      return nextState;
    });

    sound.playDing();
    showToast('✨ Construção reposicionada com sucesso!');
  };

  const handleUpdateRoadsideBoxPrice = (boxId: number, newPrice: number) => {
    setGameState((prev) => {
      const updatedRoadsideBox = prev.roadsideBox.map((box) => 
        box.id === boxId ? { ...box, price: newPrice } : box
      );
      return { ...prev, roadsideBox: updatedRoadsideBox };
    });
  };



  const handleHarvestNectarFromBush = (bushId: string) => {
    setGameState((prev) => {
      const updatedEntities = prev.entities.map((ent) => {
        if (
          ent.id === bushId &&
          ent.type === 'nectar_bush' &&
          ent.nectarBushData &&
          ent.nectarBushData.nectarLeft > 0
        ) {
          const newLeft = ent.nectarBushData.nectarLeft - 1;
          return {
            ...ent,
            nectarBushData: {
              ...ent.nectarBushData,
              nectarLeft: newLeft,
              isWilted: newLeft <= 0,
            },
          };
        }
        return ent;
      });
      const nextState = { ...prev, entities: updatedEntities };
      if (currentUid) {
        saveFarmToFirestore(currentUid, nextState);
      }
      return nextState;
    });
  };

  const handleAddNectarToTree = () => {
    setGameState((prev) => {
      const treeIdx = prev.entities.findIndex((e) => e.type === 'bee_tree' && e.beeTreeData);
      if (treeIdx === -1) return prev;
      const treeEnt = prev.entities[treeIdx];
      const tree = treeEnt.beeTreeData!;
      if (tree.nectarCount >= tree.maxNectar) return prev;

      const updatedEntities = [...prev.entities];
      updatedEntities[treeIdx] = {
        ...treeEnt,
        beeTreeData: {
          ...tree,
          nectarCount: Math.min(tree.maxNectar, tree.nectarCount + 1),
        },
      };

      const nextState = { ...prev, entities: updatedEntities };
      if (currentUid) {
        saveFarmToFirestore(currentUid, nextState);
      }
      return nextState;
    });
  };

  // 16. Claim Achievement Reward
  const handleClaimAchievement = (achId: string) => {
    const ach = gameState.achievements.find((a) => a.id === achId);
    if (!ach || ach.claimed) return;

    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + ach.rewardCoins,
      gems: prev.gems + ach.rewardGems,
      achievements: prev.achievements.map((a) =>
        a.id === achId ? { ...a, claimed: true } : a
      ),
    }));

    showToast(`🏆 Conquista resgatada! +${ach.rewardGems} 💎 +${ach.rewardCoins} 🪙`);
  };

  // Loading screen enquanto Firestore carrega a fazenda
  if (isLoadingFarm) {
    return (
      <LoadingScreen
        statusText={loadingStatusText}
        subMessage={loadingSubMessage}
        errorMessage={loadingError}
        isFadingOut={isLoadingFadingOut}
        onRetry={handleGoogleLogin}
        onCancel={() => {
          setIsLoadingFarm(false);
          setLoadingError(null);
        }}
        onPlayOffline={handlePlayOffline}
      />
    );
  }

  if (isAuthRequired) {
    return (
      <div className="relative w-screen h-screen overflow-hidden font-sans bg-gradient-to-b from-[#8bc34a] to-[#558b2f] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="bg-[#fffbeb] border-4 border-[#eab308] rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col items-center gap-6 text-center relative z-10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-6xl sm:text-7xl animate-bounce duration-1000">🌾</span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#451a03] tracking-wide uppercase drop-shadow-sm">
              Harvest Horizon
            </h1>
            <p className="text-[10px] sm:text-xs font-black bg-[#fef08a] text-[#854d0e] px-3 py-1 rounded-full uppercase border border-[#facc15]">
              Simulador de Fazenda Online
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-black text-[#451a03]">Bem-vindo de volta, Fazendeiro!</h2>
            <p className="text-xs text-[#78350f] font-bold leading-relaxed">
              Para carregar e salvar o progresso da sua fazenda com segurança na nuvem e habilitar o comércio multiplayer, faça login com a sua conta Google.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-amber-50 text-amber-950 font-black text-sm px-4 py-3.5 rounded-2xl border-2 border-amber-300 shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Entrar com o Google</span>
            </button>

            <button
              onClick={handlePlayOffline}
              className="w-full bg-amber-200/60 hover:bg-amber-200 text-amber-900 font-bold text-xs py-2.5 px-4 rounded-xl border border-amber-400/80 transition-all active:scale-95 cursor-pointer"
            >
              🌾 Continuar como Convidado (Modo Local)
            </button>
          </div>

          <span className="text-[10px] text-[#b45309] font-bold">
            Versão 1.0.0 • Rodando em Tempo Real
          </span>
        </div>
      </div>
    );
  }

  const handleStartFishingBoatRepair = (costCoins: number) => {
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins - costCoins,
      fishingBoat: { status: 'repairing', repairStartedAt: Date.now() },
    }));
  };

  const handleSpeedUpFishingBoatRepair = (costGems: number) => {
    setGameState((prev) => ({
      ...prev,
      gems: prev.gems - costGems,
      fishingBoat: { status: 'repaired' },
    }));
  };

  const handleFishingBoatClick = () => {
    if (gameState.fishingBoat?.status === 'repaired') {
      setIsFishingLakeMode(true);
    } else {
      setIsFishingBoatModalOpen(true);
    }
  };

  if (isFishingLakeMode) {
    return (
      <FishingLakeView
        gameState={gameState}
        onReturnToFarm={() => setIsFishingLakeMode(false)}
        onCatchFish={handleCatchFish}
      />
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans bg-[#558b2f]">
      {/* Top Header Bar */}
      <TopBar
        level={gameState.level}
        xp={gameState.xp}
        coins={gameState.coins}
        gems={gameState.gems}
        siloUsed={siloUsed}
        siloMax={siloCap}
        barnUsed={barnUsed}
        barnMax={barnCap}
        farmName={gameState.farmName}
        soundEnabled={gameState.soundEnabled}
        musicEnabled={gameState.musicEnabled}
        graphicsStyle={gameState.graphicsStyle || '3d_rendered'}
        onlineCount={onlineCount}
        onOpenMultiplayer={() => setIsMultiplayerModalOpen(true)}
        isVisiting={visitingFarm !== null}
        visitingFarmName={visitingFarm?.farmName}
        visitingLevel={visitingFarm?.level}
        visitingLikes={visitingFarm?.likes}
        onLeaveVisiting={handleLeaveVisiting}
        onLikeVisitingFarm={handleLikeVisitingFarm}
        onOpenSilo={() => setStorageModalType('silo')}
        onOpenBarn={() => setStorageModalType('barn')}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenFreeGems={() => setIsFreeGemsModalOpen(true)}
      />

      {/* Floating Action Toast */}
      {floatingMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-950/90 text-yellow-200 border-2 border-yellow-400 font-extrabold px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-xs text-xs sm:text-sm animate-in fade-in slide-in-from-top-4 duration-150">
          {floatingMessage}
        </div>
      )}

      {/* Interactive Isometric Farm Canvas */}
      <FarmCanvas
        entities={visitingFarm ? (visitingFarm.entities || []) : gameState.entities}
        selectedEntity={selectedEntity}
        graphicsStyle={gameState.graphicsStyle || '3d_rendered'}
        inventory={gameState.inventory}
        fishingBoatStatus={gameState.fishingBoat?.status || 'broken'}
        onFishingBoatClick={handleFishingBoatClick}
        onQuickPlantCrop={handleQuickPlantCrop}
        onSelectEntity={(ent) => {
          if (visitingFarm) {
            if (ent?.id === 'roadside_shop') {
              setRoadsideInitialTab('stand');
              setIsRoadsideOpen(true);
            }
            return;
          }
          setSelectedEntity(ent);
          if (ent?.type === 'building') {
            setActiveBuildingModalEntity(ent);
          } else if (ent?.type === 'order_board') {
            setIsOrderBoardOpen(true);
          } else if (ent?.type === 'roadside_shop') {
            setIsRoadsideOpen(true);
          } else if (ent?.type === 'lucky_wheel') {
            setIsLuckyWheelOpen(true);
          } else if (ent?.type === 'silo') {
            setStorageModalType('silo');
          } else if (ent?.type === 'barn') {
            setStorageModalType('barn');
          } else if (ent?.type === 'farmhouse') {
            setIsAchievementsOpen(true);
          }
        }}
        onQuickHarvestCrop={handleHarvestCrop}
        onQuickCollectAnimal={handleCollectAnimal}
        onQuickCollectBuilding={(bId) => handleCollectAllCompleted(bId)}
        isMovingMode={isMovingMode}
        onMoveEntityPosition={handleMoveEntityPosition}
        truckDeliveringUntil={gameState.truckDeliveringUntil}
        activeVisitor={gameState.activeVisitor}
        onOpenVisitor={() => setIsVisitorModalOpen(true)}
        siloUsed={siloUsed}
        siloCap={siloCap}
        siloLevel={gameState.siloLevel}
        barnUsed={barnUsed}
        barnCap={barnCap}
        barnLevel={gameState.barnLevel}
        playerLevel={gameState.level}
        farmName={gameState.farmName}
        hasFulfillableOrders={hasFulfillableOrders}
        availableOrdersCount={
          Array.isArray(gameState.orders)
            ? gameState.orders.filter((o) => o && o.state === 'available').length
            : 0
        }
        hasRoadsideCoinsToCollect={hasRoadsideCoinsToCollect}
        canSpinWheel={canSpinWheel}
        onOpenSilo={() => setStorageModalType('silo')}
        onOpenBarn={() => setStorageModalType('barn')}
        onOpenFarmhouse={() => setIsAchievementsOpen(true)}
        onOpenOrderBoard={() => setIsOrderBoardOpen(true)}
        onOpenRoadsideShop={() => setIsRoadsideOpen(true)}
        onOpenLuckyWheel={() => setIsLuckyWheelOpen(true)}
        onOpenBeeTree={handleOpenBeeTree}
        onHarvestNectarFromBush={handleHarvestNectarFromBush}
        onAddNectarToTree={handleAddNectarToTree}
        onRemoveDeadEntity={handleRemoveDeadEntity}
      />

      {/* Radial Tool Selector / Quick Plot Popups */}
      {selectedEntity && selectedEntity.type !== 'building' && (
        <ActionRadial
          selectedEntity={selectedEntity}
          level={gameState.level}
          inventory={gameState.inventory}
          gems={gameState.gems}
          onClose={() => setSelectedEntity(null)}
          onPlantCrop={handlePlantCrop}
          onHarvestCrop={handleHarvestCrop}
          onFeedAnimals={handleFeedAnimals}
          onCollectAnimal={handleCollectAnimal}
          onSpeedUpCrop={handleSpeedUpCrop}
          onSpeedUpAnimal={handleSpeedUpAnimal}
          onOpenBuildingModal={(ent) => {
            setSelectedEntity(null);
            setActiveBuildingModalEntity(ent);
          }}
          onOpenOrderBoard={() => {
            setSelectedEntity(null);
            setIsOrderBoardOpen(true);
          }}
          onOpenRoadsideShop={() => {
            setSelectedEntity(null);
            setIsRoadsideOpen(true);
          }}
          onOpenLuckyWheel={() => {
            setSelectedEntity(null);
            setIsLuckyWheelOpen(true);
          }}
          onOpenSilo={() => {
            setSelectedEntity(null);
            setStorageModalType('silo');
          }}
          onOpenBarn={() => {
            setSelectedEntity(null);
            setStorageModalType('barn');
          }}
          onOpenFarmhouse={() => {
            setSelectedEntity(null);
            setIsAchievementsOpen(true);
          }}
          onRemoveDeadEntity={(entityId) => {
            handleRemoveDeadEntity(entityId);
            setSelectedEntity(null);
          }}
          unlockedParcelIds={gameState.unlockedParcelIds}
          onOpenExpansionModal={(parcelId) => {
            sound.playClick();
            setUnlockModalParcelId(parcelId);
            setSelectedEntity(null);
          }}
          fishingBoatStatus={gameState.fishingBoat?.status}
          onFishingBoatClick={() => {
            sound.playClick();
            if (gameState.fishingBoat?.status === 'broken' || gameState.fishingBoat?.status === 'repairing') {
              setIsFishingBoatModalOpen(true);
            } else if (gameState.fishingBoat?.status === 'repaired') {
              setIsFishingLakeMode(true);
            }
          }}
          deliveryBoatStatus={gameState.deliveryBoat?.status}
          onDeliveryBoatClick={() => {
            if (gameState.deliveryBoat?.status === 'docked') {
              sound.playClick();
              setIsDeliveryBoatModalOpen(true);
            }
          }}
        />
      )}

      {/* Expansion Unlock Modal */}
      <UnlockParcelModal
        parcelId={unlockModalParcelId}
        gameState={gameState}
        onClose={() => setUnlockModalParcelId(null)}
        onUnlock={handleUnlockParcel}
      />

      {isFishingBoatModalOpen && (
        <FishingBoatModal
          gameState={gameState}
          onClose={() => setIsFishingBoatModalOpen(false)}
          onStartRepair={handleStartBoatRepair}
          onSpeedUpRepair={handleSpeedUpBoatRepair}
        />
      )}

      {isDeliveryBoatModalOpen && (
        <DeliveryBoatModal
          gameState={gameState}
          onClose={() => setIsDeliveryBoatModalOpen(false)}
          onFillCrate={handleFillDeliveryCrate}
          onSendBoat={handleSendDeliveryBoat}
        />
      )}

      {/* Bottom HUD Toolbar removed to support immersive building taps */}

      {/* Floating Shop Button in bottom-right corner */}
      <button
        id="btn-floating-shop"
        onClick={() => {
          sound.playClick();
          setIsShopOpen(true);
        }}
        className="absolute bottom-4 right-4 z-40 flex flex-col items-center justify-center w-16 h-16 bg-gradient-to-t from-amber-600 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-amber-950 rounded-full shadow-2xl border-4 border-white active:scale-95 transition-all pointer-events-auto cursor-pointer"
      >
        <span className="text-2xl">🛒</span>
        <span className="text-[9px] font-black tracking-tight uppercase">Loja</span>
      </button>

      {/* Game Settings Modal Dialog */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        farmName={gameState.farmName}
        onUpdateFarmName={(newName) => {
          setGameState((prev) => applyWongamerVip({ ...prev, farmName: newName }, googleUser?.email));
        }}
        soundEnabled={gameState.soundEnabled}
        onToggleSound={() => setGameState((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
        musicEnabled={gameState.musicEnabled}
        onToggleMusic={() => {
          const next = sound.toggleMusic();
          setGameState((p) => ({ ...p, musicEnabled: next }));
        }}
        graphicsStyle={gameState.graphicsStyle || '3d_rendered'}
        onToggleGraphicsStyle={() => {
          setGameState((p) => {
            const nextStyle = p.graphicsStyle === 'vector' ? '3d_rendered' : 'vector';
            showToast(nextStyle === '3d_rendered' ? '✨ Gráficos 3D Ativados!' : '📐 Gráficos Vetoriais Ativados!');
            return { ...p, graphicsStyle: nextStyle };
          });
        }}
        googleUser={googleUser}
        onLogout={handleLogout}
      />

      {/* Full Modal Dialogs */}
      {activeBuildingModalEntity && (
        <BuildingModal
          entity={activeBuildingModalEntity}
          level={gameState.level}
          inventory={gameState.inventory}
          gems={gameState.gems}
          onClose={() => setActiveBuildingModalEntity(null)}
          onQueueRecipe={handleQueueRecipe}
          onCollectCompletedItem={handleCollectCompletedItem}
          onCollectAllCompleted={handleCollectAllCompleted}
          onSpeedUpBuilding={handleSpeedUpBuilding}
          onUnlockQueueSlot={handleUnlockQueueSlot}
        />
      )}

      {isOrderBoardOpen && (
        <OrderBoardModal
          orders={gameState.orders}
          inventory={gameState.inventory}
          truckDeliveringUntil={gameState.truckDeliveringUntil}
          gems={gameState.gems}
          onClose={() => setIsOrderBoardOpen(false)}
          onSendOrder={handleSendOrder}
          onTrashOrder={handleTrashOrder}
          onSpeedUpTruck={handleSpeedUpTruck}
        />
      )}

      {storageModalType && (
        <StorageModal
          type={storageModalType}
          inventory={gameState.inventory}
          siloLevel={gameState.siloLevel}
          barnLevel={gameState.barnLevel}
          gems={gameState.gems}
          coins={gameState.coins}
          onClose={() => setStorageModalType(null)}
          onUpgradeStorage={handleUpgradeStorage}
          onSellItem={handleSellItem}
        />
      )}

      {isRoadsideOpen && (
        <RoadsideShopModal
          initialTab={roadsideInitialTab}
          boxes={visitingFarm ? (visitingFarm.roadsideBoxes || []) : gameState.roadsideBoxes}
          inventory={gameState.inventory}
          coins={gameState.coins}
          myFarmId={currentUid || myFarmId}
          newspaperOffers={newspaperOffers}
          onClose={() => setIsRoadsideOpen(false)}
          onPutItemOnSale={handlePutItemOnSale}
          onCollectBoxMoney={handleCollectBoxMoney}
          onBuyNewspaperItem={handleBuyNewspaperItem}
          onVisitFarm={handleVisitFarm}
          onOpenMultiplayerModal={() => setIsMultiplayerModalOpen(true)}
          onRefreshNewspaper={() => {
            multiplayerClient.fetchNewspaper().then((offers) => {
              setNewspaperOffers(offers);
            });
          }}
        />
      )}

      {isShopOpen && (
        <ShopModal
          level={gameState.level}
          coins={gameState.coins}
          entities={gameState.entities}
          onClose={() => setIsShopOpen(false)}
          onBuyCropPlot={handleBuyCropPlot}
          onBuyAnimalPen={handleBuyAnimalPen}
          onBuyBuilding={handleBuyBuilding}
          onBuyDecoration={handleBuyDecoration}
          onBuyBeeTree={handleBuyBeeTree}
          onBuyNectarBush={handleBuyNectarBush}
        />
      )}

      {isBeeTreeModalOpen && selectedBeeTreeEntity && (
        <BeeTreeModal
          entity={
            gameState.entities.find((e) => e.id === selectedBeeTreeEntity.id) ||
            selectedBeeTreeEntity
          }
          coins={gameState.coins}
          level={gameState.level}
          hasHoneyExtractor={gameState.entities.some(
            (e) => e.type === 'building' && e.buildingData?.buildingType === 'honey_extractor'
          )}
          onClose={() => {
            setIsBeeTreeModalOpen(false);
            setSelectedBeeTreeEntity(null);
          }}
          onHarvestNectar={handleHarvestNectar}
          onUpgradeStage={handleUpgradeBeeTreeStage}
          onOpenHoneyExtractor={() => {
            setIsBeeTreeModalOpen(false);
            setSelectedBeeTreeEntity(null);
            const extractor = gameState.entities.find(
              (e) => e.type === 'building' && e.buildingData?.buildingType === 'honey_extractor'
            );
            if (extractor) {
              setActiveBuildingModalEntity(extractor);
            }
          }}
        />
      )}

      {isLuckyWheelOpen && (
        <LuckyWheelModal
          onClose={() => setIsLuckyWheelOpen(false)}
          gems={gameState.gems}
          lastSpinDate={gameState.lastLuckySpinDate}
          onClaimReward={handleClaimWheelReward}
        />
      )}

      {isVisitorModalOpen && (
        <VisitorModal
          visitor={gameState.activeVisitor}
          inventory={gameState.inventory}
          onClose={() => setIsVisitorModalOpen(false)}
          onAcceptDeal={handleAcceptVisitorDeal}
          onRefuseDeal={handleRefuseVisitorDeal}
        />
      )}

      {levelUpPopupLevel !== null && (
        <LevelUpModal
          newLevel={levelUpPopupLevel}
          onClose={() => setLevelUpPopupLevel(null)}
        />
      )}

      {isAchievementsOpen && (
        <AchievementsModal
          farmName={gameState.farmName}
          level={gameState.level}
          achievements={gameState.achievements}
          stats={gameState.stats}
          onClose={() => setIsAchievementsOpen(false)}
          onRenameFarm={(newName) =>
            setGameState((p) => applyWongamerVip({ ...p, farmName: newName }, googleUser?.email))
          }
          onClaimAchievement={handleClaimAchievement}
        />
      )}

      {isBuildingShowcaseOpen && (
        <BuildingShowcaseModal
          onClose={() => setIsBuildingShowcaseOpen(false)}
        />
      )}

      {/* Multiplayer & Connect Devices Modal */}
      <MultiplayerModal
        isOpen={isMultiplayerModalOpen}
        onClose={() => setIsMultiplayerModalOpen(false)}
        farmId={myFarmId}
        farmName={gameState.farmName}
        avatar={playerAvatar}
        level={gameState.level}
        onlineCount={onlineCount}
        onlineFarms={onlineFarms}
        onUpdateProfile={handleUpdateProfile}
        onVisitFarm={handleVisitFarm}
      />

      {/* Google AdMob Free Gems Cinema Modal */}
      {isFreeGemsModalOpen && (
        <FreeGemsModal
          currentGems={gameState.gems}
          onClose={() => setIsFreeGemsModalOpen(false)}
          onEarnGems={(amount) => {
            setGameState((prev) => ({
              ...prev,
              gems: prev.gems + amount,
            }));
            showToast(`💎 +${amount} Diamantes adicionados!`);
          }}
        />
      )}

      {/* Fishing Boat Modal */}
      {isFishingBoatModalOpen && (
        <FishingBoatModal
          gameState={gameState}
          onClose={() => setIsFishingBoatModalOpen(false)}
          onStartRepair={handleStartFishingBoatRepair}
          onSpeedUpRepair={handleSpeedUpFishingBoatRepair}
        />
      )}
    </div>
  );
}
