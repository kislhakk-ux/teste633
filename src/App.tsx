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
import { auth, googleSignIn, googleSignOut } from './utils/firebase';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const state = loadGameState();
    return { ...state, graphicsStyle: '3d_rendered' };
  });
  const [selectedEntity, setSelectedEntity] = useState<FarmEntity | null>(null);
  const [activeBuildingModalEntity, setActiveBuildingModalEntity] = useState<FarmEntity | null>(null);
  const [isOrderBoardOpen, setIsOrderBoardOpen] = useState(false);
  const [isRoadsideOpen, setIsRoadsideOpen] = useState(false);
  const [roadsideInitialTab, setRoadsideInitialTab] = useState<'stand' | 'newspaper'>('stand');
  const [isMultiplayerModalOpen, setIsMultiplayerModalOpen] = useState(false);
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

  // Google Login flow handler
  const handleGoogleLogin = async () => {
    sound.playClick();
    try {
      const firebaseUser = await googleSignIn();

      const uid = firebaseUser.uid;
      const defaultName = firebaseUser.displayName || 'Fazendeiro do Google';
      const avatar = firebaseUser.photoURL || '👨‍🌾';
      const email = firebaseUser.email || '';
      
      // Prompt for farm name when logging in with Google
      let farmName = window.prompt("Escolha um nome para a sua fazenda:", defaultName);
      if (!farmName || farmName.trim() === '') {
        farmName = defaultName;
      }

      setGameState((p) => ({ ...p, farmName: farmName }));
      setPlayerAvatar(avatar);
      localStorage.setItem('hayday_player_avatar', avatar);
      
      localStorage.setItem('hayday_google_logged_in', 'true');
      const userData = {
        uid,
        name: farmName,
        email,
        imageUrl: avatar
      };
      localStorage.setItem('hayday_google_user_data', JSON.stringify(userData));
      setGoogleUser(userData);
      
      multiplayerClient.connect(
        farmName,
        gameState.level,
        avatar,
        gameState.entities,
        gameState.roadsideBoxes
      );
      
      setIsAuthRequired(false);
      showToast(`🌾 Bem-vindo, ${farmName}!`);
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      alert(`Erro no login com o Google: ${err.message || JSON.stringify(err)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await googleSignOut();
    } catch (e) {
      // ignore
    }
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

  // Save to LocalStorage whenever gameState changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

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
      setNewspaperOffers((prev) => [offer, ...prev.filter((o) => o.id !== offer.id)]);
      showToast(`📰 Novo anúncio no Jornal: ${offer.count}x ${ITEMS[offer.itemId]?.name || offer.itemId} por ${offer.sellerFarmName}!`);
    });

    const unsubOfferSold = multiplayerClient.on('offer_sold', (msg) => {
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

        // 4. Spawn Farm Visitor periodically if none active
        let newVisitor = prev.activeVisitor;
        if (!newVisitor && Math.random() < 0.03) {
          updated = true;
          newVisitor = generateRandomVisitor(prev.level, prev.inventory);
        }

        // Check for XP Level Up
        const xpReq = LEVEL_XP_REQUIREMENTS[prev.level] || 99999;
        let finalLevel = prev.level;
        let finalGems = prev.gems;
        let finalCoins = newCoins;

        if (newXp >= xpReq) {
          updated = true;
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
          xp: newXp,
          orders: newOrders,
          truckDeliveringUntil: newTruckDeliveringUntil,
          roadsideBoxes: newBoxes,
          activeVisitor: newVisitor,
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

  // 12. Farm Visitor Deal
  const handleAcceptVisitorDeal = (visitor: FarmVisitor) => {
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
      stats: {
        ...prev.stats,
        totalCoinsEarned: prev.stats.totalCoinsEarned + visitor.offeredCoins,
      },
    }));

    setIsVisitorModalOpen(false);
    showToast(`🤝 Negócio fechado com ${visitor.name}! +🪙 ${visitor.offeredCoins}`);
  };

  const handleRefuseVisitorDeal = () => {
    setGameState((prev) => ({ ...prev, activeVisitor: null }));
    setIsVisitorModalOpen(false);
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

  // 14. Shop Buy & Place Entities
  const findNextAvailablePosition = (width: number, height: number) => {
    for (let gy = 4; gy < 12; gy++) {
      for (let gx = 3; gx < 12; gx++) {
        const isOccupied = gameState.entities.some(
          (e) =>
            gx < e.x + e.width &&
            gx + width > e.x &&
            gy < e.y + e.height &&
            gy + height > e.y
        );
        if (!isOccupied) {
          return { x: gx, y: gy };
        }
      }
    }
    return { x: 5, y: 5 };
  };

  const handleBuyCropPlot = () => {
    const currentPlots = gameState.entities.filter((e) => e.type === 'crop_plot').length;
    const cost = 20 + currentPlots * 10;
    if (gameState.coins < cost) return;

    const pos = findNextAvailablePosition(1, 1);
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

    const pos = findNextAvailablePosition(2, 2);
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

    const pos = findNextAvailablePosition(2, 2);
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

  const handleQuickPlantCrop = (plotId: string, cropId: string) => {
    const currentQty = gameState.inventory[cropId] || 0;
    if (currentQty <= 0) return;

    setGameState((prev) => {
      const updatedEntities = prev.entities.map((ent) => {
        if (ent.id === plotId && ent.type === 'crop_plot') {
          const cropDef = CROPS[cropId as ItemId];
          return {
            ...ent,
            cropData: {
              cropId: cropId as ItemId,
              plantedAt: Date.now(),
              growDuration: cropDef.growTime,
            },
          };
        }
        return ent;
      });

      const updatedInventory = {
        ...prev.inventory,
        [cropId]: currentQty - 1,
      };

      return {
        ...prev,
        entities: updatedEntities,
        inventory: updatedInventory,
      };
    });
    sound.playPlant();
  };

  const handleBuyDecoration = (decType: DecorationType) => {
    const decDef = DECORATIONS[decType];
    if (gameState.coins < decDef.cost) return;

    const pos = findNextAvailablePosition(decDef.width, decDef.height);
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

  // 15. Move Entity Position on Grid
  const handleMoveEntityPosition = (entityId: string, newX: number, newY: number) => {
    setGameState((prev) => ({
      ...prev,
      entities: prev.entities.map((e) =>
        e.id === entityId ? { ...e, x: newX, y: newY } : e
      ),
    }));
    sound.playPlant();
    showToast('🛠️ Construção reposicionada com sucesso!');
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

            {/* O login real com o Google agora é obrigatório para acessar o jogo */}
          </div>

          <span className="text-[10px] text-[#b45309] font-bold">
            Versão 1.0.0 • Rodando em Tempo Real
          </span>
        </div>
      </div>
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
        graphicsStyle={gameState.graphicsStyle || 'vector'}
        inventory={gameState.inventory}
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
          setGameState((prev) => ({ ...prev, farmName: newName }));
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
          myFarmId={myFarmId}
          newspaperOffers={newspaperOffers}
          onClose={() => setIsRoadsideOpen(false)}
          onPutItemOnSale={handlePutItemOnSale}
          onCollectBoxMoney={handleCollectBoxMoney}
          onBuyNewspaperItem={handleBuyNewspaperItem}
          onVisitFarm={handleVisitFarm}
          onOpenMultiplayerModal={() => setIsMultiplayerModalOpen(true)}
          onRefreshNewspaper={() => {
            multiplayerClient.send({ type: 'heartbeat', farmId: myFarmId });
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
            setGameState((p) => ({ ...p, farmName: newName }))
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
    </div>
  );
}
