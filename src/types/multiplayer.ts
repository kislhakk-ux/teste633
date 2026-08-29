import { ItemId, FarmEntity, RoadsideBox } from './game';

export interface MultiplayerOffer {
  id: string;
  sellerFarmId: string;
  sellerFarmName: string;
  sellerAvatar: string;
  sellerLevel: number;
  boxId: number;
  itemId: ItemId;
  count: number;
  price: number;
  advertised: boolean;
  isSold: boolean;
  buyerFarmId?: string;
  buyerFarmName?: string;
  soldAt?: number;
  createdAt: number;
}

export interface OnlineFarm {
  farmId: string;
  farmName: string;
  level: number;
  avatar: string;
  isOnline: boolean;
  lastSeen: number;
  likes: number;
  offersCount: number;
  entities?: FarmEntity[];
  roadsideBoxes?: RoadsideBox[];
}

export interface SoldNotification {
  boxId: number;
  itemId: ItemId;
  count: number;
  price: number;
  buyerFarmName: string;
  soldAt: number;
}

export type ClientWsMessage =
  | {
      type: 'register';
      farmId: string;
      farmName: string;
      level: number;
      avatar: string;
      entities?: FarmEntity[];
      roadsideBoxes?: RoadsideBox[];
    }
  | {
      type: 'heartbeat';
      farmId: string;
    }
  | {
      type: 'publish_offer';
      offer: MultiplayerOffer;
    }
  | {
      type: 'cancel_offer';
      farmId: string;
      boxId: number;
    }
  | {
      type: 'buy_offer';
      offerId: string;
      buyerFarmId: string;
      buyerFarmName: string;
    }
  | {
      type: 'collect_box';
      farmId: string;
      boxId: number;
    }
  | {
      type: 'like_farm';
      farmId: string;
      targetFarmId: string;
    }
  | {
      type: 'request_farm';
      targetFarmId: string;
    };

export type ServerWsMessage =
  | {
      type: 'init';
      onlineCount: number;
      farms: OnlineFarm[];
      offers: MultiplayerOffer[];
      pendingSales: SoldNotification[];
    }
  | {
      type: 'presence';
      onlineCount: number;
      farms: OnlineFarm[];
    }
  | {
      type: 'offer_published';
      offer: MultiplayerOffer;
    }
  | {
      type: 'offer_sold';
      offerId: string;
      buyerFarmName: string;
      isSold: boolean;
    }
  | {
      type: 'offer_removed';
      offerId: string;
    }
  | {
      type: 'item_sold_to_you';
      boxId: number;
      buyerFarmName: string;
      itemId: ItemId;
      count: number;
      price: number;
    }
  | {
      type: 'buy_result';
      success: boolean;
      offerId?: string;
      itemId?: ItemId;
      count?: number;
      price?: number;
      sellerFarmName?: string;
      error?: string;
    }
  | {
      type: 'farm_data';
      farm: OnlineFarm;
    };
