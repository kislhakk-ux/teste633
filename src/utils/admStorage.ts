import { LakeEntity, LakeTerrainTile, LakeTerrainType } from '../types/adm';

const STORAGE_KEY_ENTITIES = 'hayday_adm_lake_entities_v1';
const STORAGE_KEY_TERRAIN = 'hayday_adm_lake_terrain_v1';
const STORAGE_KEY_UNLOCKED = 'hayday_adm_unlocked_v1';

export const DEFAULT_LAKE_ENTITIES: LakeEntity[] = [
  // 1. Cabana de Pesca (Sem pescador bloqueando!)
  { id: 'ent_cabin', type: 'cabin', x: 3.2, y: 2.6, scale: 1 },

  // 2. Cachoeira 3D no rochedo virada para a frente
  { id: 'ent_waterfall', type: 'waterfall', x: 1.2, y: 0.8, scale: 1 },

  // 3. Bancada de Iscas & Fabricador de Redes
  { id: 'ent_lure_maker', type: 'lure_maker', x: 5.8, y: 1.8, scale: 1 },
  { id: 'ent_net_maker', type: 'net_maker', x: 1.8, y: 4.5, scale: 1 },

  // 4. Salão de Patos
  { id: 'ent_duck_salon', type: 'duck_salon', x: 14.8, y: 3.6, scale: 1 },

  // 5. Patos nadando
  { id: 'ent_duck_1', type: 'duck', x: 8.5, y: 4.2, scale: 1 },
  { id: 'ent_duck_2', type: 'duck', x: 13, y: 7.8, scale: 1 },

  // 6. Armadilha de Lagostas
  { id: 'ent_shrimp_trap', type: 'shrimp_trap', x: 3.2, y: 9.5, scale: 1 },

  // 7. Troncos d'água com barril
  { id: 'ent_log_1', type: 'water_log', x: 11.5, y: 5.2, scale: 1.05 },
  { id: 'ent_log_2', type: 'water_log', x: 4.2, y: 8.2, scale: 0.9 },

  // 8. Ilhota com Pinheiro Lone Pine
  { id: 'ent_island_pine', type: 'pine', x: 3.8, y: 11.8, scale: 1.15 },

  // 9. Pontos de Pesca (Spots)
  { id: 'ent_spot_1', type: 'fishing_spot', x: 7, y: 6.5, scale: 1 },
  { id: 'ent_spot_2', type: 'fishing_spot', x: 10.5, y: 6.5, scale: 1 },
  { id: 'ent_spot_3', type: 'fishing_spot', x: 6.5, y: 10.5, scale: 1 },
  { id: 'ent_spot_4', type: 'fishing_spot', x: 12, y: 11.5, scale: 1 },
  { id: 'ent_spot_5', type: 'fishing_spot', x: 8.5, y: 13, scale: 1 },

  // 10. Floresta de Pinheiros da Crista da Montanha
  { id: 'ent_tree_p1', type: 'pine', x: -1.5, y: -1.2, scale: 1.5 },
  { id: 'ent_tree_p2', type: 'pine', x: -0.2, y: -1.5, scale: 1.6 },
  { id: 'ent_tree_l1', type: 'lake_tree', x: 1.8, y: -1.6, scale: 1.4 },
  { id: 'ent_tree_p3', type: 'pine', x: 3.6, y: -1.8, scale: 1.5 },
  { id: 'ent_tree_p4', type: 'pine', x: 5.5, y: -1.8, scale: 1.6 },
  { id: 'ent_tree_l2', type: 'lake_tree', x: 7.5, y: -1.8, scale: 1.5 },
  { id: 'ent_tree_p5', type: 'pine', x: 9.5, y: -1.6, scale: 1.6 },
  { id: 'ent_tree_p6', type: 'pine', x: 11.8, y: -1.5, scale: 1.5 },
  { id: 'ent_tree_l3', type: 'lake_tree', x: 13.8, y: -1.2, scale: 1.4 },
  { id: 'ent_tree_p7', type: 'pine', x: 15.5, y: -0.8, scale: 1.5 },

  // 11. Flanco Esquerdo & Direito
  { id: 'ent_tree_p8', type: 'pine', x: -1.2, y: 1.5, scale: 1.4 },
  { id: 'ent_tree_p9', type: 'pine', x: -1.4, y: 4, scale: 1.5 },
  { id: 'ent_tree_l4', type: 'lake_tree', x: -1.2, y: 7, scale: 1.3 },
  { id: 'ent_tree_p10', type: 'pine', x: -1.4, y: 10, scale: 1.4 },
  { id: 'ent_tree_l5', type: 'lake_tree', x: -1.2, y: 13.5, scale: 1.4 },
  { id: 'ent_tree_p11', type: 'pine', x: -0.8, y: 15.5, scale: 1.3 },

  { id: 'ent_tree_p12', type: 'pine', x: 16.2, y: 1.5, scale: 1.4 },
  { id: 'ent_tree_l6', type: 'lake_tree', x: 16.5, y: 4.5, scale: 1.3 },
  { id: 'ent_tree_p13', type: 'pine', x: 16.2, y: 8, scale: 1.4 },
  { id: 'ent_tree_p14', type: 'pine', x: 16, y: 11, scale: 1.3 },
  { id: 'ent_tree_l7', type: 'lake_tree', x: 15.8, y: 14, scale: 1.3 },

  // 12. Frente
  { id: 'ent_tree_l8', type: 'lake_tree', x: 5.5, y: 16.2, scale: 1.2 },
  { id: 'ent_tree_p15', type: 'pine', x: 9, y: 16.2, scale: 1.3 },
  { id: 'ent_tree_l9', type: 'lake_tree', x: 12.5, y: 16, scale: 1.2 },
];

export function loadAdmEntities(): LakeEntity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ENTITIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Erro ao carregar entidades do ADM:', err);
  }
  return DEFAULT_LAKE_ENTITIES;
}

export function saveAdmEntities(entities: LakeEntity[]) {
  try {
    localStorage.setItem(STORAGE_KEY_ENTITIES, JSON.stringify(entities));
  } catch (err) {
    console.error('Erro ao salvar entidades do ADM:', err);
  }
}

export function resetAdmEntities(): LakeEntity[] {
  try {
    localStorage.removeItem(STORAGE_KEY_ENTITIES);
  } catch (err) {
    console.error(err);
  }
  return [...DEFAULT_LAKE_ENTITIES];
}

// Terrain map storage (key is `${x}_${y}`)
export type TerrainGridMap = Record<string, LakeTerrainType>;

export function loadAdmTerrain(): TerrainGridMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TERRAIN);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Erro ao carregar terreno do ADM:', err);
  }
  return {};
}

export function saveAdmTerrain(terrain: TerrainGridMap) {
  try {
    localStorage.setItem(STORAGE_KEY_TERRAIN, JSON.stringify(terrain));
  } catch (err) {
    console.error('Erro ao salvar terreno do ADM:', err);
  }
}

export function resetAdmTerrain(): TerrainGridMap {
  try {
    localStorage.removeItem(STORAGE_KEY_TERRAIN);
  } catch (err) {
    console.error(err);
  }
  return {};
}

export function checkIsAdmUnlocked(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_UNLOCKED) === 'true';
  } catch {
    return false;
  }
}

export function setAdmUnlocked(unlocked: boolean) {
  try {
    if (unlocked) {
      localStorage.setItem(STORAGE_KEY_UNLOCKED, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEY_UNLOCKED);
    }
  } catch {}
}
